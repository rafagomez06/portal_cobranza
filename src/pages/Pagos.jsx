import { useState, useMemo, useEffect } from "react";
import {
  Space,
  Card,
  Breadcrumb,
  Form,
  Popover,
  Button,
  Empty,
  Upload,
  Divider,
  Flex,
  Row,
  Modal,
  Col,
  Tooltip,
  Typography,
  message,
  InputNumber,
  Select,
} from "antd";
import {
  UploadOutlined,
  EyeOutlined,
  SaveOutlined,
  FilePdfOutlined,
  SearchOutlined,
  ClearOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { RFC_VENTAS_GRALES } from "../constants/RfcGenericos";
import DataTable from "../components/DateTable";
import ModalDetalle from "../components/ModalDetalle";
import { NumeroALetras } from "../utils/NumeroALetras";
import { CardStyle } from "../configs/Estilos";
//Hooks
import { useCatalogos } from "../hooks/useCatalogos";
import { useListadoFacturas } from "../hooks/useListadoFacturas";
import { useHistorialNotasCredito } from "../hooks/useHistorialNotasCredito";
import { useHistorialPagosFacturas } from "../hooks/useHistorialPagosFacturas";
import { useRegistrarPago } from "../hooks/useRegistrarPago";
import { fetchVerFacturaCliente } from "../services/verFacturaClienteService";

//Context
import { useAuth } from "../context/AuthContext";

const { Title, Text } = Typography;
//################ HELPERS ################

// Convierte cualquier valor numerico/string a centavos enteros
const aCentavos = (v) => Math.round((Number(v) || 0) * 100);

// Saldo real de una factura en centavos (importe_factura - importe_abonado)
const saldoRealCentavos = (fila) =>
  Math.max(
    0,
    aCentavos(fila.importe_factura) - aCentavos(fila.importe_abonado),
  );

// Recorre las filas en el ORDEN DE MARCADO y reparte el monto disponible.
// Devuelve los abonos por key (en centavos) y lo que queda disponible.
const calcularAbonos = (orden, filasPorKey, montoCentavos) => {
  const abonos = {};
  let restante = montoCentavos;

  orden.forEach((key) => {
    const fila = filasPorKey[key];
    if (!fila) return;
    const abono = Math.min(saldoRealCentavos(fila), restante);
    abonos[key] = abono;
    restante -= abono;
  });

  return { abonos, restante };
};

const Pagos = () => {
  const [form] = Form.useForm();
  const [parametro, setParametro] = useState(null);
  const [parametroHistorial, setParametroHistorial] = useState(null);
  const [parametroNotaCredito, setParametroNotaCredito] = useState(null);
  const [parametroCatalogo, setParametroCatalogo] = useState(null);
  const [valueSelect, setValueSelect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  // Keys de las filas seleccionadas
  const [ordenSeleccion, setOrdenSeleccion] = useState([]);
  const [rowSelectorActivo, setRowSelectorActivo] = useState(false);
  const [esSelectFactActivo, setEsSelectFactActivo] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(null);

  //################ Consumo Hooks  ################
  const { user, updateUser } = useAuth();
  const { RegistrarPago } = useRegistrarPago();
  //Catalogo
  const {
    tiposFacturas,
    isLoading: isLoadingCatalogos,
    isError,
    error,
  } = useCatalogos(parametroCatalogo);

  //Facturas
  const {
    listadoFacturas,
    isLoading: isLoadingFacturas,
    isError: isErrorFacturas,
    error: errorFacturas,
    refetch: refetchFacturas,
  } = useListadoFacturas(parametro);

  //Historial Pagos
  const {
    historialPagosFacturas,
    isLoading: isLoadingHistorial,
    isError: isErrorHistorial,
    error: errorHistorial,
    refetch: refetchHistorial,
  } = useHistorialPagosFacturas(parametroHistorial);

  //Listado Notas Credito
  const {
    historialNotasCredito,
    isLoading: isLoadingNotasCredito,
    isError: isErrorNotasCredito,
    error: errorNotasCredito,
    refetch: refetchNotasCredito,
  } = useHistorialNotasCredito(parametroNotaCredito);

  //################################################################
  //Modales a mostrar
  const MODAL_CONFIG = {
    historialPagos: {
      title: "Historial de Pagos",
      tHeader: historialPagosFacturas.t_header,
      tBody: historialPagosFacturas.t_body,
      loading: isLoadingHistorial,
      emptyText: "No hay registros de pagos para mostrar de esta factura",
      nota: "Nota: Los pagos pueden demorar en reflejarse en el saldo real.*",
    },
    notasCredito: {
      title: "Notas de Crédito",
      tHeader: historialNotasCredito.t_header,
      tBody: historialNotasCredito.t_body,
      loading: isLoadingNotasCredito,
      emptyText: "No hay notas de crédito para mostrar de esta factura",
    },
  };

  const config = modalAbierto ? MODAL_CONFIG[modalAbierto] : {};

  //#################### useEffects ###############################
  const montoCapturado = Form.useWatch("monto", form);

  useEffect(() => {
    const monto = Number(montoCapturado) || 0;
    setRowSelectorActivo(monto > 0);
  }, [montoCapturado]);

  // Error al cargar el catálogo
  useEffect(() => {
    if (isError && error?.status_message !== "canceled") {
      messageApi.error({ content: error.message, key: "err-catalogos" });
    }
  }, [isError, error, messageApi]);

  // Error al cargar facturas
  useEffect(() => {
    if (isErrorFacturas && errorFacturas?.status_message !== "canceled") {
      messageApi.error({ content: errorFacturas.message, key: "err-facturas" });
    }
  }, [isErrorFacturas, errorFacturas, messageApi]);

  // Busca Catalogo Tipo Factura x tipo cliente
  useEffect(() => {
    const rfcCliente = user.rfc_cliente;
    //Valida si es venta general o no
    const esVentaGeneral = RFC_VENTAS_GRALES.includes(rfcCliente) ? 1 : 0;

    setParametroCatalogo(esVentaGeneral ?? null);
  }, [user.rfc_cliente]);

  // Cuando llegan facturas nuevas, las keys anteriores ya no aplican
  useEffect(() => {
    // Reset de la orden de selección al llegar facturas nuevas
    setOrdenSeleccion([]);

    const nuevoCod = listadoFacturas?.cod_cliente;
    if (!nuevoCod) return;
    if (user?.cod_cliente === nuevoCod) return;

    updateUser({ cod_cliente: nuevoCod });
  }, [
    listadoFacturas?.t_body,
    listadoFacturas?.cod_cliente,
    user?.cod_cliente,
  ]);

  //########################################################

  //Config para subida de archivo
  //Tipo de archivo aceptado
  const TIPO_ARCHIVOS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  //Tamaño mbs max.
  const MAX_SIZE_MBS = 5;

  //Formato de archivo
  const validaFormato = (file) => {
    const esTipoValido = TIPO_ARCHIVOS.includes(file.type);
    if (!esTipoValido) {
      messageApi.error("Solo se permiten archivos JPG, PNG o PDF");
      return Upload.LIST_IGNORE;
    }

    const esTamañoValido = file.size / 1024 / 1024 < MAX_SIZE_MBS;
    if (!esTamañoValido) {
      messageApi.error(`El archivo debe pesar menos de ${MAX_SIZE_MBS} MB`);
      return Upload.LIST_IGNORE;
    }
    return false; //No subir, solo guardar
  };

  // Configuración del Upload
  const uploadProps = {
    name: "comprobante_file",
    headers: { authorization: "authorization-text" },
    beforeUpload: validaFormato,
  };

  //Valida formulario
  const onRegistrarPagoFailed = () => {
    messageApi.warning("Por favor, completa los campos requeridos.");
  };

  // Al enviar el formulario
  const onRegistrarPago = async (values) => {
    const cod_empresa = 1;

    const fileList = values.archivo || [];
    const archivoOriginal = fileList[0]?.originFileObj || fileList[0];

    if (!archivoOriginal) {
      messageApi.warning("Por favor sube el comprobante de pago.");
      return;
    }

    const detalleFacturas = ordenSeleccion.map((key, index) => {
      const fila = filasPorKey[key];
      const abonoCentavos = abonosCentavos[key] ?? 0;

      return {
        orden: index + 1,
        factura: fila.factura?.trim(),
        fecha: fila.fecha,
        tipo_moneda: fila.tipo_moneda,
        importe_factura: aCentavos(fila.importe_factura) / 100,
        importe_abonado: aCentavos(fila.importe_abonado) / 100,
        importe_abonar: abonoCentavos / 100,
        saldo_pendiente_factura:
          Math.max(0, saldoRealCentavos(fila) - abonoCentavos) / 100,
      };
    });

    //Construimos el FormData a enviar al back
    const formData = new FormData();
    formData.append("cod_empresa", cod_empresa);
    formData.append("rfc_cliente", user?.rfc_cliente ?? "");
    formData.append("cod_cliente", user?.cod_cliente ?? "");
    formData.append(
      "moneda",
      valueSelect === 1 ? "P" : valueSelect === 2 ? "D" : "V",
    );
    formData.append("importe_monto", montoCentavos / 100);
    formData.append("importe_disponible", totalDisponible);
    formData.append("importe_abonado", totalAbonado);
    // Validamos si vienene seleccionadas las facturas o no
    if (Array.isArray(detalleFacturas) && detalleFacturas.length > 0) {
      formData.append("facturas", JSON.stringify(detalleFacturas));
    }
    formData.append("comprobante_file", archivoOriginal);
    setLoading(true);
    try {
      const result = await RegistrarPago(formData);
      setLoading(false);
      if (result.success) {
        message.open({
          type: "success",
          content: result.message,
          duration: 5,
        });
        messageApi.success("Datos enviados correctamente");
        //Reiniciamos formulario
        handleReset();
        return;
      }

      switch (result.status_message) {
        case "canceled":
          return; // no mostramos nada
        case "network_error":
        case "timeout":
          message.error(result.message);
          break;
        case "login_failed":
          message.error(result.message);
          break;
        default:
          message.error(result.message);
      }
    } catch (error) {
      messageApi.error("Ocurrió un error al enviar");
    } finally {
      setLoading(false);
    }
  };

  //Columnas para formatear a dinero $0.00
  const columnasFormatoMoneda = [
    "importe_factura",
    "saldo_pendiente_factura",
    "importe_abonado",
    "importe",
    "importe_abonar",
  ];

  //Reinicia la pantalla
  const handleReset = () => {
    form.resetFields();
    setValueSelect(0);
    setOrdenSeleccion([]);
    setEsSelectFactActivo(true);
  };

  //LLena valores combo tipos factura
  const options = tiposFacturas.map((tipo) => ({
    value: tipo.idTipoFactura,
    label: tipo.descripcion,
  }));

  //################ DATOS DERIVADOS ################
  // Filas base con key, SIN modificar los valores del backend
  const filasBase = useMemo(
    () =>
      (listadoFacturas.t_body ?? []).map((row, index) => ({
        ...row,
        key: row.idenc ?? row.factura?.trim() ?? String(index),
      })),
    [listadoFacturas.t_body],
  );

  const filasPorKey = useMemo(
    () => Object.fromEntries(filasBase.map((r) => [r.key, r])),
    [filasBase],
  );

  const montoCentavos = aCentavos(montoCapturado);

  // Se recalcula desde cero en cada cambio
  const { abonos: abonosCentavos, restante: disponibleCentavos } = useMemo(
    () => calcularAbonos(ordenSeleccion, filasPorKey, montoCentavos),
    [ordenSeleccion, filasPorKey, montoCentavos],
  );

  const totalDisponible = disponibleCentavos / 100;
  const totalAbonado = (montoCentavos - disponibleCentavos) / 100;
  const hayFilasSeleccionadas = ordenSeleccion.length > 0;

  //Recorrido Datasource
  const dataSource = useMemo(
    () =>
      filasBase.map((row) => {
        // No seleccionada, valores originales del backend
        if (!(row.key in abonosCentavos)) {
          return { ...row, importe_abonar: 0 };
        }

        // Seleccionada, calculo(saldo real - abono asignado)
        const abono = abonosCentavos[row.key];
        return {
          ...row,
          importe_abonar: abono / 100,
          saldo_pendiente_factura:
            Math.max(0, saldoRealCentavos(row) - abono) / 100,
        };
      }),
    [filasBase, abonosCentavos],
  );

  //  Buscar facturas al hacer click y cuando selecciona tipo de factura
  const handleBuscarFacturas = () => {
    const mapaMonedas = {
      1: "P", // Peso
      2: "D", // Dólar
      3: "V", //Ventas Grales
    };
    const moneda = mapaMonedas[valueSelect] || "P";

    if (!valueSelect) {
      messageApi.warning("Por favor, selecciona el tipo de factura.");
      return;
    }
    const rfc = user?.rfc_cliente;
    if (!rfc) {
      messageApi.warning("No se encontró RFC del cliente.");
      return;
    }

    const nuevoParametro = {
      rfc,
      moneda,
    };

    const mismoParametro =
      parametro?.rfc === nuevoParametro.rfc &&
      parametro?.moneda === nuevoParametro.moneda;

    if (mismoParametro) {
      refetchFacturas();
    } else {
      setParametro(nuevoParametro);
    }
  };

  //Seleccion row de tabla
  const handleSelectionRowChange = (keys) => {
    // Conserva el orden previo, quita las desmarcadas y agrega las nuevas al final
    const nuevoOrden = [
      ...ordenSeleccion.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !ordenSeleccion.includes(k)),
    ];
    setOrdenSeleccion(nuevoOrden);

    // Aviso solo al marcar una fila y agotar el saldo
    if (nuevoOrden.length > ordenSeleccion.length) {
      const { restante } = calcularAbonos(
        nuevoOrden,
        filasPorKey,
        montoCentavos,
      );
      if (restante === 0) {
        messageApi.warning("El total disponible se ha terminado");
      }
    }
  };

  //Detecta seleccion de rows en tabla
  const rowSelection = {
    selectedRowKeys: ordenSeleccion,
    onChange: handleSelectionRowChange,
    hideSelectAll: true,
    getCheckboxProps: (record) => ({
      // Solo se bloquean las NO seleccionadas cuando ya no hay saldo
      disabled: disponibleCentavos <= 0 && !ordenSeleccion.includes(record.key),
    }),
  };

  //Detecta cambio select
  const handleSelectChange = (value) => {
    setValueSelect(value);
    setEsSelectFactActivo(false);
  };

  // Helper para generar el contenido del Popover
  const renderPopoverContent = (monto) => {
    const num = Number(monto);
    let moneda = valueSelect;
    switch (moneda) {
      case 1:
        moneda = "P";
        break;
      case 2:
        moneda = "D";
        break;
      case 3:
        moneda = "V";
        break;
    }

    if (!num || isNaN(num)) return <span>$0.00</span>;
    return (
      <div style={{ maxWidth: 260, fontWeight: 500, color: "#1677ff" }}>
        {NumeroALetras(num, moneda)}
      </div>
    );
  };

  //Visualizar Pagos a factura
  const handleVerDetalle = (record) => {
    const valorFact = record.factura;
    const factura = valorFact.trim();
    const cod_cliente = user?.cod_cliente;

    if (!factura) {
      messageApi.warning("No se encontró factura del cliente.");
      return;
    }

    if (!cod_cliente) {
      messageApi.warning("No se encontró Codigo del cliente.");
      return;
    }

    const nvoParamHistorial = {
      cod_cliente,
      factura,
    };

    setParametroHistorial(nvoParamHistorial);
    setModalAbierto("historialPagos");
  };
  //Visualizar Notas de credito
  const handleVerNotasCredito = (record) => {
    const valorFact = record.factura;
    const factura = valorFact.trim();
    const cod_cliente = user?.cod_cliente;

    if (!factura) {
      messageApi.warning("No se encontró factura del cliente.");
      return;
    }

    if (!cod_cliente) {
      messageApi.warning("No se encontró Codigo del cliente.");
      return;
    }

    const nvoParamNotaCredito = {
      cod_cliente,
      factura,
    };

    setParametroNotaCredito(nvoParamNotaCredito);
    setModalAbierto("notasCredito");
  };
  //Visualizar Factura
  const handleVerFactura = async (record) => {
    try {
      await fetchVerFacturaCliente({
        cod_cliente: record.cod_cliente,
        factura: record.factura,
      });
    } catch (error) {
      message.error(error?.message || "No se pudo abrir la factura");
    }
  };

  //Boton de acción
  const actionColumn = {
    title: "Detalle",
    key: "acciones",
    align: "center",
    width: 10,
    fixed: "left",
    render: (_, record) => (
      <Space size="small">
        <Tooltip title="Ver Pagos">
          <Button
            type="link"
            style={{ color: "#3cda27" }}
            icon={<EyeOutlined />}
            onClick={() => handleVerDetalle(record)}
          />
        </Tooltip>
        <Tooltip title="Ver Notas de Crédito">
          <Button
            type="link"
            style={{ color: "#faad14" }}
            icon={<DollarOutlined />}
            onClick={() => handleVerNotasCredito(record)}
          />
        </Tooltip>
        <Tooltip title="Ver Factura">
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            onClick={() => handleVerFactura(record)}
          />
        </Tooltip>
      </Space>
    ),
  };

  return (
    <>
      {contextHolder}

      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[{ title: "Pagos" }, { title: "Registro" }]}
      />

      <h2>Registrar Pagos</h2>

      <Card style={CardStyle} variant="borderless">
        <Form
          form={form}
          name="frmPagos"
          layout="vertical"
          size="large"
          initialValues={{ valueSelect: null, monto: null }}
          onFinish={onRegistrarPago}
          onFinishFailed={onRegistrarPagoFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Row gutter={16} align="start" wrap={false}>
            {/* Moneda */}
            <Col flex="0 0 220px">
              <Form.Item
                label="Selecciona Tipo Factura"
                name="valueSelect"
                rules={[
                  { required: true, message: "Selecciona Tipo Factura *" },
                ]}
              >
                <Select
                  placeholder="Seleccione Opción"
                  style={{ width: "100%" }}
                  onChange={handleSelectChange}
                  options={options}
                  loading={isLoadingCatalogos}
                  disabled={isLoadingCatalogos || isError}
                  status={isError ? "error" : undefined}
                  notFoundContent={
                    isError ? `Error: ${error?.message}` : "Sin datos"
                  }
                />
              </Form.Item>
            </Col>

            {/* Comprobante */}
            <Col flex="0 0 260px">
              <Form.Item
                label="Comprobante de Pago"
                name="archivo"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                rules={[
                  { required: true, message: "Sube Comprobante de Pago *" },
                ]}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Seleccionar archivo</Button>
                </Upload>
              </Form.Item>
            </Col>
            {/* Monto */}
            <Col flex="0 0 160px">
              <Form.Item
                label="Ingresa Monto"
                name="monto"
                rules={[
                  { required: true, message: "Ingrese el monto *" },
                  {
                    type: "number",
                    min: 1,
                    message: "El monto debe ser mayor a 0 *",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  min={0}
                  disabled={esSelectFactActivo || hayFilasSeleccionadas}
                  precision={2}
                  prefix={"$"}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>

            {/* Botones de acccion*/}
            <Col flex="auto">
              <Flex
                justify="flex-end"
                align="flex-end"
                gap="small"
                style={{ height: "100%" }}
              >
                <Button
                  color="green"
                  variant="solid"
                  loading={isLoadingFacturas}
                  onClick={handleBuscarFacturas}
                  icon={<SearchOutlined />}
                >
                  Buscar Facturas
                </Button>
                <Button
                  color="blue"
                  variant="solid"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Guardar
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={loading}
                  icon={<ClearOutlined />}
                >
                  Limpiar
                </Button>
              </Flex>
            </Col>
          </Row>

          <Divider />
        </Form>
        {/* DataTable de Facturas*/}
        {dataSource.length > 0 ? (
          <>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
              wrap="wrap"
              gap="middle"
            >
              <Title level={4} style={{ margin: 0 }}>
                Listado de Facturas Pendientes
              </Title>
              <Flex align="center" gap="small">
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    backgroundColor: "#bae0ff",
                    borderRadius: 10,
                    padding: 8,
                  }}
                >
                  Total Abonar:
                </Text>
                <Popover
                  content={renderPopoverContent(totalAbonado)}
                  title="Cantidad a abonar:"
                  trigger="hover"
                  placement="left"
                >
                  <InputNumber
                    value={totalAbonado}
                    readOnly
                    formatter={(v) =>
                      `$ ${Number(v).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                    parser={(v) => Number(String(v).replace(/[^\d.-]/g, ""))}
                    style={{
                      width: 160,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#52c41a",
                      backgroundColor: "#f6ffed",
                    }}
                    controls={false}
                  />
                </Popover>
              </Flex>
            </Flex>
            <Flex
              justify="flex-end"
              align="center"
              style={{ marginBottom: 16 }}
              wrap="wrap"
              gap="middle"
            >
              <Flex align="center" gap="small">
                <Text
                  strong
                  style={{
                    fontSize: 16,
                    backgroundColor: "#d9f7be",
                    borderRadius: 10,
                    padding: 8,
                  }}
                >
                  Total Disponible:
                </Text>
                <Popover
                  content={renderPopoverContent(totalDisponible)}
                  title="Cantidad Disponible"
                  trigger="hover"
                  placement="left"
                >
                  <InputNumber
                    value={totalDisponible}
                    readOnly
                    formatter={(v) =>
                      `$ ${Number(v).toLocaleString("es-MX", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                    parser={(v) => Number(String(v).replace(/[^\d.-]/g, ""))}
                    style={{
                      width: 160,
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#52c41a",
                      backgroundColor: "#f6ffed",
                    }}
                    controls={false}
                  />
                </Popover>
              </Flex>
            </Flex>
            {/*Componente DateTable*/}
            <DataTable
              tHeader={listadoFacturas.t_header}
              tBody={dataSource}
              loading={isLoadingFacturas}
              currencyColumns={columnasFormatoMoneda}
              pagination={{ pageSize: 20, showSizeChanger: false }}
              rowSelection={
                rowSelectorActivo ? rowSelection : rowSelectorActivo
              }
              actionColumn={actionColumn}
              searchable
              searchDataIndex="factura"
              searchPlaceholder="Buscar por factura"
            />

            <ModalDetalle
              open={!!modalAbierto}
              onClose={() => setModalAbierto(null)}
              currencyColumns={columnasFormatoMoneda}
              {...config}
            />
          </>
        ) : (
          <Empty description="No hay facturas para mostrar" />
        )}
      </Card>
    </>
  );
};

export default Pagos;

import React, { useState, useMemo, useEffect } from "react";

import {
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
  Col,
  Typography,
  message,
  InputNumber,
  Select,
} from "antd";
import {
  UploadOutlined,
  SaveOutlined,
  SearchOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import DataTable from "../components/DateTable";
import { NumeroALetras } from "../utils/NumeroALetras";
import { CardStyle } from "../configs/Estilos";
import { useCatalogos } from "../hooks/useCatalogos";
import { useListadoFacturas } from "../hooks/useListadoFacturas";
const { Title, Text } = Typography;

const Pagos = () => {
  const [form] = Form.useForm();
  const [parametro, setParametro] = useState(null);
  const [valueSelect, setValueSelect] = useState(0);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [abonos, setAbonos] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalImporteRow, setTotalImporteRow] = useState(0);
  const [rowSelectorActivo, setRowSelectorActivo] = useState(false);
  const [esSelectFactActivo, setEsSelectFactActivo] = useState(true);

  const {
    tiposFacturas,
    isLoading: isLoadingCatalogos,
    isError,
    error,
  } = useCatalogos();

  const {
    listadoFacturas,
    isLoading: isLoadingFacturas,
    isError: isErrorFacturas,
    error: errorFacturas,
    refetch: refetchFacturas,
  } = useListadoFacturas(parametro);

  //Reinicia la pantalla
  const handleReset = () => {
    form.resetFields();
    setParametro(null);
    setValueSelect(0);
    setAbonos({});
    setSelectedRowKeys([]);
    setTotalImporteRow(0);
    setEsSelectFactActivo(true);
    messageApi.info("Formulario limpiado");
  };

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
  //########################################################33

  //LLena valores combo tipos factura
  const options = tiposFacturas.map((tipo) => ({
    value: tipo.idTipoFactura,
    label: tipo.descripcion,
  }));

  //  Normalizar t_body agregando un "key" para Ant Design
  const dataSource = useMemo(() => {
    return (listadoFacturas.t_body ?? []).map((row, index) => ({
      ...row,
      key: row.idenc ?? row.factura?.trim() ?? String(index),
    }));
  }, [listadoFacturas.t_body]);

  //  Buscar facturas al hacer click
  const handleBuscarFacturas = () => {
    const nuevoParametro = "DI456"; // DUMMY QUITAR obtener de localstorage

    if (nuevoParametro === parametro) {
      refetchFacturas();
    } else {
      setParametro(nuevoParametro);
    }
  };

  //Seleccion row de tabla, Obtiene data de row
  const handleSelectionRowChange = (keys, rows) => {
    setSelectedRowKeys(keys);
    console.log("Filas seleccionadas:", rows);

    // Suma en centavos para evitar error de flotante
    const totalCentavos = rows.reduce(
      (sum, row) => sum + Math.round((Number(row.importe_factura) || 0) * 100),
      0,
    );
    const totalRow = totalCentavos / 100;
    setTotalImporteRow(totalRow);

    // Validación
    if (totalRow > (Number(montoCapturado) || 0)) {
      messageApi.warning("El total disponible excede el monto capturado");
    }
    console.log("## Total importe seleccionado:", totalRow);
  };

  // Detecta cambio en Monto
  const totalDisponible = useMemo(() => {
    const montoInicial = Number(montoCapturado) || 0;
    const totalAbonado = Object.values(abonos).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
    const auxtotal = montoInicial - totalAbonado - totalImporteRow;

    return Math.round(auxtotal * 100) / 100; // número, no string
  }, [montoCapturado, abonos, totalImporteRow]);

  //Detecta seleccion de rows en tabla
  const rowSelection = {
    selectedRowKeys,
    onChange: handleSelectionRowChange,
    hideSelectAll: true,
  };

  //Detecta cambio select
  const handleSelectChange = (value) => {
    console.log(`Valor Select: ${value}`);
    setValueSelect(value);
    setEsSelectFactActivo(false);
  };

  //Tipo de archivo aceptado
  const TIPO_ARCHIVOS = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  //Tamaño max.
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
    return true;
  };

  // Configuración del Upload
  const uploadProps = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: { authorization: "authorization-text" },
    onChange(info) {
      console.log("info", info);
      if (info.file.status === "done") {
        messageApi.success(`${info.file.name} cargado correctamente`);
      } else if (info.file.status === "error") {
        messageApi.error(`${info.file.name} falló al cargar`);
      }
    },
  };

  // Al enviar el formulario
  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Datos del formulario:", {
        ...values,
        moneda: value === 1 ? "Pesos" : "Dólares",
      });

      // aqui ejecuta el backend
      // await api.post("/pagos", values);

      await new Promise((resolve) => setTimeout(resolve, 1200));
      messageApi.success("Datos enviados correctamente");
      form.resetFields();
    } catch (error) {
      messageApi.error("Ocurrió un error al enviar");
    } finally {
      setLoading(false);
    }
  };

  //Valida formulario
  const onFinishFailed = () => {
    messageApi.warning("Por favor, completa los campos requeridos.");
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
                <Upload
                  {...uploadProps}
                  maxCount={1}
                  accept=".jpg,.jpeg,.png,.pdf"
                  beforeUpload={validaFormato}
                >
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
                  disabled={esSelectFactActivo}
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
        {/* DATATABLE DE LAS FACTURAS*/}
        {dataSource.length > 1 ? (
          <>
            <Flex
              justify="space-between"
              align="center"
              style={{ marginBottom: 16 }}
              wrap="wrap"
              gap="middle"
            >
              <Title level={4} style={{ margin: 0 }}>
                Lista de Facturas
              </Title>
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
                  title="Cantidad en letras"
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
                    backgroundColor: "#bae0ff",
                    borderRadius: 10,
                    padding: 8,
                  }}
                >
                  Total Abonado:
                </Text>
                <Popover
                  content={renderPopoverContent(totalImporteRow)}
                  title="Cantidad en letras"
                  trigger="hover"
                  placement="left"
                >
                  <InputNumber
                    value={totalImporteRow}
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
              tBody={listadoFacturas.t_body}
              loading={isLoadingFacturas}
              pagination={{ pageSize: 15, showSizeChanger: false }}
              rowSelection={
                rowSelectorActivo ? rowSelection : rowSelectorActivo
              }
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

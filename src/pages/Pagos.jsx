import React, { useState, useMemo } from "react";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Empty,
  Upload,
  Divider,
  Table,
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

import { CardStyle } from "../configs/Estilos";
import { useCatalogos } from "../hooks/useCatalogos";
import { useListadoFacturas } from "../hooks/useListadoFacturas";
import { GeneraColumnasCabecero } from "../utils/DataTableUtils";
const { Title, Text } = Typography;

const Pagos = () => {
  const [form] = Form.useForm();
  const [parametro, setParametro] = useState(null);
  const [valueSelect, setValueSelect] = useState(1);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [abonos, setAbonos] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalImporteRow, setTotalImporteRow] = useState(0);

  const {
    tiposFacturas,
    isLoading: isLoadingCatalogos,
    isError,
    error,
  } = useCatalogos();

  const {
    listadoFacturas,
    isLoading: isLoadingFacturas,
    fetchListadoFacturas,
    resetListado,
  } = useListadoFacturas(parametro);

  const montoCapturado = Form.useWatch("monto", form);

  //LLena valores combo tipos factura
  const options = tiposFacturas.map((tipo) => ({
    value: tipo.idTipoFactura,
    label: tipo.descripcion,
  }));

  const columns = useMemo(() => {
    const baseColumns = GeneraColumnasCabecero(listadoFacturas.t_header);
    return [...baseColumns];
  }, [listadoFacturas.t_header, abonos]);

  //  Normalizar t_body agregando un `key` para Ant Design
  const dataSource = useMemo(() => {
    return (listadoFacturas.t_body ?? []).map((row, index) => ({
      ...row,
      key: row.idenc ?? row.factura?.trim() ?? String(index),
    }));
  }, [listadoFacturas.t_body]);

  //  Buscar facturas al hacer clic
  const handleBuscarFacturas = async () => {
    try {
      const parametro = "DI456";
      setParametro(parametro);
      messageApi.success("Facturas cargadas correctamente");
    } catch (err) {
      if (err?.errorFields) {
        // Error de validación del formulario
        messageApi.warning("Selecciona el tipo de factura");
      } else {
        messageApi.error(err.message || "Error al cargar facturas");
      }
    }
  };

  //Reinicia la pantalla
  const handleReset = () => {
    form.resetFields();
    setValueSelect(1);
    setAbonos({});
    setSelectedRowKeys([]);
    setTotalImporteRow(0);
    messageApi.info("Formulario limpiado");
  };

  //Seleccion row de tabla
  const handleSelectionRowChange = (keys, rows) => {
    setSelectedRowKeys(keys);
    console.log("Filas seleccionadas:", rows);

    const totalRow = rows.reduce((sum, row) => {
      const importe = row.importe_factura;
      return sum + importe;
    });
    setTotalImporteRow(totalRow);
    console.log("## Total importe seleccionado:", totalRow);
  };

  // Detecta cambio en Monto
  const totalDisponible = useMemo(() => {
    const montoInicial = Number(montoCapturado) || 0;
    const totalAbonado = Object.values(abonos).reduce(
      (sum, value) => sum + (Number(value) || 0),
      0,
    );
    return montoInicial - totalAbonado - totalImporteRow;
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

  //EJEMPLO DE MAQUETADO, QUITAR
  // const dataSource = [
  //   {
  //     key: "1",
  //     factura: "A320452",
  //     fecha: "11-05-2026",
  //     moneda: "Pesos",
  //     importe: 100,
  //     ncFolio: "NC-001",
  //     ncImporte: 200,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "2",
  //     factura: "A320432",
  //     fecha: "20-05-2026",
  //     moneda: "Pesos",
  //     importe: 200,
  //     ncFolio: "NC-0012",
  //     ncImporte: 200,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "3",
  //     factura: "A320422",
  //     fecha: "30-05-2026",
  //     moneda: "Pesos",
  //     importe: 500,
  //     ncFolio: "NC-002",
  //     ncImporte: 200,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "4",
  //     factura: "A320452",
  //     fecha: "10-05-2026",
  //     moneda: "Pesos",
  //     importe: 200,
  //     ncFolio: "NC-021",
  //     ncImporte: 120,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "5",
  //     factura: "A320352",
  //     fecha: "07-03-2026",
  //     moneda: "Pesos",
  //     importe: 100,
  //     ncFolio: "NC-421",
  //     ncImporte: 130,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "6",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "7",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "8",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "9",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "10",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  //   {
  //     key: "11",
  //     factura: "A320452",
  //     fecha: "10-01-2026",
  //     moneda: "Pesos",
  //     importe: 120,
  //     ncFolio: "NC-111",
  //     ncImporte: 230,
  //     abonado: 0,
  //     aclaracion: 0,
  //   },
  // ];

  // const columns = [
  //   {
  //     title: "Folio Factura",
  //     dataIndex: "factura",
  //     key: "factura",
  //   },
  //   {
  //     title: "Fecha",
  //     dataIndex: "fecha",
  //     key: "fecha",
  //   },
  //   {
  //     title: "Moneda",
  //     dataIndex: "moneda",
  //     key: "moneda",
  //   },
  //   {
  //     title: "Importe",
  //     dataIndex: "importe",
  //     key: "importe",
  //   },
  //   {
  //     title: "Nota de Crédito",
  //     key: "notaCreditoGroup",
  //     children: [
  //       {
  //         title: "Folio",
  //         dataIndex: "ncFolio",
  //         key: "ncFolio",
  //       },
  //       {
  //         title: "Importe",
  //         dataIndex: "ncImporte",
  //         key: "ncImporte",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Abonado",
  //     dataIndex: "abonado",
  //     key: "abonado",
  //   },
  //   {
  //     title: "Por Aclarar",
  //     dataIndex: "aclaracion",
  //     key: "aclaracion",
  //   },
  // ];

  return (
    <>
      {contextHolder}

      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[{ title: "Pagos" }, { title: "Registro" }]}
      />

      <h2>Pagos</h2>

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
                rules={[{ required: true, message: "Selecciona Tipo Factura" }]}
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
                  { required: true, message: "Sube Comprobante de Pago" },
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
                  { required: true, message: "Ingrese el monto" },
                  {
                    type: "number",
                    min: 1,
                    message: "El monto debe ser mayor a 0",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  min={0}
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
        {/*AQUI VA EL DATATABLE DE LAS FACTURAS*/}
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
                <Text strong style={{ fontSize: 16 }}>
                  Total Disponible:
                </Text>
                <InputNumber
                  value={totalDisponible}
                  readOnly
                  formatter={(v) =>
                    `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(v) => v.replace(/\$\s?|(,*)/g, "")}
                  style={{
                    width: 110,
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#52c41a",
                    backgroundColor: "#f6ffed",
                  }}
                  controls={false}
                />
              </Flex>
            </Flex>

            <DataTable
              tHeader={listadoFacturas.t_header}
              tBody={listadoFacturas.t_body}
              loading={loading}
              pagination={{ pageSize: 5, showSizeChanger: true }}
              rowSelection={rowSelection}
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

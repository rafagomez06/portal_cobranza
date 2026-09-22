// components/DataTable.jsx
import { Table } from "antd";

export default function DataTable({
  tHeader = [],
  tBody = [],
  currencyColumns = [
    "importe_factura",
    "importe_nota_credito",
    "abonado",
    "importe_aclarar",
  ],
  currencySymbol = "$",
  locale = "es-MX",
  loading = false,
  pagination = { pageSize: 10 },
  rowSelection = false,
  rowKey = "key",
  ...rest
}) {
  //Formateo moneda
  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return `${currencySymbol}${num.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Mapear t_header columns de antd
  const columns = tHeader
    .map((col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key || col.dataIndex,
      align:
        col.align ||
        (currencyColumns.includes(col.dataIndex) ? "left" : "left"),
      hidden: col.hidden || false,
      render: (value) => {
        if (
          currencyColumns.includes(col.dataIndex) &&
          value != null &&
          value !== ""
        ) {
          return formatCurrency(value);
        }
        return value;
      },
    }))
    .filter((c) => !c.hidden);

  // Asegurar key en dataSource
  const dataSource = tBody.map((row, i) => ({
    ...row,
    key: row.key ?? row.id ?? i,
  }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      rowKey={rowKey}
      rowSelection={rowSelection}
      scroll={{ x: "max-content" }}
      {...rest}
    />
  );
}

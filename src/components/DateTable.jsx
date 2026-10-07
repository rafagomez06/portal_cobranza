// components/DataTable.jsx
import { Table } from "antd";

export default function DataTable({
  tHeader = [],
  tBody = [],
  currencyColumns = [],
  currencySymbol = "$",
  locale = "es-MX",
  loading = false,
  pagination = { pageSize: 10 },
  rowSelection = false,
  rowKey = "key",
  // columna de acciones (o cualquier columna extra)
  actionColumn = null,
  renderers = {},
  columnWidths = {},

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
    .map((col) => {
      const key = col.key || col.dataIndex;
      const isCurrency = currencyColumns.includes(col.dataIndex);

      return {
        title: col.title,
        dataIndex: col.dataIndex,
        key,
        align: col.align || (isCurrency ? "right" : "right"),
        width: col.width || columnWidths[col.dataIndex],
        hidden: col.hidden || false,
        render:
          renderers[col.dataIndex] ||
          ((value) => {
            if (isCurrency && value != null && value !== "") {
              return formatCurrency(value);
            }
            return value;
          }),
      };
    })
    .filter((c) => !c.hidden);

  //  Agregar columna de acciones al final (o donde se prefiera)
  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  // Asegurar key en dataSource
  const dataSource = tBody.map((row, i) => ({
    ...row,
    key: row.key ?? row.id ?? i,
  }));

  return (
    <Table
      columns={finalColumns}
      dataSource={dataSource}
      loading={loading}
      pagination={pagination}
      rowKey={rowKey}
      size="small"
      rowSelection={rowSelection}
      scroll={{ x: "max-content" }}
      {...rest}
    />
  );
}

// // components/DataTable.jsx
// import { Table } from "antd";

// export default function DataTable({
//   tHeader = [],
//   tBody = [],
//   currencyColumns = [],
//   currencySymbol = "$",
//   locale = "es-MX",
//   loading = false,
//   pagination = { pageSize: 10 },
//   rowSelection = false,
//   rowKey = "key",
//   // columna de acciones (o cualquier columna extra)
//   actionColumn = null,
//   renderers = {},
//   columnWidths = {},

//   ...rest
// }) {
//   //Formateo moneda
//   const formatCurrency = (value) => {
//     const num = Number(value);
//     if (isNaN(num)) return value;
//     return `${currencySymbol}${num.toLocaleString(locale, {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;
//   };

//   // Mapear t_header columns de antd
//   const columns = tHeader
//     .map((col) => {
//       const key = col.key || col.dataIndex;
//       const isCurrency = currencyColumns.includes(col.dataIndex);

//       return {
//         title: col.title,
//         dataIndex: col.dataIndex,
//         key,
//         align: col.align || (isCurrency ? "right" : "right"),
//         width: col.width || columnWidths[col.dataIndex],
//         hidden: col.hidden || false,
//         render:
//           renderers[col.dataIndex] ||
//           ((value) => {
//             if (isCurrency && value != null && value !== "") {
//               return formatCurrency(value);
//             }
//             return value;
//           }),
//       };
//     })
//     .filter((c) => !c.hidden);

//   //  Agregar columna de acciones al final (o donde se prefiera)
//   const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

//   // Asegurar key en dataSource
//   const dataSource = tBody.map((row, i) => ({
//     ...row,
//     key: row.key ?? row.id ?? i,
//   }));

//   return (
//     <Table
//       columns={finalColumns}
//       dataSource={dataSource}
//       loading={loading}
//       pagination={pagination}
//       rowKey={rowKey}
//       size="small"
//       rowSelection={rowSelection}
//       scroll={{ x: "max-content" }}
//       {...rest}
//     />
//   );
// }
import { useState, useMemo } from "react";
import { Table, Input, Flex } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
  actionColumn = null,
  renderers = {},
  columnWidths = {},

  searchable = false, // activa/desactiva la búsqueda
  searchDataIndex = "factura", // columna sobre la que se busca
  searchPlaceholder = "Buscar...", // placeholder del input
  searchWidth = 170, // ancho del input

  ...rest
}) {
  const [searchText, setSearchText] = useState("");

  // Formateo moneda
  const formatCurrency = (value) => {
    const num = Number(value);
    if (isNaN(num)) return value;
    return `${currencySymbol}${num.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Columnas
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

  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  // Asegurar key en dataSource
  const dataSource = tBody.map((row, i) => ({
    ...row,
    key: row.key ?? row.id ?? i,
  }));

  const filteredDataSource = useMemo(() => {
    if (!searchable || !searchText.trim()) return dataSource;

    const term = searchText.toLowerCase().trim();
    return dataSource.filter((row) => {
      const value = row?.[searchDataIndex];
      return value != null && String(value).toLowerCase().includes(term);
    });
  }, [dataSource, searchText, searchable, searchDataIndex]);

  return (
    <>
      {searchable && (
        <Flex justify="flex-end" style={{ marginBottom: 12 }}>
          <Input
            placeholder={searchPlaceholder}
            allowClear
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: searchWidth }}
          />
        </Flex>
      )}

      <Table
        columns={finalColumns}
        dataSource={filteredDataSource}
        loading={loading}
        pagination={pagination}
        rowKey={rowKey}
        size="small"
        rowSelection={rowSelection}
        scroll={{ x: "max-content" }}
        {...rest}
      />
    </>
  );
}

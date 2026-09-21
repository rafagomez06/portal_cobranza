// components/DataTable.jsx
import { Table } from "antd";

export default function DataTable({
  tHeader = [],
  tBody = [],
  loading = false,
  pagination = { pageSize: 10 },
  rowSelection = false,
  rowKey = "key",
  ...rest
}) {
  // Mapear t_header columns de antd
  const columns = tHeader
    .map((col) => ({
      title: col.title,
      dataIndex: col.dataIndex,
      key: col.key || col.dataIndex,
      align: col.align || "left",
      hidden: col.hidden || false,
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

//Modal reutilizable
import { Modal, Empty } from "antd";
import DataTable from "./DateTable";

export default function ModalDetalle({
  open,
  title,
  nota,
  tHeader = [],
  tBody = [],
  loading = false,
  emptyText = "No hay datos para mostrar",
  currencyColumns = [],
  onClose,
  width = 680,
}) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      width={width}
      destroyOnHidden
    >
      {nota && <p>{nota}</p>}
      {tBody.length > 0 ? (
        <DataTable
          tHeader={tHeader}
          tBody={tBody}
          loading={loading}
          currencyColumns={currencyColumns}
          pagination={{ pageSize: 20, showSizeChanger: false }}
        />
      ) : (
        <Empty description={emptyText} />
      )}
    </Modal>
  );
}

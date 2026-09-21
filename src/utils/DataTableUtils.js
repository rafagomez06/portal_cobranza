/**
 * Convierte el header del backend al formato de columnas de Ant Design.
 * @param {Array} t_header Array de columnas del backend
 * @param {Object} opciones { renderers, widths, aligns }
 * @returns {Array} Columnas para Ant Design
 */
export function GeneraColumnasCabecero(t_header = [], opciones = {}) {
  const { renderers = {}, widths = {}, aligns = {} } = opciones;

  return t_header.map((col) => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.key,
    // align: aligns[col.key] || "center",
    width: widths[col.key],
    // render: renderers[col.key], // undefined si no hay renderer
  }));
}

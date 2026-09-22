// components/MontoConLetras.jsx
import React from "react";
import { Popover } from "antd";
import { NumeroALetras } from "../utils/NumeroALetras";

export const MontoConLetras = ({ cantidad, estiloSpan }) => {
  // Convertimos el valor recibido en letras
  const textoEnLetras = NumeroALetras(Number(cantidad));

  // Formato visual en moneda ($1,250.50)
  const montoFormateado = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MX",
  }).format(cantidad);

  const popoverContent = (
    <div style={{ maxWidth: "250px", fontWeight: 500, color: "#1890ff" }}>
      {textoEnLetras}
    </div>
  );

  return (
    <Popover
      content="{popoverContent}"
      placement="top"
      title="Cantidad en letras"
      trigger="hover"
    >
      <span
        style={{
          cursor: "pointer",
          borderBottom: "1px dashed #1890ff",
          ...estiloSpan,
        }}
      >
        {montoFormateado}
      </span>
    </Popover>
  );
};

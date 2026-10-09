import { ApiConexion } from "../configs/ApiConexion";

export async function fetchVerFacturaCliente({ cod_cliente, factura }) {
  try {
    const response = await ApiConexion.get("/archivo/obtener-archivo", {
      params: { cod_cliente, factura },
      responseType: "blob",
    });

    const blob = response.data;

    // si no es PDF, es un error disfrazado de blob
    if (blob.type && !blob.type.includes("pdf")) {
      const text = await blob.text();
      const errorData = JSON.parse(text);
      const mensaje =
        errorData?.body?.message ||
        errorData?.message ||
        "No se pudo obtener la factura";
      throw new Error(mensaje);
    }

    // abrir en nueva pestaña
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } catch (error) {
    //  Manejar el error del backend (viene como Blob)
    let mensaje = "No se pudo obtener la factura";

    const errorBlob = error?.response?.data;

    if (errorBlob instanceof Blob) {
      try {
        const text = await errorBlob.text();
        const errorData = JSON.parse(text);
        mensaje = errorData?.body?.message || errorData?.message || mensaje;
      } catch {
        // Si no se puede parsear, dejamos el mensaje por defecto
      }
    } else if (error?.body?.message) {
      // Si el interceptor ya normalizó el error
      mensaje = error.body.message;
    } else if (error?.message) {
      mensaje = error.message;
    }

    throw new Error(mensaje);
  }
}

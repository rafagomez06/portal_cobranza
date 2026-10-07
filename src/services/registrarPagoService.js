import { postForm } from "../configs/ApiConexion";
//Envio de Form al back
export const fetchRegistrarPago = (formData) =>
  postForm("/pago/registrar-pago", formData);

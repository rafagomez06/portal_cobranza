import { ApiConexion } from "../configs/ApiConexion";

export const fetchLogin = (userData) =>
  ApiConexion.post("/auth/login", userData);

import axios from "axios";

// Creamos una instancia de Axios con la URL base de la API
const api = axios.create({
  baseURL: "http://localhost:4000/api", // URL del backend
});

// Interceptor para agregar token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // obtener token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // agregar encabezado Authorization
  }
  return config;
});

export default api; // exportamos la instancia para usar en componentes

import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api" });

// Interceptor de respuesta global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("[InterceptorLog]Error de red o sin respuesta del servidor:", error);
    } else {
      console.warn(`[InterceptorLog]Error ${error.response.status}: ${error.response.statusText}`);
    }
    return Promise.reject(error);
  }
);
export default api;

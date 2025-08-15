import api from "../../links/api";

const getAll = () => api.get("/barrios");

export const barrioService = {getAll};

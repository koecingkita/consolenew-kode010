import { api } from "../utils/api";
import { apiEndpoints } from "../config/config";

const KATEGORI = apiEndpoints.kategori;

export const KategoriService = {
  get: (value) => {

    const path = !value ? KATEGORI.get+value : KATEGORI.get;
    console.log("FETCH URL:", path); // kok ada /true nya?


    return api.get(path);
  },
  detail: (id) => api.get(`/api/artikel/${id}`),
  create: (data) => api.post("/api/artikel", data),
  update: (id, data) => api.put(`/api/artikel/${id}`, data),
  remove: (id) => api.delete(`/api/artikel/${id}`),
};

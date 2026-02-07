import { api } from "../utils/api";
import { apiEndpoints } from "../config/config";

const ARTIKEL = apiEndpoints.artikel;
const PANDUAN = apiEndpoints.panduan;
const PRODUK = apiEndpoints.produk;


export const ArtikelService = {
  get: (value = '') => {
    const path = !value ? ARTIKEL.get+value : ARTIKEL.get;

    return api.get(path);
  },
  detail: (id) => api.get(`/api/artikel/${id}`),
  create: (data) => api.post("/api/artikel", data),
  update: (id, data) => api.put(`/api/artikel/${id}`, data),
  remove: (id) => api.delete(`/api/artikel/${id}`),

  Panduan: {
    get: (value = '') => {
      const path = !value ? PANDUAN.get + value : PANDUAN.get;
      return api.get(path);
    },
  },

  Produk: {
    get: (value = '') => {
      const path = !value ? PRODUK.get + value : PRODUK.get;
      return api.get(path);
    },
  },
};

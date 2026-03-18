import { api } from "../utils/api";
import { apiEndpoints } from "../config/config";

const TAG = apiEndpoints.tag;

export const TagService = {
  get: (value = '') => {
    const path = value ? TAG.get+value : TAG.get;
    return api.get(path);
  },
  detail: (id) => api.get(`/api/artikel/${id}`),
  create: (data) => api.post(TAG.create, data),
  update: (id, data) => api.put(`/api/artikel/${id}`, data),
  delete: (id) => api.delete(TAG.delete, id),
};

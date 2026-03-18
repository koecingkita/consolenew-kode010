import { api } from "../utils/api";
import { apiEndpoints } from "../config/config";

const FAQ = apiEndpoints.faq;

export const FAQService = {
  get: (value = '') => {
    const path = value ? FAQ.get+value : FAQ.get;
    return api.get(path);
  },
  detail: (id) => api.get(`/api/artikel/${id}`),
  create: (data) => api.post(FAQ.create, data),
  update: (id, data) => api.put(`/api/artikel/${id}`, data),
  delete: (id) => api.delete(FAQ.delete, id),
};

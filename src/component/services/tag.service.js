import { api } from "../utils/api";
import { apiEndpoints } from "../config/config";

const TAG = apiEndpoints.tag;

export const TagService = {
  get: (value = '') => {
    const path = value ? TAG.get+value : TAG.get;
    return api.get(path);
  },
  cek: (value = '') => {
    const path = value ? TAG.cek+"?detail=true&tag="+value : TAG.cek+"/"+value;
    return api.get(path);
  },
  detail: (id) => api.get(`/api/artikel/${id}`),
  create: (data) => api.post(TAG.create, data),
  update: (data) => api.patch(TAG.update, data),
  delete: (id) => api.delete(TAG.delete, id),
};

// k?&queryTag=2&artikel=cb003e52-59be-402f-ba15-93a1eff7c623'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const BaseUrl = import.meta.env.VITE_BASE_URL;
const urlApi = apiBaseUrl + "/api";

export const apiEndpoints = {
  users: {
    cekExist: urlApi + "/users/cek-exist",
    login: urlApi + "/users/login",
    logout: urlApi + "/users/logout",
    refresh: urlApi + "/users/refresh",
    cekMember: urlApi + "/users/member/cek",
    member: {
      get: urlApi + "/users/member/get",
      biodata: {
        input: urlApi + "/users/member/biodata/input",
      },
    },
  },
  artikel: {
    get: urlApi + "/artikel/get",
    create: urlApi + "/artikel/create",
    delete: urlApi + "/artikel/delete",
    update: urlApi + "/artikel/update",
    publish: urlApi + "/artikel/publish",
    unpublish: urlApi + "/artikel/unpublish",
  },
  produk: {
    get: urlApi + "/produk/get",
    create: urlApi + "/produk/create",
    delete: urlApi + "/produk/delete",
    update: urlApi + "/produk/update",
    publish: urlApi + "/produk/publish",
    unpublish: urlApi + "/produk/unpublish",
  },
  panduan: {
    get: urlApi + "/panduan/get",
    create: urlApi + "/panduan/create",
    delete: urlApi + "/panduan/delete",
    update: urlApi + "/panduan/update",
    publish: urlApi + "/panduan/publish",
    unpublish: urlApi + "/panduan/unpublish",
  },
  kategori: {}, // get, create, delete, update
  faq: {}, // get, create, delete, update
};

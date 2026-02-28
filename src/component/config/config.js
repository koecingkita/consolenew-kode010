const BASE = '/api'
const ARTIKEL = BASE+'/content'
const USER = BASE+'/users'

export const apiEndpoints = {
  users: {
    cekExist: USER+"/cek-exist",
    login: USER+"/login",
    logout: USER+"/logout",
    refresh: USER+"/refresh",
    cekMember: USER+"/member/cek",
    member: {
      get: USER+"/member/get",
      biodata: {
        input: USER+"/member/biodata/input",
      },
    },
  },
  artikel: {
    get: ARTIKEL + "/artikel/get",
    create: ARTIKEL+"/create/artikel",
    delete: ARTIKEL+"/delete/force/artikel",
    update: {
      get: ARTIKEL + "/artikel/update/get",
      update: ARTIKEL + "/update/artikel",
    },
    publish: ARTIKEL+"/artikel/publish",
    unpublish: ARTIKEL+"/artikel/unpublish",
  },
  produk: {
    get: ARTIKEL+"/produk/get",
    create: ARTIKEL+"/produk/create",
    delete: ARTIKEL+"/produk/delete",
    update: ARTIKEL+"/produk/update",
    publish: ARTIKEL+"/produk/publish",
    unpublish: ARTIKEL+"/produk/unpublish",
  },
  panduan: {
    get: ARTIKEL+"/panduan/get",
    create: ARTIKEL+"/panduan/create",
    delete: ARTIKEL+"/panduan/delete",
    update: ARTIKEL+"/panduan/update",
    publish: ARTIKEL+"/panduan/publish",
    unpublish: ARTIKEL+"/panduan/unpublish",
  },
  kategori: {
    get: ARTIKEL + "/kategori/get",
    create: ARTIKEL + "/create/category",
    update: ARTIKEL + "/update/category",
    delete: ARTIKEL + "/delete/category"

  },
  faq: {}, // get, create, delete, update
};

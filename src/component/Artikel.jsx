import { AiOutlineSearch } from "solid-icons/ai";
import { FaSolidAdd, FaSolidDownload } from "solid-icons/fa";
import { BsSortDownAlt } from "solid-icons/bs";
import { BiRegularFilterAlt } from "solid-icons/bi";
import { createSignal, createResource, For, Show, createEffect } from 'solid-js';
import { listArtikel, listArtikelProduk, listArtikelPanduan } from './config/dataTable.js';
import { FaRegularEdit } from 'solid-icons/fa'
import { RiSystemDeleteBinLine } from 'solid-icons/ri'
import { BsInfoLg } from 'solid-icons/bs'
import { A } from '@solidjs/router';
import Tooltip from "./theme/ui/Tooltip.jsx";
import Delete from './modals/Delete.jsx'
import Info from './modals/Info.jsx'
import { ArtikelService } from "./services/artikel.service.js";

const ARTIKEL = ArtikelService.get;
const PANDUAN = ArtikelService.Panduan.get;
const PRODUK = ArtikelService.Produk.get;

const initialModals = { type: null, item: null, open: false }

function Artikel() {
  const [tab, setTab] = createSignal(0);
  const [modals, setModals] = createSignal(initialModals);
  const [artikel] = createResource(ARTIKEL);
  const [panduan] = createResource(PANDUAN);
  const [produk] = createResource(PRODUK);

  createEffect(() => {
    const dataArtikel = artikel();
    const dataPanduan = panduan();
    const dataProduk = produk();

    if (!dataArtikel) return;
    if (!dataPanduan) return;
    if (!dataProduk) return;

    console.log('dataArtikel:', dataArtikel);
    console.log('dataPanduan:', dataPanduan);
    console.log('dataProduk:', dataProduk);
  })
  const openModal = (type, item=null) => {
    setModals({ type, item, open:true });
  };

  const closeModal = () => {
    setModals(initialModals)
  }


  const headArtikel = [
    {
      key: "id", label: "ID", render: (item) => (
        <td class="whitespace-nowrap text-sm font-medium text-blue-600">
          {item.id}
        </td>
    )},
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          class={`px-3 py-1 text-xs rounded-full ${
            item.status === "1"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === "1" ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <div class="flex gap-2 text-md">
          <Tooltip text='Edit Artikel' position='bottom'>
            <A href={`update/${item.slug}`}>
              <FaRegularEdit class="text-blue-700 cursor-pointer" />
            </A>
          </Tooltip>

          <Tooltip text='Delete Artikel' position='bottom'>
            <RiSystemDeleteBinLine class="text-red-700 cursor-pointer" onClick={() => openModal('delete', item)}/>
          </Tooltip>

          <Tooltip text='Detail Artikel' position='bottom'>
            <BsInfoLg class="cursor-pointer" onClick={() => openModal('info', item)}/>
          </Tooltip>
        </div>
      ),
    },
  ];

  const headPanduan = [
    {
      key: "id", label: "ID", render: (item) => (
        <td class="whitespace-nowrap text-sm font-medium text-blue-600">
          {item.id}
        </td>
    )},
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          class={`px-3 py-1 text-xs rounded-full ${
            item.status === "1"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === "1" ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <div class="flex gap-2 text-md">
          <FaRegularEdit class="text-blue-700 cursor-pointer" />
          <RiSystemDeleteBinLine class="text-red-700 cursor-pointer" />
          <BsInfoLg class="cursor-pointer" />
        </div>
      ),
    },
  ];

  const headArtikelProduk = [
    {
      key: "id", label: "ID", render: (item) => (
        <td class="whitespace-nowrap text-sm font-medium text-blue-600">
          {item.id}
        </td>
    )},
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "kategori", label: "Kategori" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          class={`px-3 py-1 text-xs rounded-full ${
            item.status === "1"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.status === "1" ? "Aktif" : "Tidak Aktif"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: () => (
        <div class="flex gap-2 text-md">
          <FaRegularEdit class="text-blue-700 cursor-pointer" />
          <RiSystemDeleteBinLine class="text-red-700 cursor-pointer" />
          <BsInfoLg class="cursor-pointer" />
        </div>
      ),
    },
  ];

  const dataTab = [
    { id: 0, label: "Artikel Umum", dataHead: headArtikel, dataBody: () => artikel()?.data || [] },
    { id: 1, label: "Artikel Produk", dataHead:  headArtikelProduk, dataBody: listArtikelProduk},
    { id: 2, label: "Artikel Panduan", dataHead: headPanduan, dataBody: listArtikelPanduan },
  ]

  return (
    <>
      <div class="mb-8 rounded-2xl p-6 text-gray-700 shadow-sm border border-gray-200 bg-white">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-xl font-semibold">Dashboard Artikel</h1>
            <p class="text-sm">Kelola artikel, draft, dan publikasi</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button class="flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-300 hover:cursor-pointer transition">
              <FaSolidDownload class="h-4 w-4" />
              Download CSV
            </button>
            <A href='create' class="flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition">
              <FaSolidAdd class="h-4 w-4" />
              Buat Artikel
            </A>
          </div>
        </div>

        <div class="w-full my-4">
          <div class="flex border-b border-gray-200">
            <For each={dataTab}>
              {(item) => (
                <button
                  onClick={() => setTab(item.id)}
                  class={`hover:cursor-pointer px-4 py-2 text-sm font-medium transition ${tab() === item.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {item.label}
                </button>
              )}
            </ For>
          </div>
        </div>

        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div class="relative">
              <input
                type="text"
                placeholder={`Cari ${dataTab[tab()].label.toLowerCase()} ...`}
                class="w-60 rounded-lg bg-white/90 border px-4 py-1 text-sm  text-gray-800  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2  text-gray-400">
                <AiOutlineSearch />
              </span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button class="flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
              <BiRegularFilterAlt /> Filter
            </button>

            <button class="flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
              <BsSortDownAlt /> Sort
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">{dataTab[tab()].label}</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <For each={dataTab[tab()].dataHead}>
                  {(head) => (
                    <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      {head.label}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <Show when={artikel()?.data} fallback={
                <tr>
                  <td colspan={dataTab[tab()].dataHead.length} class='px-6 py-4 text-center'>
                    Loading ...
                  </td>
                </tr>
              }>
              <For each={dataTab[tab()].dataBody()}>
                {(item) => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <For each={dataTab[tab()].dataHead}>
                      {(head) => (
                        <td class='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                          {head.render ? head.render(item) : item[head.key]}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>

              </Show>
            </tbody>
          </table>
        </div>
      </div>

      <Show when={modals().open && modals().type==='delete'}>
        <Delete
          item={modals().item}
          onClose={closeModal}
        />
      </Show>

      <Show when={modals().open && modals().type==='info'}>
        <Info
          item={modals().item}
          onClose={closeModal}
        />
      </Show>

    </>
  );
}

export default Artikel;

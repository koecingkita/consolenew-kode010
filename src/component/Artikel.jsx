import { AiOutlineSearch } from "solid-icons/ai";
import { FaSolidAdd, FaSolidDownload } from "solid-icons/fa";
import { BsSortDownAlt } from "solid-icons/bs";
import { BiRegularFilterAlt } from "solid-icons/bi";
import { createSignal, For, Show } from 'solid-js';
import { listArtikel } from './config/dataTable.js';
import { FaRegularEdit } from 'solid-icons/fa'
import { RiSystemDeleteBinLine } from 'solid-icons/ri'
import { BsInfoLg } from 'solid-icons/bs'
import { A } from '@solidjs/router';

function Artikel() {
  const [tab, setTab] = createSignal(0);

  console.log('list artikel: ', listArtikel);

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Smith",
      date: "Today, 10:30 AM",
      amount: "$245.99",
      status: "Completed",
    },
    {
      id: "#ORD-002",
      customer: "Sarah Johnson",
      date: "Today, 09:15 AM",
      amount: "$89.50",
      status: "Processing",
    },
    {
      id: "#ORD-003",
      customer: "Mike Brown",
      date: "Yesterday, 3:45 PM",
      amount: "$156.75",
      status: "Completed",
    },
    {
      id: "#ORD-004",
      customer: "Emma Wilson",
      date: "Yesterday, 11:20 AM",
      amount: "$299.99",
      status: "Pending",
    },
  ];

  const dataTab = [
    { id: 0, label: "Artikel" },
    { id: 1, label: "Produk" },
    { id: 2, label: "Layanan" },
    { id: 3, label: "FAQ" },
    { id: 4, label: "Info" },
  ]

  const filterTab = () =>
    dataTab.filter((item) => item.label.toLowerCase()
  );

  return (
    <>
      <div class="mb-8 rounded-2xl p-6 text-gray-700 shadow-sm  bg-white">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* ===== Left: Title & Info ===== */}
          <div>
            <h1 class="text-xl font-semibold">Dashboard Artikel</h1>
            <p class="text-sm">Kelola artikel, draft, dan publikasi</p>
          </div>

          {/* ===== Right: Actions ===== */}
          <div class="flex flex-wrap items-center gap-2">
            {/* Create Artikel */}
            <button class="flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition">
              <FaSolidDownload class="h-4 w-4" />
              Download CSV
            </button>
            <A href='create' class="flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition">
              <FaSolidAdd class="h-4 w-4" />
              Buat Artikel
            </A>
          </div>
        </div>

        {/* */}
        {/* */}
        {/* */}

        <div class="w-full my-4">
          {/* Tabs header */}
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

        {/* */}
        {/* */}
        {/* */}

        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* ===== Left: Title & Info ===== */}
          <div>
            {/* Search */}
            <div class="relative">
              <input
                type="text"
                placeholder="Cari artikel..."
                class="w-60 rounded-lg bg-white/90 border px-4 py-1 text-sm  text-gray-800  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2  text-gray-400">
                <AiOutlineSearch />
              </span>
            </div>
          </div>

          {/* ===== Right: Actions ===== */}
          <div class="flex flex-wrap items-center gap-2">
            {/* Create Artikel */}
            <button class="flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
              <BiRegularFilterAlt /> Filter
            </button>

            {/* Create Artikel */}
            <button class="flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition">
              <BsSortDownAlt /> Sort
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Artikel Order</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <For each={listArtikel.slice(0, 6)}>
                {(item) => (
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {item.id}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {item.title}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {item.slug}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class={`px-3 py-1 text-xs rounded-full ${
                          item.status === "1"
                            ? "bg-green-100 text-green-800"
                            : item.status === "0"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.status === "1" ? 'aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-md flex gap-2">
                      <FaRegularEdit class='text-blue-800 hover:cursor-pointer' />
                      <RiSystemDeleteBinLine class='text-red-700 hover:cursor-pointer'/>
                      <BsInfoLg class='hover:cursor-pointer'/>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Artikel;

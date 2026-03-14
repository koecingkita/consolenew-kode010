import { FaSolidAdd } from "solid-icons/fa";
import { createSignal, createResource, For, Show, createEffect } from "solid-js";
import CreateKategori from "./modals/CreateKategori";
import Tooltip from "./theme/ui/Tooltip.jsx";
import { FaRegularEdit } from "solid-icons/fa";
import { RiSystemDeleteBinLine } from "solid-icons/ri";
import { KategoriService } from "./services/kategori.service";
import Delete from "./modals/Delete.jsx";

const initialModals = { type: null, item: null, open: false };

function Kategori() {
  const [modals, setModals] = createSignal(initialModals);

  // 🔥 ambil refetch dengan benar
  const [kategori, { refetch }] = createResource(async () => {
    const result = await KategoriService.get();
    return result.data.data; // langsung return array
  });



  createEffect(() => {
    if (kategori()) {
      console.log("kategori:", kategori());
    }
  });

  const openModal = (type, item = null) => {
    setModals({ type, item, open: true });
  };

  const closeModal = () => {
    setModals(initialModals);
  };

  const headKategori = [
    {
      key: "id",
      label: "ID",
      render: (item) => (
        <span class="whitespace-nowrap text-sm font-medium text-blue-600">
          {item.id}
        </span>
      ),
    },
    { key: "label", label: "Label" },
    { key: "slug", label: "Slug" },
    {
      key: "action",
      label: "Action",
      render: (item) => (
        <div class="flex gap-2 text-md">
          <Tooltip text="Edit Kategori" position="bottom">
            <FaRegularEdit class="text-blue-700 cursor-pointer" />
          </Tooltip>

          <Tooltip text="Delete Kategori" position="bottom">
            <RiSystemDeleteBinLine
              class="text-red-700 cursor-pointer"
              onClick={() => openModal("delete", item)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <div class="mb-8 rounded-2xl p-6 text-gray-700 shadow-sm border border-gray-200 bg-white">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-xl font-semibold">Kategori Artikel Produk</h1>
            <p class="text-sm text-gray-600">
              Digunakan untuk mengelompokkan artikel produk berdasarkan kategori
            </p>
          </div>

          <button
            onClick={() => openModal("create")}
            class="flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold hover:bg-gray-300 transition"
          >
            <FaSolidAdd class="h-4 w-4" />
            Buat Kategori
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">
            Kategori Produk
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <For each={headKategori}>
                  {(head) => (
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {head.label}
                    </th>
                  )}
                </For>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <Show
                when={kategori()}
                fallback={
                  <tr>
                    <td
                      colSpan={headKategori.length}
                      class="px-6 py-4 text-center"
                    >
                      Loading...
                    </td>
                  </tr>
                }
              >
                {(items) => (
                  <For each={items()}>
                    {(item) => (
                      <tr class="hover:bg-gray-50 transition-colors">
                        <For each={headKategori}>
                          {(head) => (
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {head.render
                                ? head.render(item)
                                : item[head.key]}
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                )}
              </Show>
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Show when={modals().open && modals().type === "create"}>
        <CreateKategori onClose={closeModal} onSuccess={refetch} />
      </Show>

      {/* DELETE MODAL */}
      <Show when={modals().open && modals().type === "delete"}>
        <Delete
          isOpen={true}
          onClose={closeModal}
          title="Kategori"
          itemName={modals().item?.label}
          onDelete={() => KategoriService.delete({ kategori: modals().item?.id })}
          onSuccess={refetch}
        />
      </Show>
    </>
  );
}

export default Kategori;

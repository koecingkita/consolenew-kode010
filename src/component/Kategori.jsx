import { FaSolidAdd } from 'solid-icons/fa';
import { createSignal, createResource, For, Show, createEffect } from 'solid-js';
import CreateKategori from './modals/CreateKategori';
import { listKategori } from './config/dataTable.js';
import Tooltip from "./theme/ui/Tooltip.jsx";
import { FaRegularEdit } from 'solid-icons/fa'
import { RiSystemDeleteBinLine } from 'solid-icons/ri'
import { AiOutlineSearch } from "solid-icons/ai";
import { BiRegularFilterAlt } from "solid-icons/bi";
import { BsSortDownAlt } from "solid-icons/bs";
import { KategoriService } from './services/kategori.service';

const initialModals = { type: null, item: null, open: false }


function Kategori() {
  const [modals, setModals] = createSignal(initialModals);
  const [kategori] = createResource(KategoriService.get);

  createEffect(() => {
    const data = kategori();
    if (!data) return;

    console.log("kategori:sz", data);
  });


  const openModal = (type, item=null) => {
    setModals({ type, item, open:true });
  };

  const closeModal = () => {
    setModals(initialModals)
  }


  // id, name, slug, status
  //
  const headKategori = [
    {key:'id', label:'ID', render: (item) => (
      <td class="whitespace-nowrap text-sm font-medium text-blue-600">
        {item.id}
      </td>
    )},
    {key:'label', label:'Label'},
    {key:'slug', label:'Slug'},
      {key:'action', label:'Action', render: (item)=>(
        <div class="flex gap-2 text-md">
          <Tooltip text='Edit Kategori' position='bottom'>
            {/* <A href={`update/${item.slug}`}>*/}
              <FaRegularEdit class="text-blue-700 cursor-pointer" />
            {/* </A>*/}
          </Tooltip>

          <Tooltip text='Delete Kategori' position='bottom'>
            <RiSystemDeleteBinLine class="text-red-700 cursor-pointer" onClick={() => openModal('delete', item)}/>
          </Tooltip>
        </div>
      )}
  ]

  return (<>
    <div class="mb-8 rounded-2xl p-6 text-gray-700 shadow-sm border border-gray-200  bg-white">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-xl font-semibold">Kategori Artikel Produk</h1>
          <p class="text-sm text-gray-600">
            Digunakan untuk mengelompokkan artikel yang berisi informasi produk berdasarkan kategori tertentu
          </p>
        </div>

        <div>
          <button onCLick={() => openModal('create') } class="hover:cursor-pointer flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition">
            <FaSolidAdd class="h-4 w-4" />
            Buat Kategori
          </button>
        </div>
      </div>

      <div class='flex flex-row gap-4 mt-8 justify-between'>
        <div>
          <div class='relative'>
            <input placeholder='Cari kategori ...' class='w-60 rounded-lg bg-white/90 border px-4 py-1 text-sm  text-gray-800  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white' />
            <span class="absolute right-3 top-1/2 -translate-y-1/2  text-gray-400">
              <AiOutlineSearch />
            </span>
          </div>
        </div>

        <div class='flex flex-wrap items-center gap-2'>
          <button class='hover:cursor-pointer flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition'>
            <BiRegularFilterAlt />Filter</button>
          <button class='hover:cursor-pointer flex items-center gap-1 rounded-lg  bg-white px-2 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition'>
            <BsSortDownAlt />Sort</button>
        </div>


      </div>


    </div>

    <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Kategori Produk</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <For each={headKategori}>
              {(head) => (
                <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {head.label}
                </th>
              )}
            </For>
          </thead>


          <tbody class="divide-y divide-gray-200">
            <Show
              when={kategori()}
              fallback={
                <tr>
                  <td colspan={headKategori.length} class="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              }
            >
              {(res) => (
                <For each={res().data}>
                  {(item) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <For each={headKategori}>
                        {(head) => (
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {head.render ? head.render(item) : item[head.key]}
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

    <Show when={modals().open && modals().type === 'create'}>
      <CreateKategori item={modals().item} onClose={closeModal}/>
    </Show>
  </>)
}

export default Kategori;

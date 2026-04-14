import { FaSolidAdd } from 'solid-icons/fa';
import { createSignal, For, Show, createResource, createEffect } from 'solid-js';
import CreateTag from './modals/CreateTag';
import UpdateTag from './modals/UpdateTag';
import { listTag } from './config/dataTable.js';
import { FaRegularEdit } from 'solid-icons/fa'
import { RiSystemDeleteBinLine } from 'solid-icons/ri'
import Tooltip from "./theme/ui/Tooltip.jsx";
import { BiRegularFilterAlt } from "solid-icons/bi";
import { BsSortDownAlt } from "solid-icons/bs";
import { AiOutlineSearch } from "solid-icons/ai";
import { TagService } from './services/tag.service';
import Delete from "./modals/Delete.jsx";

const initialModals = { type:null, item:null, open:false }

function Tag() {
  const [modals, setModals] = createSignal(initialModals);
  const [search, setSearch] = createSignal("");
  const [sortDir, setSortDir] = createSignal("asc");

  const [tag, { refetch }] = createResource(async () => {
    const result = await TagService.get();
    return result.data.data;
  })

  createEffect(() => {
    if (tag()) {
      console.log("tag: ", tag());
    }
  })

  const openModal = (type, item=null) => {
    setModals({ type, item, open:true });
  };

  const closeModal = () => {
    setModals(initialModals)
  }

  const filterBySearch = (list) => {
    if(!Array.isArray(list)) return [];
    const q = search().toLocaleLowerCase().trim();

    let result = [...list];

    if(q) {
      result = result.filter(item =>
        item.label?.toLocaleLowerCase().includes(q)
      )
    }

    result = result.sort((a, b) => {
      return sortDir() === "asc" ? a.id - b.id : b.id - a.id
    })

    console.log("result filter: ", result);

    return result;
  }

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Smith', date: 'Today, 10:30 AM', amount: '$245.99', status: 'Completed' },
    { id: '#ORD-002', customer: 'Sarah Johnson', date: 'Today, 09:15 AM', amount: '$89.50', status: 'Processing' },
    { id: '#ORD-003', customer: 'Mike Brown', date: 'Yesterday, 3:45 PM', amount: '$156.75', status: 'Completed' },
    { id: '#ORD-004', customer: 'Emma Wilson', date: 'Yesterday, 11:20 AM', amount: '$299.99', status: 'Pending' },
  ];

  // id, name, slug, status
  //
  const headTag = [
    {key:'id', label:'ID', render: (item) => (
      <td class="whitespace-nowrap text-sm font-medium text-blue-600">
        {item.id}
      </td>
    )},
    {key:'label', label:'Label'},
    {key:'description', label:'Deskripsi'},
    {key:'action', label:'Action', render: (item)=>(
      <div class="flex gap-2 text-md">
        <Tooltip text='Edit Tag' position='bottom'>
          {/* <A href={`update/${item.slug}`}>*/}
            <FaRegularEdit class="text-blue-700 cursor-pointer" onClick={() => openModal('update', item)} />
          {/* </A>*/}
        </Tooltip>

        <Tooltip text='Delete Tag' position='bottom'>
          <RiSystemDeleteBinLine class="text-red-700 cursor-pointer" onClick={() => openModal('delete', item)}/>
        </Tooltip>
      </div>
    )}
  ]

  return (<>
    <div class="mb-8 rounded-2xl p-6 text-gray-700 shadow-sm border border-gray-200  bg-white">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-xl font-semibold">Tag Artikel</h1>
          <p class="text-sm text-gray-600">
            Kelola dan susun tag untuk memudahkan pengelompokan serta pencarian artikel produk
          </p>
        </div>
        <div>
          <button onClick={() => openModal('create') } class="hover:cursor-pointer flex items-center gap-2 rounded-lg bg-white px-4 py-1 border border-slate-950 text-xs font-semibold text-gray-700 hover:bg-gray-300 transition">
            <FaSolidAdd class="h-4 w-4" />
            Buat Tag
          </button>
        </div>
      </div>

      <div class='flex flex-row gap-4 mt-8 justify-between'>
        <div>
          <div class='relative'>
            <input
              type="text"
              value={search()}
              onInput={(e) => setSearch(e.currentTarget.value)}
              placeholder='Cari tag ...'
              class='w-60 rounded-lg bg-white/90 border px-4 py-1 text-sm  text-gray-800  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white' />
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
        <h3 class="text-lg font-semibold text-gray-800">Tag</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <For each={headTag}>
              {(head) => (
                <th class='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  {head.label}
                </th>
              )}
            </For>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <For each={filterBySearch(tag() || [])}>
              {(item) => (
                <tr class="hover:bg-gray-50 transition-colors">
                  <For each={headTag}>
                    {(head) => (
                      <td class='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
                        {head.render ? head.render(item) : item[head.key]}
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>

    <Show when={modals().open && modals().type === 'create'}>
      <CreateTag item={modals().item} onClose={closeModal} onSuccess={refetch} />
    </Show>

    <Show when={modals().open && modals().type === "delete"}>
      <Delete
        isOpen={true}
        onClose={closeModal}
        title="Tag"
        itemName={modals().item?.label}
        onDelete={() => TagService.delete({ tag: modals().item?.id })}
        onSuccess={refetch}
      />
    </Show>

    <Show when={modals().open && modals().type === "update"}>
      <UpdateTag
        isOpen={true}
        onClose={closeModal}
        title="Tag"
        itemName={modals().item}
        onSuccess={refetch}
      />
    </Show>
  </>)
}

export default Tag;


/* untuk pencariannya gimana bjirr */

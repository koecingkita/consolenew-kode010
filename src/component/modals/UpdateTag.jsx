import { createSignal } from 'solid-js';
import { TagService } from '../services/tag.service.js';
const UPDATE = TagService.update;

function UpdateTag(props) {
  const handleClose = () => {
    props.onClose();
  }

  const [title, setTitle] = createSignal(props.itemName.label);
  const [desc, setDesc] = createSignal(props.itemName.description);

  const handleChange = (setter) => {
      return (e) => {
        setter(e.target.value)
      }
  }

  const handleCreate = async () => {
    try {
      const payload = {
        tag: props.itemName.id,
        label: title(),
        desc: desc()
      }

      console.log("payload: ", payload);
      const result = await UPDATE(payload);

      setTitle('');
      setDesc('');
      console.log('result: ', result);

      await props.onSuccess?.();
      handleClose();
    } catch (e) {
      console.log("Gagal update tag:", e)
    }
  }

  return (<div class='fixed inset-0 z-50 overflow-y-auto'>
    <div class='fixed inset-0 bg-black/30 transition-opacity' onClick={handleClose}></div>

    <div class='flex min-h-full items-center justify-center p-4'>
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div class="px-4 pt-5 sm:p-6 sm:pb-4">
            <label class='font-semibold text-gray-900/80 uppercase'>Tambah Tag Artikel</label>
            <p class='mt-4 text-gray-800/70 text-sm'>
              Tag digunakan sebagai penanda tambahan untuk mengelompokkan artikel produk berdasarkan topik atau karakteristik tertentu
            </p>
        </div>

        <div class="sm:px-6 sm:pb-6 flex flex-col gap-4">
            <div class='flex flex-col gap-1 '>
              <label class='text-sm'>Title</label>
              <input type='text' value={title()}  onInput={handleChange(setTitle)} placeholder='Pulsa Murah ...' class='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"'/>
            </div>
            <div class='flex flex-col gap-1'>
              <label class='text-sm'>Deskripsi</label>
            <textarea rows='6' type='text' value={desc()} onInput={handleChange(setDesc)} placeholder='Deskripsi kategori ...' class='resize-none text-sm block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"'/>
            </div>
        </div>

        <div class='bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex gap-1.5'>
          <button type='button'
            onClick={handleCreate}
            class='hover:cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-inset ring-blue-700 hover:bg-blue-700 sm:mt-0 sm:w-auto'
          >Update</button>
          <button type='button'
            onClick={handleClose}
            class='hover:cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
          >Batal</button>
        </div>
      </div>
    </div>
  </div>)
}

export default UpdateTag;

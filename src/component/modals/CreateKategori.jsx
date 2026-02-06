import { createSignal } from 'solid-js';

function CreateKategori(props) {
  const handleClose = () => {
    props.onClose();
  }

  const [title, setTitle] = createSignal("");
  const [slug, setSlug] = createSignal("");
  const [desc, setDesc] = createSignal("");
  const [isSlugAuto, setIsSlugAuto] = createSignal(true);

  const generateSlug = (text) => {
    return text
      .toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s+]/g,"-")
  }

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    if (isSlugAuto()) {
      setSlug(generateSlug(value));
    }
  }

  const handleSlugChange = (e) => {
    setSlug(e.target.value);
    setIsSlugAuto(false)
  }

  return (
  <div class='fixed inset-0 z-50 overflow-y-auto'>
    <div class='fixed inset-0 bg-black/30 transition-opacity' onClick={handleClose}></div>

    <div class='flex min-h-full items-center justify-center p-4'>
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" onClick={(e) => e.stopPropagation()} >
        <div class="px-4 pt-5 sm:p-6 sm:pb-4">
            <label class='font-semibold text-gray-900/80 uppercase'>Tambah Kategori Produk</label>
            <p class='mt-4 text-gray-800/70 text-sm'>
              Digunakan untuk mengelompokkan artikel produk agar lebih terstruktur dan mudah dikelola
            </p>
          </div>

        <div class="sm:px-6 sm:pb-6 flex flex-col gap-4">
            <div class='flex flex-col gap-1 '>
              <label class='text-sm'>Title</label>
              <input type='text' value={title()} onInput={handleTitleChange} placeholder='Pulsa Murah ...' class='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"'/>
            </div>
            <div class='flex flex-col gap-1'>
              <label class='text-sm'>Slug</label>
              <input disabled={true} type='text' value={slug()} onInput={handleSlugChange}  placeholder='pulsa-murah' class='block w-full rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"'/>
            </div>
            <div class='flex flex-col gap-1'>
              <label class='text-sm'>Deskripsi</label>
              <textarea rows='6' type='text' onInput={(e) => setDesc(e.target.value) } value={desc()} placeholder='Deskripsi kategori ...' class='resize-none text-sm block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"'/>
            </div>
        </div>


        <div class='bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 flex gap-1.5'>
          <button type='button'
            onClick={handleClose}
            class='hover:cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-inset ring-blue-700 hover:bg-blue-700 sm:mt-0 sm:w-auto'
          >Tambah</button>
          <button type='button'
            onClick={handleClose}
            class='hover:cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
          >Batal</button>
        </div>
      </div>
    </div>

  </div>);
}

export default CreateKategori;

/*
mau bikin kondisi dimana ketika inputan judul di masukkan, maka otomatis inputan slug masuk, tapi ketika melakukan editan di inputan slug maka fungsi otomatisnya ga bekerja lagi
*/

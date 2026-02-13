import Container from "./theme/ui/ContainerContent";
import TextRich from "./TextRich";
import TagInput from "./TagInput";
import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, Show } from "solid-js";

const jenisArtikel = [
  { id: 1, label:'Artikel'},
  { id: 2, label:'Produk'},
  { id: 3, label:'Panduan'}
]

function CreateArtikel(props) {
  const initialMeta = [
    { label:'judulArtikel', value: ''},
    { label:'image', value: ''},
    { label:'imageAlt', value: ''},
    { label:'metaTitle', value: 'metatitle'},
    { label:'metaSlug', value: ''},
    { label:'metaDeskripsi', value: ''},
    { label:'metaKeyword', value: ''},
    { label:'metaTag', value: ''},
  ]
  const initialBody = { label:'content', value:''}
  const initialArtikel = { meta:initialMeta, content:initialBody };

  const location = useLocation();
  const [artikel, setArtikel] = createSignal(initialArtikel);

  const [content, setContent] = createSignal(initialBody);
  const [meta, setMeta] = createSignal(initialMeta);
  const [contentBlocks, setContentBlock] = createSignal([]);
  const [editorData, setEditorData] = createSignal(null);

  const [contentJSON, setContentJSON] = createSignal(null);
  const [contentHTML, setContentHTML] = createSignal("");


/*

  const [data, setData] = createSignal({ type:null, status:false});
  const handleData = () => {
    setData({...data(), type:'open', status: true});
  }

  const dataSatu = [
    { label:'firstName', value:'pertama' },
    { label:'lastName', value:'kedua' },
  ]
  const dataDua = {
    label:'content', value:'isi'
  }
  const bentukData = { dataSatu, dataDua }
  const handleSubmitData = () => {
    const tmpData = { ...bentukData, dataDua:{ ...dataDua, value:'dataaa'}, dataSatu: dataSatu.map(item => item.label === 'firstName' ? { ...item, value: dataBaru'} : item) }; // kalo mau set value firstName gimana
    const tmpData = { ...bentukData, dataDua:{ ...dataDua, value:'dataaa'}, dataSatu: dataSatu.map(item => item.label === 'firstName' ? { ...item, value: dataBaru'} : item) }; // kalo mau set value firstName gimana

    return tmpData
  }

*/



  createEffect(() => {
    console.log("query:", location.pathname);
  })


  const handleSave = () => {
    console.log("SAVE");
    const tmpData = { ...initialArtikel, initialBody: { ...initialBody, value: contentJSON()} }

    console.log('temporary Data: ', tmpData);
    return;
  }

  const handlePublish = () => {
    console.log("PUBLISH");
    const tmpData = { ...initialArtikel, initialBody: { ...initialBody, value: [contentJSON(), contentHTML()] } }

    console.log('temporary Data: ', tmpData);
    return;
  }


  const handleInput = (blocks) => {
    setContentBlock(blocks)
  }

  return (<Container>

    <div class='flex flex-col rounded-xl w-full max-w-6xl mx-auto '>
      <div class="flex flex-col gap-6 mx-6 mb-5">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Jenis Artikel</label>
          <select value={artikel()} onChange={(e) => setArtikel(e.target.value)} id="artikeljenis" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
            <option selected disabled>Pilih jenis artikel</option>
            <For each={jenisArtikel}>
              {(item) => (
                    <option value={item.id}>{item.label}</option>
              )}
            </For>
          </select>
        </div>
      </div>

      <Show when={artikel() === '2'}>
        <div class="flex flex-col gap-6 mx-6 mb-5">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Kategori Produk</label>
            <select id="artikeljenis" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
              <option selected disabled>Pilih jenis artikel</option>
              <option value="pulsa" >Pulsa</option>
              <option value="paket internet" >Paket Internet</option>
              <option value="ppob" >PPOB</option>
              <option value="e wallet" >E Wallet</option>
            </select>
          </div>
        </div>
      </Show>

      <div class="flex flex-col gap-6 mx-6 mb-5">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Judul Artikel</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up pulsa murah' />
          <p class="mt-1 text-xs text-gray-500">Judul akan tampil sebagai headline utama</p>
        </div>
      </div>

      <div class="flex flex-col gap-6 mx-6 mb-5">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">

          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Image</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='https://domain.com/images.webp'/>

          <label class="block mb-2.5 mt-5 text-sm font-medium text-heading" for="file_input">Keterangan image</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Gambar adaku - Top up pulsa murah'/>

        </div>
      </div>
    </div>

    {/* <TextRich oninput={handleInput} />*/}
    <TextRich
      initialJSON={contentJSON()}
      onChange={(json, html) => {
        // simpan json ke state/DB
        console.log("DOC JSON:", json);
        setContentJSON(json);
        setContentHTML(html);
      }}
    />


{/*
    <pre class="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-[220px]">
      {contentHTML()}
    </pre>
    <pre>{JSON.stringify(contentJSON(), null, 2)}</pre>
*/}


    <div class='flex flex-col mt-8 rounded-xl w-full max-w-6xl mx-auto'>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-5 bg-white rounded-xl shadow-sm p-6 border-gray-200">
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Title</label>
          <input value={artikel().meta[4].value} type='text' oninput={(e) => setArtikel({ ...artikel, meta: meta.map(item => item.label === 'metaTitle' ? { ...item, value: e.target.value } : item ) })} class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up pulsa murah'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Slug</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: top-up-pulsa-murah'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Deskripsi</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Adaku adalah aplikasi digital yang menjual produk-produk PPOB ...'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Keyword</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up Pulsa, Pulsa Murah, Pulsa Bebas Denom ...'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Tag</label>
          <TagInput />
          {/*
            <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>
          */}
        </div>
      </div>
    </div>

    <div class='w-full max-w-6xl mx-auto mb-20 p-6'>
      <div class='flex gap-2 justify-end'>
        <div class='flex gap-2 bg-white p-4 rounded-xl shadow-sm'>
          <button type="button" class="text-red-600 border border-red-500 shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-1 focus:outline-none hover:cursor-pointer hover:bg-gray-50 hover:text-red-400">Cancel</button>
          <button type="button" onClick={handleSave} class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 focus:outline-none hover:cursor-pointer">Save</button>
          <button type="button" onClick={handlePublish} class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 focus:outline-none hover:cursor-pointer">Publish Artikel</button>
        </div>
      </div>
    </div>
  </Container>);
}

export default CreateArtikel;

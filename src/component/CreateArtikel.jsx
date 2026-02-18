import Container from "./theme/ui/ContainerContent";
import TextRich from "./TextRich";
import TagInput from "./TagInput";
import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, Show, createResource } from "solid-js";
import { ArtikelService } from "./services/artikel.service.js";
import { KategoriService } from "./services/kategori.service.js";
import { useAuth } from "./context/AuthContext";

const CREATE_ARTIKEL = ArtikelService.create;
const GET_KATEGORI = KategoriService.get;

const jenisArtikel = [
  { id: 1, label: 'Artikel' },
  { id: 2, label: 'Produk' },
  { id: 3, label: 'Panduan' }
];

function CreateArtikel(props) {
  const { author } = useAuth();
  const initialMeta = [
    { label: 'contentJudul', value: '' },
    { label: 'contentImage', value: '' },
    { label: 'contentImageAlt', value: '' },
    { label: 'metaTitle', value: '' },
    { label: 'metaSlug', value: '' },
    { label: 'metaDescription', value: '' },
    { label: 'metaKeyword', value: '' },
    { label: 'metaTag', value: 'ssss' },
  ];

  const initialBody = { label: 'content', value: '' };
  const initialArtikel = { meta: initialMeta, content: initialBody };

  // State untuk form
  const [artikel, setArtikel] = createSignal(initialArtikel);
  const [jenisArtikelId, setJenisArtikelId] = createSignal(''); // STATE TERPISAH UNTUK SELECT
  const [jenisArtikelProduk, setJenisArtikelProduk] = createSignal(''); // STATE TERPISAH UNTUK SELECT
  const [contentJSON, setContentJSON] = createSignal(null);
  const [contentHTML, setContentHTML] = createSignal("");

  // Resource untuk kategori
  const [kategori] = createResource(async () => {
    const result = await GET_KATEGORI();
    return result;
  });

  const kategoriList = () => kategori()?.data?.data ?? [];

  const location = useLocation();

  createEffect(() => {
    console.log("query:", location.pathname);
    console.log("Kategori loading:", kategori.loading);
    console.log("Kategori data:", kategori());
    console.log("Kategori latest:", kategori.latest);
  });

  const handleSave = () => {
    console.log("SAVE");

    const tmpData = {
      ...artikel(),
      content: { ...artikel().initialBody, value: contentJSON() }
    };

    const metaArray = Array.isArray(tmpData.meta) ? tmpData.meta : [];

    const dataObject = {
      ...Object.fromEntries(
        metaArray.map(item => [item.label, item.value])
      ),
      content: tmpData.content?.value,
      kategori: jenisArtikelId(),
      author
    };

    const gass = CREATE_ARTIKEL(dataObject);
    return;
  };

  const handlePublish = () => {
    console.log("PUBLISH");
    const tmpData = {
      ...initialArtikel,
      initialBody: { ...initialBody, value: [contentJSON(), contentHTML()] }
    };
    console.log('temporary Data: ', tmpData);
    return;
  };

  const updateMetaByLabel = (label, value) => {
    setArtikel({
      ...artikel(),
      meta: artikel().meta.map(item =>
        item.label === label ? { ...item, value } : item
      )
    });
  };

  const getMetaValue = (label) => {
    const item = artikel().meta.find(m => m.label === label);
    return item ? item.value : '';
  };

  return (
    <Container>
      <div class='flex flex-col rounded-xl w-full max-w-6xl mx-auto '>
        {/* Jenis Artikel Select */}
        <div class="flex flex-col gap-6 mx-6 mb-5">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Jenis Artikel
            </label>

            {/* Select untuk jenis artikel (statis) */}
            <select
              value={jenisArtikelId()}
              onChange={(e) => setJenisArtikelId(e.target.value)}
              id="artikeljenis"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="" disabled selected>Pilih jenis artikel</option>
              <For each={jenisArtikel}>
                {(item) => (
                  <option value={item.id}>{item.label}</option>
                )}
              </For>
            </select>
          </div>
        </div>

        {/* Kategori Produk - Muncul jika jenis artikel = Produk (id: 2) */}
        <Show when={jenisArtikelId() === '2'}>
          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
                Kategori Produk
              </label>

              {/* Select untuk kategori produk (dari API) */}
              <Show
                when={!kategori.loading}
                fallback={
                  <select disabled class="block w-full rounded-md bg-gray-100 px-3 py-1.5">
                    <option>Loading kategori produk...</option>
                  </select>
                }
              >
                <Show
                  when={!kategori.error}
                  fallback={
                    <select disabled class="block w-full rounded-md bg-red-50 px-3 py-1.5">
                      <option>Error loading kategori</option>
                    </select>
                  }
                >

                  <select
                    id="kategoriProduk"
                    setJenisArtikelProduk
                    value={jenisArtikelProduk()}
                    onChange={(e) => setJenisArtikelProduk(e.target.value)}
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="" disabled selected>Pilih kategori produk</option>
                    <For each={kategoriList()}>
                      {(item) => (
                        <option value={item.id}>{item.label}</option>
                      )}
                    </For>
                  </select>
                </Show>
              </Show>
            </div>
          </div>
        </Show>

        {/* Judul Artikel */}
        <div class="flex flex-col gap-6 mx-6 mb-5">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Judul Artikel
            </label>
            <input
              value={getMetaValue('contentJudul')}
              oninput={(e) => updateMetaByLabel('contentJudul', e.target.value)}
              type='text'
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Contoh: Top up pulsa murah'
            />
            <p class="mt-1 text-xs text-gray-500">Judul akan tampil sebagai headline utama</p>
          </div>
        </div>

        {/* Image Inputs */}
        <div class="flex flex-col gap-6 mx-6 mb-5">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Image URL
            </label>
            <input
              type='text'
              value={getMetaValue('contentImage')}
              oninput={(e) => updateMetaByLabel('contentImage', e.target.value)}
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='https://domain.com/images.webp'
            />

            <label class="block mb-2.5 mt-5 text-sm font-medium text-heading" for="file_input">
              Alt Text
            </label>
            <input
              type='text'
              value={getMetaValue('contentImageAlt')}
              oninput={(e) => updateMetaByLabel('contentImageAlt', e.target.value)}
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Gambar adaku - Top up pulsa murah'
            />
          </div>
        </div>
      </div>

      {/* TextRich Editor */}
      <TextRich
        initialJSON={contentJSON()}
        onChange={(json, html) => {
          console.log("DOC JSON:", json);
          setContentJSON(json);
          setContentHTML(html);
        }}
      />

      {/* Meta Fields */}
      <div class='flex flex-col mt-8 rounded-xl w-full max-w-6xl mx-auto'>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-5 bg-white rounded-xl shadow-sm p-6 border-gray-200">
          <div class="">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Meta Title
            </label>
            <input
              value={getMetaValue('metaTitle')}
              type='text'
              oninput={(e) => updateMetaByLabel('metaTitle', e.target.value)}
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Contoh: Top up pulsa murah'
            />
          </div>
          <div class="">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Meta Slug
            </label>
            <input
              value={getMetaValue('metaSlug')}
              oninput={(e) => updateMetaByLabel('metaSlug', e.target.value)}
              type='text'
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Contoh: top-up-pulsa-murah'
            />
          </div>
          <div class="">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Meta Deskripsi
            </label>
            <input
              value={getMetaValue('metaDescription')}
              oninput={(e) => updateMetaByLabel('metaDescription', e.target.value)}
              type='text'
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Contoh: Adaku adalah aplikasi digital yang menjual produk-produk PPOB ...'
            />
          </div>
          <div class="">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Meta Keyword
            </label>
            <input
              value={getMetaValue('metaKeyword')}
              oninput={(e) => updateMetaByLabel('metaKeyword', e.target.value)}
              type='text'
              class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
              placeholder='Contoh: Top up Pulsa, Pulsa Murah, Pulsa Bebas Denom ...'
            />
          </div>
          <div class="">
            <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">
              Meta Tag
            </label>
            <TagInput />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div class='w-full max-w-6xl mx-auto mb-20 p-6'>
        <div class='flex gap-2 justify-end'>
          <div class='flex gap-2 bg-white p-4 rounded-xl shadow-sm'>
            <button type="button" class="text-red-600 border border-red-500 shadow-xs font-medium leading-5 rounded-md text-sm px-4 py-1 focus:outline-none hover:cursor-pointer hover:bg-gray-50 hover:text-red-400">
              Cancel
            </button>
            <button type="button" onClick={handleSave} class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 focus:outline-none hover:cursor-pointer">
              Save
            </button>
            <button type="button" onClick={handlePublish} class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-md text-sm px-4 focus:outline-none hover:cursor-pointer">
              Publish Artikel
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CreateArtikel;

import Container from "./theme/ui/ContainerContent";
import TextRich from "./TextRich";
import TagInput from "./TagInput";
import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, Show, createResource, Suspense } from "solid-js";
import { ArtikelService } from "./services/artikel.service";

const jenisArtikel = [
  { id: 1, label:'Artikel'},
  { id: 2, label:'Produk'},
  { id: 3, label:'Panduan'}
]

const CEKARTIKEL = ArtikelService.getDataUpdate;

function UpdateArtikel(props) {
  const location = useLocation();
  const [artikel, setArtikel] = createSignal(0);
  const uuidArtikel = location.pathname.split("/").pop();

  const [cekArtikel] = createResource(
    () => uuidArtikel,
    async (uuid) => {
      console.log("Fetching artikel with UUID:", uuid);

      try {
        const response = await CEKARTIKEL(uuid);
        console.log("Response lengkap:", response);

        const result = response.data;

        // Cek struktur response
        if (!result || !result.success) {
          throw new Error(result?.message || "Artikel tidak ditemukan");
        }

        // Yang penting: response.data adalah object artikel
        console.log("Data artikel:", result.data);
        return result.data; // Langsung return data artikelnya
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
    }
  );

  createEffect(() => {
    console.log("=== DEBUG ===");
    console.log("Resource state:", cekArtikel.state);
    console.log("Resource data:", cekArtikel());
    console.log("Raw response:", JSON.stringify(response)); // <-- ini


    // Set jenis artikel setelah data loaded
    if (cekArtikel.state === 'ready' && cekArtikel()) {
      console.log("Setting artikel ID:", cekArtikel().jenis_artikel_id);
      setArtikel(cekArtikel().jenis_artikel_id || 0);
    }
  });

  return (
    <Container>
      {/* Loading state */}
      <Show when={cekArtikel.state === 'pending'}>
        <div class="text-center p-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p class="mt-2 text-gray-600">Memuat data artikel...</p>
        </div>
      </Show>

      {/* Error state */}
      <Show when={cekArtikel.state === "errored"}>
        <div class="mx-6 my-10 flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-600">
            📄
          </div>

          <h2 class="text-lg font-semibold text-gray-700">
            Artikel tidak ditemukan
          </h2>

          <p class="text-sm text-gray-500">
            Artikel yang kamu cari tidak tersedia atau sudah dihapus.
          </p>

          <button
            onClick={() => window.history.back()}
            class="mt-3 rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
          >
            Kembali
          </button>
        </div>
      </Show>

      {/* Success state */}
      <Show when={cekArtikel.state === 'ready' && cekArtikel()}>
        <div class='flex flex-col rounded-xl w-full max-w-6xl mx-auto'>
          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Jenis Artikel</label>
              <select
                value={artikel()}
                onChange={(e) => setArtikel(parseInt(e.target.value))}
                id="artikeljenis"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option disabled>Pilih jenis artikel</option>
                <For each={jenisArtikel}>
                  {(item) => (
                    <option
                      value={item.id}
                      selected={artikel() === item.id}
                    >
                      {item.label}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          <Show when={artikel() === 2}>
            <div class="flex flex-col gap-6 mx-6 mb-5">
              <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Kategori Produk</label>
                <select
                  id="kategori_produk"
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option disabled selected>Pilih kategori produk</option>
                  <option value="pulsa">Pulsa</option>
                  <option value="paket internet">Paket Internet</option>
                  <option value="ppob">PPOB</option>
                  <option value="e wallet">E Wallet</option>
                </select>
              </div>
            </div>
          </Show>

          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-heading" for="judul">Judul Artikel</label>
              <input
                type='text'
                id="judul"
                value={cekArtikel()?.judul || ''}
                class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                placeholder='Contoh: Top up pulsa murah'
              />
              <p class="mt-1 text-xs text-gray-500">Judul akan tampil sebagai headline utama</p>
            </div>
          </div>

          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-heading" for="image">Image</label>
              <input
                type='text'
                id="image"
                value={cekArtikel()?.gambar || ''}
                class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                placeholder='https://domain.com/images.webp'
              />

              <label class="block mb-2.5 mt-5 text-sm font-medium text-heading" for="keterangan_image">Keterangan image</label>
              <input
                type='text'
                id="keterangan_image"
                value={cekArtikel()?.keterangan_gambar || ''}
                class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                placeholder='Gambar adaku - Top up pulsa murah'
              />
            </div>
          </div>

          <TextRich />

          <div class='flex flex-col mt-8 rounded-xl w-full max-w-6xl mx-auto'>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-5 bg-white rounded-xl shadow-sm p-6 border-gray-200">
              <div>
                <label class="block mb-2.5 text-sm font-medium text-heading" for="meta_title">Meta Title</label>
                <input
                  type='text'
                  id="meta_title"
                  value={cekArtikel()?.meta_title || ''}
                  class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  placeholder='Contoh: Top up pulsa murah'
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-heading" for="meta_slug">Meta Slug</label>
                <input
                  type='text'
                  id="meta_slug"
                  value={cekArtikel()?.slug || ''}
                  class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  placeholder='Contoh: top-up-pulsa-murah'
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-heading" for="meta_description">Meta Deskripsi</label>
                <input
                  type='text'
                  id="meta_description"
                  value={cekArtikel()?.meta_description || ''}
                  class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  placeholder='Contoh: Adaku adalah aplikasi digital ...'
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-heading" for="meta_keyword">Meta Keyword</label>
                <input
                  type='text'
                  id="meta_keyword"
                  value={cekArtikel()?.meta_keyword || ''}
                  class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  placeholder='Contoh: Top up Pulsa, Pulsa Murah'
                />
              </div>
              <div class="lg:col-span-2">
                <label class="block mb-2.5 text-sm font-medium text-heading" for="meta_tag">Meta Tag</label>
                <TagInput initialTags={cekArtikel()?.tags || []} />
              </div>
            </div>
          </div>

          <div class='w-full max-w-6xl mx-auto mb-20 p-6'>
            <div class='flex gap-2 justify-end'>
              <div class='flex gap-2 bg-white p-4 rounded-xl shadow-sm'>
                <button type="button" class="text-red-600 border border-red-500 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer hover:bg-gray-50 hover:text-red-400">Cancel</button>
                <button type="button" class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer">Update Artikel</button>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </Container>
  );
}

export default UpdateArtikel;

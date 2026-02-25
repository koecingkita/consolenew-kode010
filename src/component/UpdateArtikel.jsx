import Container from "./theme/ui/ContainerContent";
import TextRich from "./TextRich";
import TagInput from "./TagInput";
import { useLocation } from "@solidjs/router";
import { createEffect, createSignal, For, Show, createResource } from "solid-js";
import { ArtikelService } from "./services/artikel.service";

const jenisArtikel = [
  { id: 1, label: "Artikel" },
  { id: 2, label: "Produk" },
  { id: 3, label: "Panduan" },
];

function UpdateArtikel(props) {
  const location = useLocation();
  const uuidArtikel = location.pathname.split("/").pop();

  // Form signals
  const [artikel, setArtikel] = createSignal(0);
  const [judul, setJudul] = createSignal("");
  const [gambar, setGambar] = createSignal("");
  const [keteranganGambar, setKeteranganGambar] = createSignal("");
  const [metaTitle, setMetaTitle] = createSignal("");
  const [metaSlug, setMetaSlug] = createSignal("");
  const [metaDescription, setMetaDescription] = createSignal("");
  const [metaKeyword, setMetaKeyword] = createSignal("");
  const [kontenJSON, setKontenJSON] = createSignal(null); // null = belum siap
  const [kontenHTML, setKontenHTML] = createSignal("");
  const [editorApi, setEditorApi] = createSignal(null);

  // Fetch data
  const [cekArtikel] = createResource(
    () => uuidArtikel,
    async (uuid) => {
      try {
        const response = await ArtikelService.getDataUpdate(uuid);
        const result = response.data;
        if (!result || !result.success) {
          throw new Error(result?.message || "Artikel tidak ditemukan");
        }
        return result.data;
      } catch (error) {
        console.error("Error fetching artikel:", error);
        throw error;
      }
    }
  );

  // ✅ Populate semua field setelah data ready
  // kontenJSON di-set TERAKHIR supaya TextRich baru mount setelah data siap
  createEffect(() => {
    if (cekArtikel.state === "ready" && cekArtikel()) {
      const data = cekArtikel();

      setArtikel(data.jenis_artikel_id || 0);
      setJudul(data.judul || "");
      setGambar(data.gambar || "");
      setKeteranganGambar(data.keterangan_gambar || "");
      setMetaTitle(data.meta_title || "");
      setMetaSlug(data.slug || "");
      setMetaDescription(data.meta_description || "");
      setMetaKeyword(data.meta_keyword || "");

      // Parse konten — set ini terakhir karena trigger render TextRich
      if (data.konten) {
        try {
          const parsed =
            typeof data.konten === "string"
              ? JSON.parse(data.konten)
              : data.konten;
          setKontenJSON(parsed);
        } catch {
          // Kalau gagal parse, set empty doc
          setKontenJSON({ type: "doc", content: [{ type: "paragraph" }] });
        }
      } else {
        // Tidak ada konten, set empty doc supaya editor tetap muncul
        setKontenJSON({ type: "doc", content: [{ type: "paragraph" }] });
      }
    }
  });

  const handleUpdate = () => {
    const payload = {
      jenis_artikel_id: artikel(),
      judul: judul(),
      gambar: gambar(),
      keterangan_gambar: keteranganGambar(),
      meta_title: metaTitle(),
      slug: metaSlug(),
      meta_description: metaDescription(),
      meta_keyword: metaKeyword(),
      konten: kontenJSON(),
      konten_html: kontenHTML(),
    };
    console.log("Payload update:", payload);
    // TODO: ArtikelService.update(uuidArtikel, payload)
  };

  return (
    <Container>
      {/* Loading */}
      <Show when={cekArtikel.state === "pending"}>
        <div class="text-center p-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
          <p class="mt-2 text-gray-600">Memuat data artikel...</p>
        </div>
      </Show>

      {/* Error */}
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

      {/* Success */}
      <Show when={cekArtikel.state === "ready" && cekArtikel()}>
        <div class="flex flex-col rounded-xl w-full max-w-6xl mx-auto">

          {/* Jenis Artikel */}
          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-gray-700" for="artikeljenis">
                Jenis Artikel
              </label>
              <select
                id="artikeljenis"
                value={artikel()}
                onChange={(e) => setArtikel(parseInt(e.target.value))}
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option disabled value={0}>Pilih jenis artikel</option>
                <For each={jenisArtikel}>
                  {(item) => (
                    <option value={item.id} selected={artikel() === item.id}>
                      {item.label}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          {/* Kategori Produk */}
          <Show when={artikel() === 2}>
            <div class="flex flex-col gap-6 mx-6 mb-5">
              <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="kategori_produk">
                  Kategori Produk
                </label>
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

          {/* Judul */}
          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-gray-700" for="judul">
                Judul Artikel
              </label>
              <input
                type="text"
                id="judul"
                value={judul()}
                onInput={(e) => setJudul(e.target.value)}
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Contoh: Top up pulsa murah"
              />
              <p class="mt-1 text-xs text-gray-500">Judul akan tampil sebagai headline utama</p>
            </div>
          </div>

          {/* Image */}
          <div class="flex flex-col gap-6 mx-6 mb-5">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <label class="block mb-2.5 text-sm font-medium text-gray-700" for="image">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                value={gambar()}
                onInput={(e) => setGambar(e.target.value)}
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="https://domain.com/images.webp"
              />
              <label class="block mb-2.5 mt-5 text-sm font-medium text-gray-700" for="keterangan_image">
                Keterangan Image
              </label>
              <input
                type="text"
                id="keterangan_image"
                value={keteranganGambar()}
                onInput={(e) => setKeteranganGambar(e.target.value)}
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Gambar adaku - Top up pulsa murah"
              />
            </div>
          </div>

          {/* ✅ FIX UTAMA:
              - kontenJSON() === null  → tampilkan skeleton loading
              - kontenJSON() !== null  → mount TextRich dengan data yang sudah siap
              Dengan begitu onMount di TextRich selalu jalan SETELAH initialJSON ada isinya
          */}
          <Show
            when={kontenJSON() !== null}
            fallback={
              <div class="flex flex-col gap-6 mx-6 mb-5">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div class="px-6 pt-5 pb-3 border-b border-gray-100">
                    <label class="block text-sm font-medium text-gray-700">Konten Artikel</label>
                  </div>
                  <div class="min-h-[400px] flex items-center justify-center text-gray-400 text-sm">
                    <div class="flex flex-col items-center gap-2">
                      <div class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-gray-200 border-t-blue-500" />
                      <span>Memuat editor...</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <TextRich
              initialJSON={kontenJSON()}
              onChange={(json, html) => {
                setKontenJSON(json);
                setKontenHTML(html);
              }}
              setApi={setEditorApi}
            />
          </Show>

          {/* Meta SEO */}
          <div class="flex flex-col mt-8 rounded-xl w-full max-w-6xl mx-auto">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-5 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div>
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="meta_title">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  value={metaTitle()}
                  onInput={(e) => setMetaTitle(e.target.value)}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Contoh: Top up pulsa murah"
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="meta_slug">
                  Meta Slug
                </label>
                <input
                  type="text"
                  id="meta_slug"
                  value={metaSlug()}
                  onInput={(e) => setMetaSlug(e.target.value)}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Contoh: top-up-pulsa-murah"
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="meta_description">
                  Meta Deskripsi
                </label>
                <input
                  type="text"
                  id="meta_description"
                  value={metaDescription()}
                  onInput={(e) => setMetaDescription(e.target.value)}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Contoh: Adaku adalah aplikasi digital ..."
                />
              </div>
              <div>
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="meta_keyword">
                  Meta Keyword
                </label>
                <input
                  type="text"
                  id="meta_keyword"
                  value={metaKeyword()}
                  onInput={(e) => setMetaKeyword(e.target.value)}
                  class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  placeholder="Contoh: Top up Pulsa, Pulsa Murah"
                />
              </div>
              <div class="lg:col-span-2">
                <label class="block mb-2.5 text-sm font-medium text-gray-700" for="meta_tag">
                  Meta Tag
                </label>
                <TagInput initialTags={cekArtikel()?.tags || []} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div class="w-full max-w-6xl mx-auto mb-20 p-6">
            <div class="flex gap-2 justify-end">
              <div class="flex gap-2 bg-white p-4 rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  class="text-red-600 border border-red-500 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer hover:bg-gray-50 hover:text-red-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdate}
                  class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer"
                >
                  Update Artikel
                </button>
              </div>
            </div>
          </div>

        </div>
      </Show>
    </Container>
  );
}

export default UpdateArtikel;

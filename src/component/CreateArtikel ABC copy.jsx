import { createSignal } from "solid-js";
import TiptapSolidEditor from "./TextRich";

export default function CreateArtikel() {
  const [title, setTitle] = createSignal("");
  const [contentJSON, setContentJSON] = createSignal(null);
  const [contentHTML, setContentHTML] = createSignal("");

  const [imageUrl, setImageUrl] = createSignal("");
  const [imageAlign, setImageAlign] = createSignal("center"); // left|center|right
  const [imageSize, setImageSize] = createSignal(100); // 25|50|75|100

  let editorApi = null;

  const insertImage = () => {
    const url = imageUrl().trim();
    if (!url) return alert("Masukkan URL gambar dulu.");

    editorApi?.insertImage?.(url, imageAlign(), imageSize());
    setImageUrl("");
  };

  const save = async () => {
    const payload = {
      title: title(),
      content_json: contentJSON(),
      content_html: contentHTML(),
    };

    console.log("PAYLOAD SAVE:", payload);
    alert("Cek console: payload siap disimpan.");
  };

  return (
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-semibold">Create Artikel</h1>
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          onClick={save}
        >
          Simpan
        </button>
      </div>

      <div class="grid grid-cols-1 gap-4">
        {/* Judul */}
        <div class="bg-white border rounded-xl p-4">
          <label class="block text-sm font-medium mb-2">Judul</label>
          <input
            class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)}
            placeholder="Judul artikel..."
          />
        </div>

        {/* Toolbar Insert Image URL */}
        <div class="bg-white border rounded-xl p-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium mb-2">Image URL</label>
              <input
                class="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black/10"
                value={imageUrl()}
                onInput={(e) => setImageUrl(e.currentTarget.value)}
                placeholder="https://....jpg / .png / .webp"
              />
              <div class="text-[11px] text-gray-500 mt-1">
                Gambar akan jadi block sendiri + otomatis ada paragraf kosong setelahnya.
              </div>
            </div>

            <div class="w-full sm:w-36">
              <label class="block text-sm font-medium mb-2">Align</label>
              <select
                class="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-black/10"
                value={imageAlign()}
                onChange={(e) => setImageAlign(e.currentTarget.value)}
              >
                <option value="left">Kiri</option>
                <option value="center">Tengah</option>
                <option value="right">Kanan</option>
              </select>
            </div>

            <div class="w-full sm:w-28">
              <label class="block text-sm font-medium mb-2">Size</label>
              <select
                class="w-full border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-black/10"
                value={imageSize()}
                onChange={(e) => setImageSize(Number(e.currentTarget.value))}
              >
                <option value={25}>25%</option>
                <option value={50}>50%</option>
                <option value={75}>75%</option>
                <option value={100}>100%</option>
              </select>
            </div>

            <button
              type="button"
              class="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
              onClick={insertImage}
            >
              Insert Image
            </button>
          </div>
        </div>

        {/* Editor + Output */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Editor */}
          <div class="bg-white border rounded-xl p-4 lg:col-span-1">
            <TiptapSolidEditor
              initialJSON={contentJSON()}
              onChange={(json, html) => {
                setContentJSON(json);
                setContentHTML(html);
              }}
              setApi={(api) => (editorApi = api)}
            />
          </div>

          {/* JSON Output */}
          <div class="bg-white border rounded-xl p-4 lg:col-span-1">
            <div class="text-sm font-semibold mb-2">JSON Output</div>
            <pre class="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-[560px]">
              {JSON.stringify(contentJSON(), null, 2)}
            </pre>
          </div>

          {/* HTML Output + Preview */}
          <div class="bg-white border rounded-xl p-4 lg:col-span-1">
            <div class="text-sm font-semibold mb-2">HTML Output</div>

            <pre class="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-[220px]">
              {contentHTML()}
            </pre>

            <div class="mt-4">
              <div class="text-sm font-semibold mb-2">Preview</div>

              <div class="prose max-w-none" innerHTML={contentHTML()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

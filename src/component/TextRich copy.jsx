import { createSignal, onMount } from "solid-js";

function TextRich() {
  let editorRef;

  const exec = (command, value = null) => {
    editorRef.focus();
    document.execCommand(command, false, value);
  };

  const insertImage = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url) exec("insertImage", url);
  };

  const setHeading = (level) => {
    exec("formatBlock", `h${level}`);
  };

  const setFontSize = (size) => {
    exec("fontSize", size); // 1–7 (HTML legacy)
  };

  const setFontFamily = (font) => {
    exec("fontName", font);
  };

  const setTextColor = (color) => {
    exec("foreColor", color);
  };

  return (
    <div class="w-full border rounded-lg bg-white">
      {/* Toolbar */}
      <div class="flex flex-wrap gap-1 border-b p-2 bg-gray-50">
        {/* Headings */}
        {[1, 2, 3, 4, 5, 6].map((h) => (
          <button
            class="px-2 py-1 text-sm border rounded hover:bg-gray-200"
            onClick={() => setHeading(h)}
          >
            H{h}
          </button>
        ))}

        <button class="btn" onClick={() => exec("formatBlock", "p")}>
          P
        </button>

        {/* Align */}
        <button class="btn" onClick={() => exec("justifyLeft")}>⬅</button>
        <button class="btn" onClick={() => exec("justifyCenter")}>↔</button>
        <button class="btn" onClick={() => exec("justifyRight")}>➡</button>

        {/* List */}
        <button class="btn" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button class="btn" onClick={() => exec("insertOrderedList")}>1. List</button>

        {/* Quote */}
        <button class="btn" onClick={() => exec("formatBlock", "blockquote")}>
          ❝ Quote
        </button>

        {/* Image */}
        <button class="btn" onClick={insertImage}>
          🖼 Image
        </button>

        {/* Font Size */}
        <select
          class="border rounded px-1"
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="">Size</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        {/* Font Family */}
        <select
          class="border rounded px-1"
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="">Font</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
        </select>

        {/* Text Color */}
        <input
          type="color"
          onChange={(e) => setTextColor(e.target.value)}
          title="Text Color"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contenteditable
        class="min-h-[200px] p-4 focus:outline-none prose max-w-none"
        placeholder="Tulis sesuatu..."
      ></div>
    </div>
  );
}

export default TextRich;

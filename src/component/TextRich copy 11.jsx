import { onMount, onCleanup, createSignal, createEffect } from "solid-js";
import { Editor, Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import { FaRegularImage } from "solid-icons/fa";

/* ================= IMAGE BLOCK ================= */
const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      align: { default: "center" },
      size: { default: 100 },
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-image-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, align, size } = HTMLAttributes;
    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-image-block": "true",
        style: `text-align:${align};`,
      }),
      [
        "img",
        {
          src: src || "",
          alt: alt || "",
          style: `display:inline-block;width:${size}%;max-width:100%;height:auto;`,
        },
      ],
    ];
  },
});

/* ================= FONT SIZE ================= */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el) => el.style.fontSize?.replace("px", ""),
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}px` } : {},
      },
    };
  },
});

/* ================= LIST EXTENSIONS ================= */
const BulletListTW = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return ["ul", mergeAttributes(HTMLAttributes, { class: "list-disc pl-6" }), 0];
  },
});

const OrderedListTW = OrderedList.extend({
  renderHTML({ HTMLAttributes }) {
    return ["ol", mergeAttributes(HTMLAttributes, { class: "list-decimal pl-6" }), 0];
  },
});

const BlockquoteTW = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        class: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3",
      }),
      0,
    ];
  },
});

/* ================= MAIN EDITOR COMPONENT ================= */
export default function TextRich(props) {
  // ✅ FIX: Gunakan fungsi setter untuk ref agar SolidJS assign dengan benar
  let editorEl;
  let editorInstance;

  const [heading, setHeading] = createSignal("p");
  const [fontSize, setFontSize] = createSignal("16");
  const [textColor, setTextColor] = createSignal("#111827");
  const [showLinkInput, setShowLinkInput] = createSignal({ type: null, open: false });
  const [linkUrl, setLinkUrl] = createSignal("");
  const [imageAlign, setImageAlign] = createSignal("center");
  const [imageSize, setImageSize] = createSignal(100);
  const [isReady, setIsReady] = createSignal(false);

  const emitChange = () => {
    if (!editorInstance) return;
    props?.onChange?.(editorInstance.getJSON(), editorInstance.getHTML());
  };

  const initEditor = () => {
    // ✅ FIX: Cek editorEl sebelum init, destroy dulu kalau sudah ada
    if (!editorEl) {
      console.warn("editorEl belum siap");
      return;
    }

    if (editorInstance) {
      editorInstance.destroy();
      editorInstance = null;
    }

    editorInstance = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          hardBreak: true,
          bulletList: false,
          orderedList: false,
          blockquote: false,
        }),
        BulletListTW,
        OrderedListTW,
        BlockquoteTW,
        Underline,
        TextStyle,
        Color.configure({ types: ["textStyle"] }),
        FontSize,
        TextAlign.configure({ types: ["heading", "paragraph", "blockquote"] }),
        Image.configure({ inline: false }),
        ImageBlock,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline cursor-pointer hover:text-blue-800",
          },
        }),
      ],
      content: props?.initialJSON || { type: "doc", content: [{ type: "paragraph" }] },
      onUpdate: emitChange,
      editorProps: {
        attributes: {
          class: "min-h-[300px] w-full p-4 outline-none prose max-w-none",
        },
      },
    });

    setIsReady(true);
    emitChange();

    props?.setApi?.({
      insertImage,
      getJSON: () => editorInstance.getJSON(),
      getHTML: () => editorInstance.getHTML(),
    });
  };

  // ✅ FIX: onMount - init editor setelah DOM siap
  onMount(() => {
    console.log("=== TextRich onMount ===");
    console.log("editorEl:", editorEl);
    console.log("props.initialJSON:", props?.initialJSON);

    setTimeout(() => {
      console.log("=== After setTimeout ===");
      console.log("editorEl:", editorEl);
      initEditor();
    }, 0);
  });


  // ✅ FIX: Watch initialJSON dari props - update konten ketika data datang (untuk mode update)
  createEffect(() => {
    const json = props?.initialJSON;
    if (!json || !editorInstance) return;

    // Hindari update kalau konten sama
    const current = JSON.stringify(editorInstance.getJSON());
    const incoming = JSON.stringify(json);
    if (current !== incoming) {
      editorInstance.commands.setContent(json, false);
    }
  });

  onCleanup(() => {
    editorInstance?.destroy();
    editorInstance = null;
  });

  /* ================= HELPERS ================= */
  const insertImage = (url, align = "center", size = 100) => {
    editorInstance
      ?.chain()
      .focus()
      .insertContent([
        { type: "imageBlock", attrs: { src: url, align, size } },
        { type: "paragraph" },
      ])
      .run();
    emitChange();
  };

  const setHeadingBlock = (val) => {
    setHeading(val);
    if (val === "p") editorInstance?.chain().focus().setParagraph().run();
    else editorInstance?.chain().focus().toggleHeading({ level: Number(val) }).run();
  };

  const setFont = (size) => {
    setFontSize(size);
    editorInstance?.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const handleSetLink = () => {
    const url = linkUrl();
    if (url) {
      editorInstance?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setShowLinkInput({ type: null, open: false });
    setLinkUrl("");
  };

  const toggleLinkInput = () => {
    const { from, to } = editorInstance.state.selection;
    const hasSelection = from !== to;
    if (!hasSelection && !editorInstance.isActive("link")) {
      alert("Pilih teks terlebih dahulu untuk menambahkan link!");
      return;
    }
    if (editorInstance.isActive("link")) {
      setLinkUrl(editorInstance.getAttributes("link").href || "");
    } else {
      setLinkUrl("");
    }
    setShowLinkInput({ type: "link", open: !showLinkInput().open });
  };

  const handleInsertImage = () => {
    const url = linkUrl();
    if (url) insertImage(url, imageAlign(), imageSize());
    setShowLinkInput({ type: null, open: false });
    setLinkUrl("");
    setImageAlign("center");
    setImageSize(100);
  };

  /* ================= RENDER ================= */
  return (
    <div class="flex flex-col gap-6 mx-6 mb-5">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 pt-5 pb-3 border-b border-gray-100">
          <label class="block text-sm font-medium text-gray-700">Konten Artikel</label>
        </div>

        {/* ================= TOOLBAR ================= */}
        <div class="bg-gray-50 border-b border-gray-200">
          <div class="flex flex-wrap gap-1.5 p-3">
            {/* Text Style Group */}
            <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
              <select
                class="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={heading()}
                onChange={(e) => setHeadingBlock(e.target.value)}
              >
                <option value="p">Normal</option>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option value={n}>Heading {n}</option>
                ))}
              </select>
              <select
                class="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-20"
                value={fontSize()}
                onChange={(e) => setFont(e.target.value)}
              >
                {[12, 14, 16, 18, 20, 24, 32].map((s) => (
                  <option value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Format Group */}
            <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
              {[
                { label: "B", title: "Bold", action: () => editorInstance?.chain().focus().toggleBold().run(), mark: "bold", cls: "font-bold" },
                { label: "I", title: "Italic", action: () => editorInstance?.chain().focus().toggleItalic().run(), mark: "italic", cls: "italic" },
                { label: "U", title: "Underline", action: () => editorInstance?.chain().focus().toggleUnderline().run(), mark: "underline", cls: "underline" },
              ].map(({ label, title, action, mark, cls }) => (
                <button
                  class={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ${cls} ${
                    editorInstance?.isActive(mark)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={action}
                  title={title}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Alignment Group */}
            <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
              {[
                {
                  align: "left",
                  title: "Align Left",
                  icon: <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm0 5h10v2H2V9zm0 5h16v2H2v-2z"/></svg>,
                },
                {
                  align: "center",
                  title: "Align Center",
                  icon: <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm3 5h10v2H5V9zm-3 5h16v2H2v-2z"/></svg>,
                },
                {
                  align: "right",
                  title: "Align Right",
                  icon: <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm6 5h10v2H8V9zm-6 5h16v2H2v-2z"/></svg>,
                },
              ].map(({ align, title, icon }) => (
                <button
                  class={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                    editorInstance?.isActive({ textAlign: align })
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                  onClick={() => editorInstance?.chain().focus().setTextAlign(align).run()}
                  title={title}
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* List & Extra Group */}
            <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                class={`px-2 h-8 rounded-md flex items-center gap-1 text-sm transition-all ${
                  editorInstance?.isActive("bulletList")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => editorInstance?.chain().focus().toggleBulletList().run()}
                title="Bullet List"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="4" cy="5" r="1.5"/>
                  <circle cx="4" cy="10" r="1.5"/>
                  <circle cx="4" cy="15" r="1.5"/>
                  <path d="M8 4h10v2H8V4zm0 5h10v2H8V9zm0 5h10v2H8v-2z"/>
                </svg>
              </button>
              <button
                class={`px-2 h-8 rounded-md flex items-center gap-1 text-sm transition-all ${
                  editorInstance?.isActive("orderedList")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => editorInstance?.chain().focus().toggleOrderedList().run()}
                title="Ordered List"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zM8 4h10v2H8V4zm0 5h10v2H8V9zm0 5h10v2H8v-2z"/>
                </svg>
              </button>
              <button
                class={`px-2 h-8 rounded-md flex items-center gap-1 text-sm transition-all ${
                  editorInstance?.isActive("blockquote")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => editorInstance?.chain().focus().toggleBlockquote().run()}
                title="Blockquote"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 10c0-2.21-1.79-4-4-4v3c.55 0 1 .45 1 1s-.45 1-1 1v3c2.21 0 4-1.79 4-4zm8 0c0-2.21-1.79-4-4-4v3c.55 0 1 .45 1 1s-.45 1-1 1v3c2.21 0 4-1.79 4-4z"/>
                </svg>
              </button>
              <button
                class={`px-2 h-8 rounded-md flex items-center gap-1 text-sm transition-all hover:bg-gray-100 text-gray-700`}
                onClick={() => setShowLinkInput({ type: "image", open: !showLinkInput().open })}
                title="Insert Image"
              >
                <FaRegularImage />
              </button>
              <button
                class={`px-2 h-8 rounded-md flex items-center gap-1 text-sm transition-all ${
                  editorInstance?.isActive("link")
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={toggleLinkInput}
                title="Insert Link"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                </svg>
              </button>
            </div>

            {/* Color Group */}
            <div class="flex items-center gap-1.5">
              <input
                type="color"
                value={textColor()}
                onInput={(e) => {
                  setTextColor(e.target.value);
                  editorInstance?.chain().focus().setColor(e.target.value).run();
                }}
                class="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
                title="Text Color"
              />
              <button
                class="px-2.5 h-8 text-xs border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-all"
                onClick={() => editorInstance?.chain().focus().unsetColor().run()}
                title="Reset Color"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Image Input Panel */}
          {showLinkInput().type === "image" && (
            <div class="p-3 bg-purple-50 border-t border-purple-100">
              <div class="flex gap-2 items-start">
                <div class="flex-1 space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-purple-700 mb-1.5">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={linkUrl()}
                      onInput={(e) => setLinkUrl(e.target.value)}
                      class="w-full px-3 py-2 text-sm border border-purple-200 rounded-md outline-none focus:ring-2 focus:ring-purple-500/30 bg-white"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleInsertImage(); }
                      }}
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-purple-700 mb-1.5">Alignment</label>
                      <select
                        class="w-full px-3 py-2 text-sm border border-purple-200 rounded-md bg-white focus:outline-none"
                        value={imageAlign()}
                        onChange={(e) => setImageAlign(e.target.value)}
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-purple-700 mb-1.5">Width (%)</label>
                      <div class="flex items-center gap-2">
                        <input
                          type="range" min="10" max="100" step="5"
                          value={imageSize()}
                          onInput={(e) => setImageSize(e.target.value)}
                          class="flex-1"
                        />
                        <span class="text-sm font-medium text-purple-700 w-12 text-right">{imageSize()}%</span>
                      </div>
                    </div>
                  </div>
                  {linkUrl() && (
                    <div class="p-2 bg-white rounded-md border border-purple-200">
                      <p class="text-xs text-purple-600 mb-1">Preview:</p>
                      <div style={`text-align: ${imageAlign()}`}>
                        <img
                          src={linkUrl()} alt="Preview"
                          style={`width: ${imageSize()}%; max-width: 100%; height: auto; display: inline-block;`}
                          class="rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div class="flex gap-2 justify-end mt-3">
                <button
                  class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  onClick={() => { setShowLinkInput({ type: null, open: false }); setLinkUrl(""); }}
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium disabled:opacity-50"
                  onClick={handleInsertImage}
                  disabled={!linkUrl()}
                >
                  Insert Image
                </button>
              </div>
            </div>
          )}

          {/* Link Input Panel */}
          {showLinkInput().type === "link" && (
            <div class="flex gap-2 p-3 bg-blue-50 border-t border-blue-100">
              <input
                type="url"
                placeholder="Paste or type a link..."
                value={linkUrl()}
                onInput={(e) => setLinkUrl(e.target.value)}
                class="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                onKeyPress={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleSetLink(); }
                }}
              />
              <button
                class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                onClick={handleSetLink}
              >
                Apply
              </button>
              <button
                class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => { setShowLinkInput({ type: null, open: false }); setLinkUrl(""); }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ================= EDITOR AREA ================= */}
        {/* ✅ FIX UTAMA: ref pakai callback function */}
        <div
          ref={(el) => { editorEl = el; }}
          class="min-h-[400px] bg-white p-6"
        />

        {/* Helper Text */}
        <div class="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <span>
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded">Enter</kbd> paragraf baru &nbsp;•&nbsp;
            <kbd class="px-1.5 py-0.5 bg-white border border-gray-200 rounded">Shift+Enter</kbd> baris baru
          </span>
        </div>
      </div>
    </div>
  );
}

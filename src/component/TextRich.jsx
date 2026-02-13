import { onMount, onCleanup, createSignal } from "solid-js";
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
import { FaRegularImage } from 'solid-icons/fa'


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
      size: { default: 100 }, // %
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

/* ================= LIST (Tailwind class langsung ke UL/OL) ================= */
const BulletListTW = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(HTMLAttributes, {
        class: "list-disc pl-6",
      }),
      0,
    ];
  },
});

const OrderedListTW = OrderedList.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "ol",
      mergeAttributes(HTMLAttributes, {
        class: "list-decimal pl-6",
      }),
      0,
    ];
  },
});

const BlockquoteTW = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3'
      }), 0
    ]
  }
})

/* ================= EDITOR ================= */
export default function TiptapSolidEditor(props) {
  let editorEl;
  let editor;

  const [heading, setHeading] = createSignal("p");
  const [fontSize, setFontSize] = createSignal("16");
  const [textColor, setTextColor] = createSignal("#111827");
  const [showLinkInput, setShowLinkInput] = createSignal({ type:null, open:false});
  const [linkUrl, setLinkUrl] = createSignal("");
  const [imageAlign, setImageAlign] = createSignal("center");
  const [imageSize, setImageSize] = createSignal(100);

  const emitChange = () => {
    if (!editor) return;
    props?.onChange?.(editor.getJSON(), editor.getHTML());
  };

  const insertImage = (url, align = "center", size = 100) => {
    editor
      .chain()
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
    if (val === "p") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().toggleHeading({ level: Number(val) }).run();
  };

  const setFont = (size) => {
    setFontSize(size);
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
  };

  const btn = (active) =>
    `px-2 py-1 text-xs rounded-md border ${
      active ? "bg-black text-white" : "bg-white hover:bg-gray-50"
    }`;

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        // ✅ Matikan list bawaan StarterKit supaya override kita kepakai
        StarterKit.configure({
          hardBreak: true,
          bulletList: false,
          orderedList: false,
          blockquote: false,
        }),

        // ✅ list custom tailwind
        BulletListTW,
        OrderedListTW,
        BlockquoteTW,

        // Text styling
        Underline,
        TextStyle,
        Color.configure({ types: ["textStyle"] }),
        FontSize,

        // Text align
        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),

        // Image
        Image.configure({ inline: false }),
        ImageBlock,

        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline cursor-pointer hover:text-blue-800"
          }
        })
      ],
      content: props?.initialJSON || {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
      onUpdate: emitChange,
      editorProps: {
        attributes: {
          class:
            "min-h-[300px] w-full rounded-xl border bg-white p-4 outline-none focus:ring-2 focus:ring-black/10",
        },
      },
    });

    props?.setApi?.({
      insertImage,
      getJSON: () => editor.getJSON(),
      getHTML: () => editor.getHTML(),
    });

    emitChange();
  });

  onCleanup(() => editor?.destroy());

  const handleSetLink = () => {
    const url = linkUrl();
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setShowLinkInput({ ...showLinkInput(), type:null, open:false });
    setLinkUrl("");
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run();
  }

  const toggleLinkInput = () => {
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    if (!hasSelection && !editor.isActive('link')) {
      alert('Pilih teks terlebih dahulu untuk menambahkan link!');
      return;
    }

    if (editor.isActive("link")) {
      const previousUrl = editor.getAttributes("link").href;
      setLinkUrl(previousUrl || "");
    } else {
      setLinkUrl("");
    }
    setShowLinkInput({ ...showLinkInput(), type:'link', open: !showLinkInput().open});
  }

  const handleAddimage = () => {
    setShowLinkInput({ ...showLinkInput(), type: 'image', open: !showLinkInput().open });
  }

  const handleInsertImage = () => {
    const url = linkUrl();
    if (url) {
      insertImage(url, imageAlign(), imageSize());
    }
    setShowLinkInput({ type: null, open: false });
    setLinkUrl("");
    setImageAlign("center");
    setImageSize(100);
  };


  return (
    <div class="w-full max-w-4xl mx-auto">
      {/* ================= TOOLBAR ================= */}
      <div class="bg-white border border-gray-200 rounded-t-lg shadow-sm">
        {/* Main Toolbar */}
        <div class="flex flex-wrap gap-1.5 p-3 border-b border-gray-100">
          {/* Text Style Group */}
          <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
            <select
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={heading()}
              onChange={(e) => setHeadingBlock(e.target.value)}
            >
              <option value="p">Normal</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option value={n}>Heading {n}</option>
              ))}
            </select>

            <select
              class="px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-20"
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
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm transition-all ${
                editor?.isActive("bold")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold (Ctrl+B)"
            >
              B
            </button>
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center italic text-sm transition-all ${
                editor?.isActive("italic")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic (Ctrl+I)"
            >
              I
            </button>
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center underline text-sm transition-all ${
                editor?.isActive("underline")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline (Ctrl+U)"
            >
              U
            </button>
          </div>

          {/* Alignment Group */}
          <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ${
                editor?.isActive({ textAlign: "left" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              title="Align Left"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm0 5h10v2H2V9zm0 5h16v2H2v-2z"/>
              </svg>
            </button>
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ${
                editor?.isActive({ textAlign: "center" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              title="Align Center"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm3 5h10v2H5V9zm-3 5h16v2H2v-2z"/>
              </svg>
            </button>
            <button
              class={`w-8 h-8 rounded-md flex items-center justify-center text-sm transition-all ${
                editor?.isActive({ textAlign: "right" })
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              title="Align Right"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4h16v2H2V4zm6 5h10v2H8V9zm-6 5h16v2H2v-2z"/>
              </svg>
            </button>
          </div>

          {/* List Group */}
          <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              class={`px-3 h-8 rounded-md flex items-center gap-1.5 text-sm transition-all ${
                editor?.isActive("bulletList")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
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
              class={`px-3 h-8 rounded-md flex items-center gap-1.5 text-sm transition-all ${
                editor?.isActive("orderedList")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              title="Numbered List"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4h2v2H3V4zm0 5h2v2H3V9zm0 5h2v2H3v-2zM8 4h10v2H8V4zm0 5h10v2H8V9zm0 5h10v2H8v-2z"/>
              </svg>
            </button>
          </div>

          {/* Extra Format Group */}
          <div class="flex items-center gap-1 pr-3 border-r border-gray-200">
            <button
              class={`px-3 h-8 rounded-md flex items-center gap-1.5 text-sm transition-all ${
                editor?.isActive("blockquote")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              title="Quote"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10c0-2.21-1.79-4-4-4v3c.55 0 1 .45 1 1s-.45 1-1 1v3c2.21 0 4-1.79 4-4zm8 0c0-2.21-1.79-4-4-4v3c.55 0 1 .45 1 1s-.45 1-1 1v3c2.21 0 4-1.79 4-4z"/>
              </svg>
            </button>

            <button
              class={`px-3 h-8 rounded-md flex items-center gap-1.5 text-sm transition-all ${
                editor?.isActive("image")
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={handleAddimage}
              title="Insert Image"
            >
              <FaRegularImage />
            </button>

            <button
              class={`px-3 h-8 rounded-md flex items-center gap-1.5 text-sm transition-all ${
                editor?.isActive("link")
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
            <div class="relative">
              <input
                type="color"
                value={textColor()}
                onInput={(e) => {
                  setTextColor(e.target.value);
                  editor.chain().focus().setColor(e.target.value).run();
                }}
                class="w-8 h-8 rounded-md cursor-pointer border border-gray-200"
                title="Text Color"
              />
            </div>
            <button
              class="px-2.5 h-8 text-xs border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 transition-all"
              onClick={() => editor.chain().focus().unsetColor().run()}
              title="Reset Color"
            >
              Reset
            </button>
          </div>
        </div>

        {showLinkInput().type === 'image' && (
          <div class="p-3 bg-purple-50 border-b border-purple-100">
            <div class="flex gap-2 items-start">
              <svg class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>

              <div class="flex-1 space-y-3">
                {/* URL Input */}
                <div>
                  <label class="block text-xs font-medium text-purple-700 mb-1.5">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={linkUrl()}
                    onInput={(e) => setLinkUrl(e.target.value)}
                    class="w-full px-3 py-2 text-sm border border-purple-200 rounded-md outline-none focus:ring-2 focus:ring-purple-500/30 bg-white"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleInsertImage();
                      }
                    }}
                  />
                </div>

                {/* Image Settings */}
                <div class="grid grid-cols-2 gap-3">
                  {/* Alignment */}
                  <div>
                    <label class="block text-xs font-medium text-purple-700 mb-1.5">Alignment</label>
                    <select
                      class="w-full px-3 py-2 text-sm border border-purple-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      value={imageAlign()}
                      onChange={(e) => setImageAlign(e.target.value)}
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label class="block text-xs font-medium text-purple-700 mb-1.5">Width (%)</label>
                    <div class="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={imageSize()}
                        onInput={(e) => setImageSize(e.target.value)}
                        class="flex-1"
                      />
                      <span class="text-sm font-medium text-purple-700 w-12 text-right">{imageSize()}%</span>
                    </div>
                  </div>
                </div>

                {/* Preview (optional) */}
                {linkUrl() && (
                  <div class="mt-2 p-2 bg-white rounded-md border border-purple-200">
                    <p class="text-xs text-purple-600 mb-1">Preview:</p>
                    <div style={`text-align: ${imageAlign()}`}>
                      <img
                        src={linkUrl()}
                        alt="Preview"
                        style={`width: ${imageSize()}%; max-width: 100%; height: auto; display: inline-block;`}
                        class="rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div style="display: none;" class="text-xs text-red-500 p-2">
                        ⚠️ Failed to load image
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div class="flex gap-2 justify-end mt-3">
              <button
                class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setShowLinkInput({ type: null, open: false });
                  setLinkUrl("");
                  setImageAlign("center");
                  setImageSize(100);
                }}
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleInsertImage}
                disabled={!linkUrl()}
              >
                Insert Image
              </button>
            </div>
          </div>
        )}

        {/* Link Input Panel */}
        {showLinkInput().type === 'link' && (
          <div class="flex gap-2 p-3 bg-blue-50 border-b border-blue-100">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
            <input
              type="url"
              placeholder="Paste or type a link..."
              value={linkUrl()}
              onInput={(e) => setLinkUrl(e.target.value)}
              class="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
            />
            <button
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              onClick={handleSetLink}
            >
              Apply
            </button>
            <button
              class="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                setShowLinkInput({ ...showLinkInput(), type:null, open:false });
                setLinkUrl("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Helper Text */}
        <div class="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <span>
            <kbd class="px-1.5 py-0.5 text-xs bg-white border border-gray-200 rounded">Enter</kbd> untuk paragraf baru •
            <kbd class="px-1.5 py-0.5 text-xs bg-white border border-gray-200 rounded ml-1">Shift+Enter</kbd> untuk baris baru
          </span>
        </div>
      </div>

      {/* ================= EDITOR ================= */}
      <div
        ref={editorEl}
        class="min-h-[400px] bg-white border border-t-0 border-gray-200 rounded-b-lg p-6 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all"
      />
    </div>
  );
}

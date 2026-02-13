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
  const [showLinkInput, setShowLinkInput] = createSignal(false);
  const [linkUrl, setLinkUrl] = createSignal("");

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
    setShowLinkInput(false);
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
    setShowLinkInput(!showLinkInput());
  }

  return (
    <div class="w-full">
      {/* ================= TOOLBAR ================= */}
      <div class="flex flex-wrap gap-2 mb-3 items-center">
        {/* Heading */}
        <select
          class="border rounded px-2 py-1 text-xs"
          value={heading()}
          onChange={(e) => setHeadingBlock(e.target.value)}
        >
          <option value="p">Paragraph</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option value={n}>H{n}</option>
          ))}
        </select>

        {/* Font size */}
        <select
          class="border rounded px-2 py-1 text-xs"
          value={fontSize()}
          onChange={(e) => setFont(e.target.value)}
        >
          {[12, 14, 16, 18, 20, 24, 32].map((s) => (
            <option value={s}>{s}px</option>
          ))}
        </select>

        {/* Bold / Italic / Underline */}
        <button class={btn(editor?.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button class={btn(editor?.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button class={btn(editor?.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>

        {/* Text Align */}
        <button class={btn(editor?.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</button>
        <button class={btn(editor?.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</button>
        <button class={btn(editor?.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</button>

        {/* ✅ LIST BUTTONS */}
        <button class={btn(editor?.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </button>
        <button class={btn(editor?.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </button>

        {/* Quote */}
        <button class={btn(editor?.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Quote
        </button>

        <button class={btn(editor?.isActive("link"))} onClick={toggleLinkInput}>
          Link
        </button>

        {showLinkInput() && (
          <div class="flex gap-2 mb-3 items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl()}
              onInput={(e) => setLinkUrl(e.target.value)}
              class="flex-1 px-3 py-1.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-black/10"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSetLink();
                }
              }}
            />
            <button
              class="px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-800"
              onClick={handleSetLink}
            >
              Set Link
            </button>
            <button
              class="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Text color */}
        <input
          type="color"
          value={textColor()}
          onInput={(e) => {
            setTextColor(e.target.value);
            editor.chain().focus().setColor(e.target.value).run();
          }}
          class="h-7 w-8 border rounded"
        />

        <button
          class="px-2 py-1 text-xs border rounded"
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Reset Color
        </button>

        <div class="ml-auto text-xs text-gray-500">
          Enter = paragraf • Shift+Enter = baris baru
        </div>
      </div>

      {/* ================= EDITOR ================= */}
      <div ref={editorEl} />
    </div>
  );
}

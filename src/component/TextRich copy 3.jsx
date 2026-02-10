import { onMount, onCleanup, createSignal } from "solid-js";
import { Editor, Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

/* ================= IMAGE BLOCK (align + size) ================= */
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
      align: { default: "center" }, // left|center|right
      size: { default: 100 }, // 25|50|75|100 (%)
    };
  },

  parseHTML() {
    return [{ tag: "figure[data-image-block]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, alt, align, size } = HTMLAttributes;

    const safeAlign = ["left", "center", "right"].includes(align)
      ? align
      : "center";

    const s = Number(size);
    const safeSize = [25, 50, 75, 100].includes(s) ? s : 100;

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-image-block": "true",
        style: `text-align:${safeAlign};`,
      }),
      [
        "img",
        {
          src: src || "",
          alt: alt || "",
          style: `display:inline-block;width:${safeSize}%;max-width:100%;height:auto;`,
        },
      ],
    ];
  },
});

/* ================= FONT SIZE (via TextStyle mark attrs) ================= */
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el) => el.style.fontSize?.replace("px", ""),
        renderHTML: (attrs) => {
          if (!attrs.fontSize) return {};
          return { style: `font-size:${attrs.fontSize}px` };
        },
      },
    };
  },
});

export default function TiptapSolidEditor(props) {
  let editorEl;

  // editor dibuat reactive biar tombol selalu "nempel"
  const [ed, setEd] = createSignal(null);

  // UI state
  const [heading, setHeading] = createSignal("p");
  const [fontSize, setFontSize] = createSignal("16");
  const [textColor, setTextColor] = createSignal("#111827");

  const emitChange = () => {
    const editor = ed();
    if (!editor) return;
    props?.onChange?.(editor.getJSON(), editor.getHTML());
  };

  // dipanggil dari parent via setApi
  const insertImage = (url, align = "center", size = 100, alt = "") => {
    const editor = ed();
    if (!editor) return;

    const cleanAlign = ["left", "center", "right"].includes(align) ? align : "center";
    const s = Number(size);
    const cleanSize = [25, 50, 75, 100].includes(s) ? s : 100;

    editor
      .chain()
      .focus()
      .insertContent([
        { type: "imageBlock", attrs: { src: url, alt, align: cleanAlign, size: cleanSize } },
        { type: "paragraph" }, // wajib: paragraf kosong setelah image
      ])
      .run();

    emitChange();
  };

  const setHeadingBlock = (val) => {
    const editor = ed();
    if (!editor) return;

    setHeading(val);
    if (val === "p") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().toggleHeading({ level: Number(val) }).run();

    emitChange();
  };

  const setFont = (size) => {
    const editor = ed();
    if (!editor) return;

    setFontSize(size);
    editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
    emitChange();
  };

  const applyColor = (hex) => {
    const editor = ed();
    if (!editor) return;

    setTextColor(hex);
    editor.chain().focus().setColor(hex).run();
    emitChange();
  };

  const unsetColor = () => {
    const editor = ed();
    if (!editor) return;

    editor.chain().focus().unsetColor().run();
    emitChange();
  };

  const btn = (active) =>
    [
      "px-2 py-1 text-xs rounded-md border",
      active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50",
    ].join(" ");

  onMount(() => {
    const editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          hardBreak: true, // Shift+Enter = baris baru dalam paragraf
        }),

        // marks & styling
        Underline,
        TextStyle,
        FontSize,
        Color.configure({ types: ["textStyle"] }),

        // text align untuk paragraph/heading/blockquote
        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),

        // image
        Image.configure({ inline: false }),
        ImageBlock,
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

    setEd(editor);

    // expose API ke parent
    props?.setApi?.({
      insertImage,
      getJSON: () => editor.getJSON(),
      getHTML: () => editor.getHTML(),
      focus: () => editor.chain().focus().run(),
    });

    emitChange();
  });

  onCleanup(() => {
    ed()?.destroy();
  });

  return (
    <div class="w-full">
      {/* TOOLBAR */}
      <div class="flex flex-wrap gap-2 mb-3 items-center">
        {/* Heading */}
        <select
          class="border rounded px-2 py-1 text-xs bg-white"
          value={heading()}
          onChange={(e) => setHeadingBlock(e.currentTarget.value)}
        >
          <option value="p">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        {/* Font Size */}
        <select
          class="border rounded px-2 py-1 text-xs bg-white"
          value={fontSize()}
          onChange={(e) => setFont(e.currentTarget.value)}
        >
          <option value="12">12px</option>
          <option value="14">14px</option>
          <option value="16">16px</option>
          <option value="18">18px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
        </select>

        {/* Bold / Italic / Underline */}
        <button
          type="button"
          class={btn(ed()?.isActive("bold"))}
          onClick={() => ed()?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          class={btn(ed()?.isActive("italic"))}
          onClick={() => ed()?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          class={btn(ed()?.isActive("underline"))}
          onClick={() => ed()?.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        {/* Text Align */}
        <button
          type="button"
          class={btn(ed()?.isActive({ textAlign: "left" }))}
          onClick={() => ed()?.chain().focus().setTextAlign("left").run()}
        >
          Left
        </button>
        <button
          type="button"
          class={btn(ed()?.isActive({ textAlign: "center" }))}
          onClick={() => ed()?.chain().focus().setTextAlign("center").run()}
        >
          Center
        </button>
        <button
          type="button"
          class={btn(ed()?.isActive({ textAlign: "right" }))}
          onClick={() => ed()?.chain().focus().setTextAlign("right").run()}
        >
          Right
        </button>

        {/* LIST (INI YANG KAMU MAU) */}
        <button
          type="button"
          class={btn(ed()?.isActive("bulletList"))}
          onClick={() => ed()?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>

        <button
          type="button"
          class={btn(ed()?.isActive("orderedList"))}
          onClick={() => ed()?.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>

        {/* Quote */}
        <button
          type="button"
          class={btn(ed()?.isActive("blockquote"))}
          onClick={() => ed()?.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>

        {/* Color */}
        <div class="flex items-center gap-2">
          <input
            type="color"
            value={textColor()}
            onInput={(e) => applyColor(e.currentTarget.value)}
            class="h-7 w-8 border rounded bg-white"
            title="Text Color"
          />
          <button type="button" class="px-2 py-1 text-xs border rounded" onClick={unsetColor}>
            Reset
          </button>
        </div>

        <div class="ml-auto text-xs text-gray-500">
          Enter = paragraf • Shift+Enter = baris baru
        </div>
      </div>

      {/* EDITOR */}
      <div ref={editorEl} />
    </div>
  );
}

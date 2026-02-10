import { onMount, onCleanup, createSignal } from "solid-js";
import { Editor, Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

// ===== Custom image block with align + size =====
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
      size: { default: 100 }, // 25|50|75|100
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

export default function TiptapSolidEditor(props) {
  let editorEl;
  let editor;

  const [headingLevel, setHeadingLevel] = createSignal("p");
  const [textColor, setTextColor] = createSignal("#111827");

  const emitChange = () => {
    if (!editor) return;
    props?.onChange?.(editor.getJSON(), editor.getHTML());
  };

  const insertImage = (url, align = "center", size = 100, alt = "") => {
    if (!editor) return;

    const cleanAlign = ["left", "center", "right"].includes(align) ? align : "center";
    const s = Number(size);
    const cleanSize = [25, 50, 75, 100].includes(s) ? s : 100;

    editor
      .chain()
      .focus()
      .insertContent([
        { type: "imageBlock", attrs: { src: url, alt, align: cleanAlign, size: cleanSize } },
        { type: "paragraph" }, // wajib setelah image
      ])
      .run();

    emitChange();
  };

  const setHeading = (val) => {
    if (!editor) return;
    setHeadingLevel(val);

    if (val === "p") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().toggleHeading({ level: Number(val) }).run();
  };

  const applyColor = (hex) => {
    if (!editor) return;
    setTextColor(hex);
    editor.chain().focus().setColor(hex).run();
  };

  const btnClass = (active) =>
    [
      "px-2 py-1 text-xs rounded-md border",
      active ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50",
    ].join(" ");

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({ hardBreak: true }),
        Underline,
        TextStyle,
        Color.configure({ types: ["textStyle"] }),
        Image.configure({ inline: false, allowBase64: true }),
        ImageBlock,
      ],
      content: props?.initialJSON || {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
      onUpdate() {
        emitChange();
      },
      editorProps: {
        attributes: {
          class:
            "min-h-[260px] w-full rounded-xl border bg-white p-4 outline-none focus:ring-2 focus:ring-black/10",
        },
      },
    });

    props?.setApi?.({
      insertImage,
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML(),
      focus: () => editor?.chain().focus().run(),
    });

    emitChange();
  });

  onCleanup(() => editor?.destroy());

  return (
    <div class="w-full">
      <div class="flex flex-wrap items-center gap-2 mb-3">
        <select
          class="px-2 py-1 text-xs rounded-md border bg-white"
          value={headingLevel()}
          onChange={(e) => setHeading(e.currentTarget.value)}
        >
          <option value="p">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
        </select>

        <button
          type="button"
          class={btnClass(editor?.isActive("bold"))}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>

        <button
          type="button"
          class={btnClass(editor?.isActive("italic"))}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>

        <button
          type="button"
          class={btnClass(editor?.isActive("underline"))}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          Underline
        </button>

        <div class="flex items-center gap-2 ml-1">
          <span class="text-xs text-gray-600">Color</span>
          <input
            type="color"
            value={textColor()}
            onInput={(e) => applyColor(e.currentTarget.value)}
            class="h-7 w-9 p-0 border rounded-md bg-white"
          />
          <button
            type="button"
            class="px-2 py-1 text-xs rounded-md border bg-white hover:bg-gray-50"
            onClick={() => editor?.chain().focus().unsetColor().run()}
          >
            Reset
          </button>
        </div>

        <div class="ml-auto text-xs text-gray-500">
          Enter = paragraf baru • Shift+Enter = baris baru
        </div>
      </div>

      <div ref={editorEl} />
    </div>
  );
}

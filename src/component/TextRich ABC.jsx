import { onMount, onCleanup } from "solid-js";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Custom node imageBlock:
 * - block image (bukan inline)
 * - punya align dan size
 * - HTML: <figure style="text-align:..."><img style="width:..%" /></figure>
 */
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

    const safeSize = [25, 50, 75, 100].includes(Number(size))
      ? Number(size)
      : 100;

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

  const emitChange = () => {
    if (!editor) return;
    const json = editor.getJSON();
    const html = editor.getHTML();
    props?.onChange?.(json, html);
  };

  const insertImage = (url, align = "center", size = 50, alt = "") => {
    if (!editor) return;

    const cleanAlign = ["left", "center", "right"].includes(align)
      ? align
      : "center";

    const cleanSize = [25, 50, 75, 100].includes(Number(size))
      ? Number(size)
      : 100;

    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: "imageBlock",
          attrs: { src: url, alt, align: cleanAlign, size: cleanSize },
        },
        { type: "paragraph" }, // wajib: paragraf kosong setelah image
      ])
      .run();

    emitChange();
  };

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          hardBreak: true, // Shift+Enter = baris baru dalam paragraf
        }),

        // optional (kalau nanti kamu mau pakai node image bawaan)
        Image.configure({
          inline: false,
          allowBase64: true,
        }),

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

    // expose API ke parent
    props?.setApi?.({
      insertImage,
      getJSON: () => editor?.getJSON(),
      getHTML: () => editor?.getHTML(),
      focus: () => editor?.chain().focus().run(),
    });

    emitChange(); // biar parent langsung ada output awal
  });

  onCleanup(() => {
    editor?.destroy();
  });

  return (
    <div class="w-full">
      <div class="flex items-center justify-between mb-3">
        <div class="text-sm font-semibold">Text Editor</div>
        <div class="text-xs text-gray-500">
          Enter = paragraf baru • Shift+Enter = baris baru
        </div>
      </div>

      <div ref={editorEl} />

      <div class="mt-2 text-[11px] text-gray-500">
        Insert image via URL dari parent (align & size tersimpan di JSON).
      </div>
    </div>
  );
}

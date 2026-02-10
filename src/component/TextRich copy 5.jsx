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

/* ================= IMAGE BLOCK ================= */
const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      align: { default: "center" },
      size: { default: 100 },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      { style: `text-align:${HTMLAttributes.align}` },
      [
        "img",
        {
          src: HTMLAttributes.src,
          style: `width:${HTMLAttributes.size}%;max-width:100%;height:auto;`,
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
        renderHTML: (attrs) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}px` } : {},
      },
    };
  },
});

/* ================= BULLET LIST (TAILWIND CLASS) ================= */
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

/* ================= ORDERED LIST (TAILWIND CLASS) ================= */
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

export default function TiptapSolidEditor(props) {
  let editorEl;
  const [ed, setEd] = createSignal(null);

  const emitChange = () => {
    const editor = ed();
    if (!editor) return;
    props?.onChange?.(editor.getJSON(), editor.getHTML());
  };

  onMount(() => {
    const editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          bulletList: false,
          orderedList: false,
        }),

        // our overridden list
        BulletListTW,
        OrderedListTW,

        Underline,
        TextStyle,
        FontSize,
        Color.configure({ types: ["textStyle"] }),
        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),

        Image.configure({ inline: false }),
        ImageBlock,
      ],
      content: {
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

    emitChange();
  });

  onCleanup(() => ed()?.destroy());

  const btn = (active) =>
    `px-2 py-1 text-xs rounded border ${
      active ? "bg-black text-white" : "bg-white"
    }`;

  return (
    <div class="w-full">
      {/* TOOLBAR */}
      <div class="flex flex-wrap gap-2 mb-3">
        <button
          class={btn(ed()?.isActive("bulletList"))}
          onClick={() => ed()?.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>

        <button
          class={btn(ed()?.isActive("orderedList"))}
          onClick={() => ed()?.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>
      </div>

      {/* EDITOR */}
      <div ref={editorEl} />
    </div>
  );
}

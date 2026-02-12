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

/* ================= LIST (TAILWIND CLASS) ================= */
const BulletListTW = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(HTMLAttributes, {
        class: "list-disc pl-6 my-2",
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
        class: "list-decimal pl-6 my-2",
      }),
      0,
    ];
  },
});

/* ================= QUOTE (TAILWIND CLASS) ================= */
const BlockquoteTW = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(HTMLAttributes, {
        class:
          "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-3",
      }),
      0,
    ];
  },
});

/* ================= EDITOR ================= */
export default function TiptapSolidEditor(props) {
  let editorEl;
  let editor;

  const [heading, setHeading] = createSignal("p");
  const [fontSize, setFontSize] = createSignal("16");
  const [textColor, setTextColor] = createSignal("#111827");

  const emitChange = () => {
    if (!editor) return;
    props?.onChange?.(editor.getJSON(), editor.getHTML());
  };

  onMount(() => {
    editor = new Editor({
      element: editorEl,
      extensions: [
        // Matikan list & quote bawaan
        StarterKit.configure({
          hardBreak: true,
          bulletList: false,
          orderedList: false,
          blockquote: false,
        }),

        // Custom Tailwind blocks
        BulletListTW,
        OrderedListTW,
        BlockquoteTW,

        // Text styling
        Underline,
        TextStyle,
        Color.configure({ types: ["textStyle"] }),
        FontSize,

        TextAlign.configure({
          types: ["heading", "paragraph", "blockquote"],
        }),

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

    emitChange();
  });

  onCleanup(() => editor?.destroy());

  const btn = (active) =>
    `px-2 py-1 text-xs rounded-md border ${
      active ? "bg-black text-white" : "bg-white hover:bg-gray-50"
    }`;

  return (
    <div class="w-full">
      {/* TOOLBAR */}
      <div class="flex flex-wrap gap-2 mb-3 items-center">
        {/* LIST */}
        <button
          class={btn(editor?.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>
        <button
          class={btn(editor?.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>

        {/* QUOTE */}
        <button
          class={btn(editor?.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </button>
      </div>

      {/* EDITOR */}
      <div ref={editorEl} />
    </div>
  );
}

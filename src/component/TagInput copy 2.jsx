import { createSignal, For, Show } from "solid-js";

const MAX_TAG = 6;

const listTag = [
  { id: 1, label: "label satu" },
  { id: 2, label: "label dua" },
  { id: 3, label: "label tiga" },
  { id: 4, label: "label empat" },
  { id: 5, label: "label lima" },
  { id: 6, label: "label enam" },
  { id: 7, label: "label tujuh" },
  { id: 8, label: "label delapan" },
  { id: 9, label: "label sembilan" },
  { id: 10, label: "label sepuluh" },
];

export default function TagInput(props) {
  // Perbaiki: props.tags sebagai initial value, bukan props.tag()
  const [tags, setTags] = createSignal(props.tags || []);
  const [input, setInput] = createSignal("");
  const [open, setOpen] = createSignal(false);

  // Perbaiki: fungsi untuk notify parent
  const notifyParent = (newTags) => {
    if (props.onTagsChange) {
      props.onTagsChange(newTags);
    }
  };

  const isMax = () => tags().length >= MAX_TAG;

  const filteredTags = () =>
    listTag.filter(
      (item) =>
        item.label.toLowerCase().includes(input().toLowerCase()) &&
        !tags().some((t) => t.id === item.id)
    );

  const addTag = (tag) => {
    if (isMax()) return;
    const newTags = [...tags(), tag];
    setTags(newTags);
    notifyParent(newTags); // Panggil dengan data baru
    setInput("");
    setOpen(false);
  };

  const removeTag = (id) => {
    const newTags = tags().filter((t) => t.id !== id);
    setTags(newTags);
    notifyParent(newTags); // Panggil dengan data baru
  };

  return (
    <div class="relative w-full">
      {/* Input wrapper */}
      <div
        class={`flex flex-wrap items-center gap-2 rounded-md border p-2 ${
          isMax()
            ? "border-gray-300 bg-gray-100"
            : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
        }`}
      >
        <For each={tags()}>
          {(tag) => (
            <span class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                class="ml-1 hover:text-blue-900"
              >
                ✕
              </button>
            </span>
          )}
        </For>

        <input
          value={input()}
          disabled={isMax()}
          onInput={(e) => {
            setInput(e.currentTarget.value);
            setOpen(true);
          }}
          onFocus={() => !isMax() && setOpen(true)}
          onBlur={() => {
            // Delay close to allow click on dropdown items
            setTimeout(() => setOpen(false), 200);
          }}
          placeholder={isMax() ? "Maksimal 6 tag" : "Cari tag..."}
          class="flex-1 min-w-[120px] border-none p-1 text-sm outline-none disabled:cursor-not-allowed disabled:bg-transparent"
        />
      </div>

      {/* Info text */}
      <Show when={isMax()}>
        <p class="mt-1 text-xs text-red-500">
          Maksimal {MAX_TAG} tag
        </p>
      </Show>

      {/* Dropdown */}
      <Show when={!isMax() && open() && filteredTags().length > 0}>
        <ul class="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          <For each={filteredTags()}>
            {(item) => (
              <li
                onClick={() => addTag(item)}
                class="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 transition-colors"
              >
                {item.label}
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}

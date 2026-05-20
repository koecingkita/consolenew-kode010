// TagInput.jsx
import { createSignal, For, Show, createEffect } from "solid-js";

const MAX_TAG = 6;

export default function TagInput(props) {
  const [input, setInput] = createSignal("");
  const [open, setOpen] = createSignal(false);

  // Gunakan props.tags (signal dari parent) untuk selected tags
  const tags = () => props.tags?.() || props.selectedTags?.() || [];
  const setTags = props.setTags || props.onChange;

  const isMax = () => tags().length >= MAX_TAG;

  // Filter tags dari props.listTag yang belum dipilih
  const filteredTags = () => {
    const list = props.listTag?.() || props.listTag || [];
    return list.filter(
      (item) =>
        item.label.toLowerCase().includes(input().toLowerCase()) &&
        !tags().some((t) => t.id === item.id)
    );
  };

  const addTag = (tag) => {
    if (isMax()) return;
    const newTags = [...tags(), tag];
    if (setTags) setTags(newTags);
    setInput("");
    setOpen(false);
  };

  const removeTag = (id) => {
    const newTags = tags().filter((t) => t.id !== id);
    if (setTags) setTags(newTags);
  };

  // Debug: log perubahan tags
  createEffect(() => {
    console.log('Selected tags di TagInput:', tags());
    const tagIds = tags().map(t => t.id).join(',');
    console.log('Tag IDs string:', tagIds);

    // Panggil callback jika ada
    if (props.onTagChange) {
      props.onTagChange(tagIds);
    }
  });

  return (
    <div class="relative w-full max-w-md">
      {/* Input wrapper */}
      <div class={`flex flex-wrap items-center gap-2 rounded-md border p-2 ${
        isMax() ? "bg-gray-50 border-gray-300" : "border-gray-300 focus-within:ring-2 focus-within:ring-blue-500"
      }`}>
        <For each={tags()}>
          {(tag) => (
            <span class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {tag.label}
              <button
                type="button"
                onClick={() => removeTag(tag.id)}
                class="ml-1 hover:text-blue-900 focus:outline-none"
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
          onFocus={() => setOpen(true)}
          placeholder={`${isMax() ? "Maksimal 6 tag" : "Cari tag..."}`}
          class="flex-1 min-w-[120px] border-none p-1 text-sm outline-none"
        />
      </div>

      {/* Dropdown */}
      <Show when={open() && filteredTags().length > 0}>
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

      {/* Info counter */}
      <div class="mt-1 text-xs text-gray-500">
        {tags().length}/{MAX_TAG} tag terpilih
      </div>
    </div>
  );
}

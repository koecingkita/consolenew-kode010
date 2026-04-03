import { createSignal, For, Show, createEffect } from "solid-js";

const MAX_TAG = 6;

export default function TagInput(props) {
  const [tags, setTags] = createSignal([]);
  const [input, setInput] = createSignal("");
  const [open, setOpen] = createSignal(false);
  const [initialized, setInitialized] = createSignal(false);

  // props.tagListDB → () => [{id, label}]
  // props.dataTag   → () => '1,4,5'

  const notifyParent = (newTags) => {
    if (props.onTagsChange) props.onTagsChange(newTags);
  };

  const isMax = () => tags().length >= MAX_TAG;

  const filteredTags = () =>
    (props.tagListDB?.() ?? []).filter(
      (item) =>
        item.label.toLowerCase().includes(input().toLowerCase()) &&
        !tags().some((t) => t.id === item.id)
    );

  const addTag = (tag) => {
    if (isMax()) return;
    const newTags = [...tags(), tag];
    setTags(newTags);
    notifyParent(newTags);
    setInput("");
    setOpen(false);
  };

  const removeTag = (id) => {
    const newTags = tags().filter((t) => t.id !== id);
    setTags(newTags);
    notifyParent(newTags);
  };

  createEffect(() => {
    const db = props.tagListDB?.() ?? [];
    const raw = props.dataTag?.();

    if (initialized() || db.length === 0 || !raw) return;

    const ids = String(raw).split(',').map((id) => id.trim()).filter(Boolean);
    const matchTag = ids
      .map((id) => db.find((tag) => String(tag.id) === String(id)))
      .filter(Boolean);

    if (ids.length > 0 && matchTag.length === 0) return;

    setTags(matchTag);
    notifyParent(matchTag);
    setInitialized(true);
  });

  return (
    <div class="relative w-full">
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
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={isMax() ? "Maksimal 6 tag" : "Cari tag..."}
          class="flex-1 min-w-[120px] border-none p-1 text-sm outline-none disabled:cursor-not-allowed disabled:bg-transparent"
        />
      </div>

      <Show when={isMax()}>
        <p class="mt-1 text-xs text-red-500">Maksimal {MAX_TAG} tag</p>
      </Show>

      <Show when={!isMax() && open()}>
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

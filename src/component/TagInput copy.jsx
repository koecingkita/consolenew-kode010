import { createSignal, For } from "solid-js";

const listTag = [
  {id:1, label:'label satu'},
  {id:2, label:'label dua'},
  {id:3, label:'label tiga'},
  {id:4, label:'label empat'},
  {id:5, label:'label lima'},
  {id:6, label:'label enam'},
  {id:7, label:'label tujuh'},
  {id:8, label:'label delapan'},
  {id:9, label:'label sembilan'},
  {id:10, label:'label sepuluh'},
]

export default function TagInput() {
  const [tags, setTags] = createSignal([]);
  const [input, setInput] = createSignal("");

  const addTag = () => {
    const value = input().trim();
    if (!value) return;
    if (tags().includes(value)) return;

    setTags([...tags(), value]);
    setInput("");
  };

  const removeTag = (tag) => {
    setTags(tags().filter(t => t !== tag));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !input() && tags().length) {
      removeTag(tags()[tags().length - 1]);
    }
  };

  return (
    <div class="flex flex-wrap items-center gap-2 rounded-md border border-gray-300 p-2 focus-within:ring-2 focus-within:ring-blue-500">
      <For each={tags()}>
        {(tag) => (
          <span class="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              class="ml-1 text-blue-500 hover:text-blue-700"
            >
              ✕
            </button>
          </span>
        )}
      </For>

      <input
        value={input()}
        onInput={(e) => setInput(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        placeholder="Add a tag..."
        class="flex-1 min-w-[120px] border-none p-1 text-sm outline-none"
      />
    </div>
  );
}

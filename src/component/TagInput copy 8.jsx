import { createSignal, For, Show, createEffect } from "solid-js";


export default function TagInput(props) {
  createEffect(() => {
    // Track resource loading status
    console.log('Tag loading:', props.tagResource.loading);

    // Track data changes
    const tags = props.tagData();
    console.log('Tags updated:', tags);
    console.log('Jumlah tags:', tags?.length);
  });

  return (
    <div>
      <Show when={!props.tagResource.loading} fallback={<div>Loading tags...</div>}>
        <For each={props.tagData() || []}>
          {(item) => <div>{item.label}</div>}
        </For>
      </Show>
    </div>
  );
}

/*
di console log kenapa kosong?
TagInput.jsx:10 data props:  []
TagInput.jsx:11 jumlah tags:  0

sedangkan di ui nya ada?

 * /

/*
soal component solidjs

component ini kenapa ga muncul console.log() nya
tapi ketika ini ada perubahan dan di save langsung muncul lognya

*/



/*

 const tagListDB = () => getTagList()?.data?.data ?? [];
  {tagListDB().map((item, index) => (
    <div>
      {item.label}
    </div>
  ))}
kalo dilooping di halaman yang sama itu bisa, tapi kenapa ketika kirim kek component lain itu ga bisa

<TagInput tag={tagListDB()}  />
// component lainnya
export default function TagInput(props) {
  console.log('data props: ', props.tag); // kenapa ga masuk

*/

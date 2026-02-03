import Container from "./theme/ui/ContainerContent";
import TextRich from "./TextRich";
import TagInput from "./TagInput";
import { useLocation } from "@solidjs/router";
import { createEffect } from "solid-js";

function CreateArtikel(props) {
  const location = useLocation();

  createEffect(() => {
    console.log("query:", location.pathname);
  })

  return (<Container>

    <div class='flex flex-col rounded-xl w-full max-w-6xl mx-auto'>
      <div class="flex flex-col gap-6 mx-6">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Judul Artikel</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up pulsa murah'/>
        </div>
      </div>
      <div class="flex flex-col gap-6 m-6">
        <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">

          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Image</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='https://domain.com/images.webp'/>

          <label class="block mb-2.5 mt-5 text-sm font-medium text-heading" for="file_input">Keterangan image</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Gambar adaku - Top up pulsa murah'/>

        </div>
      </div>
    </div>

    <TextRich />

    <div class='flex flex-col mt-8 rounded-xl w-full max-w-6xl mx-auto'>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-5 bg-white rounded-xl shadow-sm p-6 border-gray-200">
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Title</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up pulsa murah'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Slug</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: top-up-pulsa-murah'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Deskripsi</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Adaku adalah aplikasi digital yang menjual produk-produk PPOB ...'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Keyword</label>
          <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6' placeholder='Contoh: Top up Pulsa, Pulsa Murah, Pulsa Bebas Denom ...'/>
        </div>
        <div class="">
          <label class="block mb-2.5 text-sm font-medium text-heading" for="file_input">Meta Tag</label>
          <TagInput />
          {/*
            <input type='text' class='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'/>
          */}
        </div>
      </div>
    </div>

    <div class='w-full max-w-6xl mx-auto mb-20 p-6'>
      <div class='flex gap-2 justify-end'>
        <div class='flex gap-2 bg-white p-4 rounded-xl shadow-sm'>
          <button type="button" class="text-red-600 border border-red-500 shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer hover:bg-gray-50 hover:text-red-400">Cancel</button>
          <button type="button" class="text-white bg-blue-500 box-border border border-transparent hover:bg-blue-600 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-xl text-sm px-4 py-2.5 focus:outline-none hover:cursor-pointer">Create Artikel</button>
        </div>
      </div>
    </div>
  </Container>);
}

export default CreateArtikel;

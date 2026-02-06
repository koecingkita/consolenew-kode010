function Info(props) {
  const handleClose = () => {
    props.onClose();
  }

  return (
  <div class='fixed inset-0 z-50 overflow-y-auto'>
    <div class='fixed inset-0 bg-black/30 transition-opacity' onClick={handleClose}></div>

    <div class='flex min-h-full items-center justify-center p-4'>
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" onClick={(e) => e.stopPropagation()} >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          ssssss
        </div>

        <div class='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
          <button type='button'
            onClick={handleClose}
            class='hover:cursor-pointer mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
          >Batal</button>
        </div>
      </div>
    </div>

  </div>);
}

export default Info;

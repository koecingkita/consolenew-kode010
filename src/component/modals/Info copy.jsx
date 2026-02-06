import { AiOutlineInfoCircle } from "solid-icons/ai";

function Info(props) {
  const handleClose = () => {
    props.onClose();
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Overlay */}
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        class="relative w-full max-w-md rounded-2xl bg-white shadow-xl animate-[scaleIn_.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div class="flex items-center gap-3 border-b px-6 py-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <AiOutlineInfoCircle size={22} />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">
              Informasi
            </h3>
            <p class="text-sm text-gray-500">
              Detail penting untuk kamu
            </p>
          </div>
        </div>

        {/* Body */}
        <div class="px-6 py-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Ini adalah modal informasi. Kamu bisa pakai untuk
            menampilkan detail, peringatan ringan, atau
            penjelasan fitur tanpa mengganggu alur pengguna.
          </p>
        </div>

        {/* Footer */}
        <div class="flex justify-end gap-2 border-t bg-gray-50 px-6 py-3 rounded-b-2xl">
          <button
            onClick={handleClose}
            class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export default Info;

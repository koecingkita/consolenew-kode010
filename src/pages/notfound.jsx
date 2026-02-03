import { useNavigate } from "@solidjs/router";
import { FaSolidArrowLeftLong } from 'solid-icons/fa'

function NotFound() {
  const navigate = useNavigate();

  return (
    <div class="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-white">
      <img src="/404.png" class="max-w-md w-full" />

      <button
        onClick={() => navigate(-1)}
        class="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium flex gap-2 items-center
               hover:bg-blue-700 transition"
      >
        <FaSolidArrowLeftLong /> Kembali
      </button>
    </div>
  );
}

export default NotFound;

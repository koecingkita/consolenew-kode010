import { createSignal } from "solid-js";

function Delete(props) {
  const [loading, setLoading] = createSignal(false);

  if (!props.isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await props.onDelete?.();

      if (res?.error) {
        alert("Gagal menghapus data");
        return;
      }

      await props.onSuccess?.();
      props.onClose?.();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        class="fixed inset-0 bg-black/30"
        onClick={props.onClose}
      ></div>

      {/* Modal */}
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          class="relative w-full max-w-lg rounded-lg bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="p-6">
            <h3 class="text-lg font-semibold uppercase">
              Hapus {props.title ?? "Data"}
            </h3>

            <p class="mt-2 text-sm text-gray-500">
              {props.message ?? (
                <>
                  Apakah Anda yakin ingin menghapus{" "}
                  <strong>{props.itemName}</strong>? Tindakan ini tidak dapat
                  dibatalkan.
                </>
              )}
            </p>
          </div>

          <div class="bg-gray-100 px-6 py-4 flex justify-end gap-2">
            <button
              onClick={props.onClose}
              class="px-4 py-2 rounded-md border"
              disabled={loading()}
            >
              Batal
            </button>

            <button
              onClick={handleDelete}
              disabled={loading()}
              class="px-4 py-2 rounded-md bg-red-600 text-white"
            >
              {loading() ? "Menghapus..." : "Hapus"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Delete;

import { useState } from "react";

export default function ImagePopup({ src, alt = "", triggerLabel = "View photo" }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  return (
    <div className="flex items-center justify-center bg-transparent">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full h-fit w-full bg-green-600 my-3 px-6 py-3 font-medium text-white shadow-md transition hover:bg-green-500"
      >
        {triggerLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative max-w-3xl rounded-lg bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-gray-700 shadow-md transition hover:bg-gray-200"
            >
              ✕
            </button>

            <img src={src} alt={alt} className="max-h-[80vh] w-full rounded object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

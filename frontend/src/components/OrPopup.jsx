import React, { useState } from 'react';
import open from "./SubscriptionCard.jsx";

function ImagePopup() {
  // State to track if the popup photo is visible
  const ok = open
  const [isOpen, setIsOpen] = useState(ok);

  return (
    <div className="flex items-center justify-center bg-transparent">
      {/* Trigger Button */}
      {/* <button 
        onClick={() => setIsOpen(true)}
        className="rounded-full h-fit w-full bg-green-600 my-3 px-6 py-3 font-medium text-white shadow-md transition hover:bg-green-500"
      >
        Subscribe Now
      </button> */}

      {/* Pop-up Overlay (Only visible when isOpen is true) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsOpen(false)} // Closes if you click outside the photo box
        >
          {/* Modal Container */}
          <div 
            className="relative max-w-3xl rounded-lg bg-white p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the photo area
          >
            {/* Cancel Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-gray-700 shadow-md transition hover:bg-gray-200"
            >
              ✕
            </button>

            {/* Displayed Image */}
            <img 
              src="https://picsum.photos" 
              alt="Popup Content" 
              className="max-h-[80vh] w-full rounded object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImagePopup;

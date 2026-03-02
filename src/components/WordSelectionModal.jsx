import React from 'react';

const WordSelectionModal = ({ choices, onSelect }) => {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full mx-4 border-4 border-yellow-400">
        <h2 className="text-3xl font-black mb-6 text-blue-600 tracking-tight">PICK A WORD</h2>
        <div className="grid grid-cols-1 gap-4">
          {choices.map((word) => (
            <button
              key={word}
              onClick={() => onSelect(word)}
              className="py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-xl rounded-2xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(202,138,4)]"
            >
              {word}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordSelectionModal;
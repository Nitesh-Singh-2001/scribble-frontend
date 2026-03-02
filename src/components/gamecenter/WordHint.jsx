import React from "react";

const WordHint = ({ word }) => {
  return (
    <div className="text-3xl font-mono tracking-[0.5em] font-bold text-white drop-shadow-md">
      {word}
    </div>
  );
};

export default WordHint;
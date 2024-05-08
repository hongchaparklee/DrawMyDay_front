// MemoryPad.js
import React, { useRef, useState } from 'react';

function MemoryPad() {
  const canvasRef = useRef(null);
  const [color, setColor] = useState('#000000');
  let isPainting = false;

  const startPainting = (e) => {
    isPainting = true;
    draw(e);
  };

  const stopPainting = () => {
    isPainting = false;
  };

  const draw = (e) => {
    if (!isPainting) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const changeColor = (e) => {
    setColor(e.target.value);
  };

  return (
    <div>
      <canvas
        onMouseDown={startPainting}
        onMouseUp={stopPainting}
        onMouseMove={draw}
        onMouseOut={stopPainting}
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000' }}
      />
      <input type="color" onChange={changeColor} value={color} />
    </div>
  );
}

export default MemoryPad;

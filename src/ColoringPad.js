//ColoringPad.js

import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';

const ColoringPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color, setColor] = useState('#000');
  const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  setStateStack([imageData]);

    const handleCanvasTouchStart = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      context.strokeStyle = isEraserModeRef.current ? canvas.style.backgroundColor : color;
      context.lineWidth = penSize;
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
      pathRef.current = [{ x, y }];
    };

    const handleCanvasTouchMove = (e) => {
      if (!isDrawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      context.lineTo(x, y);
      context.stroke();
      pathRef.current = [...pathRef.current, { x, y }];

      e.preventDefault();
    };

    const handleCanvasTouchEnd = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      setStateStack((prev) => [...prev, imageData]);
    };
    
    canvas.addEventListener('touchstart', handleCanvasTouchStart);
    canvas.addEventListener('touchmove', handleCanvasTouchMove);
    canvas.addEventListener('touchend', handleCanvasTouchEnd);
    
    return () => {
      canvas.removeEventListener('touchstart', handleCanvasTouchStart);
      canvas.removeEventListener('touchmove', handleCanvasTouchMove);
      canvas.removeEventListener('touchend', handleCanvasTouchEnd);
    };
    }, [color, isDrawing, penSize]);
    
    const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    };
    
    const toggleEraserMode = () => {
    isEraserModeRef.current = !isEraserModeRef.current;
    setPenSize(isEraserModeRef.current ? 20 : 5);
    };
    
    const handlePenSizeChange = (e) => {
    setPenSize(parseInt(e.target.value, 10));
    };
    
    const handleClearAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    pathRef.current = [];
    };
    
    const handleUndo = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const lastState = stateStack[stateStack.length - 1];
    
    if (lastState) {
      const newStack = stateStack.slice(0, stateStack.length - 1);
      context.putImageData(lastState, 0, 0);
      setStateStack(newStack);
      setRedoStack((prev) => [lastState, ...prev]);
    }
    };
    
    const handleRedo = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const nextState = redoStack[0];
    
    if (nextState) {
      const newStack = redoStack.slice(1);
      setRedoStack(newStack);
      setStateStack((prev) => [...prev, nextState]);
      context.putImageData(nextState, 0, 0);
    }
    };
    

  return (
    <div>
      <SketchPicker color={color} onChange={handleColorChange} />
      <button onClick={toggleEraserMode}>{isEraserModeRef.current ? '펜' : '지우개'}</button>
      <input
        type="range"
        min="1"
        max="20"
        step="1"
        value={penSize}
        onChange={handlePenSizeChange}
      />
      <span>{penSize}</span>
      <button onClick={handleClearAll}>전체 지우기</button>
      <button onClick={handleUndo}>뒤로 가기</button>
      <button onClick={handleRedo}>앞으로 가기</button>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid #000', backgroundColor: 'white' }}
        onTouchMove={(e) => {
          e.preventDefault();
        }}
      />
    </div>
  );
};

export default ColoringPad;
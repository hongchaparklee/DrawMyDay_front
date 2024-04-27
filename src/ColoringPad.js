//ColoringPad.js

import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

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
  
    console.log('Current color:', color);
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

    const predefinedColors = [
      '#FFFFFF', '#FF0000', '#FFA07A', '#FF6347', '#FF4500', 
      '#FFFF00', '#ADFF2F', '#008000', '#00FFFF', 
      '#0000FF', '#00008B', '#800080', '#FFC0CB', '#FF69B4', 
      '#A52A2A', '#A9A9A9', '#808080', '#000000',
    ];
  
    const handleColorClick = (predefinedColor) => {
      let rgbaColor = predefinedColor;
      if (predefinedColor[0] === '#') { 
        const r = parseInt(predefinedColor.slice(1, 3), 16);
        const g = parseInt(predefinedColor.slice(3, 5), 16);
        const b = parseInt(predefinedColor.slice(5, 7), 16);
        rgbaColor = `rgba(${r}, ${g}, ${b}, 0.5)`; // 50% 투명도 적용
      }
      setColor(rgbaColor);
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
  
      // 이미지를 로딩하고 캔버스에 그리는 함수
      const loadImageOnCanvas = (imageFile) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
      
        // 이미지 객체 생성
        const img = new Image();
        img.src = URL.createObjectURL(imageFile);
      
        img.onload = () => {
          // 캔버스와 이미지의 비율을 계산
          const hRatio = canvas.width / img.width;
          const vRatio = canvas.height / img.height;
          const ratio = Math.min(hRatio, vRatio); // 캔버스에 맞게 이미지 비율 유지
          
          // 이미지가 캔버스 중앙에 위치하도록
          const centerShift_x = (canvas.width - img.width * ratio) / 2;
          const centerShift_y = (canvas.height - img.height * ratio) / 2;
      
          context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 클리어
          // 비율에 맞게 이미지 크기 조정 및 중앙에 위치시키기
          context.drawImage(img, 0, 0, img.width, img.height, 
                            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
          // 이미지 테두리 설정하는 곳
          context.strokeStyle = '#000'; //테두리 색상
          context.lineWidth = 1; //테두리 두께
          // 테두리를 그릴 사각형의 시작점과 너비, 높이를 계산하여 테두리 그리기
      context.strokeRect(centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        };
      };
      
      
  // 파일 입력 처리
    const handleFileInput = (e) => {
      const file = e.target.files[0];
      if (file) {
        loadImageOnCanvas(file);
      }
    };
  
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginBottom: '20px' }}>
          {predefinedColors.map((predefinedColor) => (
            <button
              key={predefinedColor}
              style={{
                backgroundColor: predefinedColor,
                width: 30,
                height: 30,
                margin: 2,
                border: color === predefinedColor ? '3px solid black' : '1px solid grey',
                boxSizing: 'border-box'
              }}
              onClick={() => handleColorClick(predefinedColor)}
            />
          ))}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
          <button onClick={toggleEraserMode}>{isEraserModeRef.current ? <FaPencilAlt size="18" /> : <FaEraser size="18" />}</button>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={penSize}
            onChange={handlePenSizeChange}
          />
          <input type="file" accept="image/*" onChange={handleFileInput} />
          <button onClick={handleClearAll}><DeleteIcon /></button>
          <button onClick={handleUndo}><UndoIcon /></button>
          <button onClick={handleRedo}><RedoIcon /></button>
        </div>
        
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: 'white' }}
          onTouchMove={(e) => e.preventDefault()}
        />
      </div>
    );
    
    
};
  
  export default ColoringPad;
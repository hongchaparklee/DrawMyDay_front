//ColoringPad.js

import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; 
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useImage } from './pages/ImageContext';


const ColoringPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color, setColor] = useState('#000');
  const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);
  const { imageUrls, setSelectedImageUrl, selectedImageUrl } = useImage();
  const [imageLoaded, setImageLoaded] = useState(false);

  let navigate = useNavigate();  
  
  const goToCompletePad = () => {
    const isConfirmed = window.confirm("정말 정말 완성하셨습니까?");
  
    if (isConfirmed) {
      const canvas = canvasRef.current;
      const imageDataUrl = canvas.toDataURL("image/png");
      
      navigate('/complete', { state: { imageDataUrl } });
    }
  }

  const handleSelectImage = (url) => {
    setSelectedImageUrl(url);
    setImageLoaded(false); // 이미지 선택 시 로딩 상태 초기화
  };

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
      '#FFFFFF', '#FFFF00', '#FFA07A', '#FF6347', '#FF0000',
      '#FF69B4', '#FFC0CB', '#A52A2A', '#800080', '#00008B', 
      '#0000FF', '#00FFFF', '#008000', '#ADFF2F', '#A9A9A9', '#000000', 
    ];
  
    const handleColorClick = (predefinedColor) => {
      setColor(predefinedColor);
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '800px', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px', padding: '10px', backgroundColor: '#AED9E0', borderRadius: '10px', border: '1px solid #ccc' }}>
            <button onClick={toggleEraserMode}>{isEraserModeRef.current ? <FaPencilAlt size="15" /> : <FaEraser size="15" />}</button>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={penSize}
              onChange={handlePenSizeChange}
            />
            <button onClick={handleClearAll} style={{ margin: '3px' }}><DeleteIcon /></button>
            <button onClick={handleUndo} style={{ margin: '1px' }}><UndoIcon /></button>
            <button onClick={handleRedo} style={{ margin: '1px' }}><RedoIcon /></button>
            <button onClick={goToCompletePad} style={{ margin: '1px' }}>완성</button>
            
            {/* 색상 선택기 컨테이너 */}
            <div style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
              {predefinedColors.map((predefinedColor) => (
                <button
                  key={predefinedColor}
                  style={{
                    backgroundColor: color === predefinedColor ? 'transparent' : predefinedColor,
                    width: 30, 
                    height: 30, 
                    margin: '1px', 
                    border: color === predefinedColor ? `3px solid ${predefinedColor}` : '1px solid grey',
                    borderRadius: '50%',
                    boxSizing: 'border-box',
                  }}
                  onClick={() => handleColorClick(predefinedColor)}
                />
              ))}
            </div>
          </div>
        </div>
        {!imageLoaded && (
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ backgroundColor: 'white' }}
        />
      )}
      
      {selectedImageUrl && (
        <img
          src={selectedImageUrl}
          alt="Selected Drawing"
          style={{
            marginTop: '20px',
            maxWidth: '800px',
            maxHeight: '600px',
            objectFit: 'contain',
            display: imageLoaded ? 'block' : 'none' // 이미지 로딩 상태에 따라 표시 여부 결정
          }}
          onLoad={() => setImageLoaded(true)} // 이미지 로딩 완료 시 로딩 상태 업데이트
        />
      )}
      
      {/* 이미지 선택 시 handleSelectImage 함수 사용 */}
      <div>
      {imageUrls.map((url, index) => (
        <img
          key={index}
          src={`${url}?${new Date().getTime()}`}
          alt={`Uploaded Drawing ${index + 1}`}
          crossOrigin="anonymous"
          onClick={() => handleSelectImage(url)}
          style={{ cursor: 'pointer' }}
        />
      ))}
      </div>
    </div>
  );
};
      
  
  export default ColoringPad;

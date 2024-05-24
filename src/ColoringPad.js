//ColoringPad.js

import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; 
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useImage } from './pages/ImageContext';

const predefinedColors = [
  '#E6E6FA', '#99FF99', '#FFFF00', '#FFFFFF', '#FFE4E1',
  '#FFDAB9', '#FFD700', '#FFC0CB', '#FFB6C1', '#FFA07A',
  '#FF69B4', '#FF6347', '#FF0000', '#FAE7B5', '#FADADD',
  '#F4C2C2', '#CB99C9', '#ADFF2F', '#A9A9A9', '#A52A2A',
  '#8B0000', '#800080', '#582900', '#5D3FD3', '#087830',
  '#00FFFF', '#008000', '#00416A', '#0000FF', '#00008B',
  '#000000'
];

const ColoringPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color, setColor] = useState('#000');
  const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);
  const { imageUrls, selectedImageUrl } = useImage();
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
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // CORS 문제를 방지하기 위해
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true); // 이미지 로드 완료 상태 업데이트
    };
    img.src = url;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.strokeStyle = color;

    const handleCanvasTouchStart = (e) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
    
      context.strokeStyle = isEraserModeRef.current ? canvas.style.backgroundColor : color;
      context.lineWidth = penSize;
      context.beginPath();
      context.moveTo(x, y);
      
      pathRef.current = [{ x, y }];
    };
  
  
    const handleCanvasTouchMove = (e) => {
      if (!isDrawing) return;
    
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
    
      context.lineTo(x, y);
      context.stroke();
      pathRef.current = [...pathRef.current, { x, y }];
    };
    const handleCanvasTouchEnd = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      setStateStack((prev) => [...prev, imageData]);
      setIsDrawing(false);
    };
  
    canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleCanvasTouchEnd);
  
    return () => {
      canvas.removeEventListener('touchstart', handleCanvasTouchStart);
      canvas.removeEventListener('touchmove', handleCanvasTouchMove);
      canvas.removeEventListener('touchend', handleCanvasTouchEnd);
    };
  
  }, [color, isDrawing, penSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const context = canvas.getContext('2d');
    context.strokeStyle = color;
  
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setStateStack([imageData]);
  }, [imageLoaded, color]);
  
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
            <button onClick={goToCompletePad} style={{ margin: '5px', fontFamily: 'KCCMurukmuruk, sans-serif' }}>완성</button>
            
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
        <div>
          <p>이미지 로드 상태: {imageLoaded ? '완료' : '로딩 중...'}</p>
          <p>그리기 상태: {isDrawing ? '그리는 중' : '대기 중'}</p>
        </div>
      
        {selectedImageUrl && (
          <img
            src={selectedImageUrl}
            alt="Selected Drawing"
            onLoad = {() => setImageLoaded(true)}
            style={{
              marginTop: '20px',
              maxWidth: '800px',
              maxHeight: '600px',
              objectFit: 'contain',
              display: imageLoaded ? 'block' : 'none' // 이미지 로딩 상태에 따라 표시 여부 결정
            }}
          />
        )}
  
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
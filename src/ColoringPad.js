//ColoringPad.js

import React, { useState, useRef, useEffect } from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; 
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

  let navigate = useNavigate();
  
  const goToCompletePad = () => {
    const canvas = canvasRef.current;
    // 캔버스의 이미지 데이터를 URL 형식으로 가져옵니다.
    const imageDataUrl = canvas.toDataURL("image/png");
    
    // React Router의 navigate 함수를 사용하여 데이터를 다음 페이지에 상태로 전달합니다.
    navigate('/complete', { state: { imageDataUrl } });
  }
  
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginRight: '20px' }}>
        {predefinedColors.map((predefinedColor) => (
          <button
            key={predefinedColor}
              style={{
                backgroundColor: color === predefinedColor ? 'transparent' : predefinedColor, // 선택된 색상은 배경색 투명
                width: 30, 
                height: 30, 
                margin: 2, 
                border: color === predefinedColor ? `3px solid ${predefinedColor}` : '1px solid grey', // 선택된 색상은 색상 테두리 보임
                borderRadius: '50%', // 여기를 수정하여 버튼을 원형으로 만듭니다
                boxSizing: 'border-box',
              }}
            onClick={() => handleColorClick(predefinedColor)}
          />
        ))}

        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
            <button onClick={goToCompletePad}>☆ 완 성 ☆</button>
          </div>
          
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ backgroundColor: 'white' }}
            onTouchMove={(e) => e.preventDefault()}
          />
        </div>
      </div>
    );
    
    
    
};
  
  export default ColoringPad;
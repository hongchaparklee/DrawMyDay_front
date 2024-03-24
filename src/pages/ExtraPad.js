//ExtraPad.js

import React, { useState, useRef, useEffect, useCallback } from 'react';
//만약 내가 수정함
const ExtraPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color] = useState('#000');
  const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineSpacing] = useState(80);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);

  const invertColors = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data; // 픽셀 데이터 배열
  
      // 모든 픽셀에 대해 색상 반전 처리
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
      }
  
      // 변경된 이미지 데이터를 캔버스에 다시 그림
      ctx.putImageData(imageData, 0, 0);
    }
  };
  
  const saveCanvas = () => {
    invertColors(); // 색상 반전 처리를 먼저 수행하게 함
  
    const canvas = canvasRef.current;
    if (canvas) {
      const imageDataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imageDataUrl;
      link.download = 'canvas-image.png'; // 저장될 파일 이름 지정
      document.body.appendChild(link); // Firefox에서 필요
      link.click();
      document.body.removeChild(link); // Firefox에서 필요
    }
  };
  
  
  

  const drawHorizontalLines = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height); 


    for (let y = 0; y < canvas.height; y += lineSpacing) {
      context.beginPath(); // 새로운 경로 시작
      context.moveTo(0, y);
      context.lineTo(canvas.width, y);
      context.strokeStyle = '#ddd'; // 가로선 색상
      context.stroke();
      context.closePath(); // 경로 닫기
    }
  }, [lineSpacing]);


  useEffect(() => {
    drawHorizontalLines();
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setStateStack([imageData]);

    const initializeDrawingSettings = () => {
        context.strokeStyle = color; // 현재 색상 상태를 사용
        context.lineWidth = penSize; // 현재 선 굵기 상태를 사용
    };

    const handleCanvasTouchStart = (e) => {
        e.preventDefault();
        if (e.pointerType && e.pointerType !== 'pen') {
            return;
          }
        if (!isDrawing) setIsDrawing(true);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top

        
        initializeDrawingSettings();
        context.beginPath();  
        context.moveTo(x, y);
        
        pathRef.current = [{ x, y }];
    };

    const handleCanvasTouchMove = (e) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

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
    }, [color, isDrawing, penSize, drawHorizontalLines]);
    
    const toggleEraserMode = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
      
        if (isEraserModeRef.current) {
          // 지우개 모드 해제: 그림그리게 함
          context.globalCompositeOperation = 'source-over';
        } else {
          // 지우개 모드 활성화: 지우개모드로
          context.globalCompositeOperation = 'destination-out';
          context.lineWidth = 10; // 지우개 크기 조절가능
        }
        isEraserModeRef.current = !isEraserModeRef.current; // 모드 토글
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

    const handleUndo = () => { //뒤로가기 버튼
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (stateStack.length > 1) { // 첫 번째 상태를 제외하고 실행
          const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
          setRedoStack((prev) => [currentState, ...prev]); // 현재 상태를 redoStack에 추가
      
          const lastState = stateStack[stateStack.length - 2]; // 마지막에서 두 번째 상태를 복원
          context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 클리어
          context.putImageData(lastState, 0, 0);
          const newStack = stateStack.slice(0, stateStack.length - 1);
          setStateStack(newStack);
        }
      };
    
      const handleRedo = () => {  //앞으로가기버튼
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (redoStack.length > 0) {
          const nextState = redoStack[0];
          context.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 클리어
          context.putImageData(nextState, 0, 0);
          const newStack = redoStack.slice(1);
          setRedoStack(newStack);
          setStateStack((prev) => [...prev, nextState]);
        }
      };
    
  return (
    <div>
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
      <button onClick={saveCanvas}>확인</button>
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

export default ExtraPad;
//DrawMyDayPad.js

import React, { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import KakaoTalk_20240510_211849584 from '../assets/KakaoTalk_20240510_211849584.png';
import axios from 'axios';
import saveSendIcon from '../assets/DMD-05.png';

const DrawMyDayPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color] = useState('#000');
  const [penSize] = useState(2.5);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const [isEraserMode, setIsEraserMode] = useState(false);
  const navigate = useNavigate();
  const isEraserModeRef = useRef(isEraserMode);
  const [isClearAllActive, setIsClearAllActive] = useState(false);
  const [isUndoActive, setIsUndoActive] = useState(false);
  const [isRedoActive, setIsRedoActive] = useState(false);

  const goToColoringPad = (base64Image) => {
    navigate('/coloring', { state: { image: base64Image } });
  }
 
  const invertColors = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      // 모든 픽셀에 대해 색상 반전 처리
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];       
        data[i + 1] = 255 - data[i + 1]; 
        data[i + 2] = 255 - data[i + 2]; 
      }
      ctx.putImageData(imageData, 0, 0);
    }
  };

  const saveAndSendCanvas = () => {
    invertColors(); 

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.toBlob(blob => {
        const formData = new FormData(); 
        formData.append('file', blob, 'paper.png'); 

        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          formData.append('userInfo', userInfo);
        }

        axios.post('http://3.17.80.177/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log('이미지가 성공적으로 전송되었습니다.', response.data);
          const base64Image = response.data.image;
          goToColoringPad(base64Image);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }, 'image/png');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    setStateStack([imageData]);

    const image = new Image();
    image.onload = function(){
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = KakaoTalk_20240510_211849584;

    const initializeDrawingSettings = () => {
        context.strokeStyle = color; 
        context.lineWidth = penSize; 
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
  }, [color, isDrawing, penSize]);
    
  const activatePenMode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'source-over'; // 그림 그리기 모드
    context.lineWidth = penSize; // 펜 크기
    isEraserModeRef.current = false;
    setIsEraserMode(false);
  };

  const activateEraserMode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'destination-out'; // 지우개 모드
    context.lineWidth = 10; // 지우개 크기
    isEraserModeRef.current = true;
    setIsEraserMode(true);
  };
    
  const handleClearAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    pathRef.current = [];
    setIsClearAllActive(true);
    setTimeout(() => setIsClearAllActive(false), 200);
    
    const image = new Image();
    image.onload = function() {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = KakaoTalk_20240510_211849584;
  };
    

  const handleUndo = () => { //뒤로가기 버튼
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setIsUndoActive(true);
    setTimeout(() => setIsUndoActive(false), 200);
    if (stateStack.length > 1) { 
      const currentState = context.getImageData(0, 0, canvas.width, canvas.height);
      setRedoStack((prev) => [currentState, ...prev]);
      
      const lastState = stateStack[stateStack.length - 2]; 
      context.clearRect(0, 0, canvas.width, canvas.height); 
      context.putImageData(lastState, 0, 0);
      const newStack = stateStack.slice(0, stateStack.length - 1);
      setStateStack(newStack);
    }
  };
    
  const handleRedo = () => { 
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setIsRedoActive(true);
    setTimeout(() => setIsRedoActive(false), 200);

    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(nextState, 0, 0);
      const newStack = redoStack.slice(1);
      setRedoStack(newStack);
      setStateStack((prev) => [...prev, nextState]);
    }
  };

  async function handleSaveSendAndGo() {
    try {
      console.log('이미지 전송을 시작합니다.');
      await saveAndSendCanvas();
      console.log('이미지 전송이 완료되었습니다. 다음 페이지로 이동합니다.');
      goToColoringPad();
    } catch (error) {
      console.error('이미지 전송에 실패했습니다:', error);
    }
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ width: '420px', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '10px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ccc' }}>
        {/* 첫 번째 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', marginLeft: '50px' }}>
          <button
            className={`btn ${!isEraserMode ? 'btn-selected' : ''}`}
            onClick={activatePenMode}
            style={{
              backgroundImage: `url(/assets/DMD-10.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: !isEraserMode ? 1 : 0.5,
              border: 'none'
            }}
          ></button>
          <button
            className={`btn ${isEraserMode ? 'btn-selected' : ''}`}
            onClick={activateEraserMode}
            style={{
              backgroundImage: `url(/assets/DMD-08.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isEraserMode ? 1 : 0.5,
              border: 'none'
            }}
          ></button>
          <button
            className="btn"
            onClick={handleClearAll}
            style={{
              backgroundImage: `url(/assets/DMD-11.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isClearAllActive ? 1 : 0.5,
              border: 'none'
            }}
          ></button>
        </div>
        {/* 두 번째 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', marginRight: '50px' }}>
          <button
            className="btn"
            onClick={handleUndo}
            style={{
              backgroundImage: `url(/assets/DMD-09.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isUndoActive ? 1 : 0.5,
              border: 'none'
            }}
          ></button>
          <button
            className="btn"
            onClick={handleRedo}
            style={{
              backgroundImage: `url(/assets/DMD-12.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isRedoActive ? 1 : 0.5,
              border: 'none'
            }}
          ></button>
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <img
          src={saveSendIcon}
          alt="Save and Send"
          style={{ 
            cursor: 'pointer', 
            position: 'absolute', 
            right: '0', // 오른쪽 끝에 위치
            top: '50%', // Y축 중앙에 위치
            transform: 'translateY(140%)', // Y축 중앙으로 조정
            width: '50px', // 이미지의 너비 조정
            height: 'auto' // 이미지의 높이를 자동으로 조정하여 비율 유지
          }}
          onClick={handleSaveSendAndGo}
        />
      </div>
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

export default DrawMyDayPad;
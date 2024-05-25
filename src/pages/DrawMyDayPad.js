//DrawMyDayPad.js

import React, { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import KakaoTalk_20240510_211849584 from '../assets/KakaoTalk_20240510_211849584.png';
import axios from 'axios';
import { useImage } from './ImageContext';

const DrawMyDayPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color] = useState('#000');
  const [penSize] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);
  const [setSavedImage] = useState('');
  const { setSelectedImageUrl } = useImage(); 

  let navigate = useNavigate();

  const goToColoringPad = () => {
    navigate('/coloring');
  }
 
  const invertColors = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data; // 픽셀 데이터 배열
  
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
          headers : {
            'Content-Type': 'multipart/form-data' 
          }
        })
        .then(response => {
          console.log('이미지가 성공적으로 전송되었습니다.', response.data);
          setSelectedImageUrl(response.data.image_urls); 
          console.log('서버 응답:', response.data.image_urls);
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
    
  const toggleEraserMode = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
      
    if (isEraserModeRef.current) {
      // 지우개 모드 해제: 그림그리게 함
      context.globalCompositeOperation = 'source-over';
    } else
      {
        // 지우개 모드 활성화: 지우개모드로
        context.globalCompositeOperation = 'destination-out';
        context.lineWidth = 10; // 지우개 크기
      }
    isEraserModeRef.current = !isEraserModeRef.current; 
  };
    
  const handleClearAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    pathRef.current = [];
    
    // 배경 이미지를 다시 그림
    const image = new Image();
    image.onload = function() {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = KakaoTalk_20240510_211849584;
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

  const saveImageToState = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imageDataUrl = canvas.toDataURL('image/png'); // 이미지 데이터를 URL로 변환
      setSavedImage(imageDataUrl); // 상태 변수에 저장
      console.log('이미지 저장됨');
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      <div style = {{ width: '800px', display : 'flex', flexDirection : 'row', justifyContent : 'center', gap : '10px', marginBottom : '20px', padding : '10px', backgroundColor : '#AED9E0', borderRadius : '10px', border : '1px solid #ccc'}}>
        <button onClick={toggleEraserMode} style={{ margin: '5px' }}>
          {isEraserModeRef.current ? <FaPencilAlt size="18" /> : <FaEraser size="18" />}
        </button>
        <button onClick={handleClearAll} style={{ margin: '5px' }}><DeleteIcon /></button>
        <button onClick={handleUndo} style={{ margin: '5px' }}><UndoIcon /></button>
        <button onClick={handleRedo} style={{ margin: '5px' }}><RedoIcon /></button>
        <button onClick={saveAndSendCanvas} style={{ margin: '5px' }}>확인</button>
        <button onClick={goToColoringPad} style={{ margin: '5px' }}>다음</button>
        <button onClick={handleSaveSendAndGo} style={{ margin: '5px', fontFamily: 'KCCMurukmuruk, sans-serif'}}>확인 및 다음</button>
        <button onClick={saveImageToState} style={{ margin: '5px' }}>이미지 저장</button> {/* 이미지 저장 함수 호출 */}
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

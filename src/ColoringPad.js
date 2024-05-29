//ColoringPad.js

import React, { useState, useRef, useEffect} from 'react';
import { FaPencilAlt, FaEraser } from 'react-icons/fa';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom'; 
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';

const predefinedColors = [
  '#E6E6FA', '#99FF99', '#FFFF00', '#FFFFFF', '#FFE4E1',
  '#FFDAB9', '#FFD700', '#FFC0CB', '#FFB6C1', '#FFA07A',
  '#FF69B4', '#FF6347', '#FF0000', '#FAE7B5', '#FADADD',
  '#F4C2C2', '#CB99C9', '#ADFF2F', '#A9A9A9', '#A52A2A',
  '#8B0000', '#800080', '#582900', '#5D3FD3', '#087830',
  '#00FFFF', '#008000', '#00416A', '#0000FF', '#00008B',
  '#000000'
];

const messages = [
  'Tip : 일기를 쓸 때는 솔직하게 적어봐요',
  'Tip : 횡단보도를 건널 때는 손을 들고 건너요',
  'Tip : 엄마 말을 잘 들으면 좋은 일이 생길지도?',
  'Tip : 아빠에게 마사지를 해주면 좋은 일이 생길지도?',
  'Tip : 비가 올 때는 우산을 써요',
  'TMI) 인간에게 가장 가까운 동물은 침팬지가 아니라 고릴라다',
  'Quiz) 코끼리는 점프를 할 수 있을까?',
  'TMI) 새우의 심장은 머리에 있다',
  'Tip : 나갔다 들어오면 꼭! 손을 씻어요',
  'Tip : 자기 전에 화장실을 갔다가 잠을 자요',
  'Tip : 모르는 사람이 까까 사준다고 해도 따라가지 말아요',
  'Quiz) 어린왕자가 먼저 만나는 캐릭터는 누구인가요?',
  'Tip : 양치랑 세수 할 때는 물을 끄고 해요',
  'Tip : 야생의 동물들은 함부로 만지지 않아요',
  'Tip : 기침이나 재채기를 할 떄는 손으로 입을 막아요',
  ];

const RandomMessage = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 메시지를 변경하는 곳
    const changeMessage = () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    };

    // 컴포넌트 마운트 시 초기 메시지 설정
    changeMessage();

    // 대충 4~5초
    const intervalId = setInterval(changeMessage, 4000 + Math.random() * 1000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  return (
    <p style={{ fontSize: '18px', fontFamily: 'KCCMurukmuruk, sans-serif' }}>{message}</p>
  );
};

const ColoringPad = () => {
  const [stateStack, setStateStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [color, setColor] = useState('#000');
  const [penSize, setPenSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false); 
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const pathRef = useRef([]);
  const isEraserModeRef = useRef(false);
  const [imageLoaded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const location = useLocation();
  const { image } = location.state || {};

  let navigate = useNavigate();  
  
  const goToCompletePad = () => {
    const isConfirmed = window.confirm("정말 정말 완성하셨습니까?");
  
    if (isConfirmed) {
      const canvas = canvasRef.current;
      const imageDataUrl = canvas.toDataURL("image/png", 0.1);
      
      navigate('/complete', { state: { imageDataUrl } });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    const localImg = new Image();
    localImg.src = '/assets/sketch.png';
    localImg.onload = () => {
      context.drawImage(localImg, 0, 0, canvas.width, canvas.height);

      if (image) {
        const serverImg = new Image();
        serverImg.src = `data:image/png;base64,${image}`;
        serverImg.onload = () => {
          const imgWidth = canvas.width * 0.9;
          const imgHeight = canvas.height * 0.9;
          const imgX = (canvas.width - imgWidth) / 2;
          const imgY = (canvas.height - imgHeight) / 2;
  
          context.drawImage(serverImg, imgX, imgY, imgWidth, imgHeight);
          setModalIsOpen(false);
        };
      }
    };
  }, [image]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    const alpha = 0.01;
    const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha})`; 

    const handleCanvasTouchStart = (e) => {
      setIsDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;
    
      context.strokeStyle = isEraserModeRef.current ? canvas.style.backgroundColor : rgbaColor;
      context.lineWidth = penSize * 2.5;
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
    if (!imageLoaded) return;

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
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', width: '800px',  gap: '10px', padding: '10px', backgroundColor: '#AED9E0', borderRadius: '10px', border: '1px solid #ccc'}}>
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
      <div>
        <canvas ref={canvasRef} width={800} height={600} />
        <Modal
          isOpen={modalIsOpen}
          contentLabel="로딩 중"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              border: 'none',
            },
          }}
        >
        <img src="/assets/loadingimage.jpg" alt="Loading..." style={{ borderRadius: '10px' }} />
        <p style={{ fontSize: '38px', fontFamily: 'KCCMurukmuruk, sans-serif'  }}>이미지를 그리고 있어요~</p>
        <RandomMessage/>
        </Modal>
      </div>
    </div>
  );
};
      
export default ColoringPad;
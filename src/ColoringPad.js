//ColoringPad.js

import React, { useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom'; 
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import nextIcon from './assets/DMD-05.png';
import previousIcon from './assets/DMD-06.png';
import axios from 'axios';

const predefinedColors = [
  '#000000', '#FFFFFF', '#FFFAF0', '#F8F8FF', '#DCDCDC', 
  '#FFFACD', '#FAFAD2', '#FFE4B5', '#FFDEAD', '#FFDAB9', 
  '#FFEB3B', '#FFD700', '#FFA500', '#FF8C00', '#FF4500', 
  '#FF0000', '#DC143C', '#FF69B4', '#FF1493', '#C71585', 
  '#DB7093', '#DDA0DD', '#EE82EE', '#DA70D6', '#BA55D3', 
  '#9932CC', '#9400D3', '#8A2BE2', '#8B008B', '#800080', 
  '#4B0082', '#6A5ACD', '#483D8B', '#0000FF', '#0000CD', 
  '#00008B', '#000080', '#191970', '#1E90FF', '#00BFFF', 
  '#87CEEB', '#00FFFF', '#40E0D0', '#20B2AA', '#008B8B', 
  '#008080', '#3CB371', '#2E8B57', '#556B2F', '#6B8E23', 
  '#808000', '#ADFF2F', '#7FFF00', '#006400', '#008000',
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
    const changeMessage = () => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setMessage(messages[randomIndex]);
    };
    changeMessage();
    // 대충 6~7초
    const intervalId = setInterval(changeMessage, 6000 + Math.random() * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <p style={{ fontSize: '18px', fontFamily: 'UhBeeSehyun, sans-serif', color: '#ec7499' }}>{message}</p>
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
  const [isClearAllActive, setIsClearAllActive] = useState(false);
  const [isUndoActive, setIsUndoActive] = useState(false);
  const [isRedoActive, setIsRedoActive] = useState(false);

  let navigate = useNavigate();  
  
  const goToCompletePad = () => {
    const isConfirmed = window.confirm("정말 정말 완성하셨습니까?");
  
    if (isConfirmed) {
      const canvas = canvasRef.current;
      const imageDataUrl = canvas.toDataURL("image/png", 0.007);
      
      navigate('/complete', { state: { imageDataUrl } });
    }
  }

  const goToDrawMyDayPage = () => {
    navigate('/drawmyday');
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
          const imgY = (canvas.height - imgHeight) / 2 + 20;
  
          context.drawImage(serverImg, imgX, imgY, imgWidth, imgHeight);
          setModalIsOpen(false);
        };
      } 
      // else { 
      //   setModalIsOpen(false);
      // }
    };
  }, [image]);

  const resendImage = () => {
    const savedImage = localStorage.getItem('savedImage');
    if (savedImage) {
      const base64Response = savedImage.split(',')[1];
      
      const blob = base64ToBlob(base64Response, 'image/png');
  
      console.log('Blob 생성됨:', blob.size, blob.type); 
      const formData = new FormData();
      formData.append('file', blob, 'paper.png');
  
      setModalIsOpen(true);
  
      axios.post('http://3.17.80.177/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        console.log('이미지가 성공적으로 재전송되었습니다.', response.data);
        const base64Image = response.data.image;
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        contextRef.current = context;
  
        const localImg = new Image();
        localImg.src = '/assets/sketch.png';
        localImg.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height); 
          context.drawImage(localImg, 0, 0, canvas.width, canvas.height); 
  
          // 서버에서 받은 이미지를 그리기
          const img = new Image();
          img.src = `data:image/png;base64,${base64Image}`;
          img.onload = () => {
            const imgWidth = canvas.width * 0.9;
            const imgHeight = canvas.height * 0.9;
            const imgX = (canvas.width - imgWidth) / 2;
            const imgY = (canvas.height - imgHeight) / 2 + 20;

            context.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            setModalIsOpen(false);
          };
        };
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  };
  
  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
  

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

const handlePen = () => {
  isEraserModeRef.current = false;
  setPenSize(5); 
};

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
    
  const handlePenSizeChange = (e) => {
    setPenSize(parseInt(e.target.value, 10));
  };
    
  const handleClearAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    pathRef.current = [];
    setIsClearAllActive(true);
    setTimeout(() => setIsClearAllActive(false), 200);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const lastState = stateStack[stateStack.length - 1];
    setIsUndoActive(true);
    setTimeout(() => setIsUndoActive(false), 200);

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
    setIsRedoActive(true);
    setTimeout(() => setIsRedoActive(false), 200);
      
    if (nextState) {
      const newStack = redoStack.slice(1);
      setRedoStack(newStack);
      setStateStack((prev) => [...prev, nextState]);
      context.putImageData(nextState, 0, 0);
    } 
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', width: '1000px',  gap: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ccc'}}>
        {/* 첫 번째 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginLeft: '1px', marginRight: '10px' }}>
          <button onClick={handlePen} 
          style = {{
            backgroundImage: `url(/assets/bt_brush_on.png)`,
            backgroundSize: 'cover',
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border : 'none',
          }}>
          </button>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={penSize}
            onChange={handlePenSizeChange}
          />
          <button onClick={handleClearAll} 
            style={{ 
              backgroundImage: `url(/assets/bt_trash.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isClearAllActive ? 1 : 0.5,
              border: 'none',
              margin: '3px', 
            }}> 
          </button>
        </div>
        {/* 두 번째 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginLeft: '60px', marginRight: '60px' }}>
          <button 
            onClick={handleUndo} 
            style={{ 
              backgroundImage: `url(/assets/bt_back_on.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isUndoActive ? 1 : 0.5,
              border : 'none',
              margin: '3px', 
            }}>
          </button>
          <button 
            onClick={handleRedo} 
            style={{
              backgroundImage: `url(/assets/bt_fw_on.png)`,
              backgroundSize: 'cover',
              width: '30px',
              height: '30px',
              backgroundColor: 'transparent',
              opacity: isRedoActive ? 1 : 0.5,
              border: 'none',
              margin: '3px', 
            }}>
          </button>
        </div>
        <div style={{ overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap', maxWidth: '400px', marginLeft: '15px', marginRight: '1px', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {predefinedColors.map((predefinedColor) => (
            <button
              key={predefinedColor}
              style={{
                backgroundColor: color === predefinedColor ? 'transparent' : predefinedColor,
                width: 29, 
                height: 29, 
                margin: '2px', 
                border: color === predefinedColor ? `2px solid ${predefinedColor}, 2px solid black` : '2px solid grey',
                borderRadius: '50%',
                boxSizing: 'border-box',
                outline: color === predefinedColor ? `2px solid ${predefinedColor}` : 'none'
              }}
              onClick={() => handleColorClick(predefinedColor)}
            />
          ))}
        </div>
      </div>
      <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <img
          src={previousIcon}
          alt="Go to Draw My Day Page"
          style={{ 
            cursor: 'pointer', 
            position: 'absolute', 
            left: '0', 
            top: '50%', 
            transform: 'translateY(140%)', 
            width: '50px', 
            height: 'auto', 
          }}
          onClick={goToDrawMyDayPage}
        />
        <img
          src={nextIcon}
          alt="Go to Complete"
          style={{ 
            cursor: 'pointer', 
            position: 'absolute', 
            right: '0', 
            top: '50%', 
            transform: 'translateY(140%)', 
            width: '50px', 
            height: 'auto' 
          }}
          onClick={goToCompletePad}
        />
      </div>
      <div>
        <canvas ref={canvasRef} width={800} height={600} />
        <button onClick={resendImage} style={{ position: 'absolute', right: '120px', bottom : '30px', border: 'none', background: 'none', padding: 0 }}>
          <img src={process.env.PUBLIC_URL + '/assets/reload.png'} alt="이미지 재전송" style={{ width: '45px', height: '45px' }} />
        </button>
        <Modal
          isOpen={modalIsOpen}
          contentLabel="로딩 중"
          style={{
            overlay : {
              backgroundColor : '#FEEFE1',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              border: 'none',
              backgroundColor: '#FEEFE1',
              width : '60%',
              height : '70%',
              overflow: 'hidden',
            },
          }}
        >
        <img src="/assets/jeoungB.gif" alt="Loading..." style={{  maxWidth: '300px', maxHeight: '300px', borderRadius: '10px' }} />
        <p style={{ fontSize: '38px', fontFamily: 'UhBeeSehyun, sans-serif', }}>이미지를 그리고 있어요~</p>
        <RandomMessage/>
        </Modal>
      </div>
    </div>
  );
};
      
export default ColoringPad;
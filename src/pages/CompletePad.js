import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 

const CompletePad = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { imageDataUrl } = location.state;
    const [additionalImageDataUrl, setAdditionalImageDataUrl] = useState('');
    const [fetchedString, setFetchedString] = useState('');

    const headingStyle = {
        fontSize: '34px',
        marginTop: '1px',
        marginBottom: '10px',
        color : '#6b8731',
        fontFamily: 'UhBeeSehyun, sans-serif',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '0px',
        padding: '20px',
        overflowY: 'auto',
        height: '100vh',
        width: '100%'
    };

    const cuteButtonStyle = {
        border: 'none',
        width : '55px',
        height : '55px',
        color: 'white',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '12px', 
        marginTop: '1px',
        marginBottom: '1px',
    };

    const buttonWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%', 
        maxWidth: '400px',
        marginTop: '10px',
    };

    const addSpacesEveryNineCharacters = (str) => {
        // 연속된 공백을 하나의 공백으로 변환
        str = str.replace(/\s+/g, ' ');
        const words = str.split(' '); // 단어 단위로 분리
        let currentLine = '';
        let result = '';
      
        words.forEach(word => {
          if ((currentLine + word).length < 16) {
            // 현재 줄에 단어를 추가할 수 있으면 추가
            currentLine += (currentLine.length > 0 ? ' ' : '') + word;
          } else if (word.length > 16) {
            // 단어 자체가 16자를 초과하는 경우
            if (currentLine.length > 0) {
              result += currentLine + '\n'; // 현재 줄을 결과에 추가하고 줄바꿈
              currentLine = ''; // 현재 줄 초기화
            }
            // 긴 단어를 적절히 분할
            while (word.length > 15) {
              result += word.substring(0, 9) + '\n'; // 9자리까지 잘라서 결과에 추가
              word = word.substring(9); // 남은 단어 업데이트
            }
            currentLine = word; // 남은 단어를 현재 줄에 설정
          } else {
            // 현재 줄이 꽉 찼으면 결과에 추가하고 새 줄 시작
            if (currentLine.length > 0) {
              result += currentLine + '\n';
            }
            currentLine = word;
          }
        });
      
        if (currentLine.length > 0) {
          result += currentLine; // 남은 내용 추가
        }
      
        return result;
      };
      
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        const imageUrl = 'http://3.17.80.177/text';
        fetch(imageUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
                    setFetchedString(data[0]);
                } else if (data.image) {
                    setAdditionalImageDataUrl(data.image);
                } else {
                    throw new Error('Unexpected response format');
                }
            })
            .catch((error) => console.error('Error:', error));
    };
    
    const saveToMemory = () => {
        const memories = JSON.parse(localStorage.getItem('memories')) || [];
        const formattedString = addSpacesEveryNineCharacters(fetchedString);

        const newMemory = {
            date: new Date().toLocaleDateString('ko-KR'),
            images: [imageDataUrl, additionalImageDataUrl].filter(url => url !== ''),
            text: formattedString,
        };
        
        memories.push(newMemory);
        localStorage.setItem('memories', JSON.stringify(memories));
        alert('저장되었습니다!');
        navigate('/Memory');
    };

    const navigateToMainPage = () => navigate('/');
    const navigateToMemoryPad = () => navigate('/Memory'); 

    return (
        <div style={containerStyle}>
            <h1 className="main-heading" style={headingStyle}>오늘의 일기</h1>
            <img src={imageDataUrl} alt="Colored pad" style={{ width: '750px', objectFit: 'contain', marginBottom: '0px' }} />
            {additionalImageDataUrl && <img src={additionalImageDataUrl} alt="Additional pad"  style={{ width: '750px', objectFit: 'contain' }} />}
            {fetchedString && (
                <div style={{
                    padding: '0px',
                    marginTop: '0px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '8px',
                    width: '750px',
                    height: '200px',
                    position: 'relative', // 컨테이너에 상대적 위치 설정
                    }}>
                    <img 
                    src="/assets/oharida.png" 
                    alt="oharida" 
                    style={{
                        width: '750px',  
                        maxHeight: '100%',
                        display: 'block',  
                        marginLeft: 'auto',  
                        marginRight: 'auto'
                    }} 
                    />
                    <div style={{
                        position: 'absolute',
                        top: '50%', // 컨테이너의 중간 위치
                        left: '50%', // 컨테이너의 중간 위치
                        transform: 'translate(-50%, -50%)', // 중앙 정렬
                        width: '100%', // 텍스트 너비를 컨테이너 너비와 맞춤
                        textAlign: 'center',
                    }}>
                    <p style={{
                        fontFamily: 'KCCMurukmuruk',
                        fontSize: '31px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        color: 'black', // 텍스트 색상은 이미지에 따라 조정
                    }}>
                        {addSpacesEveryNineCharacters(fetchedString)}
                    </p>
                    </div>
                </div>
            )}

            <div style={{...buttonWrapperStyle, display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-25.png`} 
                        alt="Main Page" 
                        style={cuteButtonStyle} 
                        onClick={navigateToMainPage} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'UhBeeSehyun, sans-serif'}}>메인으로</div>
                </div>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-26.png`} 
                        alt="Save" 
                        style={cuteButtonStyle} 
                        onClick={saveToMemory} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'UhBeeSehyun, sans-serif' }}>추억저장</div>
                </div>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-27.png`} 
                        alt="Memory Pad" 
                        style={cuteButtonStyle} 
                        onClick={navigateToMemoryPad} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'UhBeeSehyun, sans-serif' }}>추억 속으로</div>
                </div>
            </div>
        </div>
    );    
}
  
export default CompletePad;

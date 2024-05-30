//CompletedPad.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 

const CompletePad = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { imageDataUrl } = location.state;
    const [additionalImageDataUrl, setAdditionalImageDataUrl] = useState('');

    const headingStyle = {
        fontSize: '34px',
        marginTop: '1px',
        marginBottom: '10px',
        color : '#6b8731',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '1px',
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

    useEffect(() => {
        const imageUrl = '@@@@@@@서버 이미지 주소@@@@@@@';
        fetch(imageUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // JSON인지 Blob인지 판별
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return response.blob(); 
                }
            })
            .then((data) => {
                if (data instanceof Blob) {
                    // Blob 데이터를 처리
                    const imageObjectURL = URL.createObjectURL(data);
                    setAdditionalImageDataUrl(imageObjectURL);
                } else if (data.image) {
                    // JSON 데이터를 처리
                    setAdditionalImageDataUrl(data.image);
                } else {
                    throw new Error('Unexpected response format');
                }
            })
            .catch((error) => console.error('Error:', error));
    }, []);
    
    const saveToMemory = () => {
        const memories = JSON.parse(localStorage.getItem('memories')) || [];
        const newMemory = {
            date: new Date().toLocaleDateString('ko-KR'),
            images: [imageDataUrl, additionalImageDataUrl].filter(url => url !== '')
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
            <img src={imageDataUrl} alt="Colored pad" style={{ marginBottom: '5px' }} />
            {additionalImageDataUrl && <img src={additionalImageDataUrl} alt="Additional pad" />}
            <div style={{...buttonWrapperStyle, display: 'flex', justifyContent: 'center', gap: '20px'}}>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-25.png`} 
                        alt="Main Page" 
                        style={cuteButtonStyle} 
                        onClick={navigateToMainPage} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'KCCMurukmuruk, sans-serif'}}>메인으로</div>
                </div>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-26.png`} 
                        alt="Save" 
                        style={cuteButtonStyle} 
                        onClick={saveToMemory} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'KCCMurukmuruk, sans-serif' }}>추억저장</div>
                </div>
                <div style = {{ textAlign : 'center '}}>
                    <img 
                        src={`${process.env.PUBLIC_URL}/assets/DMD-27.png`} 
                        alt="Memory Pad" 
                        style={cuteButtonStyle} 
                        onClick={navigateToMemoryPad} 
                    />
                    <div style={{ fontSize: '14px', fontFamily: 'KCCMurukmuruk, sans-serif' }}>추억 속으로</div>
                </div>
            </div>
        </div>
    );    
}
  
export default CompletePad;
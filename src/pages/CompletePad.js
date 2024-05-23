//CompletedPad.js

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 

const CompletePad = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    const { imageDataUrl } = location.state;
    const [additionalImageDataUrl, setAdditionalImageDataUrl] = useState('');

    const headingStyle = {
        fontSize: '48px',
        marginBottom: '6px',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px',
        overflowY: 'auto',
        height: '100vh',
        width: '100%'
    };

    const cuteButtonStyle = {
        backgroundColor: '#FFC0CB', // 연핑크색
        border: 'none',
        color: 'white',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '12px', 
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // 그림자 효과
        fontFamily: 'KCCMurukmuruk, sans-serif',
    };

    const smallButtonStyle = {
        ...cuteButtonStyle,
        padding: '6px 12px', 
        fontSize: '14px',
        fontFamily: 'KCCMurukmuruk, sans-serif',
    };

    const buttonWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%', 
        maxWidth: '400px',
        marginTop: '20px',
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
                    return response.json(); // JSON 응답 처리
                } else {
                    return response.blob(); // Blob 응답 처리
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
    };

    const navigateToMainPage = () => navigate('/');
    const navigateToMemoryPad = () => navigate('/Memory'); 

    return (
        <div style={containerStyle}>
            <h1 className="main-heading" style={headingStyle}>오늘의 일기</h1>
            <img src={imageDataUrl} alt="Colored pad" style={{ marginBottom: '20px' }} />
            {additionalImageDataUrl && <img src={additionalImageDataUrl} alt="Additional pad" />}
            <button style={cuteButtonStyle} onClick={saveToMemory}>내 추억으로 저장하기</button>
            <div style={buttonWrapperStyle}>
                <button style={smallButtonStyle} onClick={navigateToMainPage}>메인 페이지로</button>
                <button style={smallButtonStyle} onClick={navigateToMemoryPad}>추억 속으로</button>
            </div>
        </div>
    );
}
  
export default CompletePad;
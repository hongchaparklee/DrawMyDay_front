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
    };

    const smallButtonStyle = {
        ...cuteButtonStyle,
        padding: '6px 12px', 
        fontSize: '14px', 
    };

    const buttonWrapperStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%', 
        maxWidth: '400px',
        marginTop: '20px', 
    };

    useEffect(() => {
        const imageUrl = '주소주소주소';
        fetch(imageUrl)
            .then((response) => response.json())
            .then((data) => {
                setAdditionalImageDataUrl(data.image); 
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

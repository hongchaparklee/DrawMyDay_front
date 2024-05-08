import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const CompletePad = () => {
    const location = useLocation();
    const { imageDataUrl } = location.state;
    const [additionalImageDataUrl, setAdditionalImageDataUrl] = useState('');

    const headingStyle = {
        fontSize: '48px',
        marginBottom: '6px',
    };

    useEffect(() => {
        const imageUrl = '주소주소주소';
        fetch(imageUrl)
            .then((response) => response.json())
            .then((data) => {
                setAdditionalImageDataUrl(data.image); //서버 응답에 따라 조절
            })
            .catch((error) => console.error('Error:', error));
    }, []);

    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'
        }}>
            <h1 className="main-heading" style={headingStyle}>오늘의 일기</h1>
            <img src={imageDataUrl} alt="Colored pad" style={{ marginBottom: '20px' }} /> {/* 이전 페이지에서 받은 이미지 */}
            {additionalImageDataUrl && <img src={additionalImageDataUrl} alt="Additional pad" />} {/* 서버에서 받은 추가 이미지 */}
        </div>
    );
}
  
export default CompletePad;

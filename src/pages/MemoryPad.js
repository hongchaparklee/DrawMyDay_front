import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MemoryPad = () => {
    const [memories, setMemories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadedMemories = JSON.parse(localStorage.getItem('memories')) || [];
        setMemories(loadedMemories);
        setCurrentIndex(loadedMemories.length - 1);
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < memories.length - 1 ? prevIndex + 1 : prevIndex));
    };

    const navigateToMainPage = () => navigate('/');

    const mainPageButtonStyle = {
        cursor: 'pointer',
        position: 'absolute',
        width : '42px',
        height : '42px',
        top: '0',
        right: '400px',
        margin: '10px',
    };

    const dateDisplayStyle = {
        position: 'absolute',
        right: '10px',
        bottom: '10px',
        fontFamily: 'KCCMurukmuruk',
        fontSize: '15px',
        backgroundColor: 'transparent',
        padding: '5px',
        marginRight : '20px',
    };

    const iconButtonStyle = {
        cursor: 'pointer',
        width: '3vw',
        height: 'auto',
        objectFit : 'contain',
    };

    const buttonStyle = {
        border: 'none',
        padding: '0',
        background: 'transparent',
    };
    
    return (
        <div style={{ textAlign: 'center', position: 'relative', marginTop: '80px' }}>
            <h1 style={{fontSize: '20px', fontFamily: 'KCCMurukmuruk', position: 'absolute', top: '0', left: '410px', margin: '10px' }}>내 추억 보기</h1>
            <img 
                src={`${process.env.PUBLIC_URL}/assets/home.png`} 
                alt="메인 페이지로" 
                style={mainPageButtonStyle} 
                onClick={navigateToMainPage} 
            />
            {memories.length > 0 && (
                <div style={{ position: 'relative', display: 'inline-block', marginTop: '60px' }}>
                    <button onClick={handlePrev} style={{ ...buttonStyle, position: 'absolute', left: '-27px', top: '50%', transform: 'translateY(-50%)' }}>
                        <img src={`${process.env.PUBLIC_URL}/assets/prevv.png`} alt="Previous" style={iconButtonStyle} />
                    </button>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        {memories[currentIndex].images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`memory-${index}`} 
                                style={{ maxWidth: '400px', maxHeight: '400px', margin: '0 10px', position: 'relative' }}
                            />
                        ))}
                        <div style={dateDisplayStyle}>
                            {memories[currentIndex].date}
                        </div>
                    </div>
                    <button onClick={handleNext} style={{ ...buttonStyle, position: 'absolute', right: '-27px', top: '50%', transform: 'translateY(-50%)' }}> {/* 변경사항 적용 */}
                        <img src={`${process.env.PUBLIC_URL}/assets/nextt.png`} alt="Next" style={iconButtonStyle} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default MemoryPad;

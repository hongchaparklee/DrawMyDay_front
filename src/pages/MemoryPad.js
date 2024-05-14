//MemoryPad.js
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

    const buttonStyle = {
        backgroundColor: '#FFC0CB',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '20px'
    };

    const mainPageButtonStyle = {
        ...buttonStyle,
        margin: '10px auto',
        display: 'block' 
    };

    const dateDisplayStyle = {
        position: 'absolute',
        right: 0,
        top: '-30px',
        fontFamily: 'KCCMurukmuruk',
        fontSize: '20px',
        backgroundColor: '#F8F5EA',
        padding: '5px'
    };

    return (
        <div style={{ textAlign: 'center', position: 'relative', marginTop: '20px' }}>
            <h1 style={{ fontFamily: 'KCCMurukmuruk' }}>내 추억 보기</h1>
            {memories.length > 0 && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <div style={dateDisplayStyle}>
                        {memories[currentIndex].date}
                    </div>
                    <button onClick={handlePrev} style={{ ...buttonStyle, position: 'absolute', top: '50%', left: '-50px', transform: 'translateY(-50%)' }}>◁</button>
                    <div>
                        {memories[currentIndex].images.map((image, index) => (
                            <img key={index} src={image} alt={`memory-${index}`} style={{ width: '400px', height: '400px', margin: '0 10px' }}/>
                        ))}
                    </div>
                    <button onClick={handleNext} style={{ ...buttonStyle, position: 'absolute', top: '50%', right: '-50px', transform: 'translateY(-50%)' }}>▷</button>
                    <button onClick={navigateToMainPage} style={mainPageButtonStyle}>메인 페이지로</button>
                </div>
            )}
        </div>
    );
}

export default MemoryPad;

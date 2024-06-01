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
        bottom: '115px',
        fontFamily: 'UhBeeSehyun',
        fontSize: '13px',
        backgroundColor: 'white',
        padding: '0px',
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

    const currentMemory = memories[currentIndex] || { images: [], text: '' };

    // const clearMemories = () => {
    //     localStorage.removeItem('memories'); // 'memories' 키로 저장된 데이터 삭제
    //     setMemories([]); // 애플리케이션 상태를 빈 배열로 설정하여 UI 업데이트
    //     setCurrentIndex(0); // 현재 인덱스를 0으로 리셋
    //     alert('모든 추억이 삭제되었습니다.'); // 사용자에게 알림
    // };
    
    return (
        <div style={{ textAlign: 'center', position: 'relative', marginTop: '60px' }}>
            <h1 style={{ fontSize: '20px', fontFamily: 'UhBeeSehyun', position: 'absolute', top: '0', left: '410px', margin: '10px' }}>내 추억 보기</h1>
            <img 
                src={`${process.env.PUBLIC_URL}/assets/home.png`} 
                alt="메인 페이지로" 
                style={mainPageButtonStyle} 
                onClick={navigateToMainPage} 
            />
            <div style={{ display: 'inline-block', textAlign: 'center', Width: '750px' }}>
                {currentMemory.images.map((image, index) => (
                    <img 
                        key={index} 
                        src={image} 
                        alt={`memory-${index}`} 
                        style={{ maxWidth: '400px', maxHeight:'400px', height: 'auto', margin: '0 10px', position: 'relative', marginBottom : '0px', marginTop : '68px', display : 'block', marginLeft: 'auto', marginRight: 'auto',}}
                    />
                ))}
                <div style={{...dateDisplayStyle , position: 'absolute', top: '345px', right: '374px'}}>
                    {memories[currentIndex]?.date}
                </div>

                <div style={{ padding: '0px', marginTop: '-29px', backgroundColor: '#f0f0f0', borderRadius: '8px', width: '400px', height: 'auto',  marginLeft: 'auto', marginRight: 'auto', }}>
                    <p style={{
                        fontFamily: 'Pretendard-Medium',
                        fontSize: '25px',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.7',
                        textAlign: 'center',
                    }}>
                        {currentMemory.text}
                    </p>
                </div>      
            </div>
            <button onClick={handlePrev} style={{ ...buttonStyle, position: 'absolute', left: '354px', top: '50%', transform: 'translateY(-50%)' }}>
                <img src={`${process.env.PUBLIC_URL}/assets/prevv.png`} alt="Previous" style={iconButtonStyle} />
            </button>
            <button onClick={handleNext} style={{ ...buttonStyle, position: 'absolute', right: '354px', top: '50%', transform: 'translateY(-50%)' }}> {/* 변경사항 적용 */}
                <img src={`${process.env.PUBLIC_URL}/assets/nextt.png`} alt="Next" style={iconButtonStyle} />
            </button>

            {/* <button onClick={clearMemories} style={{ margin: '20px', padding: '10px', cursor: 'pointer' }}>
                모든 추억 삭제
            </button> */}

        </div>
    );
}

export default MemoryPad;

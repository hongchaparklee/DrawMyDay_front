//CompletePad.js

import React from 'react';
import { useLocation } from 'react-router-dom';

const CompletePad = () => {
    const location = useLocation();
    const { imageDataUrl } = location.state;

    const headingStyle = {
        fontSize: '48px',
        marginBottom: '6px',
      };

    return (
        <div style={{ 
            display: 'flex',
            flexDirection: 'column', // 자식 요소들을 수직 방향으로 배열
            justifyContent: 'center', // 중앙 정렬
            alignItems: 'center', // 가로축 기준으로 중앙 정렬
            height: '100vh' // 뷰포트 높이를 100%로 설정하여 전체 화면에서 중앙 정렬되도록 함
        }}>
            {/* 제목 추가 */}
            <h1 className="main-heading" style = {headingStyle}>오늘의 일기</h1>
            {/* 받아온 이미지 데이터 URL을 이용하여 이미지를 표시합니다. */}
            <img src={imageDataUrl} alt="Colored pad" />
        </div>
    );
}
  
export default CompletePad;

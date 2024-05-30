// MainPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import drawImage from 'C:/Users/jinhy/OneDrive/Taro/DrawMyDay_front/src/assets/draw.png';
import userImage from 'C:/Users/jinhy/OneDrive/Taro/DrawMyDay_front/src/assets/user.png';
import memoryImage from 'C:/Users/jinhy/OneDrive/Taro/DrawMyDay_front/src/assets/memory.png';
import titleImage from 'C:/Users/jinhy/OneDrive/Taro/DrawMyDay_front/src/assets/title.png';
import rocketImage from 'C:/Users/jinhy/OneDrive/Taro/DrawMyDay_front/src/assets/rocket.png';

const LinkItem = ({ to, children, icon: Icon, image, imageSize = '24px', fontSize = '16px' }) => {
  return (
    <Link to={to} className="link-item" style={{
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
    }}>
      {image ? (
        <img src={image} alt="Link Icon" style={{ width: imageSize, height: imageSize, marginBottom: '5px' }} />
      ) : (
        <Icon className="icon-style" style={{ color: '#004265', marginBottom: '8px' }} />
      )}
      <span style={{ fontFamily: 'UhBeeSeHyun', textAlign: 'center', display: 'block', fontSize, color: '#004265' }}>{children}</span>
    </Link>
  );
};

const MainPage = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  };

  const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44%', // 박스의 너비
    height: '160px', // 박스의 높이
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // 박스의 배경색 및 투명도
    marginTop: '15px', // 박스의 상단 여백
    marginBottom: '30px', // 박스의 하단 여백 추가
    borderRadius: '10px', // 모서리 둥굴기
    textAlign : 'center',
    fontFamily: 'Pretendard-Medium',
    color: '#004265',
    position : 'relative',
    overflow : 'visible',
  };

  const imageStyle = {
    position: 'absolute', 
    bottom: '-40px', // 아래쪽으로부터 10px
    left: '-60px', // 왼쪽으로부터 10px
    width: '73px', // 이미지 너비
    height: '60px', // 이미지 높이
  };

  return (
    <div style={containerStyle} className="main-container my-page">
      <img src={titleImage} alt="Title" style={{ width: '450px', height: 'auto', marginTop: '14px' }} />
      <div style={boxStyle}> 
        <img src={rocketImage} alt="Rocket Icon" style={imageStyle} />
        Draw My Day로 오늘의 하루를 그려보아요!<br/>
        일기를 쓰면 일기가 그림으로 변해요!<br/>
        <br/>
        그림을 색칠하며 나만의 일기를 완성해요!<br/>
        하루하루의 이야기를 재미있게 기록해 보세요<br/>
      </div>
      <div className="link-container">
        <LinkItem to="/DrawMyDay" image={drawImage} imageSize="52px" fontSize="13px">일기 쓰기</LinkItem>
        <LinkItem to="/option" image={userImage} imageSize="52px" fontSize="13px">내 정보</LinkItem>
        <LinkItem to="/Memory" image={memoryImage} imageSize="52px" fontSize="13px">추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;
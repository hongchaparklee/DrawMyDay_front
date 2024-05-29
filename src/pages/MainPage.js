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
    <Link to={to} className="link-item">
      {image ? (
        <img src={image} alt="Link Icon" style={{ width: imageSize, height: imageSize, marginRight: '8px' }} />
      ) : (
        <Icon className="icon-style" style={{ color: '#004265' }} />
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
    height: '150px', // 박스의 높이
    backgroundColor: 'white', // 박스의 배경색
    marginTop: '10px', // 박스의 상단 여백
    marginBottom: '30px', // 박스의 하단 여백 추가
    borderRadius: '10px', // 박스의 모서리 둥글기
    textAlign : 'center',
    fontFamily: 'UhBeeSeHyunBold',
    color: '#004265',
    position : 'relative',
    overflow : 'visible',
  };

  const imageStyle = {
    position: 'absolute', // 추가: 절대 위치 설정
    bottom: '-40px', // 아래쪽으로부터 10px
    left: '-60px', // 왼쪽으로부터 10px
    width: '75px', // 이미지 너비
    height: '75px', // 이미지 높이
  };

  return (
    <div style={containerStyle} className="main-container my-page">
      <img src={titleImage} alt="Title" style={{ width: '450px', height: 'auto', marginTop: '14px' }} />
      <div style={boxStyle}> 
        <img src={rocketImage} alt="Rocket Icon" style={imageStyle} />
        "Draw MY DAY" combines journaling with drawing,<br/>
        allowing users to express thoughts through sketches and photos.<br/>
        <br/>
        With privacy features and customization,<br/>
        it's perfect for visually capturing daily experiences.<br/>
      </div>
      <div className="link-container">
        <LinkItem to="/DrawMyDay" image={drawImage} imageSize="52px" fontSize="14px">일기 쓰기</LinkItem>
        <LinkItem to="/option" image={userImage} imageSize="52px" fontSize="14px">내 정보</LinkItem>
        <LinkItem to="/Memory" image={memoryImage} imageSize="52px" fontSize="14px">추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;

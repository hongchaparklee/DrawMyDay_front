// MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaCog, FaPhotoVideo } from 'react-icons/fa';
import '../App.css';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '50px',
};

const headingStyle = {
  fontSize: '64px',
  marginBottom: '20px',
};

const iconStyle = {
  fontSize: '30px',
  marginBottom: '10px',
};

const LinkItem = ({ to, children, icon: Icon, color }) => (
  <Link to={to} className="link-item">
    <Icon className="icon-style" style = {{...iconStyle, color: color}}/>
    {children}
  </Link>
);

const MainPage = () => {
  return (
    <div className="main-container my-page" style={containerStyle}>
      <h2 className="main-heading" style = {headingStyle}>Draw My Day</h2>
      <div className="link-container">
        <LinkItem to="/DrawMyDay" icon={FaPencilAlt} color = "#ff7f00">일기 쓰기</LinkItem>
        <LinkItem to="/option" icon={FaCog} color = "#ff69b4">옵션 및 사용자 설정</LinkItem>
        <LinkItem to="/Memory" icon={FaPhotoVideo} color = "00bfff">추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;

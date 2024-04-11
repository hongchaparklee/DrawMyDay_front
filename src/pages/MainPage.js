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
  fontSize: '24px',
  marginBottom: '20px',
};

const iconStyle = {
  fontSize: '30px',
  marginBottom: '10px',
};

const LinkItem = ({ to, children, icon: Icon }) => (
  <Link to={to} className="link-item">
    <Icon className="icon-style" style = {iconStyle}/>
    {children}
  </Link>
);

const MainPage = () => {
  return (
    <div className="main-container my-page" style={containerStyle}>
      <h2 className="main-heading" style = {headingStyle}>Draw My Day</h2>
      <div className="link-container">
        <LinkItem to="/coloring" icon={FaPencilAlt}>일기 쓰기</LinkItem>
        <LinkItem to="/option" icon={FaCog}>옵션 및 사용자 설정</LinkItem>
        <LinkItem to="/extra" icon={FaPhotoVideo}>추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;

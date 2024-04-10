// MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaPalette, FaCog, FaCubes } from 'react-icons/fa';

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

const linkContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
};

const linkStyle = {
  margin: '0 15px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '18px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'color 0.3s ease',
};

const iconStyle = {
  fontSize: '30px',
  marginBottom: '10px',
};

const LinkItem = ({ to, children, icon: Icon }) => (
  <Link to={to} style={linkStyle}>
    <Icon style={iconStyle} />
    {children}
  </Link>
);

const MainPage = () => {
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Draw My Day</h2>
      <div style={linkContainerStyle}>
        <LinkItem to="/coloring" icon={FaPalette}>일기 쓰기</LinkItem>
        <LinkItem to="/option" icon={FaCog}>옵션 및 사용자 설정</LinkItem>
        <LinkItem to="/extra" icon={FaCubes}>추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;

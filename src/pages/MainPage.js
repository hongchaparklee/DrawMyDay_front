// MainPage.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt, FaUserEdit, FaPhotoVideo } from 'react-icons/fa';
import '../App.css';

const LinkItem = ({ to, children, icon: Icon, color }) => {
  const iconStyle = {
    fontSize: '30px',
    marginBottom: '10px',
  };

  return (
    <Link to={to} className="link-item">
      <Icon style={{ ...iconStyle, color }} />
      {children}
    </Link>
  );
};

const MainPage = () => {
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

  return (
    <div style={containerStyle} className="main-container my-page">
      <h2 style={headingStyle} className="main-heading">Draw My Day</h2>
      <div className="link-container">
        <LinkItem to="/DrawMyDay" icon={FaPencilAlt} color="#ff7f00">일기 쓰기</LinkItem>
        <LinkItem to="/option" icon={FaUserEdit} color="#ff69b4">내 정보</LinkItem>
        <LinkItem to="/Memory" icon={FaPhotoVideo} color="#00bfff">추억</LinkItem>
      </div>
    </div>
  );
};

export default MainPage;

// // OptionPad.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    school: '',
    age: '',
    gender: '',
    glasses: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitToServer();
  };

  const handleSubmitToServer = () => {
    const dataToSend = JSON.stringify({
      ...userInfo,
      glasses: userInfo.glasses ? "true" : "false",
      age: userInfo.age.toString(),
    });
  
    console.log(dataToSend);
    // 로컬 저장소에 userInfo 저장
    localStorage.setItem('userInfo', dataToSend);

    alert("저장된건가?");

    navigateToMemoryPad();
  };
  
  const navigateToMemoryPad = () => navigate('/');

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'KCCMurukmuruk, sans-serif',
  };

  const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: "white",
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <label>이름 : </label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label>학교 : </label>
        <input
          type="text"
          name="school"
          value={userInfo.school}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label>나이 : </label>
        <input
          type="text"
          name="age"
          value={userInfo.age}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>
      <div>
        <label>성별 : </label>
        <select
          name="gender"
          value={userInfo.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">선택하세요</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>
      <div>
        <label>안경 착용 : </label>
        <input
          type="checkbox"
          name="glasses"
          checked={userInfo.glasses}
          onChange={handleChange}
          style={{ margin: '10px' }}
        />
      </div>
      <button type="submit" style={{buttonStyle, fontFamily: 'KCCMurukmuruk, sans-serif'}}>저장해버리긔</button>
    </form>
  );
};

export default UserInfoForm;

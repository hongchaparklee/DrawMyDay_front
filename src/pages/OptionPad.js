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

  const navigateToMainPage = () => navigate('/');

    const mainPageButtonStyle = {
        cursor: 'pointer',
        position: 'absolute',
        width : '45px',
        height : '45px',
        top: '170px',
        right: '400px',
        margin: '10px',
    };

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
    const genderConverted = userInfo.gender === 'boy' ? 'boy' : userInfo.gender === 'girl' ? 'girl' : '';
  
    const glassesStatus = userInfo.glasses ? " who wearing glasses," : ",";
  
    const dataToSend = `korean, ${userInfo.age} age, ${genderConverted}${glassesStatus}`;
  
    console.log(dataToSend); 
    localStorage.setItem('userInfo', dataToSend); 
  
    alert("저장되었습니다.");
  
    navigateToMemoryPad(); 
  };  
  
  const navigateToMemoryPad = () => navigate('/');

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: 'UhBeeSehyun, sans-serif',
  };

  const inputStyle = {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <img 
                src={`${process.env.PUBLIC_URL}/assets/home.png`} 
                alt="메인 페이지로" 
                style={mainPageButtonStyle} 
                onClick={navigateToMainPage} 
            />
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
          type="number" // 숫자만 입력받도록 설정
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
          <option value="boy">남자</option>
          <option value="girl">여자</option>
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
      <button type="submit" style={{ 
          cursor: 'pointer',
          marginTop: '10px',
          width : '80px',
          height : 'auto',  
          border: 'none',
          background: 'none',
          padding: 0,
        }}>
        <img
          src={`${process.env.PUBLIC_URL}/assets/saveBu.png`}
          alt="저장 버튼"
          style={{ 
            width : '100%',
            height : 'auto',  
          }}
        />
      </button>
    </form>
  );
};

export default UserInfoForm;

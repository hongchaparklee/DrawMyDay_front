import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfoForm = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    school: '',
    age: '', // 나이는 문자열로 초기화
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
    // 성별 변환
    const genderConverted = userInfo.gender === 'male' ? 'boy' : userInfo.gender === 'female' ? 'girl' : '';

    const dataToSend = JSON.stringify({
      age: userInfo.age.toString(), // 나이는 문자열로 변환하여 저장
      gender: genderConverted,
      glasses: userInfo.glasses ? "true" : "false",
    });
  
    console.log(dataToSend); // 서버로 보내는 데이터 확인
    localStorage.setItem('userInfo', dataToSend); // 로컬 스토리지에 저장

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
    fontFamily: 'KCCMurukmuruk, sans-serif',
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

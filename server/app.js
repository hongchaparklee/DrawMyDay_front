//app.js

const express = require('express');
const app = express();
const cors = require('cors');

// 요청 본문의 크기 제한을 늘립니다.
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// 이미지 데이터를 저장할 배열
let imageList = [];

// 이미지 데이터 처리를 위한 경로
app.post('/api/images', (req, res) => {
    const { image } = req.body; // 클라이언트로부터 받은 이미지 데이터
    imageList.push({ image }); // 이미지 배열에 추가
    return res.send('success');
});

app.get('/api/images', (req, res) => {
    res.json(imageList); // 이미지 배열 반환
});

app.listen(4000, () => {
    console.log("server start!!");
});

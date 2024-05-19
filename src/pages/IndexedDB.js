// src/indexedDB.js

const dbName = "imagesDB";
const storeName = "images";

// 데이터베이스를 열고 초기화하는 함수
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      db.createObjectStore(storeName, { autoIncrement: true });
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

// 이미지 URL을 저장하는 함수
export function saveImageUrl(url) {
  openDB().then(db => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);
    store.add(url);
    db.close();
  });
}

// 저장된 이미지 URL을 불러오는 함수
export function getImageUrls() {
  return new Promise((resolve, reject) => {
    openDB().then(db => {
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = function(event) {
        resolve(event.target.result); // 모든 URL을 배열로 반환
      };

      request.onerror = function(event) {
        reject(event.target.error);
      };

      db.close();
    });
  });
}

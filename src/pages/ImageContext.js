// ImageContext.js
import React, { createContext, useContext, useState } from 'react';

const ImageContext = createContext();

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  return (
    <ImageContext.Provider value={{ imageUrls, setImageUrls, selectedImageUrl, setSelectedImageUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

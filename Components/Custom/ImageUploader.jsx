"use client"
import { useState, useEffect, useRef, memo } from 'react';
import { useSelector } from 'react-redux';

const ImageUploader = memo(({
  updateImageForm,
  defaultImage,
  defaultImageComponent,
  onImageSelect,
  width = '160px',
  height = '160px',
  resetTrigger
}) => {
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);
  const user = useSelector((state) => state.StoreOfUser?.user || null);
  
  // Set initial image (either from props or user's image)
  useEffect(() => {
    if (defaultImage) {
      setImage(defaultImage);
    } else if (updateImageForm && user?.image) {
      setImage(user.image);
    }
  }, [defaultImage, user?.image]);

  // Clean up object URLs when component unmounts or image changes
  useEffect(() => {
    if (resetTrigger) {
      if (image && typeof image !== 'string') {
        URL.revokeObjectURL(image);
      }
      setImage(null);
    }
  }, [resetTrigger]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newImage = URL.createObjectURL(file);
      setImage(newImage);
      onImageSelect && onImageSelect(file); // Safely call the callback if it exists
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        ref={inputRef}
      />
      
      <div
        style={{
          backgroundImage: image ? `url(${image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width,
          height,
          borderRadius: '50%',
          backgroundColor: image ? 'transparent' : '#f0f0f0',
        }}
        className='shadow-[2px_5px_15px_rgba(0,0,0,0.2)]'
        onClick={handleClick}
      >
        {!image && defaultImageComponent}
      </div>
    </div>
  );
});

export default ImageUploader;
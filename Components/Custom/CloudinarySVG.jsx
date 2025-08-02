import Image from 'next/image';

const CloudinarySVG = ({Icon,ColorChange,ClassName}) => {

  // Inject the SVG and apply styles
  return (
        <div style={{ color: 'black' }}> {/* This may not affect the SVG */}
<Image
  src={Icon}
  alt="SVG Icon"
  width={100}
  height={100}
  className={ClassName}
  style={{ 
    filter: ColorChange ? 'brightness(100%) saturate(100%) invert(100%) sepia(0%) saturate(100%) hue-rotate(0deg) brightness(100%) contrast(100%)' :
    'brightness(0) saturate(100%) invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)' 
  }}
/>
    </div>
  );
};

export default CloudinarySVG;
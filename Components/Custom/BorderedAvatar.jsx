'use client';
import Image from 'next/image';
// Components
import ClickPopopComponent from './ClickPopopComponent';

function BorderedAvatar({ path }) {
  const UserImage = path ? path :'/assets/Images/Avatar.webp'

  return (
    // right-38
      <ClickPopopComponent>
    <div className={`relative w-full h-fit p-1 flex justify-center items-center rounded-full ring-2 ring-gray-300 dark:ring-gray-500 cursor-pointer z-50`}>
        <div className="w-full h-full flex justify-center items-center rounded-full overflow-hidden">
          <Image
            src={UserImage}
            alt="User avatar"
            width={30}
            height={30}
            className="rounded-full w-[100%] h-[100%] object-contain cursor-pointer"
            priority={true}
            onError={() => setAvatarSrc('/assets/Images/Avatar.webp')} // Fallback if image fails to load
          />
        </div>
    </div>
      </ClickPopopComponent>
  );
}

export default BorderedAvatar;
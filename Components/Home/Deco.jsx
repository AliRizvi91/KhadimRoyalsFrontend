import React, { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoomType } from '@/RTK/Thunks/RoomTypeThunks';

// Custom Components
import Container from '../Custom/Container';
import BubbleButton from '../Custom/BubbleButton';
// Utilities
import FadeDown from '../Utilities/FadeDown';
const AnimatedText = dynamic(() => import('../Utilities/AnimatedText'), { 
  ssr: false,
  loading: () => <span>{'deco'}</span> // Fallback while loading
});
import { AnimatedProcessingText } from '../Utilities/AnimatedProcessingText';

function Deco() {
  const t = useTranslations('Home');
  const dispatch = useDispatch();
  const [loadingStates, setLoadingStates] = useState({
    classic: false,
    mini: false
  });

  // Get room data from Redux store
  const getAllTypeRoomData = useSelector((state) => state.StoreOfRoomType.getAllType);

  // Memoized room IDs to prevent unnecessary recalculations
  const roomIds = React.useMemo(() => ({
    classic: getAllTypeRoomData[1]?._id,
    mini: getAllTypeRoomData[0]?._id
  }), [getAllTypeRoomData]);

  // Fetch room types on mount
  useEffect(() => {
    dispatch(getAllRoomType());
  }, [dispatch]);

  // Optimized navigation handler
  const navigateToRoom = useCallback((roomType) => {
    const roomId = roomIds[roomType];
    if (!roomId) return;

    // Update loading state
    setLoadingStates(prev => ({ ...prev, [roomType]: true }));

    // Navigate after a small delay to allow UI to update
    setTimeout(() => {
      window.location.href = `/room/${roomId}`;
    }, 100);
  }, [roomIds]);

  // Memoized content to prevent unnecessary re-renders
  const content = React.useMemo(() => ({
    paragraphs: [
      t('decoPara1'),
      t('decoPara2'),
      t('decoPara3')
    ]
  }), [t]);

  return (
    <Container className="text-start">
      <h1 className="md:text-[17rem] sm:text-[12rem] text-[6rem] font-semibold">
        <AnimatedText delay={0.5}>{t('deco')}</AnimatedText>
      </h1>

      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-40 gap-7">
        {/* Left Column */}
        <FadeDown duration={1.2} YAxis={10}>
          <div className="text-start">
            <p className="md:text-[24px] sm:text-[19px] text-[16px] manrope mb-7">
              {content.paragraphs[0]}
            </p>
            <p className="md:text-[24px] sm:text-[19px] text-[16px] manrope">
              {content.paragraphs[1]}
            </p>
          </div>
        </FadeDown>

        {/* Right Column */}
        <div className="text-start">
          <FadeDown duration={1.2} YAxis={10}>
            <p className="md:text-[24px] sm:text-[19px] text-[16px] manrope mb-7">
              {content.paragraphs[2]}
            </p>
          </FadeDown>

          <div className="flex sm:flex-row flex-col sm:gap-0 gap-1 sm:justify-start justify-center items-center">
            <BubbleButton
              className="uppercase"
              BGImage={1}
              onClick={() => navigateToRoom('classic')}
              disabled={!roomIds.classic}
            >
              {loadingStates.classic ? (
                <AnimatedProcessingText 
                  Text={'processing'} 
                  className="lowercase text-[18px]"
                />
              ) : t('Classic')}
            </BubbleButton>

            <BubbleButton
              BGImage={2}
              onClick={() => navigateToRoom('mini')}
              disabled={!roomIds.mini}
            >
              {loadingStates.mini ? (
                <AnimatedProcessingText 
                  Text={'processing'} 
                  className="lowercase text-[18px]"
                />
              ) : t('mini')}
            </BubbleButton>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default React.memo(Deco);
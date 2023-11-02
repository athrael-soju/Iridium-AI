import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Grid, Progress } from 'antd';
import { DARK_BG_COLOR_RGB } from '@/constants';

const { useBreakpoint } = Grid;

export const PromptInputContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs;
  const isTablet = screens.md;
  const { watch } = useFormContext();
  const loading = watch('loading');
  const [percent, setPercent] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      setShowProgress(true);
      timer = setInterval(() => {
        setPercent((prevPercent) => {
          if (prevPercent >= 95) {
            clearInterval(timer);
            return prevPercent;
          }
          return prevPercent + 1;
        });
      }, 100);
    } else {
      setPercent(100);
      setTimeout(() => {
        setShowProgress(false);
        setPercent(0); // Reset for next loading
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [loading]);

  return (
    <>
      <div className="prompt-input-container">
        <div className="prompt-input-inner">
          {showProgress && (
            <Progress showInfo={false} percent={percent} size="small" />
          )}
          {children}
        </div>
      </div>
      <style jsx>{`
        .prompt-input-container {
          background-color: ${DARK_BG_COLOR_RGB};
          background-image: linear-gradient(
            180deg,
            rgba(53, 55, 64, 0),
            #353740 58.85%
          );
          position: fixed;
          padding: 20px 0;
          bottom: 0;
          width: 100%;
        }

        .prompt-input-inner {
          position: relative;
          margin: 0 auto;
          width: ${isMobile
            ? 'calc(100% - 40px)'
            : isTablet
            ? '700px'
            : '550px'};
        }
      `}</style>
    </>
  );
};

export default PromptInputContainer;

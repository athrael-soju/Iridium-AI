import React from 'react';
import { Grid } from 'antd';
import { DARK_BG_COLOR_RGB } from '@/constants';

const { useBreakpoint } = Grid;

export const PromptInputContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs;

  return (
    <>
      <div className="prompt-input-container">
        <div className="prompt-input-inner">{children}</div>
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
          width: ${isMobile ? 'calc(100% - 40px)' : '700px'};
        }
      `}</style>
    </>
  );
};

export default PromptInputContainer;

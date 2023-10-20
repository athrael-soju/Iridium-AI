'use client';

import { gray } from '@ant-design/colors';
import Header from './Header';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: gray[8],
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#108ee9',
};

const Layout = ({ children }: { readonly children: React.ReactNode }) => {
  return (
    <div>
      <div style={headerStyle}>
        <Header />
      </div>
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Layout;

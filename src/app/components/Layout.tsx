'use client';

import Header from './Header';

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
};

const Layout = ({ children }: { readonly children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div style={contentStyle}>{children}</div>
    </div>
  );
};

export default Layout;

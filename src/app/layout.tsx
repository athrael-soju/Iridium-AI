import { Analytics } from '@vercel/analytics/react';
import { gray } from '@ant-design/colors';
import Provider from './Provider';
import StyledComponentsRegistry from './lib/AntdRegistry';
import Header from './components/Header';

export const metadata = {
  title: 'Iridium.AI',
  description:
    'Iridium-AI is an Open Source application, heavily inspired by pinecone-vercel-starter. Fell free to clone/Fork, or even use as a template',
};

import '../global.css';

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: gray[8],
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Analytics />
          <StyledComponentsRegistry>
            <div style={headerStyle}>
              <Header />
            </div>
            <div style={contentStyle}>{children}</div>
          </StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}

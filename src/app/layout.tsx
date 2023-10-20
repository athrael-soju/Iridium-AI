import { Analytics } from '@vercel/analytics/react';
import Provider from './Provider';
import AntdRegistry from './lib/AntdRegistry';
import Layout from '../app/components/Layout';
import StyledComponentsRegistry from './lib/registry';

export const metadata = {
  title: 'Iridium.AI',
  description:
    'Iridium-AI is an Open Source application, heavily inspired by pinecone-vercel-starter. Fell free to clone/Fork, or even use as a template',
};

import '../global.css';

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
            <AntdRegistry>
              <Layout>{children}</Layout>
            </AntdRegistry>
          </StyledComponentsRegistry>
        </Provider>
      </body>
    </html>
  );
}

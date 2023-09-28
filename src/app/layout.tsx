import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'Iridium.AI',
  description: 'Iridium-AI is an Open Source application, heavily inspired by pinecone-vercel-starter. Fell free to clone/Fork, or even use as a template',
};

import '../global.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

// app/layout.tsx
import type { Metadata } from 'next';
import { Providers } from './providers';
import MainLayout from './components/ui/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Construction Platform',
  description: 'Your platform description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <MainLayout>
            {children}
          </MainLayout>
        </Providers>
      </body>
    </html>
  );
}
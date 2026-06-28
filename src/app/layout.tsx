import '@/styles/fonts.css';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/app/i18n/LanguageContext';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Software Designer, Creative Technologist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className='#f2f2f2'>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}

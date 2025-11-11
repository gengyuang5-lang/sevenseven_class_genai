import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import TopNav from '@/components/TopNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Attentive - One-Click Monetization for Creators',
  description: 'Support creators with tips, purchase premium articles, and join exclusive communities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <TopNav />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

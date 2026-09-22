import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Farsith Fawzer | Software Developer',
  description: 'Software Developer building modern web applications, full-stack systems and technology-driven digital experiences.',
  metadataBase: new URL('https://example.com'),
  openGraph: { title:'Farsith Fawzer | Software Developer', description:'Building ideas into real-world software.', type:'website' },
  twitter: { card:'summary_large_image', title:'Farsith Fawzer | Software Developer', description:'Building ideas into real-world software.' },
};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }

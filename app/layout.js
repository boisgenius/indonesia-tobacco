import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  display: 'optional',
});

export const metadata = {
  title: 'Indonesia Tobacco',
  description: 'Your gateway to premium Indonesian tobacco network',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}

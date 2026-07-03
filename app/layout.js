import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { TrafficNotifier } from './components/traffic-notifier';
import { BottomNav } from './components/bottom-nav';
import { PageTransition, PageReveal } from './components/page-transition';

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
      <body style={{ margin: 0, background: '#000' }}>
        <PageReveal>
          <div style={{ paddingBottom: '60px' }}>
            {children}
          </div>
        </PageReveal>
        <BottomNav />
        <PageTransition />
        <Analytics />
        <TrafficNotifier />
      </body>
    </html>
  );
}

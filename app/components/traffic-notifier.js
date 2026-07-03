'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getDevice() {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobile';
  if (/tablet|ipad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

export function TrafficNotifier() {
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: document.referrer || null,
        device: getDevice(),
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}

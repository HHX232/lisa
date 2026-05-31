import '@/scss/config/base.scss';
import '@/scss/config/fonts.scss';
import '@/scss/config/functions.scss';
import '@/scss/config/keyframes.scss';
import '@/scss/config/mixins.scss';
import '@/scss/config/placeholders.scss';
import '@/scss/config/reset.scss';
import '@/scss/config/root.scss';
import '@/scss/config/typography.scss';
import '@/scss/main.scss';
import type { Metadata } from "next";
import '../scss/config/fonts.scss';


import 'swiper/css';
import 'swiper/css/navigation';

import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from 'sonner';
import { Montserrat, Philosopher } from 'next/font/google';

const philosopher = Philosopher({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-philosopher', 
});

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700', '500', '300', '600'],
  display: 'swap',
  variable: '--font-montserrat', 
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://septaria.by'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Septaria — ювелирный магазин',
    template: '%s | Septaria',
  },
  description: 'Ювелирный интернет-магазин Septaria. Украшения из серебра: кольца, серьги, браслеты, комплекты с натуральными камнями.',
  openGraph: {
    siteName: 'Septaria',
    locale: 'ru_RU',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/logos/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/logos/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logos/favicon.ico', sizes: 'any' },
    ],
    apple: { url: '/logos/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
     <html className={`${philosopher.variable} ${montserrat.variable}`} lang="ru">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster richColors position="top-right" />
        <div id='modal_portal'></div>
      </body>
    </html>
  );
}

import './app.css';
import localFont from 'next/font/local';
import type { AppType } from 'next/dist/shared/lib/utils';
import { Footer, Header } from 'components';

const Roobert = localFont({
  src: [
    {
      path: '../assets/fonts/Roobert_Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Roobert_Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Roobert_SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-roobert',
});
const Roxborough = localFont({
  src: [
    {
      path: '../assets/fonts/RoxboroughCF_Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/RoxboroughCF_SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/RoxboroughCF_SemiBoldItalic.otf',
      weight: '600',
      style: 'italic',
    },
  ],
  variable: '--font-roxborough',
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Header />
      <main className={`${Roobert.variable} ${Roxborough.variable} bg-white`}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
};

export default MyApp;

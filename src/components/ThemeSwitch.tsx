import Image from 'next/image';
import moon from 'images/theme_moon.svg';

export default function ThemeSwitch() {
  return (
    <button className="fixed right-12 bottom-12 flex h-10 w-10 items-center justify-center bg-theme-switch">
      <Image src={moon} alt="" height={20} width={20} />
    </button>
  );
}

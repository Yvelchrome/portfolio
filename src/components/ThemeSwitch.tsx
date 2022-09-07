import Image from "next/image";
import moon from "../assets/images/theme_moon.svg";

function ThemeSwitch() {
  return (
    <button className="fixed right-12 bottom-12 flex h-10 w-10 items-center justify-center bg-gray-300">
      <Image src={moon} alt="" height={20} width={20} />
    </button>
  );
}

export default ThemeSwitch;

import Image from "next/image";
import Link from "next/link";

import logo from "assets/images/logo.svg";

export const Logo = () => {
  return (
    <Link href={"/"} className="no-locale-animation">
      <Image src={logo} alt="" className="h-12 w-auto" priority />
    </Link>
  );
};

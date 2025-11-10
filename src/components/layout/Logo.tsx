import Image from "next/image";
import Link from "next/link";

import logo from "assets/images/logo.svg";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Image src={logo} alt="" className="h-12 w-auto" priority />
    </Link>
  );
}

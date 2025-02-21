import Image from "next/image";
import Link from "next/link";

import logo from "assets/images/logo.svg";

export default function Logo() {
  return (
    <Link href={"/"}>
      <Image
        src={logo as string}
        alt=""
        width={40}
        height={75}
        className="h-12 w-auto"
        priority
      />
    </Link>
  );
}

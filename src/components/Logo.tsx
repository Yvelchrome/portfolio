import Image from "next/image";
import logo from "../assets/images/logo.svg";

function Logo() {
  return (
    <div className="fixed top-12 left-12">
      <Image src={logo} alt="" width={40} height={75} />
    </div>
  );
}

export default Logo;

import { Instagram, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Logo from "@/shared/assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="w-screen h-[20rem] overflow-hidden  bg-light">
      <div className="mycontainer h-full w-full  flex justify-between items-center ">
        <div className="">
          <Image className="" alt="" src={Logo} />
        </div>
        <ul className="flex items-center flex-col gap-2 min-w-[250px]">
          <li className="flex items-center gap-2 w-full">
            <span className="block min-w-0 flex-1 text-left truncate">
              @innoventum_
            </span>
            <span className="flex items-center justify-center w-6 h-6">
              <Instagram size={20} />
            </span>
          </li>
          <li className="flex items-center gap-2 w-full">
            <span className="block min-w-0 flex-1 text-left truncate">
              0812-3456-7890
            </span>
            <span className="flex items-center justify-center w-6 h-6">
              <Phone size={20} />
            </span>
          </li>
          <li className="flex items-center gap-2 w-full">
            <span className="block min-w-0 flex-1 text-left truncate">
              Innoventum@gmail.com
            </span>
            <span className="flex items-center justify-center w-6 h-6">
              <Mail size={20} />
            </span>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;

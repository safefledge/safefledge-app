import { ITheme } from "@/interface/interfaces";
import Image from "next/image";

export default function Navbar({theme} : ITheme){
     return (
        <nav className='navbar w-navbar-width h-navbar-height bg-navbar-color flex justify-between mt-5 ml-5'>
            <div className='flex items-start'>
                <Image src='/images/safefledgelogo.svg' alt="SafeFledge Logo" width={116} height={35} />
            </div>
            <div className='flex items-center'>

            </div>
            <div className='flex items-end'>

            </div>
        </nav>
     )
}
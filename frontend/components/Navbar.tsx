"use client";
import Image from "next/image";
import Link from "./Link";
import { useLocale } from "next-intl";



export default function Navbar() {
  const locale = useLocale();
  return (
    <nav className="navbar w-navbar-width h-navbar-height bg-navbar-color flex flex-col md:flex-row justify-between mt-5 ml-5">
      <div className="flex items-start">
        <Image
          src="/images/safefledgelogoLight.svg"
          alt="SafeFledge Logo"
          width={126}
          height={35}
        />
      </div>
      <div className="flex items-center gap-8">
        <Link className="text-base" href="/" locale={locale}>
          Tab 01
        </Link>
        <Link className="text-base" href="/about" locale={locale}>
          Tab 02
        </Link>
        <Link className="text-base" href="/contact" locale={locale}>
          Tab 03
        </Link>
        <Link className="text-base" href="/contact" locale={locale}>
          Tab 04
        </Link>
      </div>
      <div className="flex items-end gap-2 mr-0 md:mr-2">
        <button className="bg-white w-[90px] h-[30px] rounded-[17px] border border-[#0B2BF8] md:w-[126px]">
          <Link className="text-[#0B2BF8]" href="/login" locale={locale}>
            CTA - 01
          </Link>
        </button>
        <button className="bg-[#0B2BF8] w-[90px] h-[30px] rounded-[17px] border border-[#0B2BF8] md:w-[126px]">
          <Link className="text-white" href="/login" locale={locale}>
            CTA - 02
          </Link>
        </button>
      </div>
    </nav>
  );
}

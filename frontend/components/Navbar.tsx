"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "@/components/Link";

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("Home");
  return (
    <nav className="bg-transparent relative bottom-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between">
          <div className="flex">
            <Link
              className="relative lg:right-36 transition-all duration-300 ease-in-out"
              href="/"
              locale={locale}
            >
              <Image
                src="/images/logo.png"
                width={283}
                height={283}
                alt="logo"
                className=" hover:scale-110 transition-all duration-300 ease-in-out"
              />
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-14 text-white font-medium">
            <Link
              className="hover:border-b-4 transition-all duration-75 ease-in rounded-sm"
              href="/"
              locale={locale}
            >
              {t("Navbar_1")}
            </Link>
            <Link
              className="hover:border-b-4 transition-all duration-75 ease-in rounded-sm"
              href="/services"
              locale={locale}
            >
              {t("Navbar_2")}
            </Link>
            <Link
              className="hover:border-b-4 transition-all duration-75 ease-in rounded-sm"
              href="/resources"
              locale={locale}
            >
              {t("Navbar_3")}
            </Link>
            <Link
              className="hover:border-b-4 transition-all duration-75 ease-in rounded-sm"
              href="/blog"
              locale={locale}
            >
              {t("Navbar_4")}
            </Link>
            <Link
              className="bg-blue-500 text-white px-4 py-2 rounded-large hover:bg-blue-600 transition-all duration-75 ease-in"
              href="/contact"
              locale={locale}
            >
              {t("Navbar_5")}
            </Link>
          </div>
          <div className="flex sm:hidden items-center gap-8 text-white font-medium">
            <button className="focus:outline-none mr-16 hover:scale-110 transition-all duration-300 ease-in-out">
              <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

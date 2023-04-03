"use client";
import { useLocale, useTranslations } from "next-intl";
import Link from "@/components/Link";
import Navbar from "@/components/Navbar";
import SearchRating from "@/components/SearchRating";


export default function Home() {
  const locale = useLocale();
  const t = useTranslations("Home");
  return (
    <>
      <section
        className="w-full h-hero-xxxl bg-center bg-cover"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-70 h-hero-xxxl"></div>
        <Navbar />
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center relative z-10">
          <div className="relative -top-14">
            <h1 className="text-5xl ml-32 sm:ml-0 leading-10 font-bold text-white mb-4">
              {t("Hero_title")}
            </h1>
            <p className="text-m sm:text-lg w-hero-text leading-5 font-medium text-white mt-2 mb-4 ml-14 sm:ml-0 text-center">
              {t("Hero_subtitle")}
            </p>
            <svg
              className="mb-6 hidden sm:block"
              width="556"
              height="18"
              viewBox="0 0 556 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M328.776 6.79779C199.329 6.79779 63.4106 13.762 5.83935 17.6027C2.67003 17.8141 0 15.3018 0 12.1255C0 9.15902 2.35827 6.73104 5.32355 6.64787C63.0787 5.02807 188.704 1.71056 270.384 0.263173C353.766 -1.2144 492.886 3.88567 554.035 6.70669C555.164 6.75877 556 7.68699 556 8.81714C556 10.011 555.014 10.9687 553.82 10.9279C524.063 9.91111 492.341 6.79779 328.776 6.79779Z"
                fill="white"
              />
            </svg>
            <div className="flex gap-12 items-center justify-center mr-16">
              <Link
                className="bg-blue-500 text-white px-4 py-2 rounded-large hover:bg-blue-600 transition-all duration-75 ease-in"
                href="/contact"
                locale={locale}
              >
                {t("Hero_button_2")}
              </Link>
              <Link
                className="border border-white text-white px-4 py-2 rounded-large hover:bg-slate-400 hover:text-black transitiona-ll duration-75 ease-in"
                href="/learn"
                locale={locale}
              >
                {t("Hero_button")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="h-96 hidden sm:block">
      <SearchRating />
      </section>
    </>
  );
}

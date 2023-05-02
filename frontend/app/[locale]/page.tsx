"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const locale = useLocale();
  const t = useTranslations("Newsletter");

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if(email === ""){
      const error = t("Newsletter_error")
      setError(true);
      setErrorMessage(error);
      const timeout = setTimeout(() => {
        setError(false);
        setErrorMessage("");
        clearTimeout(timeout);
      }, 3000)
      return;
    }
    const request = await fetch("https://api.safefledge.com/v2/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
    const response = await request.json();
    if(response.success === true){
      setSuccess(true);
    } else {
      const error = t("Newsletter_error")
      setError(true);
      setErrorMessage(error);
      const timeout = setTimeout(() => {
        setError(false);
        setErrorMessage("");
        clearTimeout(timeout);
      }, 3000)
    }
  }
  
  return (
    <div className="from-[#56CCF2] justify-center items-center flex flex-col h-screen">
      {success === false ? (
        <div className="flex flex-col justify-center items-center">
        <Image
          src="/images/logo-auth.svg"
          alt="Logo"
          width={250}
          height={200}
        />
        <form className="w-[250px] md:w-[424px] lg:w-[424px] h-auto rounded-[20px] bg-white flex flex-col items-center mt-2"
        onSubmit={handleSubmit}
        >
          <h1 className="text-black text-[16px] lg:text-[24px] md:text-[24px] leading-7 mt-8 font-bold">
            {t("Newsletter_subtitle")}
          </h1>
          <div className="flex flex-col justify-center items-center gap-[16px] mt-6">
            <input
            onChange={(e) => setEmail(e.target.value)}
              className="w-[240px] md:w-[376px] lg:w-[376px] h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
              type="email"
              placeholder={t("Newsletter_placeholder")}
            />
            {error === true ? (
              <p className="text-red-500 text-[16px] mx-4">{errorMessage}</p>
            ) : null}
          </div>
          <button
            className="w-[240px] md:w-[376px] lg:w-[376px] h-[38px] mb-4 bg-[#56CCF2] rounded-[10px] text-white text-[16px] font-medium mt-6 hover:bg-[#2D9CDB] transition-all"
            type="submit"
          >
            {t("Newsletter_button")}
          </button>
        </form>
      </div>
      ) : <>
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/images/logo-auth.svg"
          alt="Logo"
          width={250}
          height={200}
        />
        <form className="w-[424px] h-[100px] rounded-[20px] bg-white flex flex-col items-center mt-2">
          <h1 className={`text-black ${locale === "pl" ? "text-[15px]" : "text-[18px]"} leading-7 mt-8 font-bold justify-center my-auto transition-all fade-in-out`}>
            {t("Newsletter_success")}
          </h1>
        </form>
      </div>
      </>}
    </div>
  );
}

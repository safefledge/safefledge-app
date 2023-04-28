"use client";
import "./auth.css";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { validationSchema } from "@/addons/schemas/ValidationSchema";
import { ValidationSchemaInterface } from "@/addons/interface/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import Link from "@/components/Link";
import GoogleButton from "@/components/GoogleButton";
import { calculatePasswordStrength } from "@/addons/functions/calculatePasswordStrength";

export default function Page() {
  const locale = useLocale();
  const auth_translations = useTranslations("Auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaInterface>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchemaInterface> = (data) => {
    console.log(data);
  };
  //states
  const [isUserSeePassword, setIsUserSeePassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState("None");



  ///functions
  const handlePasswordStrength = (e: any) => {
    const {score, passwordStrengthText} = calculatePasswordStrength(e.target.value);
    if (score && passwordStrengthText) {
      setPasswordStrength(score);
      setPasswordStrengthText(passwordStrengthText);
    }
    
  }

  return (
    <div className="from-[#56CCF2] justify-center items-center flex flex-col h-screen">
      <div className="flex flex-col justify-center items-center gap-6">
        <Image
          src="/images/logo-auth.svg"
          alt="Logo"
          width={250}
          height={200}
        />
        <form
          className="w-[424px] h-[515px] rounded-[20px] bg-white flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-black text-[24px] leading-7 mt-8 font-bold">
            {auth_translations("Register")}
          </h1>
          <div className="flex flex-col justify-center items-center gap-[16px] mt-6">
            <input
              className="w-[376px] h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email?.message}
              </span>
            )}
            <input
              className="w-[376px] h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
              placeholder={auth_translations("Fullname")}
              {...register("fullname")}
            />
            {errors.fullname && (
              <span className="text-red-500 text-sm">
                {errors.fullname?.message}
              </span>
            )}
            <div className="relative w-[376px]">
              <input
                className="w-full h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
                type={isUserSeePassword ? "text" : "password"}
                placeholder={auth_translations("Password")}
                {...register("password")}
                onChange={(e) => {
                    handlePasswordStrength(e);
                }}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-2"
                onClick={() => {
                  setIsUserSeePassword(!isUserSeePassword);
                }}
              >
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.96221 7.62499C3.19171 4.60545 5.72837 2.66666 8.55555 2.66666C11.3827 2.66666 13.9194 4.60545 15.1489 7.62499C15.2467 7.8651 15.2467 8.1349 15.1489 8.375C13.9194 11.3945 11.3827 13.3333 8.55555 13.3333C5.72837 13.3333 3.19171 11.3945 1.96221 8.375C1.86444 8.1349 1.86444 7.8651 1.96221 7.62499ZM8.55555 12.0998C10.8349 12.0998 12.9247 10.5245 13.9888 8C12.9247 5.4755 10.8349 3.90022 8.55555 3.90022C6.27619 3.90022 4.18639 5.4755 3.12228 8C4.18639 10.5245 6.27619 12.0998 8.55555 12.0998ZM8.55555 10.4308C7.23637 10.4308 6.16696 9.34251 6.16696 8C6.16696 6.65748 7.23637 5.56916 8.55555 5.56916C9.87473 5.56916 10.9441 6.65748 10.9441 8C10.9441 9.34251 9.87473 10.4308 8.55555 10.4308ZM8.55555 9.19728C9.2053 9.19728 9.73202 8.66124 9.73202 8C9.73202 7.33876 9.2053 6.80272 8.55555 6.80272C7.90581 6.80272 7.37908 7.33876 7.37908 8C7.37908 8.66124 7.90581 9.19728 8.55555 9.19728Z"
                    fill="#92929D"
                  />
                </svg>
              </span>
            </div>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password?.message}
              </span>
            )}
            <div className="flex justify-center items-center w-full">
              <div className="h-2 w-full bg-gray-300 rounded-full overflow-hidden">
                <div className={`h-full ${passwordStrength === 0 ? "bg-gray-300" : passwordStrength === 1 ? "bg-red-500" : passwordStrength === 2 ? "bg-yellow-500" : passwordStrength >= 3 ? "bg-green-500" : "bg-blue-500"} transition-all duration-500 ease-in-out`} style={{width: `${passwordStrength * 25}%`}}></div>
              </div>
              <span className="text-gray-400 text-sm ml-2">{passwordStrengthText}</span>
            </div>
          </div>
          <div className="flex w-[320px]">
            <span className="text-[12px] text-[#92929D] text-center">
                {auth_translations("Terms&Conditions")}{" "}<Link className=" text-[#0072C6]" href="/user/notice" locale={locale}>
                    {auth_translations("UserNotice")}{" "}
                </Link>
                {auth_translations("And")}{" "}
                <Link className="text-[#0072C6]" href="/user/privacy" locale={locale}>
                    {auth_translations("PrivacyPolicy")}
                </Link>
            </span>
          </div>
          <button className="w-[376px] h-[38px] bg-[#0072C6] rounded-[10px] text-white text-[16px] font-bold mt-6">
            {auth_translations("RegistrBtn")}
          </button>
          <span className="text-[12px] text-[#92929D] text-center mt-2">
            {auth_translations("Or")}{" "}
          </span>
          <GoogleButton />
          <div className="w-[424px] h-[45px] rounded-br-[20px] rounded-bl-[20px] bg-[#0072C6] relative top-[20px] flex justify-center">
            <span className="text-[16px] text-white text-center my-auto">
                {auth_translations("Already_have_an_account")}{" "}
                <Link className="ml-[3px] text-[#F8F8F8]" href="/auth/login" locale={locale}>
                    {auth_translations("Log_in_Allready")}
                </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

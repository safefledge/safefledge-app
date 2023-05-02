"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { validationSchemaLogin } from "@/addons/schemas/ValidationSchemaLogin";
import { ValidationSchemaLogin } from "@/addons/interface/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";
import Link from "@/components/Link";
import GoogleButton from "@/components/GoogleButton";

export default function Page({
  params
} : {
  params: {
    email: string;
    password: string;
  }
}) {
  const locale = useLocale();
  const auth_translations = useTranslations("Auth");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchemaLogin>({
    resolver: zodResolver(validationSchemaLogin),
  });
  const onSubmit: SubmitHandler<ValidationSchemaLogin> = (data) => {
    const {email, password} = data;
    async function loginUser() {
      const response = await fetch(`https://api.safefledge.com/v2/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        })
      })
      const data = await response.json();
      if(!data.data){
        setError(true);
        setErrorMessage("Email or Password is incorrect");
        setTimeout(() => {
          setError(false);
          setErrorMessage("None");
        }, 3000);
      }
      console.log(data);
    }
    loginUser();
  };
  //states
  const [isUserSeePassword, setIsUserSeePassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordStrengthText, setPasswordStrengthText] = useState("None");
  const [email, setEmail] = useState(params.email);
  const [password, setPassword] = useState(params.password);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("None");






  ///functions

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
          className="w-[424px] h-[420px] rounded-[50px] bg-white flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-black text-[24px] leading-7 mt-8 font-bold">
            {auth_translations("Login")}
          </h1>
          <div className="flex flex-col justify-center items-center gap-[16px] mt-6">
            <input
              className="w-[376px] h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
              type="email"
              value={email}
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email?.message}
              </span>
            )}
            <div className="relative w-[376px]">
              <input
                className="w-full h-[38px] bg-[#F8F8F8] border-1 border-solid rounded-[10px] placeholder:leading-5 placeholder:text-[16px] pl-5 text-sm font-medium"
                type={isUserSeePassword ? "text" : "password"}
                value={password}
                placeholder={auth_translations("Password")}
                {...register("password")}
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
            
          </div>
          <div className="flex w-[320px] mt-4">
            <span className="text-[12px] text-[#92929D] text-center">
                {auth_translations("Terms&Conditions2")}{" "}<Link className=" text-[#0072C6]" href="/user/notice" locale={locale}>
                    {auth_translations("UserNotice")}{" "}
                </Link>
                {auth_translations("And")}{" "}
                <Link className="text-[#0072C6]" href="/user/privacy" locale={locale}>
                    {auth_translations("PrivacyPolicy")}
                </Link>
            </span>
          </div>
          <button className="w-[376px] h-[38px] bg-[#0072C6] rounded-[10px] text-white text-[16px] font-bold mt-6 hover:bg-[#2F80ED] transition-all ease-in">
            {auth_translations("SigninBtn")}
          </button>
          <span className="text-[12px] text-[#92929D] text-center mt-2">
            {auth_translations("Or")}{" "}
          </span>
          <GoogleButton />
          <div className="w-[424px] h-[45px] rounded-br-[20px] rounded-bl-[20px] bg-[#0072C6] relative top-[20px] flex justify-center">
            <span className="text-[16px] text-white text-center my-auto">
                {auth_translations("No_account")}{" "}
                <Link className="ml-[3px] text-[#F8F8F8] hover:underline transition-all" href="/auth" locale={locale}>
                    {auth_translations("Register_Allready")}
                </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

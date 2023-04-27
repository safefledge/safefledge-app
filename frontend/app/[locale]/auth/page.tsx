"use client"
import { useState } from "react"
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";


export default function Page(){
    const locale = useLocale();
    const auth_translations = useTranslations("Auth");

    const [userActualPage, setUserActualPage] = useState("main");

    return (
        <div className="from-[#56CCF2] justify-center items-center flex flex-col h-screen">
            <div className="flex flex-col justify-center items-center gap-6">
                <Image src="/images/logo-auth.svg" alt="Logo" width={250} height={200} />
                <div className="w-[424px] h-[515px] rounded-[20px] bg-white flex flex-col justify-center items-center">
                    <h1 className="text-black text-[24px] font-semibold leading-7">{auth_translations("Title")}</h1>
                </div>
            </div>
        </div>
    )

}
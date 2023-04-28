"use client"

import useSession from "@/hooks/useSession";
import { useLocale, useTranslations } from "next-intl";


export default function Page(){
    const locale = useLocale();
    const auth_translations = useTranslations("App");
    const {loading, session} = useSession();

    if(loading){
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#56CCF2]"></div>
            </div>
        )
    }
    if(session){
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">{auth_translations("Welcome")}</h1>
            </div>
        )
    } else if (session === false){
        return (
            <div className="flex justify-center items-center h-screen">
                <h1 className="text-2xl font-bold">{auth_translations("Please login")}</h1>
            </div>
        )
    }
}
"use client"

import { useTranslations } from "next-intl";

export default function Dashboard({
    locale
} : {
    locale: string
}){
    const auth_translations = useTranslations("App");
    return (
    <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">{auth_translations("Welcome")}</h1>
    </div>
    )
}
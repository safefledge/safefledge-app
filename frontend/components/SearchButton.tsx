"use client"
import { useTranslations } from "next-intl"


export default function SearchButton(){
    const t = useTranslations("Home");
    return (
        <button className="bg-blue-500 text-center w-search-button h-search-button text-black px-4 py-2 rounded-large font-bold hover:transform hover:scale-105  transition-all duration-75 ease-in">{t("Hero_search_button")}</button>
    )
}
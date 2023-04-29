"use client"

import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import NonAuthorized from "@/components/NonAuthorized";
import useSession from "@/hooks/useSession";
import { useLocale, useTranslations } from "next-intl";


export default function Page(){
    const locale = useLocale();
    const auth_translations = useTranslations("App");
    const {loading, session} = useSession();

    if(loading){
        return (
            <Loading />
        )
    }
    if(session){
        return (
           <Dashboard />
        )
    } else if (session === false){
        return (
            <NonAuthorized />
        )
    }
}
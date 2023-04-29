"use client"

import Dashboard from "@/components/Dashboard";
import Loading from "@/components/Loading";
import NonAuthorized from "@/components/NonAuthorized";
import useSession from "@/hooks/useSession";
import { useLocale } from "next-intl";


export default function Page(){
    const locale = useLocale();
    const {loading, session} = useSession();
    if(loading){
        return (
            <Loading />
        )
    }
    if(session){
        return (
           <Dashboard locale={locale}/>
        )
    } else if (session === false){
        return (
            <NonAuthorized locale={locale}/>
        )
    }
}
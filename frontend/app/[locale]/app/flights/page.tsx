"use client"

import Loading from "@/components/Loading";
import useSession from "@/hooks/useSession";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";



export default function Page(){
    const locale = useLocale();
    const {loading, session} = useSession();

    const router = useRouter();
    
    if(loading === true){
        return <Loading />
    }
    if(session === true){
        return (
            <>
            <h1 className="text-3xl font-bold text-center">Flights</h1>
            </>
        )
    }
    if (session === false) {
        router.push(`/${locale}/auth/login`);
    }
}
"use client"

import Loading from "@/components/Loading";
import useSession from "@/hooks/useSession";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";



export default function Page(){
    const locale = useLocale();
    const {loading, session} = useSession();

    const router = useRouter();
    
    if(loading){
        return <Loading />
    }
    if(session){
        return (
            <>
            <h1 className="text-3xl font-bold text-center">Real-Time-Tracking</h1>
            </>
        )
    }
    if (!session) {
        router.push(`/${locale}/auth/login`);
    }
}
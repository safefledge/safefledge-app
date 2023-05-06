"use client"

import Image from "next/image"
import Link from "./Link"
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";


export default function DashboardNavbar({
    tab
} : {
    tab?: string
}){
    const locale = useLocale();
    const {loading, session} = useSession();
    const [activeTab, setActiveTab] = useState("Home");

    useEffect(() => {
        if(tab){
            setActiveTab(tab)
        }
    }, [tab])

    
    if (session === true){
        return (
            <nav className="navbar bg-[#2F80ED] w-full h-[70px] flex flex-row md:flex-row justify-between">
            <div className="items-center hidden md:flex md:visible md:items-start md:mt-4 md:ml-4">
               <Link href="/app/home" locale={locale}>
               <Image
                src="/images/safefledgelogowhite.svg"
                alt="SafeFledge Logo"
                width={164}
                height={40}
                />
               </Link>
            </div>
            <div className="hidden md:flex lg:flex gap-6 items-center justify-center md:justify-end">
                <div className={`w-[129px] h-[40px] ${activeTab === "Home" ? "bg-[#5595F6] rounded-[200px] text-white" : "bg-none "} flex items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px] hover:bg-[#5595F6] hover:transition-all hover:ease-in hover:rounded-[200px]`} onClick={() => setActiveTab("Home")}>
                    <Image 
                    className="mb-[3px]"
                    src="/images/navbar-dashboard/Home.svg"
                    alt="Home Icon"
                    width={24}
                    height={24}
                    />
                    <Link href="/app/home" className="text-white font-normal text-[16px]" locale={locale}>Home</Link>
                </div>
                <div className={`w-[129px] h-[40px] ${activeTab === "Flights" ? "bg-[#5595F6] rounded-[200px] text-white" : "bg-none "} flex items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px] hover:bg-[#5595F6] hover:transition-all hover:ease-in hover:rounded-[200px]`} onClick={() => setActiveTab("Flights")}>
                    <Image
                    className="mb-[3px]"
                    src="/images/navbar-dashboard/Flights.svg"
                    alt="Flights Icon"
                    width={24}
                    height={24}
                    />
                    <Link href="/app/flights" className="text-white font-normal text-[16px]" locale={locale}>My Flights</Link>
                </div>
                <div className={`w-[193px] h-[40px] ${activeTab === "Tracking" ? "bg-[#5595F6] rounded-[200px] text-white" : "bg-none "} flex items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px] hover:bg-[#5595F6] hover:transition-all hover:ease-in hover:rounded-[200px]`} onClick={() => setActiveTab("Tracking")}>
                    <Image
                    className="mb-[3px]"
                    src="/images/navbar-dashboard/Tracking.svg"
                    alt="Tracking Icon"
                    width={24}
                    height={24}
                    />
                    <Link href="/app/real-time-flight-tracking" className="text-white font-normal text-[16px]" locale={locale}>Real Time Tracking</Link>
                </div>
                <div className={`w-[129px] h-[40px] ${activeTab === "Settings" ? "bg-[#5595F6] rounded-[200px] text-white" : "bg-none "} flex items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px] hover:bg-[#5595F6] hover:transition-all hover:ease-in hover:rounded-[200px]`} onClick={() => setActiveTab("Settings")}>
                    <Image
                    className="mb-[3px]"
                    src="/images/navbar-dashboard/Settings.svg"
                    alt="Settings Icon"
                    width={24}
                    height={24}
                    />
                    <Link href="/app/settings" className="text-white font-normal text-[16px]" locale={locale}>Settings</Link>
                </div>
            </div>
            <div className="flex md:hidden lg:hidden gap-6 items-center">
            <div className="items-center visible ml-[20px] md:flex md:visible md:items-start md:mt-4 md:ml-4">
                <Link href="/app/home" locale={locale}>
                <Image
                src="/images/safefledgelogowhite.svg"
                alt="SafeFledge Logo"
                width={164}
                height={40}
                />
                </Link>
            </div>
            </div>
            <div className="flex items-center justify-end mr-[26px] md:justify-end md:mr-8">
                <div className="photo rounded-full w-[50px] h-[50px]">
                    <Image
                    className="rounded-full"
                    src="/images/navbar-dashboard/avatar-test/Avatar.jpg"
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    />
                </div>
               <Image
                className="ml-[10px] md:ml-[8px]"
                src="/images/navbar-dashboard/SeeAll.svg"
                alt="See All Icon"
                width={24}
                height={24}
                />

            </div>
        </nav>
        )
    } else {
        return null;
    }
    return (
        <></>
    )
}
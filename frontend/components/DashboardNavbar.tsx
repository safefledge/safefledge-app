"use client"

import Image from "next/image"
import Link from "./Link"
import { useLocale } from "next-intl";
import { useState } from "react";
import useSession from "@/hooks/useSession";


export default function DashboardNavbar(){
    const locale = useLocale();
    const {loading, session} = useSession();
    const [activeTab, setActiveTab] = useState("Home");
    
    if (session === true){
        return (
            <nav className="navbar bg-[#2F80ED] w-full h-[70px] flex flex-col md:flex-row justify-between">
            <div className="flex items-center md:items-start md:mt-4 md:ml-4">
                <Image
                src="/images/safefledgelogowhite.svg"
                alt="SafeFledge Logo"
                width={164}
                height={40}
                />
            </div>
            <div className="flex gap-6 items-center justify-center md:justify-end">
                <div className={`w-[129px] h-[40px] ${activeTab === "Home" ? "bg-[#5595F6] rounded-[200px] text-white" : "bg-none "} flex items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px] hover:bg-[#5595F6] hover:transition-all hover:ease-in hover:rounded-[200px]`} onClick={() => setActiveTab("Home")}>
                    <Image 
                    className="mb-[3px]"
                    src="/images/navbar-dashboard/Home.svg"
                    alt="Home Icon"
                    width={24}
                    height={24}
                    />
                    <Link href="/app" className="text-white font-normal text-[16px]" locale={locale}>Home</Link>
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
            <div className="flex items-center justify-center md:justify-end md:mr-8">
                <div className="photo rounded-full w-[50px] h-[50px]">
                    <Image
                    className="rounded-full"
                    src="/images/Portrait_Placeholder.png"
                    alt="Profile Picture"
                    width={50}
                    height={50}
                    />
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.075C11.9 15.075 11.8084 15.0583 11.725 15.025C11.6417 14.9917 11.5584 14.9333 11.475 14.85L6.52503 9.9C6.39169 9.76666 6.32919 9.5875 6.33753 9.3625C6.34586 9.1375 6.41669 8.95833 6.55003 8.825C6.71669 8.65833 6.89586 8.5875 7.08753 8.6125C7.27919 8.6375 7.45003 8.71666 7.60003 8.85L12 13.25L16.4 8.85C16.5334 8.71666 16.7125 8.64166 16.9375 8.625C17.1625 8.60833 17.3417 8.68333 17.475 8.85C17.6417 8.98333 17.7125 9.15833 17.6875 9.375C17.6625 9.59166 17.5834 9.775 17.45 9.925L12.525 14.85C12.4417 14.9333 12.3584 14.9917 12.275 15.025C12.1917 15.0583 12.1 15.075 12 15.075Z" fill="white"/></svg>

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
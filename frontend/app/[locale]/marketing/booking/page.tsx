"use client"

import BookingFlightSearch from "@/components/BookingFlightSearch";
import useSession from "@/hooks/useSession";
import { useLocale } from "next-intl";

export default function Page() {
    const locale = useLocale();
    const {loading, session} = useSession();
    if (session === true){
        return <BookingFlightSearch />    
    } else if (session === false) {
        return (
            <div>
                <h1>Not Logged In</h1>
            </div>
        )
    } else if (loading){
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        )
    }
}
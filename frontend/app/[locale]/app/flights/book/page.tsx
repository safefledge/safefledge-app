"use client"

import { useSearchParams } from "next/navigation"




export default function Page(){
    const searchParams = useSearchParams()

    const booking = searchParams.get("booking")

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
                Booking: {booking}
            </div>
        </div>
    )
}
"use client"

import { useState } from "react";
import Image from "next/image";
import BookingRoundTrip from "./BookingRoundTrip";
import BookingOneWay from "./BookingOneWay";
import BookingMultiCity from "./BookingMultiCity";

export default function BookingFlightSearch(){
    const [actualPage, setActualPage] = useState<string>("round_trip");
    return (
        <div className={`search w-[1235px] ${actualPage === "multi_city" ? "h-auto" : "h-[240px]"} flex flex-col justify-center items-center bg-[#F8F8F8] rounded-[20px] border-solid border-1 border-[#C9D3FF] my-[300px] mx-auto`}>
            <div className="choose w-[560px] h-[52px] gap-6 flex flex-row items-start mt-10">
                <div className={`roundtrip w-[160px] h-[52px] flex flex-col items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px]`} onClick={() => setActualPage("round_trip")}>
                    <div className="w-[160px] h-[52px] flex items center justify-center">
                        <div className="w-[24px] h-[24px]">
                            <Image
                            src={actualPage === "round_trip" ? "/images/booking/ActivePlane.svg" : "/images/booking/Plane.svg" }
                            alt="Round Trip Icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="w-[103px] h-[24px] text-[16px] flex items-center justify-center">
                            <p>Round Trip</p>
                        </div>
                    </div>
                    <Image
                        className="relative bottom-4"
                        src={actualPage === "round_trip" ? "/images/booking/ActiveBorder.svg" : "/images/booking/Border.svg" }
                        alt="Round Trip Border"
                        width={160}
                        height={24}
                        />
                </div>
                <div className={`oneway w-[160px] h-[52px] flex flex-col items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px]`} onClick={() => setActualPage("oneway_trip")}>
                    <div className="w-[160px] h-[52px] flex items center justify-center">
                        <div className="w-[24px] h-[24px]">
                            <Image
                            src={actualPage === "oneway_trip" ? "/images/booking/ActivePlane.svg" : "/images/booking/Plane.svg" }
                            alt="oneway_trip Trip Icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="w-[100px] h-[24px] flex items-center justify-center">
                            <p>One-way</p>
                        </div>
                    </div>
                    <Image
                    className="relative bottom-4"
                        src={actualPage === "oneway_trip" ? "/images/booking/ActiveBorder.svg" : "/images/booking/Border.svg" }
                        alt="Round Trip Border"
                        width={160}
                        height={24}
                        />
                </div>
                <div className={`multicity w-[160px] h-[52px] flex flex-col items-center justify-center font-normal text-[16px] cursor-pointer gap-[6px]`} onClick={() => setActualPage("multi_city")}>
                    <div className="w-[160px] h-[52px] flex items center justify-center">
                        <div className="w-[24px] h-[24px]">
                            <Image
                            src={actualPage === "multi_city" ? "/images/booking/ActivePlane.svg" : "/images/booking/Plane.svg" }
                            alt="multi_city Trip Icon"
                            width={40}
                            height={40}
                            />
                        </div>
                        <div className="w-[100px] h-[24px] flex items-center justify-center">
                            <p>Multi-city</p>
                        </div>
                    </div>
                    <Image
                    className="relative bottom-4"
                        src={actualPage === "multi_city" ? "/images/booking/ActiveBorder.svg" : "/images/booking/Border.svg" }
                        alt="multi_city Trip Border"
                        width={160}
                        height={24}
                        />
                </div>
            </div>
            {actualPage === "round_trip" ? <BookingRoundTrip /> : actualPage === "oneway_trip" ? <BookingOneWay /> : <BookingMultiCity />}
        </div>
    )
}
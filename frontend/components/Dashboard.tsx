"use client";

import { IUserProps } from "@/addons/interface/interfaces";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashboardButton from "./DashboardButton";

export default function Dashboard({
  locale,
  userProps,
}: {
  locale: string;
  userProps: IUserProps;
}) {

    //states
    const [flights, setFlights] = useState(userProps.flights);
    const [activeFlight, setActiveFlight] = useState<IUserProps["flights"][0] | null>(
        flights.length > 0 ? flights[0] : null
      );
      
    const [nextTrip, setNextTrip] = useState<Date | null>(
        activeFlight?.departureDate ? new Date(activeFlight.departureDate) : null
      );

const [activeFlightCityImage, setActiveFlightCityImage] = useState<string | null>("")      

    //effects

    useEffect(() => {
        if(nextTrip !== null)
        if(nextTrip > new Date()){
            const interval = setInterval(() => {
                setNextTrip(new Date(nextTrip.getTime() - 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeFlight, nextTrip])


   //translations
  const app = useTranslations("App");


  return (
    <div className="flex items-start h-screen">
      <div className="flex flex-col w-full  gap-3 md:gap-0 lg:gap-0">
        <div className="travel-reminder mt-6 ml-[20px] flex flex-col gap-[3px] w-[340px] md:w-[1290px] lg:w-[1290px] h-[200px] md:h-[259px] lg:h-[259px]">
          <div className="relative w-full h-[200px] md:h-[248px] lg:h-[248px]">
            <Image
              src={
                activeFlight?.status === "active" ? `/images/dashboard/testImage/${activeFlight?.arrivalAirport}.jpg` : "/images/dashboard/baseTravel.svg"
              }
              alt="Travel"
              fill={true}
              className="opacity-75 rounded-[10px]"
            />
            <div className="absolute inset-0 flex items-center justify-start rounded-[10px] h-[200px] md:h-[248px] lg:h-[248px] bg-black bg-opacity-60 ">
              <div className="text flex flex-col justify-start items-start ml-[20px]">
              <p className="text-white text-[15px] md:text-[35px] lg:text-[35px] font-semibold text-center mb-2">
               {
                    !nextTrip ? `${app("No_Trips")}` :  ` ${app("Only")} ${nextTrip.getDate() - 1} ${app("Left_Date")}`
               }
              </p>
                <p className="text-white text-[12px] md:text-[24px] lg:text-[24px] font-semibold">
                    {activeFlight?.departureAirport} {" "}
                    {activeFlight?.departureAirport && activeFlight?.arrivalAirport ? `${app("To")}` : ""}
                     {" "}
                     {activeFlight?.arrivalAirport}
                </p>
                <p className="text-white text-[10px] md:text-[12px] lg:text-[12px] font-normal mt-2">
                   {
                    activeFlight?.bookingReference && activeFlight?.status ? `${app("Reference")}:` : ""
                   } {activeFlight?.bookingReference}
                </p>
                <div className="flex flex-col justify-start items-start mt-8">
                    {
                        activeFlight?.status ? <DashboardButton type="manage" text={app("Manage_Booking")}/> : <DashboardButton type="book" text={app("Book_Now")}/>
                    }
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-auto">
                <div className="flex flex-row justify-between items-center w-full h-[50px]">
                    <p className="text-[#000000] text-[14px] md:text-[24px] lg:text-[24px] font-semibold ml-[20px]">
                        {app("Latest_travel_recommendations")}
                    </p>
                    <div className="flex flex-row justify-end items-center w-[666px] h-[36px] mr-[20px] gap-5">
                        <button className="hidden md:flex lg:flex flex-row justify-center items-center w-[130px] h-[30px] gap-4 rounded-[20px] bg-[#FFFFFF] border-1 border-solid border-[#000000]">
                            <span className="text-[#000000] text-[16px] font-bold">
                                {app("Location")}
                            </span>
                            <Image
                                src="/images/dashboard/seeAll.svg"
                                alt="See All"
                                width={18}
                                height={18}
                            />
                        </button>
                        <button className="hidden md:flex lg:flex flex-row justify-center items-center w-[150px] h-[30px] rounded-[20px] gap-4 bg-[#FFFFFF] border-1 border-solid border-[#000000]">
                            <span className="text-[#000000] text-[16px] font-bold">
                                {app("Travel_class")}
                            </span>
                            <Image
                                src="/images/dashboard/seeAll.svg"
                                alt="See All"
                                width={18}
                                height={18}
                            />
                        </button>
                        <button className="hidden md:flex lg:flex flex-row justify-center items-center w-[130px] h-[30px] rounded-[20px] gap-4 bg-[#FFFFFF] border-1 border-solid border-[#000000]">
                            <span className="text-[#000000] text-[16px] font-bold">
                                {app("Price")}
                            </span>
                            <Image
                                src="/images/dashboard/seeAll.svg"
                                alt="See All"
                                width={18}
                                height={18}
                            />
                        </button>
                        <button className="hidden md:flex lg:flex flex-row justify-center items-center w-[150px] h-[30px] rounded-[20px] gap-4 bg-[#FFFFFF] border-1 border-solid border-[#000000]">
                            <span className="text-[#000000] text-[16px] font-bold">
                                {app("More_Filters")}
                            </span>
                            <Image
                                src="/images/dashboard/seeAll.svg"
                                alt="See All"
                                width={18}
                                height={18}
                            />
                        </button>
                        <button className="flex md:hidden lg:hidden flex-row justify-center items-center w-[30px] h-[30px] rounded-[20px] bg-[#FFFFFF] border-1 border-solid border-[#000000]">
                            <Image
                                src="/images/dashboard/seeAll.svg"
                                alt="See All"
                                width={18}
                                height={18}
                            />
                        </button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}

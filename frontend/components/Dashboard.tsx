"use client";

import {
  ITravelRecommendationProps,
  IUserProps,
} from "@/addons/interface/interfaces";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import DashboardButton from "./DashboardButton";
import Link from "./Link";

export default function Dashboard({
  locale,
  userProps,
}: {
  locale: string;
  userProps: IUserProps;
}) {
  //states
  const [flights, setFlights] = useState(userProps.flights);
  const [activeFlight, setActiveFlight] = useState<
    IUserProps["flights"][0] | null
  >(flights.length > 0 ? flights[0] : null);

  const [nextTrip, setNextTrip] = useState<Date | null>(
    activeFlight?.departureDate ? new Date(activeFlight.departureDate) : null
  );

  const [activeFlightCityImage, setActiveFlightCityImage] = useState<
    string | null
  >("");

  const [travelRecommendations, setTravelRecommendations] = useState<IUserProps["travelRecommendations"]>(
    userProps.travelRecommendations
  )

  //effects

  useEffect(() => {
    if (nextTrip !== null)
      if (nextTrip > new Date()) {
        const interval = setInterval(() => {
          setNextTrip(new Date(nextTrip.getTime() - 1000));
        }, 1000);
        return () => clearInterval(interval);
      }
  }, [activeFlight, nextTrip]);

  //translations
  const app = useTranslations("App");

  return (
    <div className="flex items-start h-screen">
      <div className="flex flex-col w-full  gap-3 md:gap-0 lg:gap-0">
        <div className="travel-reminder mt-6 ml-[20px] flex flex-col gap-[3px] w-[340px] md:w-[1390px] lg:w-[1390px] h-[200px] md:h-[259px] lg:h-[259px]">
          <div className="relative w-full h-[200px] md:h-[248px] lg:h-[248px]">
            <Image
              src={
                activeFlight?.status === "active"
                  ? `/images/dashboard/testImage/${activeFlight?.arrivalAirport}.jpg`
                  : "/images/dashboard/baseTravel.svg"
              }
              alt="Travel"
              fill={true}
              className="opacity-75 rounded-[10px]"
            />
            <div className="absolute inset-0 flex items-center justify-start rounded-[10px] h-[200px] md:h-[248px] lg:h-[248px] bg-black bg-opacity-60 ">
              <div className="text flex flex-col justify-start items-start ml-[20px]">
                <p className="text-white text-[15px] md:text-[35px] lg:text-[35px] font-semibold text-center mb-2">
                  {!nextTrip
                    ? `${app("No_Trips")}`
                    : ` ${app("Only")} ${nextTrip.getDate() - 1} ${app(
                        "Left_Date"
                      )}`}
                </p>
                <p className="text-white text-[12px] md:text-[24px] lg:text-[24px] font-semibold">
                  {activeFlight?.departureAirport}{" "}
                  {activeFlight?.departureAirport &&
                  activeFlight?.arrivalAirport
                    ? `${app("To")}`
                    : ""}{" "}
                  {activeFlight?.arrivalAirport}
                </p>
                <p className="text-white text-[10px] md:text-[12px] lg:text-[12px] font-normal mt-2">
                  {activeFlight?.bookingReference && activeFlight?.status
                    ? `${app("Reference")}:`
                    : ""}{" "}
                  {activeFlight?.bookingReference}
                </p>
                <div className="flex flex-col justify-start items-start mt-8">
                  {activeFlight?.status ? (
                    <>
                      <Link
                        href={`/app/flights/${activeFlight?.bookingReference}`}
                      >
                        <DashboardButton
                          type="manage"
                          text={app("Manage_Booking")}
                        />
                      </Link>
                    </>
                  ) : (
                    <DashboardButton type="book" text={app("Book_Now")} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full h-auto">
          <div className="flex flex-row justify-between md:justify-start items-center w-full h-[50px]">
            <p className="text-[#000000] text-[14px] md:text-[24px] lg:text-[24px] font-semibold ml-[20px]">
              {app("Latest_travel_recommendations")}
            </p>
            <div className="flex flex-row justify-center relative left-[80px] md:left-[355px] items-center w-[666px] h-[36px] mr-[20px] gap-5">
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
          <div className="w-[1400px] h-auto grid grid-cols-1 md:grid-cols-3 gap-[20px]">{
             travelRecommendations.map((item, index) => (
                <div className="w-[338px] md:w-full lg:w-full h-[330px] md:h-[268px] bg-[#FFFFFF] border-1 border-solid border-[#EEEEEE] rounded-[10px] flex flex-col ml-[20px] mt-[20px]">
                    <div className="relative w-full h-[189px]">
                        <Image
                        src={`/images/dashboard/testImage/${item?.arrivalAirport}.jpg`}
                        alt="Travel"
                        fill={true}
                        className="rounded-t-[10px]"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-start items-start w-full h-[89px]">
                        <div className="flex flex-col justify-start items-start ml-[20px] mt-[10px]">
                            <p className="text-[#000000] text-[22px] w-[280px] font-semibold">
                                {item?.departureAirport} {" "}
                                {item?.departureAirport && item?.arrivalAirport ? `${app("To")}` : ""} {item?.arrivalAirport}
                            </p>
                            <p className="text-[#000000] text-[12px] font-semibold mt-[5px]">
                                {item?.subtitle}
                            </p>
                        </div>
                        <Link href={`/app/flights/book?booking=${item?.arrivalAirport}?from=${item?.departureAirport}?price=${item?.price}?class=${item?.travelClass}`}>
                        <button className="flex flex-col relative ml-4 md:ml-0 lg:ml-0 md:right-[15px] lg:right-[15px] w-[161px] h-[51px] justify-center items-center rounded-[10px] bg-gradient-to-r from-[#56CCF2] to-[#2F80ED] mt-[10px] hover:from-[#2F80ED] hover:to-[#56CCF2] transition-all duration-300 ease-in-out">
                            <p className="text-[#FFFFFF] text-[14px] font-semibold">
                                {item?.currency} {item?.price}*
                            </p>
                            <p className="text-[#FFFFFF] text-[12px] font-normal mt-[0px]">
                                {item?.flightType}/{item?.travelClass}
                            </p>
                        </button>
                        </Link>
                    </div>
                </div>
             )
             )
          }</div>
        </div>
      </div>
      <div className="hidden md:flex flex-col w-full h-auto">
        <div className="flex flex-row justify-between md:justify-start items-center w-full h-[50px]">
            <p className="text-[#000000] text-[14px] md:text-[24px] lg:text-[24px] font-semibold ml-[20px]">
                
            </p>
        </div>
      </div>
    </div>
  );
}

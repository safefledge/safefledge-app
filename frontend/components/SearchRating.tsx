"use client";
import { forwardRef, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AiOutlineSearch, AiOutlineCalendar } from "react-icons/ai";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaUserFriends,
} from "react-icons/fa";
import Link from "./Link";
import DatePicker from 'react-datepicker';
import './css/DatePickerCustom.css'

export default function SearchRating() {
  const [flightType, setFlightType] = useState("round-trip");
  const [showSetPassengers, setShowSetPassengers] = useState(false);
  const t = useTranslations("Home");


  ///Dates states

  const [departureDate, setDepartureDate] = useState<Date | null>();
  const [returnDate, setReturnDate] = useState<Date | null>(null);


  // Flight states

  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");


  /// Passengers states

  const [adults, setAdults] = useState(1);
  const [teens, setTeens] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const [canSearch, setCanSearch] = useState(false);

  const locale = useLocale();

  const CustomInput = forwardRef((props, ref) => {
    return (
      <div className="relative">
        <label
                htmlFor="departure-input"
                className="block text-sm font-medium text-gray-700 mb-2 hover:cursor-pointer"
              >
                {t("Hero_search_placeholder")}
              </label>
              <div className="flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
                  <AiOutlineCalendar className="text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  name="departure-input"
                  id="departure-input"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="dd/mm/yyyy"
                  //@ts-ignore
                  ref={ref}
                  {...props}
                />
                </div>
      </div>
    )
  })

  const CustomInput2 = forwardRef((props, ref) => {
    return (
    <div className="relative">
        <label
                htmlFor="departure-input"
                className="block text-sm font-medium text-gray-700 mb-2 hover:cursor-pointer"
              >
                {t("Hero_search_placeholder_2")}
              </label>
              <div className="flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
                  <AiOutlineCalendar className="text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  name="departure-input"
                  id="departure-input"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="dd/mm/yyyy"
                  //@ts-ignore
                  ref={ref}
                  {...props}
                />
                </div>
      </div>
    )
  })


  const onChangeRange = (dates: any) => {
    const [start, end] = dates;
    setDepartureDate(start);
    setReturnDate(end);
  }


  useEffect(() => {
    if (departureCity.length > 0 && arrivalCity.length > 0 && departureDate != null && returnDate != null) {
      setShowSetPassengers(true);
    } else {
      setShowSetPassengers(false);
    }
  }, [departureCity, arrivalCity]);

  const containerClass =
    flightType === "round-trip"
      ? "flex gap-8 mx-auto transition-all ease-out animate-fade-in-left"
      : "flex gap-8 mx-auto transition-all ease-out animate-fade-in-left";

  const containerSecond =
    "flex gap-8 mx-auto transition-all ease-out ml-2 animate-fade-in-left";

  return (
    <div className="h-full">
      <div
        className="bg-primary w-search-xxl h-search-xxl rounded-lg flex flex-col gap-4 relative z-10 mx-auto -my-20"
        style={{
          background: "rgba(255,255,255,0.8)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(10px)",
          //@ts-ignore
          "-webkit-backdrop-filter": "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <div className="flex justify-between ml-2 mt-3">
          <div>
            <button
              className={`px-4 py-2 rounded-large font-bold text-white ${
                flightType === "round-trip" ? "bg-blue-500" : "bg-gray-500"
              } mr-4`}
              onClick={() => setFlightType("round-trip")}
              style={{ transition: "background-color 0.3s" }}
            >
              {t("round_trip_flight")}
            </button>
            <button
              className={`px-4 py-2 rounded-large font-bold text-white ${
                flightType === "one-way" ? "bg-blue-500" : "bg-gray-500"
              } mr-4`}
              onClick={() => setFlightType("one-way")}
              style={{ transition: "background-color 0.3s" }}
            >
              {t("one_way_flight")}
            </button>
            <button
              className={`px-4 py-2 rounded-large font-bold text-white ${
                flightType === "multi-flight" ? "bg-blue-500" : "bg-gray-500"
              }`}
              onClick={() => setFlightType("multi-flight")}
              style={{ transition: "background-color 0.3s" }}
            >
              {t("multi_city_flight")}
            </button>
          </div>
          <div>
            <button
             className={`flex items-center mr-2 px-4 py-2 rounded-large font-bold text-white bg-gray-500 ${canSearch ? "hover:bg-blue-500 transition-all ease-in" : "cursor-not-allowed"}`}
             disabled={canSearch ? false : true}
             >
              <AiOutlineSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>
        {showSetPassengers === false ? (
          <div className={containerClass}>
            {flightType === "one-way" ? (
              <div className="relative">
                <DatePicker
                  id="departure-input"
                  customInput={<CustomInput />}
                  selected={departureDate}
                  onChange={(date) => setDepartureDate(date)}
                  placeholderText="DD/MM/YYYY"
                  className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10"
                />
              </div>
            ) : <div className="relative">
            <DatePicker 
            id="departure-input"
            customInput={<CustomInput/>}
            selected={departureDate}
            //@ts-ignore
            selectsRange
            startDate={departureDate}
            endDate={returnDate}
            onChange={onChangeRange}
            placeholderText="DD/MM/YYYY"
            className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10"
            />
        </div>}
            <div className="relative">
              <label
                htmlFor="departure-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("Hero_search_placeholder_3")}
              </label>
              <div className="flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
                  <FaPlaneDeparture className="text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  id="departure-input"
                  placeholder="Airport or City"
                  onChange={(e) => setDepartureCity(e.target.value)}
                  className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10"
                />
              </div>
            </div>
            <div className="relative mr-2">
              <label
                htmlFor="departure-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("Hero_search_placeholder_4")}
              </label>
              <div className="flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
                  <FaPlaneArrival className="text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  id="departure-input"
                  placeholder="Airport or City"
                  onChange={(e) => setArrivalCity(e.target.value)}
                  className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={containerSecond}>
            <div className="relative">
              <label
                htmlFor="passenger-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("Hero_search_placeholder_5")}
              </label>
              <div className="flex items-center">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 mt-6">
                  <FaUserFriends className="text-gray-400 text-lg" />
                </span>
                <input
                  type="text"
                  id="passenger-input"
                  placeholder="Passengers"
                  readOnly
                  value={`${adults} Adult${
                    adults > 1 ? "s" : ""
                  }, ${teens} Teen${
                    teens > 1 ? "s" : ""
                  }, ${children} Children${children > 1 ? "s" : ""}, ${
                    infants > 0 ? infants : "No"
                  } Infant${infants > 1 ? "s" : ""}`}
                  onClick={() => setShowOptions(!showOptions)}
                  onBlur={() => setShowOptions(false)}
                  className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pl-10 cursor-pointer"
                />
                <div className="flex items-center ml-4">
                  <input
                    type="checkbox"
                    id="option"
                    checked={canSearch}
                    onChange={() => setCanSearch(!canSearch)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="option" className="text-sm text-gray-600">
                  I confirm that I have read and accept <Link className="text-blue-600" href="/terms-and-conditions" locale={locale}>Terms and Conditions</Link> and <Link locale={locale} className="text-blue-600" href="/privacy-policy">Privacy Policy</Link>
                  </label>
                </div>

                {showOptions && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2">
                    <div className="p-4">
                      <div className="mb-4">
                        <label
                          htmlFor="adults"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("Passengers_Adults")} (18+)
                        </label>
                        <input
                          type="number"
                          id="adults"
                          min="0"
                          max="9"
                          value={adults}
                          onChange={(e) => setAdults(parseInt(e.target.value))}
                          className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="teens"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("Passengers_Teens")} (12-17)
                        </label>
                        <input
                          type="number"
                          id="teens"
                          min="0"
                          max="9"
                          value={teens}
                          onChange={(e) => setTeens(parseInt(e.target.value))}
                          className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="children"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("Passengers_Children")} (2-11)
                        </label>
                        <input
                          type="number"
                          id="children"
                          min="0"
                          max="9"
                          value={children}
                          onChange={(e) =>
                            setChildren(parseInt(e.target.value))
                          }
                          className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="infants"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {t("Passengers_Infant")} (0-2)
                        </label>
                        <input
                          type="number"
                          id="infants"
                          min="0"
                          max="9"
                          value={infants}
                          onChange={(e) => setInfants(parseInt(e.target.value))}
                          className="w-full px-4 py-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client"
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import MultiCity from "./MultiCity";


export default function BookingMultiCity(){
    const [multiCity, setMultiCity] = useState(false);
    const [multiCityCount, setMultiCityCount] = useState(1);
    const [multiCityInputs, setMultiCityInputs] = useState([
        {
            id: 1,
            name: "Input 1"
        }
    ])

    function addInput(){
        setMultiCityCount(multiCityCount + 1);
        setMultiCityInputs([
            ...multiCityInputs,
            {
                id: multiCityCount + 1,
                name: `Input ${multiCityCount + 1}`
            }
        ])
    }

    function removeInput(){
        console.log(multiCityCount)
        setMultiCityCount(multiCityCount - 1);
        setMultiCityInputs([
            ...multiCityInputs,
            {
                id: multiCityCount - 1,
                name: `Input ${multiCityCount - 1}`
            }
        ])
        ///check if user want to remove input with 1 input left
        if (multiCityCount === 1){
            alert("You must have at least one input");
        }
    }

    

    return (
        <div className="flex flex-col items-center w-full h-full mt-5">
            {multiCityInputs.map((index) => (
                <MultiCity key={index.id} index={index.id}/>
            ))}
            <div className="items-start w-full h-[60px] pl-4 gap-4">
            <button className="flex flex-row w-[221px] h-[48px] items-start pt-[6px] pr-[24px]"
            onClick={() => addInput()}
            >
                <span className="flex items-center justify-center w-full h-full text-black border-black border-solid border-1 rounded-[35px]">
                    <Image
                    src="/images/booking/Plus.svg"
                    alt="Plus Icon"
                    width={32}
                    height={32}
                    />
                    <span className=" font-normal">Add Another Flight</span>
                </span>
            </button>
            </div>
            <button className="flex flex-row w-[209px] h-[48px] mb-2 bg-[#2F80ED] rounded-[35px]">
                <span className="flex items-center justify-center w-full h-full text-white">
                    <Image
                    src="/images/booking/Search.svg"
                    alt="Search Icon"
                    width={32}
                    height={32}
                    />
                    <span className="ml-2 font-semibold">Search Flights</span>
                </span>
            </button>
        </div>
    )
}
"use client"
import Image from "next/image"

export default function MultiCity({
    index
} : {
    index: number
}){
    return (
        <div className="flex flex-row w-full h-[60px] pl-4 gap-4">
                <div className="departure-input relative">
                    <div className="flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center mb-4 pl-1">
                            <Image
                            src="/images/booking/DeparturePlane.svg"
                            alt="Departure Plane Icon"
                            width={32}
                            height={32}
                            />
                        </span>
                        <input
                        type="text"
                        name="departure"
                        id="departure"
                        className="focus:outline-none focus:ring-[#2F80ED] focus:border-[#2F80ED] block pl-10 placeholder:text-black  w-[274px] h-[48px] sm:text-sm border-[#00000040] border-solid border-1 rounded-[35px]"
                        placeholder="Departure Airport/City"
                        />
                    </div>
                </div>
                <div className="arrival-input relative">
                    <div className="flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center mb-4 pl-1">
                            <Image
                            src="/images/booking/ArrivalPlane.svg"
                            alt="arrival Plane Icon"
                            width={32}
                            height={32}
                            />
                        </span>
                        <input
                        type="text"
                        name="arrival"
                        id="arrival"
                        className="focus:outline-none focus:ring-[#2F80ED] focus:border-[#2F80ED] block pl-10  placeholder:text-black w-[274px] h-[48px] sm:text-sm border-[#00000040] border-solid border-1 rounded-[35px]"
                        placeholder="Arrival Airport/City"
                        />
                    </div>
                </div>
                <div className="outbound-input relative">
                    <div className="flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center mb-4 pl-1">
                            <Image
                            src="/images/booking/Outbound.svg"
                            alt="outbound Icon"
                            width={32}
                            height={32}
                            />
                        </span>
                        <input
                        type="text"
                        name="outbound"
                        id="outbound"
                        className="focus:outline-none focus:ring-[#2F80ED] focus:border-[#2F80ED] block pl-10 placeholder:text-black w-[193px] h-[48px] sm:text-sm border-[#00000040] border-solid border-1 rounded-[35px]"
                        placeholder="Outbound"
                        />
                    </div>
                </div>
                <div className="return-input relative">
                    <div className="flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center mb-4 pl-1">
                            <Image
                            src="/images/booking/Outbound.svg"
                            alt="Return Plane Icon"
                            width={32}
                            height={32}
                            />
                        </span>
                        <input
                        type="text"
                        name="Return"
                        id="Return"
                        className="focus:outline-none focus:ring-[#2F80ED] focus:border-[#2F80ED] block placeholder:text-black pl-10 w-[193px] h-[48px] sm:text-sm border-[#00000040] border-solid border-1 rounded-[35px]"
                        placeholder="Return"
                        />
                    </div>
                </div>
                <div className="passengers-input relative">
                    <div className="flex items-center">
                        <span className="absolute inset-y-0 left-0 flex items-center mb-4 pl-1">
                            <Image
                            src="/images/booking/Passengers.svg"
                            alt="Passengers Plane Icon"
                            width={32}
                            height={32}
                            />
                        </span>
                        <input
                        type="text"
                        name="Passengers"
                        id="Passengers"
                        className="focus:outline-none focus:ring-[#2F80ED] focus:border-[#2F80ED] block placeholder:text-black placeholder:ml-4 pl-10 w-[193px] h-[48px] sm:text-sm border-[#00000040] border-solid border-1  rounded-[35px]"
                        placeholder="Passengers"
                        />
                    </div>
                </div>
            </div>
    )
}
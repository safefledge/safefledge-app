import Image from "next/image"


export default function DashboardButton({type, text} : {
    type: "manage" | "book",
    text: string
}){
    return (
        <button className="w-[215px] h-[40px] border-solid border-1 border-[#FFFFFF] rounded-[25px] text-white text-[16px] font-normal">
            <div className="flex flex-row justify-center items-center">
                <p className="mr-2">
                    {text}
                </p>
                <div className="flex flex-row justify-center items-center">
                    {
                        type === "manage" ? (
                            <Image
                        src="/images/dashboard/Manage.svg"
                        alt="Manage"
                        width={20}
                        height={20}
                    />
                        ) : (
                            <Image
                        src="/images/dashboard/Manage.svg"
                        alt="Book"
                        width={20}
                        height={20}
                    />
                        )
                     }
                </div>
            </div>
        </button>
    )
}
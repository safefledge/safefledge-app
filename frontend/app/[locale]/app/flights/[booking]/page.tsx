"use client"



export default function Page({
    params
} : {
    params: {
        booking: string
        slug: string
    }
}){
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-[100%] h-[100%] flex flex-col items-center justify-center">
                {params.booking}
            </div>
        </div>
    )
}
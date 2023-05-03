"use client"

import Dashboard from "@/components/Dashboard";
import useSession from "@/hooks/useSession";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";
import Loading from "@/components/Loading";


export default function Page(){
    const locale = useLocale();
    const {loading, session} = useSession();

    const router = useRouter();

    if(loading){
       <Loading />
    }
    if(session){
        return (
            <>
            <section className="dashboard">
            <Dashboard locale={locale} userProps={
            {
               email: "marcelborowczak@outlook.com",
               avatar: "https://avatars.githubusercontent.com/u/56132740?v=4",
               fullname: "Marcel Borowczak",
               flights: [
                {
                    id: 1,
                    departureAirport: "Warsaw",
                    arrivalAirport: "London",
                    departureDate: "2023-05-15",
                    flightType: "round-trip",
                    departureTime: "10:00",
                    price: 100,
                    currency: "PLN",
                    airline: "Lot Polish Airlines",
                    flightNumber: "LOT245",
                    status: "active",
                    bookingReference: "FA2WD3"
                },
                {
                    id: 2,
                    departureAirport: "London",
                    arrivalAirport: "Warsaw",
                    departureDate: "2023-05-20",
                    flightType: "round-trip",
                    departureTime: "10:00",
                    price: 100,
                    currency: "PLN",
                    airline: "Lot Polish Airlines",
                    flightNumber: "LOT246",
                    status: "active",
                    bookingReference: "FASWD3"
                }
               ]
            }
           }/>
            </section>
            </>
        )
    } else if (session === false){
        return router.push(`${locale}/auth/login`);
    }
}
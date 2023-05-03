"use client"

import Dashboard from "@/components/Dashboard";
import useSession from "@/hooks/useSession";
import { useRouter } from 'next/navigation';
import { useLocale } from "next-intl";
import Loading from "@/components/Loading";
import { useEffect } from "react";


export default function Page(){
    const locale = useLocale();
    const {loading, session} = useSession();
    const router = useRouter();


    if(loading === true){
       return <Loading />
    }
    if(session === true){
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
               ],
               travelRecommendations: [
                {
                    departureAirport: "London",
                    arrivalAirport: "Warsaw",
                    subtitle: "Poland",
                    price: 650,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Milan",
                    arrivalAirport: "Amsterdam",
                    subtitle: "Netherlands",
                    price: 700,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Poznań",
                    arrivalAirport: "Berlin",
                    subtitle: "Germany",
                    price: 850,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Cracow",
                    arrivalAirport: "Paris",
                    subtitle: "France",
                    price: 950,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Warsaw",
                    arrivalAirport: "Budapest",
                    subtitle: "Hungary",
                    price: 1000,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Milan",
                    arrivalAirport: "Dubai",
                    subtitle: "United Arab Emirates",
                    price: 1200,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Berlin",
                    arrivalAirport: "Neapol",
                    subtitle: "Italy",
                    price: 1200,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Milan",
                    arrivalAirport: "Islamabad",
                    subtitle: "Pakistan",
                    price: 1200,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",
                },
                {
                    departureAirport: "Warsaw",
                    arrivalAirport: "Los Angeles",
                    subtitle: "United States",
                    price: 1200,
                    currency: "PLN",
                    flightType: "Round Trip",
                    travelClass: "Economy",

                }
                
               ]
            }
           }/>
            </section>
            </>
        )
    } else if (session === false) {
        return router.push(`/${locale}/auth/login`);
        
    }
}
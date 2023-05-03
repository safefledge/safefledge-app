import DashboardNavbar from "@/components/DashboardNavbar";
import { ReactNode } from "react";





export default function FlightsLayout({
    children
} : {
    children: ReactNode
}) {
    return (
        <>
        <nav>
            <DashboardNavbar tab="Flights"/>
        </nav>
        <section className="dashboard">
            {children}
        </section>
        </>
    )
}
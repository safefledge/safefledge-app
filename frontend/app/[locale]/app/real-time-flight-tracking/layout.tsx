import DashboardNavbar from "@/components/DashboardNavbar";
import { ReactNode } from "react";





export default function RealTimeTracking({
    children
} : {
    children: ReactNode
}) {
    return (
        <>
        <nav>
            <DashboardNavbar tab="Tracking"/>
        </nav>
        <section className="dashboard">
            {children}
        </section>
        </>
    )
}
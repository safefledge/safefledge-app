import DashboardNavbar from "@/components/DashboardNavbar";
import { ReactNode } from "react";





export default function HomeLayout({
    children
} : {
    children: ReactNode
}) {
    return (
        <>
        <nav>
            <DashboardNavbar tab="Home"/>
        </nav>
        <section className="dashboard">
            {children}
        </section>
        </>
    )
}
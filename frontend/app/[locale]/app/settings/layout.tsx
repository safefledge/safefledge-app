import DashboardNavbar from "@/components/DashboardNavbar";
import { ReactNode } from "react";





export default function SettingsLayout({
    children
} : {
    children: ReactNode
}) {
    return (
        <>
        <nav>
            <DashboardNavbar tab="Settings"/>
        </nav>
        <section className="dashboard">
            {children}
        </section>
        </>
    )
}
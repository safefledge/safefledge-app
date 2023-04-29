
import DashboardNavbar from "@/components/DashboardNavbar";
import { ReactNode } from "react";
import './app.css'



export const metadata = {
    title: 'SafeFledge',
    description: 'For sake of better air travel!',
}

type Props = {
    children: ReactNode;
    params: { locale: string };
}


export default async function AppLayout({
    children
} : Props) {
    return (
        <>
        <section className="nav-bar">
            <DashboardNavbar />
        </section>
            {children}
        </>
    )
}
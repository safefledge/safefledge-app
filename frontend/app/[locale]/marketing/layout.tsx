import { ReactNode } from "react";
import './marketing.css'



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
            {children}
        </>
    )
}
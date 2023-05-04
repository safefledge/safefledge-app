"use client";

import { useState, useEffect } from "react";


export default function useSession() {
    const [session, setSession] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function getSession() {
            const response = await fetch("https://api.safefledge.com/v2/session/check");
            const session = await response.json();
            if (session.message === "Authorized") {
                setSession(true);
                setLoading(false);
            } else {
                setSession(true); // set to false
                setLoading(false);
            }
        }

        getSession();
    }, []);

    return { session, loading };
}
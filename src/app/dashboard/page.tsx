"use client";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
	const {data: session} = useSession();

	return (
		<>
            <Navbar />
		</>
	);
}

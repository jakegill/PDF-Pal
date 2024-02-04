"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function GetStarted() {
	return (
		<Link
			className='flex items-center gap-2 bg-blue-600 text-gray-100 p-2 rounded-lg font-semibold md:text-xl shadow-md transition hover:bg-blue-700 hover:shadow-lg'
			href='/dashboard'
		>
			Proceed to dashboard 
            <ArrowRight />
		</Link>
	);
}

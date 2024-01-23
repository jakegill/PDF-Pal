"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
	const { data: session } = useSession();

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<Navbar />
			<div className='h-[89vh] py-4 px-8 md:px-20'>
				{/* Layout desktop*/}
				<div className='md:flex justify-between'>
					<h1 className='text-lg md:text-3xl font-semibold '>My PDFs</h1>
					<button
						onClick={() => setIsDialogOpen(true)}
						className='hidden md:flex px-8 py-3 bg-blue-800 text-slate-200 font-semibold text-ld rounded-md hover:shadow-md'
					>
						Upload PDF
					</button>
				</div>

				<main className='h-[70vh] md:h-[75vh] bg-red-100'></main>

				{/* Layout mobile */}
				<div className='md:hidden h-[10vh] flex justify-center items-center'>
					<button
						onClick={() => setIsDialogOpen(true)}
						className='px-8 py-3 bg-blue-800 text-slate-200 font-semibold text-ld rounded-md hover:shadow-md'
					>
						Upload PDF
					</button>
				</div>
			</div>

			{isDialogOpen && (
				<div className='fixed z-30 top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out'>
					<dialog open className='rounded-lg p-4 bg-white shadow-md'>
						<div className='flex gap-8'>
							<h2 className='text-md mb-4'>Upload your PDF</h2>
							<X
								className='text-red-600 cursor-pointer'
								onClick={() => setIsDialogOpen(false)}
							/>
						</div>
					</dialog>
				</div>
			)}
		</>
	);
}

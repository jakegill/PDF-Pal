"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileCard from "@/components/FileCard";
import { getFiles } from "@/lib/files";
import type { File } from "@/lib/types";

export default function Dashboard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const session = useSession();

	//Get all of the user's files
	useEffect(() => {
		if (session.data) {
			getFiles(session.data.user.id).then((data) => {
				setFiles(data);
			});
		}
	}, [session.data]);

	return (
		<>
			<Navbar />
			<div
				onClick={() => console.log(files)}
				className='h-[89vh] py-4 px-8 md:px-20'
			>
				{/* Layout desktop*/}
				<div className='md:flex justify-between py-4'>
					<h1 className='text-lg md:text-3xl font-semibold '>My PDFs</h1>
					<button
						onClick={() => setIsDialogOpen(true)}
						className='hidden md:flex px-8 py-3 bg-blue-800 hover:bg-blue-700 transition text-slate-200 font-semibold text-ld rounded-md hover:shadow-md'
					>
						Upload PDF
					</button>
				</div>

				<main className='h-[67vh] md:h-[75v] grid grid-cols-1 md:grid-cols-3 gap-y-3 md:gap-x-3 overflow-y-auto'>
					{files && files.length > 0 ? (
						files.map((file) => <FileCard key={file.id} file={file} />)
					) : (
						<div className="w-full h-full flex items-center justify-center md:col-span-3">No Files</div>
					)}
				</main>

				{/* Layout mobile */}
				<div className='md:hidden h-[10vh] flex justify-center items-center'>
					<button
						onClick={() => setIsDialogOpen(true)}
						className='px-8 py-3 bg-blue-800 hover:bg-blue-700 transition cursor-pointer text-slate-200 font-semibold text-ld rounded-md hover:shadow-md'
					>
						Upload PDF
					</button>
				</div>
			</div>

			{isDialogOpen && (
				<div className='fixed z-30 top-0 left-0 w-full h-full flex items-center justify-center transition backdrop-blur-sm transition-opacity duration-300 ease-in-out'>
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

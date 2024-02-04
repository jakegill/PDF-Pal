"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import FileCard from "@/components/FileCard";
import UploadDropzone from "@/components/UploadDropzone";
import { getFiles } from "@/lib/files";
import type { PdfFile } from "@/lib/types";


export default function Dashboard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [files, setFiles] = useState<PdfFile[]>([]);
	const session = useSession();

	//Get all of the user's files
	useEffect(() => {
		setIsLoading(true);
		if (session.data) {
			getFiles(session.data.user.id).then((data) => {
				setFiles(data);
			});
			setIsLoading(false);
		} 

	}, [session.data]);

	//delete file callback
	const handleFileDelete = (fileId: string) => {
		const updatedFiles = files.filter((file) => file.id !== fileId);
		setFiles(updatedFiles);
	};

	return (
		<>
			<Navbar />
			<div className='h-[89vh] py-4 px-8 md:px-20'>
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

				<main className='h-[67vh] md:h-[75v] grid grid-cols-1 grid-rows-auto md:grid-cols-3 md:grid-rows-[16vh] gap-y-3 md:gap-x-3 overflow-y-auto'>
					{files && files.length > 0 ? (
						files.map((file) => (
							<FileCard key={file.id} file={file} onDelete={handleFileDelete} />
						))
					) : (
						<div className='w-full h-full flex items-center justify-center md:col-span-3'>
							<Loader2 className={"text-blue-600 animate-spin h-[20vh] w-[20vw] md:h-[10vh] md:w-[10vw] md:mt-[10vh]"}/>
						</div>
					)}
				</main>

				{/* Layout mobile */}
				<div className='md:hidden h-[10vh] flex justify-center items-center'>
					<button
						onClick={() => setIsDialogOpen(true)}
						className='px-8 py-3 bg-blue-800 hover:bg-blue-700 transition cursor-pointer text-slate-200 rounded-md hover:shadow-md'
					>
						Upload PDF
					</button>
				</div>
			</div>

			{isDialogOpen && (
				<div className='fixed z-30 top-0 left-0 w-full h-full flex items-center justify-center transition backdrop-blur-sm transition-opacity duration-300 ease-in-out'>
					<dialog open className='rounded-lg p-4 bg-white shadow-md'>
						<div className='flex gap-2 flex-col'>
							<div className='flex justify-between'>
								<h2 className='text-md'>Upload your PDF</h2>
								<X
									className='text-red-600 cursor-pointer'
									onClick={() => setIsDialogOpen(false)}
								/>
							</div>
							<UploadDropzone />
						</div>
					</dialog>
				</div>
			)}
		</>
	);
}

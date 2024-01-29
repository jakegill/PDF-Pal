//for dashboard
"use client";
import type { PdfFile } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { deleteFile } from "@/lib/files";

interface FileCardProps {
	file: PdfFile;
	onDelete: (fileId: string) => void;
}

export default function FileCard({ file, onDelete }: FileCardProps) {
	const updatedAtDate = new Date(file.updatedAt);
	const formattedDate = updatedAtDate.toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});

	const handleDeleteClick = async () => {
		try {
			await deleteFile(file.id);
			onDelete(file.id);
		} catch (error) {
			console.log(error);
		}
	};

	const handleCardClick = (event: any) => {
		if (!event.target.classList.contains("delete-btn")) {
			window.location.href = `/dashboard/${file.name}`;
		}
	};

	return (
		<div
			onClick={handleCardClick}
			className='h-[16.5vh] md:h-[16vh] cursor-pointer flex flex-col p-2 bg-white-100 border-[1px] border-zinc-300 hover:shadow-lg transition rounded-md'
		>
			<h2 className='md:text-lg font-semibold px-2 py-3 border-b-[0.5px] border-zinc-300'>
				{file.name}
			</h2>
			<div className='flex justify-between py-3 px-2 items-center'>
				<time className=''>{formattedDate}</time>
				<p>{file.uploadStatus}</p>
				<div
					onClick={handleDeleteClick}
					className='delete-btn w-[15vw] md:w-[5vw] p-1 bg-red-100 hover:bg-red-200 transition flex justify-center items-center rounded-md'
				>
					<Trash2 className='text-red-600' />
				</div>
			</div>
		</div>
	);
}

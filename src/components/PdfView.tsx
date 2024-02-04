"use client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfView() {
	const [fileUrl, setFileUrl] = useState<string | null>(null);
	const [currentPageNumber, setCurrentPageNumber] = useState(1);
	const [numPages, setNumPages] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	const getUrl = async (fileId: string) => {
		try {
			const response = await fetch(`/api/files/${fileId}`);
			const data = await response.json();
			if (data.url) {
				setFileUrl(data.url);
			}
		} catch (error) {
			console.error("Error getting file.", error);
		}
	};

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			const fileId = window.location.pathname.split("/")[2];
			await getUrl(fileId);
			setIsLoading(false);
		})();
	}, []);

	return (
		<div className='flex flex-col'>
			<section className='bg-white shadow-md flex justify-center my-[1vh] p-[1px] md:p-[3px]'>
				<div className='flex gap-[1vw]'>
					<ChevronLeft
						onClick={() => {
							if (currentPageNumber > 1) {
								setCurrentPageNumber(currentPageNumber - 1);
							}
						}}
						className='cursor-pointer'
					/>
					<div>
						<input
							onChange={(e) => {
								if (
									parseInt(e.target.value, 10) > 0 &&
									parseInt(e.target.value, 10) <= numPages
								) {
									setCurrentPageNumber(parseInt(e.target.value, 10));
								}
							}}
							type='text'
							className='text-center border border-zinc-400 w-[2vw]'
							placeholder={currentPageNumber.toString()}
						/>{" "}
						/ {numPages !== 0 ? numPages : " x"}
					</div>
					<ChevronRight
						onClick={() => {
							if (currentPageNumber < numPages) {
								setCurrentPageNumber(currentPageNumber + 1);
							}
						}}
						className='cursor-pointer'
					/>
				</div>
			</section>
			{isLoading ? (
				<div className='h-[68vh] flex items-center'>
					<div className="flex flex-col items-center gap-2 justify-center">
						<Loader2 className='animate-spin h-[20vh] w-[20vw] md:h-[6vh] md:w-[6vw] md:mt-[10vh] text-blue-600' />
						<p className='text-sm text-zinc-600'>Rendering your PDF.</p>
					</div>
				</div>
			) : (
				<Document
					className='max-h-full'
					file={fileUrl}
					onLoadSuccess={({ numPages }) => setNumPages(numPages)}
				>
					<Page
						className='shadow-md max-h-full'
						pageNumber={currentPageNumber}
					/>
				</Document>
			)}
		</div>
	);
}

"use client";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { useEffect, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfView() {
	const [fileUrl, setFileUrl] = useState<string | null>(null);

	const fileId = window.location.pathname.split("/")[2];

	const getUrl = async () => {
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
		(async () => {
			await getUrl();
		})();
	}, []);

	return (
		<div >
			{fileUrl && (
				<Document file={fileUrl}>
					<Page pageNumber={1} />
				</Document>
			)}
		</div>
	);
}

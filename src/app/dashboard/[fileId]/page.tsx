import Navbar from "@/components/Navbar";
import PdfView from "@/components/PdfView";
import ChatBot from "@/components/ChatBot";

export default function PdfPage({ params }: { params: { fileId: string } }) {
	return (
		<>
			<Navbar />
			<div className="flex flex-col md:flex-row">
				<section className="h-[60vh] border-b-[1px] md:w-[65vw] md:border-r-[1px] border-zinc-300 md:h-[89vh]">
					<PdfView />
				</section>
				<section className="md:w-[35vw] md:h-[89vh]">
					<ChatBot />
				</section>
			</div>
		</>
	);
}

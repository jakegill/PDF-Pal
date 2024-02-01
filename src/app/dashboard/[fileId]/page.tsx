import Navbar from "@/components/Navbar";
import PdfView from "@/components/PdfView";
import ChatBot from "@/components/chatbot/ChatBot";

export default function PdfPage({ params }: { params: { fileId: string } }) {
	return (
		<>
			<Navbar />
			<div className="flex flex-col md:flex-row ">
				<section className="bg-zinc-100 h-[60vh] border-b-[1px] md:w-[60vw] md:border-r-[1px] border-zinc-300 md:h-[89vh] flex justify-center">
					<PdfView />
				</section>
				<section className="md:w-[40vw] md:h-[89vh] relative">
					<ChatBot />
				</section>
			</div>
		</>
	);
}

"use client"
import Navbar from "@/components/Navbar";
import PdfView from "@/components/PdfView";
import ChatBot from "@/components/chatbot/ChatBot";
import { ChatContextProvider } from "@/components/chatbot/ChatContext";
import { QueryClient, QueryClientProvider } from "react-query";

export default function PdfPage({ params }: { params: { fileId: string } }) {
	const queryClient = new QueryClient();

	return (
		<>
			<Navbar />
			<QueryClientProvider client={queryClient}>
				<ChatContextProvider fileId={params.fileId}>
					<div className='flex flex-col md:flex-row '>
						<section className='bg-zinc-100 h-[60vh] border-b-[1px] md:w-[60vw] md:border-r-[1px] border-zinc-300 md:h-[89vh] flex justify-center'>
							<PdfView />
						</section>
						<section className='md:w-[40vw] md:h-[89vh] relative'>
							<ChatBot />
						</section>
					</div>
				</ChatContextProvider>
			</QueryClientProvider>
		</>
	);
}

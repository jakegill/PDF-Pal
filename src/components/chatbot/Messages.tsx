"use client";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/components/chatbot/ChatContext";
import { Loader2 } from "lucide-react";

export default function Messages() {
	const { prevMessages } = useContext(ChatContext);
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [prevMessages]);

	return (
		<div className='flex flex-col-reverse overflow-y-auto h-[78vh] md:h-[80vh] md:w-[40vw]'>
			<div ref={bottomRef} />
			{prevMessages.length === 0 ? (
				<div className='h-[78vh] md:h-[80vh] md:w-[40vw] flex items-center justify-center'>
					<div className='flex flex-col items-center justify-center'>
						<Loader2 className='animate-spin h-[20vh] w-[20vw] md:h-[6vh] md:w-[6vw] md:mt-[10vh] text-blue-600 ' />
						<p className='text-sm text-zinc-600'>
							Getting your previous messages.
						</p>
					</div>
				</div>
			) : (
				prevMessages.map((message) => (
					<div
						key={message.id}
						className={`flex ${
							message.isUserMessage ? "justify-end" : "justify-start"
						}`}
					>
						<div
							className={`max-w-[75%] p-4 my-2 rounded-lg ${
								message.isUserMessage ? "bg-blue-500 text-white" : "bg-gray-100"
							}`}
						>
							<p>{message.text}</p>
						</div>
					</div>
				))
			)}
		</div>
	);
}

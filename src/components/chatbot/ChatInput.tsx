"use client";
import { Send } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "@/components/chatbot/ChatContext";

export default function ChatInput() {

	const {addMessage, handleInputChange, isLoading, message} = useContext(ChatContext)

	return (
		<form
			onSubmit={(e) => {
				if (!isLoading) {
					e.preventDefault();
					addMessage();
				}
			}}className='p-[2px] flex items-center absolute left-4 bottom-4 w-[92vw] md:w-[38vw] bg-white shadow-md border-zinc-300 border-[0.5px] md:h-[6vh]'
		>
			<input
				className='w-full h-full p-2 focus:border-blue-200 focus:border-[2px]'
				placeholder='Ask your pdf a question...'
				type='text'
				autoFocus
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey && !isLoading) {
						e.preventDefault();
						addMessage();
					}
				}}
				onChange={handleInputChange}
				value={message}
							/>
			<button onClick={() => {
				addMessage();
			}}type="submit" disabled={isLoading} className='p-2 mr-[2px] bg-blue-600 hover:bg-blue-500 transition text-slate-200 font-semibold text-ld rounded-md hover:shadow-md'>
				<Send />
			</button>
		</form>
	);
}
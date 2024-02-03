"use client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";

export default function ChatBot() {
	return (
		<div className='bg-slate-50 h-[89vh]'>
			<Messages />
			<ChatInput />
		</div>
	);
}

"use client";
import { createContext, useState, useEffect } from "react";
import { useMutation } from "react-query";
import type { ChatStream, ChatProviderProps, Message } from "@/lib/types";
import { getMessages } from "@/lib/messages";

export const ChatContext = createContext<ChatStream>({
	addMessage: () => {},
	message: "",
	prevMessages: [],
	handleInputChange: () => {},
	isLoading: false,
});

export const ChatContextProvider = ({
	fileId,
	children,
}: ChatProviderProps) => {
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [prevMessages, setPrevMessages] = useState<Message[]>([]);

	useEffect(() => {
		const fetchPrevMessages = async () => {
			try {
				const fetchedMessages = await getMessages(fileId);
				setPrevMessages(fetchedMessages);
			} catch (error) {
				console.log(error);
			}
		};
		fetchPrevMessages();
	}, []);

	const { mutate: sendMessage } = useMutation({
		mutationFn: async ({ message }: { message: string }) => {
			const response = await fetch("/api/message", {
				method: "POST",
				body: JSON.stringify({
					fileId,
					message,
				}),
			});
			if (!response.ok) {
				throw new Error("Failed to send message");
			}
			return response.body;
		},
		onMutate: async ({ message }) => {
			if (message.trim()) {
				setPrevMessages((currentMessages) => [
					{
						id: Date.now().toString(),
						text: message,
						isUserMessage: true,
						userId: "",
						fileId: "",
						createdAt: "",
						updatedAt: "",
					},
					...currentMessages,
				]);
				setPrevMessages((currentMessages) => [
					{
						id: "ai-temp-response",
						text: "Thinking...",
						isUserMessage: false,
						userId: "",
						fileId: "",
						createdAt: "",
						updatedAt: "",
					},
					...currentMessages,
				]);
			}
			setMessage("");
		},
		onSuccess: async (stream) => {
			const reader = stream?.getReader();
			const decoder = new TextDecoder();
			let done = false;
			let accResponse = "";
			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunk = decoder.decode(value, { stream: true });
				accResponse += chunk;
				setPrevMessages(prev => prev.map(msg => msg.id === 'ai-temp-response' ? { ...msg, text: accResponse } : msg));
			}
		},
	});

	const addMessage = () => {
		if (message.trim()) {
			sendMessage({ message });
		}
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};

	const value = {
		addMessage,
		message,
		handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
			setMessage(event.target.value),
		isLoading,
		prevMessages,
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

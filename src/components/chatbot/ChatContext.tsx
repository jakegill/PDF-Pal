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
	const [messageCounter, setMessageCounter] = useState<number>(0);

	useEffect(() => {
		const fetchPrevMessages = async () => {
			try {
				setIsLoading(true);
				const fetchedMessages = await getMessages(fileId);
				setPrevMessages(fetchedMessages);
			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
			setIsLoading(false);
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
				setPrevMessages((currentMessages: Message[]) => [
					{
						id: Date.now().toString(),
						text: message,
						isUserMessage: true,
						userId: "",
						fileId: "",
						createdAt: new Date,
						updatedAt: new Date,
					},
					...currentMessages,
				]);
				setPrevMessages((currentMessages: Message[]) => [
					{
						id: `ai-response-${messageCounter}`,
						text: "Thinking...",
						isUserMessage: false,
						userId: "",
						fileId: "",
						createdAt: new Date,
						updatedAt: new Date,
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
				// @ts-ignore
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunk = decoder.decode(value, { stream: true });
				accResponse += chunk;
				setPrevMessages(prev => prev.map(msg => msg.id === `ai-response-${messageCounter}` ? { ...msg, text: accResponse } : msg));
			}
			setMessageCounter(messageCounter + 1);
		},
		onError: (error) => {
			console.log(error);
		}
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

	// @ts-ignore
	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
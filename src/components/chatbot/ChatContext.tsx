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
			  console.log("fetch", fetchedMessages);
			  setPrevMessages(fetchedMessages); 
			} catch (error) {
				console.log(error);
			}
		  };
		fetchPrevMessages();
	},[])

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
						id: Date.now().toString(), // Temporary ID; replace with server-assigned ID later if needed
						text: message,
						isUserMessage: true, // Assuming all messages sent through this form are user messages
						userId: "", // Add the missing properties
						fileId: "",
						createdAt: "",
						updatedAt: "",
					},
					...currentMessages,
				]);
			}
			setMessage(""); // Clear the input field
		},
	});

	const addMessage = () => {
		sendMessage({ message });
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

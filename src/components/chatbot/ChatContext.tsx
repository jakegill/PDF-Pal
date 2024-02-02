"use client";
import { createContext, useState } from "react";
import { useMutation } from "react-query";

type ChatStream = {
	addMessage: () => void;
	message: string;
	handleInputChange: (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	isLoading: boolean;
};

export const ChatContext = createContext<ChatStream>({
	addMessage: () => {},
	message: "",
	handleInputChange: () => {},
	isLoading: false,
});

interface ChatProviderProps {
	fileId: string;
	children: React.ReactNode;
}

export const ChatContextProvider = ({
	fileId,
	children,
}: ChatProviderProps) => {
	const [message, setMessage] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

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
	});

	const addMessage = () => {
		sendMessage({ message });
        setMessage("");                    
	};

	const value = {
		addMessage,
		message,
		handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) =>
			setMessage(event.target.value),
		isLoading,
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(event.target.value);
	};

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

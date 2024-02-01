import { createContext, useState } from "react";
import { useMutation } from "react-query";

type ChatStream = {
    addMessage: () => void;
    message: string;
    handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
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

export const ChatProvider = ({ fileId, children }: ChatProviderProps) => {
    const [message, setMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const sendMessage = async () => {
        const response = await fetch(`/api/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileId, message }),
        });

        if (!response.ok) {
            throw new Error("Failed to send the message.");
        }
        return response.json();
    };

    const { mutate } = useMutation(sendMessage);

    const addMessage = () => {
        mutate();
    };

    const value = {
        addMessage,
        message,
        handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value),
        isLoading,
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
"use client"
import { useContext} from 'react';
import { ChatContext } from '@/components/chatbot/ChatContext';
import { getMessages } from '@/lib/messages';

export default function Messages() {
    const { prevMessages } = useContext(ChatContext); // Removed unused 'message'
  
    return (
      <div className='flex flex-col-reverse overflow-y-auto h-[78vh] md:h-[80vh] md:w-[40vw]'>
        {prevMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUserMessage ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] p-4 my-2 rounded-lg ${
                message.isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  

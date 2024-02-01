import { Send } from 'lucide-react'

export default function ChatInput() {
    return (
        <div className="flex items-center absolute left-4 bottom-4 w-[38vw] bg-white shadow-md border-zinc-300 border-[0.5px] h-[6vh]">
            <input className="w-full h-full p-2 focus:border-blue-200 focus:border-[2px]" placeholder="Ask your pdf a question..." type="text" />
            <button className="p-2 mr-[2px] bg-blue-600 hover:bg-blue-500 transition text-slate-200 font-semibold text-ld rounded-md hover:shadow-md">
                <Send />
            </button>
        </div>
    )
}
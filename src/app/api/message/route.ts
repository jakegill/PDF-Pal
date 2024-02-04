import { NextRequest } from "next/server";
import { chatInputValidator } from "@/lib/chatInputValidator";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from "@/lib/pinecone";
import { openai } from "@/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { authOptions } from "@/config/auth.config";
import type { OpenAIFormat } from "@/lib/types";

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);

	const body = await request.json();
	const { fileId, message } = chatInputValidator.parse(body);

	const file = await prisma.file.findUnique({
		where: {
			id: fileId,
		},
	});

	if (file) {
		await prisma.message.create({
			data: {
				text: message,
				isUserMessage: true,
				userId: session?.user.id,
				fileId: fileId,
			},
		});
	}

	//Vectorize message to query PDF vector...
	const pineconeIndex = pinecone.Index("pdf-pal-index");
	const embeddings = new OpenAIEmbeddings({
		openAIApiKey: process.env.OPENAI_API_KEY!,
	});
	const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
		pineconeIndex,
		namespace: fileId,
	});
	const responseMessage = await vectorStore.similaritySearch(message, 4);

	const previouslySentMessages = await prisma.message.findMany({
		where: {
			fileId: fileId,
		},
		orderBy: {
			createdAt: "asc",
		},
		take: 6,
	});

	//format messages for openai api:
	const formattedMessages: OpenAIFormat[] = previouslySentMessages.map((message) => ({
		role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
		content: message.text,
	}));
	const openaiResponse = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		temperature: 0,
		stream: true,
		messages: [
			{
				role: "system",
				content:
					"Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
			},
			{
				role: "user",
				content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
			  
		\n----------------\n
		
		PREVIOUS CONVERSATION:
		${formattedMessages.map((message) => {
			if (message.role === "user") return `User: ${message.content}\n`;
			return `Assistant: ${message.content}\n`;
		})}
		
		\n----------------\n
		
		CONTEXT:
		${responseMessage.map((r) => r.pageContent).join("\n\n")}
		
		USER INPUT: ${message}`,
			},
		],
	});

	const stream = OpenAIStream(openaiResponse, {
		async onCompletion(completion) {
			await prisma.message.create({
				data: {
					text: completion,
					isUserMessage: false,
					userId: session?.user.id,
					fileId: fileId,
				},
			});
		},
	});

	return new StreamingTextResponse(stream);
}
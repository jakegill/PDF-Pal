import { NextRequest } from "next/server";
import { chatInputValidator } from "@/lib/chatInputValidator";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
	const session = await getSession();
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
}

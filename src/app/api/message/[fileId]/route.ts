import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
	request: NextRequest,
	{ params }: { params: { fileId: string } }
) {
	const fileId = params.fileId;
	try {
		const messages = await prisma.message.findMany({
			where: {
				fileId,
			},
			take: 18,
			orderBy: {
				createdAt: "desc",
			},
		});
		if (messages) {
            return NextResponse.json(messages);
		}
	} catch (error) {
		return {
			status: 500,
            body: error,
		};
	}
}

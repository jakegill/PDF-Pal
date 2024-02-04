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
		return new Response(JSON.stringify(messages), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ error: "An error occurred while fetching messages." }),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
	}
}

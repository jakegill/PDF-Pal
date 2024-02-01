import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//Get all the files to display on dashboard.
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const userId = params.id;
		const files = await prisma.file.findMany({
			where: {
				userId,
			},
		});
		return NextResponse.json(files);
	} catch (e) {
		return NextResponse.error();
	}
}

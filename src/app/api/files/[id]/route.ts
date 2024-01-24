import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
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

export async function POST(request: Request) {
	const json = await request.json();
	const created = await prisma.file.create({ data: json });
	return new NextResponse(JSON.stringify(created), { status: 201 });
}

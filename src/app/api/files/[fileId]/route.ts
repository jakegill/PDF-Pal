import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE (
    request: Request,
    { params }: { params: { fileId: string } }
) {
    try {
        const fileId = params.fileId;
        const file = await prisma.file.delete({
            where: {
                id: fileId,
            },
        });
        return NextResponse.json(file);
    } catch (e) {
        return NextResponse.error();
    }
}

export async function GET (
    request: Request,
    { params }: { params: { fileId: string } }
) {
    try {
        const fileId = params.fileId;
        const file = await prisma.file.findUnique({
            where: {
                id: fileId,
            },
        });
        return NextResponse.json(file);
    } catch (e) {
        return NextResponse.error();
    }
}




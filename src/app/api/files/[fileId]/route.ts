import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

//TODO: delete from s3 bucket as well.
export async function DELETE (
    request: NextRequest,
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
    request: NextRequest,
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




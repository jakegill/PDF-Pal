import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
//aws endpoint https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/{filename.pdf}

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



import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getSession } from "next-auth/react";
//aws endpoint https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/{filename.pdf}

async function uploadPdfToBucket(filename: string, file: Blob) {
    try {
        const res = await fetch(`https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/${filename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': '*/*'
            },
            body: file
            })
        if (res.ok) {
            return JSON.stringify({message: 'File uploaded successfully.', status: 200});
        } else {
            throw new Error('Error uploading file.')
        }
    }
    catch (error) {
        return error;
    }
}

export async function POST(request: Request, { params }: { params: { filename: string }} )  {
    const session = await getSession();
    console.log(session?.user.id);
    try {
        const pdfFile = await request.arrayBuffer();
        const awsResponse = await uploadPdfToBucket(params.filename, new Blob([pdfFile]));
        const encodedFilename = encodeURIComponent(params.filename);
        if (JSON.parse(awsResponse as string).status === 200) {
            const prismaResponse = await prisma.file.create({
                data: {
                    name: params.filename,
                    userId: session?.user.id,
                    url: `https://pdf-pal.s3.amazonaws.com/${encodedFilename}`,
                },
            });
        } else {
            return NextResponse.error();
        }
        return NextResponse.json(pdfFile);
    } catch (e) {
        return NextResponse.error();
    }
}


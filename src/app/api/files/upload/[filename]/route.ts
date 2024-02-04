import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pinecone } from "@/lib/pinecone";
import { authOptions } from "@/config/auth.config";

//aws endpoint https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/{filename.pdf}

async function uploadPdfToBucket(filename: string, file: Blob) {
	try {
		const res = await fetch(
			`https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/${filename}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "*/*",
				},
				body: file,
			}
		);

		if (res.ok) {
			return JSON.stringify({
				message: "File uploaded successfully.",
				status: 200,
			});
		} else {
			throw new Error("Error uploading file.");
		}
	} catch (error) {
		return error;
	}
}

//Upload new PDF files.
export async function POST(
	request: Request,
	{ params }: { params: { filename: string } }
) {
	const session = await getServerSession(authOptions)

	try {
		//Upload pdf file to S3.
		const pdfFile = await request.arrayBuffer();
		const awsResponse = await uploadPdfToBucket(
			params.filename,
			new Blob([pdfFile])
		);
		const encodedFilename = encodeURIComponent(params.filename);

		if (JSON.parse(awsResponse as string).status === 200) {
			//URL, name, ect goes into database.
			const prismaResponse = await prisma.file.create({
				data: {
					name: params.filename,
					userId: session?.user.id,
					url: `https://pdf-pal.s3.amazonaws.com/${encodedFilename}`,
				},
			});

			//Index PDF for LLM to process.
			try {
				const blob = new Blob([pdfFile]);
				const loader = new PDFLoader(blob);
				const documentContent = await loader.load();

				const totalPageCount = documentContent.length;

				//vectorize
				const pineconeIndex = pinecone.Index("pdf-pal-index");
				const embeddings = new OpenAIEmbeddings({
					openAIApiKey: process.env.OPENAI_API_KEY!,
				});

				await PineconeStore.fromDocuments(documentContent, embeddings, {
					pineconeIndex,
					namespace: prismaResponse.id,
				});

				//Update upload status after vectorization.
				const updateUploadStatus = await prisma.file.update({
					where: {
						id: prismaResponse.id,
					},
					data: {
						uploadStatus: "SUCCESS",
					},
				});
			} catch (e) {
				const updateUploadStatus = await prisma.file.update({
					where: {
						id: prismaResponse.id,
					},
					data: {
						uploadStatus: "FAILED",
					},
				});
				console.error(e);
			}
		} else {
			return NextResponse.error();
		}
		return NextResponse.json(pdfFile);
	} catch (e) {
		return NextResponse.error();
	}
}

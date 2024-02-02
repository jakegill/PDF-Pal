import { User } from "@prisma/client";

declare module "next-auth" {
	interface Session {
		user: User;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: User;
	}
}

export enum UploadStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
}

export interface PdfFile {
	id: string;
	name: string;
	uploadStatus: UploadStatus;
	url?: string;
	key?: string;
	createdAt: string;
	updatedAt: string;
	userId?: string;
}

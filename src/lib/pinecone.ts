import { Pinecone } from "@pinecone-database/pinecone"

export const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

//TODO VECTOR INDEX ENTIRE FILE WHEN TRYING TO UPLOAD IT....
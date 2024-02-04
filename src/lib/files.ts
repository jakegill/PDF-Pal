"use server"
import { authOptions } from "@/config/auth.config";
import { getServerSession } from "next-auth";

export async function getFiles(userId: string) {
    try {
        const session = await getServerSession(authOptions);
        if (session?.user.id !== userId) throw new Error('Unauthorized');
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/user/${userId}`)
        if (res.ok) {
            const data = await res.json();
            return data
        } else {
            throw new Error('Error fetching files.')
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteFile(fileId: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/files/${fileId}`, {
            method: 'DELETE',
            })
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            return data
        } else {
            throw new Error('Error deleting file.')
        }
    }
    catch (error) {
        console.log(error)
    }
}

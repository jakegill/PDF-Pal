//pdf.ts

export async function getFiles(userId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/files/${userId}`)
        console.log(res)
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

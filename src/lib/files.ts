export async function getFiles(userId: string) {
    try {
        const res = await fetch(`http://localhost:3000/api/files/user/${userId}`)
        if (res.ok) {
            const data = await res.json();
            console.log(data);
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
        const res = await fetch(`http://localhost:3000/api/files/${fileId}`, {
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
export const getMessages = async (fileId:string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/message/${fileId}`, {
            method: 'GET',
        })
        if (res.ok) {
            const data = await res.json();
            return data
        } 
    } catch (error) {
        return error;
    }
}
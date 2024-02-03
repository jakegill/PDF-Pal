export const getMessages = async (fileId:string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/message/${fileId}`, {
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
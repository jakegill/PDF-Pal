import dotenv from 'dotenv';
dotenv.config()

export async function uploadPdfToBucket(filename: string, file: Blob) {
    try {
        const res = await fetch(`https://z5tc4i45mf.execute-api.us-east-1.amazonaws.com/second/pdf-pal/${filename}`, {
            method: 'PUT',
            headers: {
                'Content-Type': '*/*'
            },
            body: file
            })
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            return data
        } else {
            throw new Error('Error uploading file.')
        }
    }
    catch (error) {
        console.log(error)
    }
}
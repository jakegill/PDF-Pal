"use client"
import Dropzone from "react-dropzone";
import { File } from "lucide-react";
import { useState } from "react";
import { uploadPdfToBucket } from "@/lib/aws";

export default function UploadDropzone() {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDrop = async (acceptedFiles: string | any[]) => {
        

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setIsLoading(true);
            console.log(file);
            try {
                await fetch(`/api/files/upload/${file.name}`, {
                    method: "POST",
                    body: file,
                })
            } catch (error) {
                console.error('Error sending file to backend.', error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    return (
        <Dropzone
            multiple={false}
            onDrop={(acceptedFile) => {
                handleDrop(acceptedFile);
            }}
        >
            {({ getRootProps, getInputProps, acceptedFiles }) => (
                <div
                    {...getRootProps()}
                    className='cursor-pointer border border-dashed w-[70vw] h-[50vh] md:h-[40vh] md:w-[40vw] bg-gray-50'
                >
                    <label
                        htmlFor='dropzone-file'
                        className='flex-col gap-2 cursor-pointer transition hover:bg-gray-100 flex items-center justify-center h-full w-full'
                    >
                        <p className='text-zinc-700 text-xs md:text-base'>
                            Click to upload or{" "}
                            <span className='text-zinc-500'>drag and drop</span>
                        </p>
                        {acceptedFiles && acceptedFiles[0] ? (
                            <div className='flex gap-2 border-[1px] max-w-[30vh] border-zinc-300 bg-white p-2 text-xs items-center'><File className='text-blue-500' /><p className='text-zinc-500 truncate'>{acceptedFiles[0].name}</p></div>
                        ) : null}
                    </label>
                </div>
            )}
        </Dropzone>
    );
};
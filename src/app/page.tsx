import Navbar from "@/components/Navbar";
import GetStarted from "@/components/GetStarted";
import Image from "next/image";

export default async function Home() {
	return (
		<>
			<Navbar />
			<main className='flex flex-col mb-[20vh]'>
				<div className='h-[50vh] md:h-[60vh] flex items-center justify-center'>
					<div className='flex flex-col gap-5 items-center justify-center'>
						<p className="text-xs md:text-base">Introducing PDF Pal</p>
						<h1 className=' text-2xl md:text-5xl text-zinc-800 font-semibold max-w-[90vw] md:max-w-[50vw] text-center '>
							Leverage <span className='text-blue-700'>AI</span> to quickly
							answer questions about any PDF.
						</h1>
						<p className='text-zinc-600 text-sm md:text-lg max-w-[80vw] md:max-w-[45vw] text-center'>
							PDF Pal lets users quickly upload documents and use an ai
							assistant to answer their questions.
						</p>
						<GetStarted />
					</div>
				</div>
				<div>
					<h2 className="w-full text-center font-semibold text-blue-600 md:text-xl p-4">Drag & Drop PDFs to easily upload them</h2>
					<div className='w-full flex justify-center'>
						<Image
							src='/DropzoneImg2.png'
							alt='pdf pal landing'
							width={800}
							height={800}
						/>
					</div>
				</div>
				<div>
					<h2 className="w-full text-center font-semibold text-blue-600 md:text-xl p-4">View and select your uploaded files</h2>
					<div className='w-full flex justify-center'>
						<Image
							src='/DashboardImg.png'
							alt='pdf pal landing'
							width={800}
							height={800}
						/>
					</div>
				</div>

				<div>
					<h2 className="w-full text-center font-semibold text-blue-600 md:text-xl p-4">Chat with your PDF</h2>
					<div className='w-full flex justify-center'>
						<Image
							src='/ChatImg.png'
							alt='pdf pal landing'
							width={800}
							height={800}
						/>
					</div>
				</div>
			</main>
		</>
	);
}

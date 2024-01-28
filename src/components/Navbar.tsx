"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { CircleUserRound, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
	const { data: session } = useSession();
	const [showMenu, setShowMenu] = useState(false);

	return (
		<section className='w-full flex  px-8 md:px-20  items-center space-between h-[11vh] border-b-[1px] bg-slate-50 border-zinc-300 sticky inset-x-0 top-0 z-20'>
			<div className='flex items-center justify-between w-full'>
				<Link href='/dashboard'>
					<h2 className='md:text-3xl font-bold text-md'>
						<span className='text-blue-800'>Pdf</span>
						<span className='text-blue-500'>Pal</span>
					</h2>
				</Link>
				<div className='flex items-center gap-4'>
					<div className='relative'>
						<div
							onClick={() => setShowMenu(!showMenu)}
							className='cursor-pointer flex gap-3 items-center border-[0.5px] border-zinc-300 bg-white rounded-full transition hover:shadow-md p-2'
						>
							<Menu size={24} />
							<CircleUserRound size={30} />
						</div>

						{showMenu ? (
							<div className='bg-white rounded-md transition shadow-lg p-3 absolute right-0 mt-2 text-sm'>
								{session && session.user ? (
									<div className='flex flex-col gap-2'>
										<Link href='/dashboard/profile'>Profile</Link>
										<Link href='/dashboard/upgrade'>Upgrade</Link>
										<Link href='/api/auth/signout'>Sign Out</Link>
									</div>
								) : (
									<div className='flex flex-col gap-2'>
										<Link href='/auth/signin'>Login</Link>
										<Link href='/auth/signup'>Register</Link>
									</div>
								)}
							</div>
						) : null}
					</div>
				</div>
			</div>
		</section>
	);
}

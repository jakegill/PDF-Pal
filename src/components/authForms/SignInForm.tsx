"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(6, "Password should contain at least 6 characters.")
		.max(30, "Password should contain at most 30 characters."),
});

type InputType = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputType>({ resolver: zodResolver(loginSchema) });

	const loginUser: SubmitHandler<InputType> = async (formData) => {
		try {
			setIsLoading(true);
			const res = await signIn("credentials", {
				redirect: false,
				username: formData.email,
				password: formData.password,
			});

			if (res?.ok) {
				router.push("/dashboard");
			}
			setIsLoading(false);
			setError("Invalid email or password.");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='w-full max-w-md min-w-xs mx-auto my-10'>
			<form
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mx-auto'
				onSubmit={handleSubmit(loginUser)}
				onClick={() => setError("")}
			>
				<div className='mb-3'>
					<h2 className='text-xl mb-5'>Log in</h2>
					<div className='mb-3'>
						<label
							className='block text-zinc-700 text-sm mb-1'
							htmlFor='username'
						>
							Email
						</label>
						<input
							{...register("email")}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							id='email'
							type='email'
						/>
						{errors.email ? (
							<p className='text-red-500 text-xs'>{errors.email.message}</p>
						) : null}
					</div>
					<div className='mb-3'>
						<label
							className='block text-zinc-700 text-sm mb-1'
							htmlFor='password'
						>
							Password
						</label>
						<input
							{...register("password")}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							id='password'
							type='password'
						/>
						{errors.password ? (
							<p className='text-red-500 text-xs'>{errors.password.message}</p>
						) : null}
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					{isLoading ? (
						<div className='flex justify-center'>
							<Loader2 className='animate-spin text-blue-500' />
						</div>
					) : (
						<button
							className='bg-blue-700 py-2 text-white transition hover:bg-blue-800 hover:shadow-sm'
							type='submit'
						>
							Sign in
						</button>
					)}
					<div className='flex gap-2'>
						<p className='text-sm text-zinc-700'>Dont have an account?</p>
						<Link
							className='text-sm text-blue-600 underline'
							href='/auth/signup'
						>
							Sign up
						</Link>
					</div>
					{error !== '' ? (<div className="text-red-500">{error}</div>) : null}
				</div>
			</form>
			
		</div>
	);
}

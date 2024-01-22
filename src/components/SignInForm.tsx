"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(6, "Password should contain at least 6 characters.")
		.max(30, "Password should contain at most 30 characters."),
});

type InputType = z.infer<typeof loginSchema>;

export default function LoginForm() {

	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputType>({ resolver: zodResolver(loginSchema) });

	const loginUser: SubmitHandler<InputType> = async (formData) => {
		try {
			const res = await signIn("credentials", {
				redirect: false,
				username: formData.email,
				password: formData.password,
			});

			if (res?.ok) {
				router.push("/dashboard");
			}

		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='w-full max-w-md min-w-xs mx-auto my-10'>
			<form
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mx-auto'
				onSubmit={handleSubmit(loginUser)}
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
					<button
						className=''
						type='submit'
					>
						Sign in
					</button>
					<div className='flex gap-2'>
						<p className='text-sm text-zinc-700'>Dont have an account?</p>
						<Link
							className='text-sm text-blue-600 underline'
							href='/auth/register'
						>
							Sign up
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
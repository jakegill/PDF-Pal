"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { registerUser } from "@/lib/auth.server";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const registerSchema = z
	.object({
		firstName: z
			.string()
			.min(2, "First name must contain at least 2 characters.")
			.max(30, "First name must contain at most 30 characters.")
			.regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed."),
		lastName: z
			.string()
			.min(2, "Last name must contain at least 2 characters.")
			.max(30, "Last name must contain at most 30 characters.")
			.regex(new RegExp("^[a-zA-Z]+$"), "No special characters allowed."),
		email: z.string().email("Please enter a valid email address."),
		password: z
			.string()
			.min(6, "Password should contain at least 6 characters.")
			.max(30, "Password should contain at most 30 characters."),
		confirmPassword: z
			.string()
			.min(6, "Password should contain at least 6 characters.")
			.max(30, "Password should contain at most 30 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type InputType = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputType>({ resolver: zodResolver(registerSchema) });

	const saveUser: SubmitHandler<InputType> = async (formData) => {
		const { confirmPassword, ...user } = formData;
		try {
			setIsLoading(true);
			const res = await registerUser(user);
			if (res?.id) {
				router.push("/auth/signin");
			}
			setIsLoading(false);
		} catch (error: any) {
			console.log(error);
			setIsLoading(false);
		}
		setError("Invalid email or password.");
	};

	return (
		<div className='w-full max-w-md min-w-xs mx-auto my-10'>
			<form
				className='bg-white md:shadow-md rounded px-8 pt-6 pb-8 mx-auto'
				onSubmit={handleSubmit(saveUser)}
			>
				<div className='mb-3'>
					<h2 className='text-xl mb-5'>Register</h2>
					<div className='flex gap-2 mb-2'>
						<div>
							<label
								className='block text-zinc-700 text-sm mb-1'
								htmlFor='firstName'
							>
								First name
							</label>
							<input
								{...register("firstName")}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='firstName'
								type='text'
								placeholder=''
							/>
							{errors.firstName ? (
								<p className='text-red-500 text-xs'>
									{errors.firstName.message}
								</p>
							) : null}
						</div>
						<div>
							<label
								className='block text-zinc-700 text-sm mb-1'
								htmlFor='lastName'
							>
								Last name
							</label>
							<input
								{...register("lastName")}
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='lastName'
								type='text'
								placeholder=''
							/>
							{errors.lastName ? (
								<p className='text-red-500 text-xs'>
									{errors.lastName.message}
								</p>
							) : null}
						</div>
					</div>
					<div className='mb-2'>
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
							placeholder=''
						/>
						{errors.email ? (
							<p className='text-red-500 text-xs'>{errors.email.message}</p>
						) : null}
					</div>
					<div className='mb-2'>
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
							placeholder=''
						/>
						{errors.password ? (
							<p className='text-red-500 text-xs'>{errors.password.message}</p>
						) : null}
					</div>
					<div className='mb-2'>
						<label
							className='block text-zinc-700 text-sm mb-1'
							htmlFor='confirmPassword'
						>
							Confirm Password
						</label>
						<input
							{...register("confirmPassword")}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							id='confirmPassword'
							type='password'
							placeholder=''
						/>
						{errors.confirmPassword ? (
							<p className='text-red-500 text-xs mb-2'>
								{errors.confirmPassword.message}
							</p>
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
							Create Account
						</button>
					)}
					<div className='flex gap-2'>
						<p className='text-sm text-zinc-700'>Already have an account?</p>
						<Link
							className='text-sm text-blue-600 underline'
							href='/auth/signin'
						>
							Sign in
						</Link>
					</div>
				</div>
			</form>
		</div>
		
	);
}

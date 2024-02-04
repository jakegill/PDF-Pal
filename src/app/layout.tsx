import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Albert_Sans } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const albertSans = Albert_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "PDF Pal",
	description: "Virtual assistant that answers questions about your documents.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={albertSans.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

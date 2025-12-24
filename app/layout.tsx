import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from './_components/layout/Navbar';

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', // Add a CSS variable for the font
});

export const metadata: Metadata = {
  title: "RoleCopilot",
  description: "Meeting role management and smart timer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 text-gray-900 dark:text-gray-100 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ERL OT Management",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased text-black-900 text-sm`}>
        {children}
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "./LayoutShell"; // client layout

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ERL OT Management",
  description: "Manage overtime efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased text-black-900 text-sm`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

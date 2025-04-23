import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "./LayoutShell"; // client layout
import { getOtSettings } from "@/lib/mongodb/oTSettingsQueries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "ERL OT Management",
  description: "Manage overtime efficiently",
};

export default async function RootLayout({ children }) {
  const { Employee } = await getOtSettings();
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased text-black-900`}>
        <LayoutShell employees={Employee}>{children}</LayoutShell>
      </body>
    </html>
  );
}

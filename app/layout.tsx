import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quick QR Builder",
  description: "Paste a URL → instant QR download",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}

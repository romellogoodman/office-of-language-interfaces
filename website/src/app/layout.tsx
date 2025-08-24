import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Oli - Open-source Language Interfaces",
  description: "Open-source Language Interfaces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

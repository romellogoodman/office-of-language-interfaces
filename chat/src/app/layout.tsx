import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Chat | Oli",
  description: "Open Language Interfaces - Chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

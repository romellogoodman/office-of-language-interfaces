import type { Metadata } from "next";
import "./modern-reset.scss";
import "./globals.scss";
import Header from "@/components/Header";

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
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

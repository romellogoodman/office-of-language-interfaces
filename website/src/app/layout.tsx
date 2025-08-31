import type { Metadata } from "next";
import "./modern-reset.scss";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLatestCommitHash } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Oli - Open Language Interfaces",
  description: "Open Language Interfaces",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const commitHash = await getLatestCommitHash();

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer commitHash={commitHash} />
      </body>
    </html>
  );
}

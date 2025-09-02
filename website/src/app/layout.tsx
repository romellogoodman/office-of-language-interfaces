import type { Metadata } from "next";
import "./modern-reset.scss";
import "./globals.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Favicon from "@/components/Favicon";
import { getLatestCommitHash } from "@/lib/build-info";

export const metadata: Metadata = {
  title: "Oli - Office of Language Interfaces",
  description:
    "Office of Language Interfaces is an open research lab designing software that responds to language.",
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
        <Favicon />
        <Header />
        <main>{children}</main>
        <Footer commitHash={commitHash} />
      </body>
    </html>
  );
}

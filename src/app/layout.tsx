import type { Metadata } from "next";
import "./modern-reset.scss";
import "./globals.scss";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Oli - Office of Language Interfaces",
  description:
    "Office of Language Interfaces is a research lab designing software that responds to language.",
  icons: {
    icon: "/api/favicon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Office of Language Interfaces RSS Feed"
          href="/rss.xml"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}

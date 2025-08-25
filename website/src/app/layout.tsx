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
        <header>
          <p><a href="/">Oli - Open-source Language Interfaces</a></p>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

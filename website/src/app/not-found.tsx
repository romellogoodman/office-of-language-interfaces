import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Oli",
};

export default function NotFound() {
  return (
    <div className="main-content">
      <div className="not-found">
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/">Return home</Link>
      </div>
    </div>
  );
}
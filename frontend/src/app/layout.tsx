import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guardian Fraud Console",
  description: "Real-time fraud risk dashboard powered by FastAPI and ML",
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
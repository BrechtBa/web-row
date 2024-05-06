import type { Metadata } from "next";
import { Suspense } from 'react'

import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const roboto = Roboto_Condensed({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "WebRow",
  title: "WebRow",
  description: "Rowing web app",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense>
        <body className={roboto.className}>{children}</body>
      </Suspense>
    </html>
  );
}

import type { Metadata } from "next";
import { Roboto_Condensed } from "next/font/google";

import "./globals.css";

import ContextWrapper from "./contextProviders";


const roboto = Roboto_Condensed({ subsets: ["latin"] });

export const metadata: Metadata = {
  applicationName: "WebRow",
  title: "WebRow",
  description: "Rowing web app",
  manifest: "/manifest.json",
};


export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {

  return (
    <html lang="en">
        <body className={roboto.className}>
          <ContextWrapper>
            {children}
          </ContextWrapper>
        </body>
    </html>
  );
}

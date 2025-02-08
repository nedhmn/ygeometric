import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YGO Deck Calculator",
  description:
    "Easily improve your deck with the power of math! Make better decisions during deck-building.",
  openGraph: {
    title: "YGO Deck Calculator",
    description:
      "Calculate Yu-Gi-Oh! deck probabilities for better opening hands.",
    type: "website",
    url: "https://ygeometric.com",
    siteName: "YGO Deck Calculator",
    images: [
      {
        url: "https://52vxnh4yyv.ufs.sh/f/0vzoT97RErkwYmgcGxnOmfXd6ZuxsNWHarwzoBqT1Fc7KGIb",
        width: 1200,
        height: 630,
        alt: "YGO Deck Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YGO Deck Calculator",
    description:
      "Calculate Yu-Gi-Oh! deck probabilities for better opening hands.",
    images: [
      "https://52vxnh4yyv.ufs.sh/f/0vzoT97RErkwYmgcGxnOmfXd6ZuxsNWHarwzoBqT1Fc7KGIb",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

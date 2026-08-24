import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    applicationName: "Card Game",
    title: {
        default: "Card Game",
        template: "%s | Card Game",
    },
    description: "Play 21 card games online with game history, different difficulty levels, and a bilingual experience.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return children;
}
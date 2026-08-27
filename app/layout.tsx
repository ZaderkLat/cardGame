import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    applicationName: "MiniGames",
    title: {
        default: "MiniGames",
        template: "%s | MiniGames",
    },
    description: "Enjoy quick matches of different minigames, match history, and a multilingual experience designed for desktop and mobile devices.",
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
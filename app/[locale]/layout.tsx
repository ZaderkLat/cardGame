import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/themeProvider";
import { UserProvider } from "@/providers/userProvider";
import { TopBar } from "@/components/ui/topBar";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NextIntlClientProvider } from "next-intl";

import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const localeMetadata = {
  es: {
    appName: "MiniJuegos",
    title: "MiniJuegos - Inicio",
    description: "Disfruta de partidas rápidas de diferentes minijugos, con diferentes modos, historial y una experiencia multilenguaje para jugar desde cualquier dispositivo.",
    ogTitle: "MiniJuegos | Juega a diferentes minijuegos gratis online",
    twitterTitle: "MiniJuegos | Juega a diferentes mini juegos gratis online",
  },
  en: {
    appName: "MiniGames",
    title: "MiniGames - Home",
    description: "Enjoy quick matches of different minigames, match history, and a multilingual experience designed for desktop and mobile devices.",
    ogTitle: "MiniGames| Play different free online minigames",
    twitterTitle: "MiniGames | Play different free online minigames",
  },
} as const;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? localeMetadata.es : localeMetadata.en;
  const canonicalUrl = new URL(`/${locale}`, baseUrl).toString();

  return {
    metadataBase: new URL(baseUrl),
    applicationName: currentLocale.appName,
    title: {
      default: currentLocale.title,
      template: `%s | ${currentLocale.appName}`,
    },
    description: currentLocale.description,
    keywords: [
      "card game",
      "21",
      "casino game",
      "mini games",
      "juego de cartas",
      "online game",
      "multiplayer",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        es: new URL("/es", baseUrl).toString(),
        en: new URL("/en", baseUrl).toString(),
      },
    },
    openGraph: {
      title: currentLocale.ogTitle,
      description: currentLocale.description,
      url: canonicalUrl,
      siteName: currentLocale.appName,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/21logo.webp",
          width: 1200,
          height: 630,
          alt: currentLocale.appName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentLocale.twitterTitle,
      description: currentLocale.description,
      images: ["/21logo.webp"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
    },
  };
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;

  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (

    <html
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
          >
            <UserProvider>
              <TopBar />

              <main className="flex-1 min-h-0 flex flex-col">
                {children}
                <Toaster />
                <Analytics />
                <SpeedInsights />
              </main>
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


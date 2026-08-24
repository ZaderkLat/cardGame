import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/themeProvider";
import { UserProvider } from "@/providers/userProvider";
import { TopBar } from "@/components/ui/topBar";
import { Toaster } from "@/components/ui/sonner";

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

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tudominio.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: locale === 'es' ? 'Mini Juegos - Inicio' : 'Mini Games - Home',
      template: `%s | ${locale === 'es' ? 'Mi Aplicación' : 'My Application'}`,
    },
    description:
      locale === 'es'
        ? 'Descripción optimizada para SEO en español.'
        : 'SEO optimized description in English.',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        es: `${baseUrl}/es`,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      title: 'Mi Aplicación',
      description: 'Descripción para redes sociales',
      url: `${baseUrl}/${locale}`,
      siteName: 'Mi Aplicación',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-image.png', // Ubicada en la carpeta public/
          width: 1200,
          height: 630,
          alt: 'Preview de la aplicación',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mi Aplicación',
      description: 'Descripción para Twitter / X',
      images: ['/og-image.png'],
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
              </main>
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


// app/not-found.tsx
'use client';

import { Link } from "@/i18n/navigation";
import { usePathname } from 'next/navigation';
import '@/app/globals.css';
import { ThemeProvider } from "@/providers/themeProvider";

// Diccionario de traducciones para la vista 404
const dictionary = {
    es: {
        code: '404',
        title: 'Página no encontrada',
        description: 'Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido movida o eliminada.',
        homeButton: 'Volver al inicio',
        contactButton: 'Soporte',
    },
    en: {
        code: '404',
        title: 'Page not found',
        description: 'Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.',
        homeButton: 'Back to home',
        contactButton: 'Support',
    },
};

export default function GlobalNotFound() {
    const pathname = usePathname();

    // Detecta si la ruta que falló iniciaba con /en
    const isEn = pathname?.startsWith('/en');
    const t = isEn ? dictionary.en : dictionary.es;
    const currentLocale = isEn ? 'en' : 'es';

    return (
        <html lang={currentLocale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col items-center justify-center 
                    bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 
                    py-24 transition-colors duration-200">
                        <div className="text-center border p-8 rounded-lg">
                            {/* Código de Estado */}
                            <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                                {t.code}
                            </p>

                            {/* Título Principal */}
                            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                                {t.title}
                            </h1>

                            {/* Mensaje Amigable */}
                            <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                                {t.description}
                            </p>

                            {/* Botones de Acción con redirección según el idioma */}
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    href={isEn ? '/en' : '/es'}
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold
                                     text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                                      focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                                      transition-all"
                                >
                                    {t.homeButton}
                                </Link>

                            </div>
                        </div>
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
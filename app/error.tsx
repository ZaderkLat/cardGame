'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/app/globals.css';
import { ThemeProvider } from "@/providers/themeProvider";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

// Diccionario de traducciones para la vista de error (500 / Runtime Error)
const dictionary = {
    es: {
        title: '¡Algo salió mal!',
        description: 'Ocurrió un error inesperado. Nuestro equipo ha sido notificado.',
        tryAgain: 'Intentar de nuevo',
        goHome: 'Volver al inicio',
    },
    en: {
        title: 'Something went wrong!',
        description: 'An unexpected error occurred. Our team has been notified.',
        tryAgain: 'Try Again',
        goHome: 'Go Home',
    },
};

export default function Error({ error, reset }: ErrorProps) {
    const pathname = usePathname();

    // Detecta si la ruta que falló iniciaba con /en
    const isEn = pathname?.startsWith('/en');
    const t = isEn ? dictionary.en : dictionary.es;
    const currentLocale = isEn ? 'en' : 'es';

    useEffect(() => {
        // Registra el error en consola o servicios como Sentry / LogRocket
        console.error('Unhandled runtime error:', error);
    }, [error]);

    return (
        <html lang={currentLocale} suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="min-h-screen flex flex-col items-center justify-center bg-white
                     dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-24 text-center 
                     transition-colors duration-200 ">
                        <div className='text-center items-center border p-8 rounded-lg'>

                            <h1 className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-500
                            sm:text-5xl">
                                {t.title}
                            </h1>
                            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400 
                                max-w-md">
                                {t.description}
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <button
                                    onClick={() => reset()}
                                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold
                                 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                                  focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                                  transition-all"
                                >
                                    {t.tryAgain}
                                </button>
                                <a
                                    href={isEn ? '/en' : '/es'}
                                    className="rounded-md bg-slate-200 dark:bg-slate-800 px-4 py-2.5 
                                text-sm font-semibold text-slate-900 dark:text-slate-100
                                 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {t.goHome}
                                </a>
                            </div>
                        </div>

                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
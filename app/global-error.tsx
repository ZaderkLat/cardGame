'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import '@/app/globals.css';
import { ThemeProvider } from "@/providers/themeProvider";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

// Diccionario de traducciones para errores críticos a nivel de sistema / Layout raíz
const dictionary = {
    es: {
        title: 'Error crítico del sistema',
        description: 'Ocurrió un error a nivel de sistema. Por favor intenta recargar la aplicación.',
        tryAgain: 'Reintentar',
    },
    en: {
        title: 'Critical Application Error',
        description: 'A system-level error occurred. Please try reloading the application.',
        tryAgain: 'Try Again',
    },
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    const pathname = usePathname();

    // Detecta si la ruta activa pertenecía al idioma inglés
    const isEn = pathname?.startsWith('/en');
    const t = isEn ? dictionary.en : dictionary.es;
    const currentLocale = isEn ? 'en' : 'es';

    useEffect(() => {
        // Registro de errores críticos del layout raíz
        console.error('Critical root layout error:', error);
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
                    <main className="min-h-screen flex flex-col items-center justify-center
                     bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 
                     px-6 py-24 text-center transition-colors duration-200">
                        <div className='text-center items-center border p-8 rounded-lg'>
                            <h1 className="text-3xl font-bold tracking-tight text-red-600
                         dark:text-red-500 sm:text-5xl">
                                {t.title}
                            </h1>
                            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400
                                max-w-md">
                                {t.description}
                            </p>
                            <button
                                onClick={() => reset()}
                                className="mt-8 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold
                            text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                            focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                            transition-all"
                            >
                                {t.tryAgain}
                            </button>
                        </div>

                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
import { Link } from "@/i18n/navigation";

const dictionary = {
    es: {
        code: "404",
        title: "Página no encontrada",
        description:
            "Lo sentimos, no pudimos encontrar la página que estás buscando. Es posible que haya sido movida o eliminada.",
        homeButton: "Volver al inicio",
    },
    en: {
        code: "404",
        title: "Page not found",
        description:
            "Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.",
        homeButton: "Back to home",
    },
};

export default function GlobalNotFound() {
    const t = dictionary.es;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-24">
            <div className="text-center border p-8 rounded-lg">
                <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400">
                    {t.code}
                </p>

                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                    {t.title}
                </h1>

                <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    {t.description}
                </p>

                <div className="mt-10 flex items-center justify-center">
                    <Link
                        href="/"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        {t.homeButton}
                    </Link>
                </div>
            </div>
        </main>
    );
}
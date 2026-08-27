
import { Metadata } from "next";
import { IsLogin } from "@/components/user/isLogin";
/*------------metadata--------*/
type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

const localeMetadata = {
    es: {
        title: "MiniJuegos - Sesión Detectada",
    },
    en: {
        title: "MiniGames - Session Detected",
    },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const currentLocale =
        locale === "es" ? localeMetadata.es : localeMetadata.en;

    return {
        title: currentLocale.title,
    };
}
/*----------------------------*/

export default function Page() {



    return (
        <div className="flex min-h-full w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <IsLogin />
            </div>
        </div>
    );
}
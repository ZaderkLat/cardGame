import { LoginForm } from '@/components/user/login-form'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next';
/*------------metadata--------*/
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};
const localeMetadata = {
  es: {
    title: "MiniJuegos - Inicio de sesión",

  },
  en: {
    title: "MiniGames - Login",
  },
} as const;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? localeMetadata.es : localeMetadata.en;
  return {
    title: currentLocale.title,

  };
}
/*----------------------------*/
export default function Page() {
  const t = useTranslations("Home")
  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">

      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

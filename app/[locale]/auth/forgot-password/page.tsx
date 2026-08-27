import { ForgotPasswordForm } from '@/components/user/forgot-password-form'
import { Metadata } from 'next';
/*------------metadata--------*/
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};
const localeMetadata = {
  es: {
    title: "MiniJuegos - Restablecer contraseña",

  },
  en: {
    title: "MiniGames - Reset Password",
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
  return (
    <div className="flex h-full w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

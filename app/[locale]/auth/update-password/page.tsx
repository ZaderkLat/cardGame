import { UpdatePasswordForm } from '@/components/user/update-password-form'
import { useTranslations } from 'next-intl'
export default function Page() {
  const t = useTranslations("Home");
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <title>{t("title")}</title>
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}

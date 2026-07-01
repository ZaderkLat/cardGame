'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export function LogoutButton() {
  const t = useTranslations("logOutButton")
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return <Button onClick={logout} variant={"outline"}>{t("logOut")}</Button>
}

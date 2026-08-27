'use client'

import { useRouter } from '@/i18n/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from "@/i18n/navigation";
import { link } from 'fs'

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  //this is how it is because before, 'signUpSuccesse' was a differente route
  const t = useTranslations('SignUp')
  const t2 = useTranslations('SignUpSuccess')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const locale = useLocale();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Per-field validation errors (null = no error)
  const [fieldErrors, setFieldErrors] = useState<{
    email: string | null
    nickname: string | null
    password: string | null
    repeatPassword: string | null
  }>({
    email: null,
    nickname: null,
    password: null,
    repeatPassword: null,
  })

  // Timers to debounce validation per-field
  const timersRef = useRef<Record<string, number | undefined>>({})
  const VALIDATION_DELAY = 700 // ms

  useEffect(() => {
    // cleanup on unmount
    return () => {
      Object.values(timersRef.current).forEach((id) => {
        if (id) clearTimeout(id)
      })
    }
  }, [])

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validateField = (field: string, value: string) => {
    const v = value?.trim() ?? ''
    switch (field) {
      case 'email':
        if (!v) return t('fieldRequired')
        if (!emailRegex.test(v)) return t('invalidEmailFormat')
        return null
      case 'nickname':
        if (!v) return t('fieldRequired')
        if (v.length < 3) return t('nicknameMinLength')
        return null
      case 'password':
        if (!v) return t('fieldRequired')
        if (v.length < 6) return t('passwordMinLength')
        return null
      case 'repeatPassword':
        if (!v) return t('fieldRequired')
        if (v !== password) return t('passwordsDoNotMatch')
        return null
      default:
        return null
    }
  }

  const scheduleValidation = (field: string, value: string) => {
    // clear previous timer
    const prev = timersRef.current[field]
    if (prev) clearTimeout(prev)

    timersRef.current[field] = window.setTimeout(() => {
      setFieldErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }, VALIDATION_DELAY)
  }

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case 'email':
        setEmail(value)
        scheduleValidation('email', value)
        break
      case 'nickname':
        setNickname(value)
        scheduleValidation('nickname', value)
        break
      case 'password':
        setPassword(value)
        scheduleValidation('password', value)
        // when password changes, also re-validate repeatPassword
        scheduleValidation('repeatPassword', repeatPassword)
        break
      case 'repeatPassword':
        setRepeatPassword(value)
        scheduleValidation('repeatPassword', value)
        break
      default:
        break
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    const supabase = createClient()

    setIsLoading(true)
    setError(null)

    // validate all fields synchronously before submitting
    const newErrors = {
      email: validateField('email', email),
      nickname: validateField('nickname', nickname),
      password: validateField('password', password),
      repeatPassword: validateField('repeatPassword', repeatPassword),
    }

    setFieldErrors(newErrors)

    const hasError = Object.values(newErrors).some((v) => v !== null)
    if (hasError) {
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/protected`,
          data: {
            full_name: nickname,
            locale: locale
          },
        },
      })
      if (error) throw error
      setRegisterSuccess(true);
      //router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('unknownError'))
    } finally {
      setIsLoading(false)
    }
  }
  const handlerResendConfirmEmail = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/protected`
        }
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('unknownError'))
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {true ? (
        /** Message show when the register is successe */
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t2("title")}
            </CardTitle>

            <CardDescription>
              {t2("description")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className='flex flex-col gap-2'>
              <p className="text-sm text-muted-foreground">
                {t2("content")} {t2("contentAdvise")}
              </p>
              <p className="text-sm text-muted-foreground">
                {t2.rich("contentResend", {
                  button: (chunks) => (
                    <button
                      type="button"
                      onClick={handlerResendConfirmEmail}
                      className="cursor-pointer text-black dark:text-white underline underline-offset-4 transition-opacity hover:opacity-70"

                    >
                      {chunks}
                    </button>
                  ),
                })}
              </p>
            </div>

          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {t('title')}
            </CardTitle>

            <CardDescription>
              {t('description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    {t('email')}
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    required
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />

                  {/* error placeholder - reserve space so layout doesn't jump */}
                  <p className="min-h-5 text-sm text-red-500 mt-1" aria-live="polite">
                    {fieldErrors.email ?? '\u00A0'}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="nickname">
                    {t('nickname')}
                  </Label>

                  <Input
                    id="nickname"
                    type="text"
                    placeholder={t('nicknamePlaceholder')}
                    required
                    value={nickname}
                    onChange={(e) => handleFieldChange('nickname', e.target.value)}
                  />

                  <p className="min-h-5 text-sm text-red-500 mt-1" aria-live="polite">
                    {fieldErrors.nickname ?? '\u00A0'}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    {t('password')}
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                  />

                  <p className="min-h-5 text-sm text-red-500 mt-1" aria-live="polite">
                    {fieldErrors.password ?? '\u00A0'}
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">
                    {t('repeatPassword')}
                  </Label>

                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => handleFieldChange('repeatPassword', e.target.value)}
                  />

                  <p className="min-h-5 text-sm text-red-500 mt-1" aria-live="polite">
                    {fieldErrors.repeatPassword ?? '\u00A0'}
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? t('creatingAccount')
                    : t('signUp')}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                {t('alreadyHaveAccount')}{' '}
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  {t('login')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
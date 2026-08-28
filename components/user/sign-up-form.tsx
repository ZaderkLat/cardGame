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

  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendIsLoading, setResendIsLoading] = useState(false)
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
        if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(v)) return t('passwordFormat')
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

  const renderError = (
    field: keyof typeof fieldErrors,
    className?: string
  ) => {
    const message = fieldErrors[field]

    return (
      <p
        className={cn(
          'overflow-hidden text-xs leading-4 transition-all duration-200',
          message
            ? 'min-h-4 h-auto translate-y-0 opacity-100 text-red-600 dark:text-red-400'
            : 'h-4 translate-y-1 opacity-0 text-transparent',
          className
        )}
        aria-live="polite"
      >
        {message ?? ' '}
      </p>
    )
  }

  const showRequiredMark = (field: keyof typeof fieldErrors) => Boolean(fieldErrors[field])
  const isFormReady =
    email.trim().length > 0 &&
    nickname.trim().length > 0 &&
    password.length > 0 &&
    repeatPassword.length > 0 &&
    !Object.values(fieldErrors).some(Boolean)

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

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback/signup`,
          data: {
            full_name: nickname,
            locale: locale
          },
        },
      })
      if (error) throw error
      setRegisterSuccess(true);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('unknownError'))
    } finally {
      setIsLoading(false)
    }
  }
  const handlerResendConfirmEmail = async () => {
    setResendIsLoading(true);
    console.log("entra")
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback/signup`
        }
      })

      if (error) throw error
      setResendSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('unknownError'))
      setResendSuccess(false);
      setResendIsLoading(false);
    }

  }
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {registerSuccess ? (
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
                {t2.rich("contentLogin", {
                  button: (chunks) => (
                    <button
                      type="button"
                      onClick={() => router.push("/auth/login")}
                      className="cursor-pointer text-black dark:text-white underline underline-offset-4
                         transition-opacity hover:opacity-70"

                    >
                      {chunks}
                    </button>
                  ),
                })}
              </p>
              {(resendSuccess) ? (
                <p className="text-sm text-muted-foreground underline underline-offset-4">
                  {t2("contentResendSucess")}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t2.rich("contentResend", {
                    button: (chunks) => (
                      <button
                        type="button"
                        onClick={handlerResendConfirmEmail}
                        className="cursor-pointer text-black dark:text-white underline underline-offset-4 transition-opacity
                         hover:opacity-70 disabled:cursor-wait disabled:opacity-50 disabled:no-underline"
                        disabled={resendIsLoading}
                      >
                        {chunks}
                      </button>
                    ),
                  })}
                </p>
              )}
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
              <div className="flex flex-col gap-1">
                <div className="grid gap-1">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('email')}
                    {showRequiredMark('email') && (
                      <span className="ml-1 text-red-600 dark:text-red-400">*</span>
                    )}
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    required
                    value={email}
                    aria-invalid={Boolean(fieldErrors.email)}
                    className={cn(
                      fieldErrors.email &&
                      'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400'
                    )}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />

                  {renderError('email')}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="nickname" className="text-sm font-medium">
                    {t('nickname')}
                    {showRequiredMark('nickname') && (
                      <span className="ml-1 text-red-600 dark:text-red-400">*</span>
                    )}
                  </Label>

                  <Input
                    id="nickname"
                    type="text"
                    placeholder={t('nicknamePlaceholder')}
                    required
                    value={nickname}
                    aria-invalid={Boolean(fieldErrors.nickname)}
                    className={cn(
                      fieldErrors.nickname &&
                      'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400'
                    )}
                    onChange={(e) => handleFieldChange('nickname', e.target.value)}
                  />

                  {renderError('nickname')}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('password')}
                    {showRequiredMark('password') && (
                      <span className="ml-1 text-red-600 dark:text-red-400">*</span>
                    )}
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    aria-invalid={Boolean(fieldErrors.password)}
                    className={cn(
                      fieldErrors.password &&
                      'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400'
                    )}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                  />

                  {renderError('password', 'max-w-[22rem] break-words')}
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="repeat-password" className="text-sm font-medium">
                    {t('repeatPassword')}
                    {showRequiredMark('repeatPassword') && (
                      <span className="ml-1 text-red-600 dark:text-red-400">*</span>
                    )}
                  </Label>

                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    aria-invalid={Boolean(fieldErrors.repeatPassword)}
                    className={cn(
                      fieldErrors.repeatPassword &&
                      'border-red-500 focus-visible:ring-red-500 dark:border-red-400 dark:focus-visible:ring-red-400'
                    )}
                    onChange={(e) => handleFieldChange('repeatPassword', e.target.value)}
                  />

                  {renderError('repeatPassword')}
                </div>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isFormReady}
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
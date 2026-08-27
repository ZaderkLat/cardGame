import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')

  let next = '/'

  if (_next) {
    try {
      const nextUrl = new URL(_next)

      // Solo permitir URLs de tu propio dominio
      if (nextUrl.origin === request.nextUrl.origin) {
        next = nextUrl.pathname + nextUrl.search + nextUrl.hash
      }
    } catch {
      // Si no es una URL válida, dejamos "/"
    }
  }


  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      redirect(next)
    } else {
      redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  redirect('/auth/error?error=No%20token%20hash%20or%20type')
}
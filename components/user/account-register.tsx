'use client'

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export function AccountRegister({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'div'>) {

    const t = useTranslations('AccountRegister');
    const router = useRouter();

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center',
                className
            )}
            {...props}
        >
            <Card className="w-full max-w-md ">
                <CardContent className="flex flex-col items-center px-6 py-8 text-center sm:px-8 sm:py-10">

                    <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2
                            className="size-8 text-green-500"
                            strokeWidth={2}
                        />
                    </div>

                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        {t('title')}
                    </h2>

                    <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                        {t('description')}
                    </p>

                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className=" mt-7 h-10 w-full rounded-md bg-blue-600 px-5 text-lg font-black text-white
                            transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                            focus-visible:ring-offset-2 cursor-pointer dark:bg-blue-700 dark:hover:bg-blue-800
                        "
                    >
                        {t('backMenu')}
                    </button>

                </CardContent>
            </Card>
        </div>
    );
}
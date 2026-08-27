import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";


/*------------metadata--------*/
type Props = {
  params: Promise<{ locale: string; slug: string }>;
};
const localeMetadata = {
  es: {
    title: "MiniJuegos - Cuenta Registrada",

  },
  en: {
    title: "MiniGames - Registered Account",
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

export default async function Page() {
  const t = await getTranslations("SignUpSuccess");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("title")}
              </CardTitle>

              <CardDescription>
                {t("description")}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("content")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

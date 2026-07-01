"use client";

import { Check } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";


export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  function changeLanguage(newLocale: "es" | "en") {
    router.replace(pathname, {
      locale: newLocale
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          🌐
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage("es")}>
          🇪🇸 Español
          {locale === "es" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => changeLanguage("en")}>
          🇺🇸 English
          {locale === "en" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
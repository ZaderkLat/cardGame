"use client";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from '@/lib/client'
import { useRouter } from "next/navigation";
import { Cog } from "lucide-react";
import { ModeToggle } from "../ui/modeToggle";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "../ui/languajeToggle";

export default function ConfigMenu() {
    const t = useTranslations("SettingsMenu");
    const router = useRouter();

    const logoutHandler = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Cog className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
                <DropdownMenuGroup>
                    <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>

                    <DropdownMenuItem>
                        {t("profile")}
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                        {t("billing")}
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup className="flex justify-center gap-6">
                    <ModeToggle />
                    <LanguageSwitcher />
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={logoutHandler}>
                        {t("logout")}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
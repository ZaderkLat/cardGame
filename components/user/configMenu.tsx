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
import { useState } from "react";
import { ModeToggle } from "../ui/modeToggle";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { LanguageSwitcher } from "../ui/languajeToggle";
import { LogOut } from "lucide-react";
interface ConfigMenuProps {
    username: string;
    isGuest: boolean;
}
export default function ConfigMenu({ username, isGuest }: ConfigMenuProps) {
    const t = useTranslations("SettingsMenu");
    const router = useRouter();

    const logoutHandler = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
    }
    const [open, setOpen] = useState(false);
    return (
        <DropdownMenu open={open} onOpenChange={setOpen} >
            <DropdownMenuTrigger asChild>
                {/*scale-100 means that that the button does not perform any animation, cuz scale:115 is general for Button component*/}
                <Button className="hover:scale-100" variant="outline">
                    <div className="flex flex-row gap-1 items-center b">
                        {username}
                        <ChevronDown
                            className={`transition-transform ${open ? "rotate-180" : ""
                                }`}
                        />
                    </div>

                </Button>
            </DropdownMenuTrigger>
            {!isGuest ? (
                <DropdownMenuContent>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-center">{t("myAccount")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                    </DropdownMenuGroup>
                    <DropdownMenuGroup className="flex flex-col items-center ">
                        <DropdownMenuItem className="w-full text-center justify-center">
                            {t("profile")}
                        </DropdownMenuItem>

                        <DropdownMenuItem className="w-full text-center justify-center">
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

                        <DropdownMenuItem
                            className="w-full text-center justify-center"
                            onClick={logoutHandler}>
                            <LogOut /> {t("logout")}

                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                </DropdownMenuContent>

            ) : (
                <DropdownMenuContent>
                    <DropdownMenuGroup className="text-center">
                        <DropdownMenuLabel>{t("configuration")}</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="flex justify-center gap-6 p-1">
                        <ModeToggle />
                        <LanguageSwitcher />
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="flex flex-col items-center ">
                        <DropdownMenuItem className="w-full text-center justify-center"
                            onClick={() => router.push("/auth/login")}>
                            {t("login")}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="w-full text-center justify-center"
                            onClick={() => router.push("/auth/sign-up")}>
                            {t("register")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            )
            }





        </DropdownMenu >
    );
}

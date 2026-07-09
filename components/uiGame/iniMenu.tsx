"use client";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MenuStatus } from "@/interface/menuStatus";
import { useUser } from "@/hooks/useUser";
import {
  useTranslations

} from "next-intl";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface IniMenuProps {
  setMenuState: (state: MenuStatus) => void;
}

export default function IniMenu({ setMenuState }: IniMenuProps) {
  const t = useTranslations("iniMenu");
  const { user, loading } = useUser();
  const router = useRouter();
  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md h-auto pt-14 pb-14 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-extrabold mb-3">
            <h1 className="text-5xl font-extrabold mb-3">
              {t("welcome")}
            </h1>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent >
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setMenuState("select")}
              className="h-12 shadow-xl dark:text-zinc-300 text-lg font-semibold bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"

            >
              {t("playButton")}
            </Button>
            {loading ? (
              <div className="flex gap-4 w-full mt-4">
                <Skeleton className="bg-zinc-200 dark:bg-zinc-600 flex-1 h-10 rounded-md" />
                <Skeleton className="bg-zinc-200 dark:bg-zinc-600 flex-1 h-10 rounded-md" />
              </div>
            ) : (
              <div>
                {user?.isGuest ? (
                  <div className="flex gap-4 w-full mt-4">
                    <Button className="flex-1 h-10 text-lg  border border-zinc-200 shadow-xl hover:bg-zinc-200 " variant="outline"
                      onClick={() => { router.push("/auth/sign-up") }}>
                      {t("register")}
                    </Button>

                    <Button className="flex-1 h-10 text-lg border border-zinc-200 shadow-xl hover:bg-zinc-200 hover:scale-105" variant="outline"
                      onClick={() => { router.push("/auth/login") }}>
                      {t("login")}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full mt-4">
                    <Button className="flex-1 h-10 text-lg border border-zinc-200 shadow-xl hover:bg-zinc-200 hover:scale-105" variant="outline">
                      {t("historial")}
                    </Button>
                  </div>
                )}

              </div>
            )}



          </div>
        </CardContent>
      </Card>
    </div >
  );
}



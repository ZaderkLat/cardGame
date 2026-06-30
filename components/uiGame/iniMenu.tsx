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

import {
  useTranslations

} from "next-intl";
interface IniMenuProps {
  setMenuState: (state: MenuStatus) => void;
}

export default function IniMenu({ setMenuState }: IniMenuProps) {
  const t = useTranslations("iniMenu");
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
              className="h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-700"
            >
              {t("playButton")}
            </Button>

            <Button
              onClick={() => setMenuState("info")}
              variant="outline"
              className="h-12 text-lg"
            >
              {t("howPlayButton")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



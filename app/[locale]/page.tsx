"use client";

import { useEffect, useState } from "react";
import TwentyOneTable from "@/components/uiGame/twentyOne/twentyOneTable";
import IniMenu from "@/components/uiGame/iniMenu";
import SelectGameMenu from "@/components/uiGame/selectGameMenu";
import { MenuStatus } from "@/interface/menuStatus";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  const [menuState, setMenuState] = useState<MenuStatus>("main");
  const [previousMenuState, setPreviousMenuState] = useState<MenuStatus>("main");

  const handlerMenu = (state: MenuStatus) => {
    setPreviousMenuState(menuState);
    setMenuState(state);
  };

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black">

      <title>{t("title")}</title>
      {menuState === "main" && (
        <IniMenu setMenuState={handlerMenu} />
      )}
      {menuState === "select" && <SelectGameMenu setMenuState={handlerMenu} menuState={previousMenuState} />}
      {menuState === "game_twenty_one" && <TwentyOneTable setMenuState={handlerMenu} />}



    </div>
  );
}

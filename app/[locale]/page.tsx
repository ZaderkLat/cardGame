"use client";

import { useState } from "react";

import TwentyOneSelect from "@/components/uiGame/twentyOne/twentyOneSelectMode";
import IniMenu from "@/components/uiGame/iniMenu";
import SelectGameMenu from "@/components/uiGame/selectGameMenu";
import { MenuStatus } from "@/interface/menuStatus";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("Home");
  const [menuState, setMenuState] = useState<MenuStatus>("main");
  const [previousMenuState, setPreviousMenuState] = useState<MenuStatus>("main");
  const [gameModeId, setGameModeId] = useState<number>(0);

  const handlerMenu = (state: MenuStatus) => {
    setPreviousMenuState(menuState);
    setMenuState(state);
  };

  return (
    <div className="flex flex-col min-h-0 h-full flex-1 bg-zinc-50 dark:bg-black">

      <title>{t("title")}</title>
      {menuState === "main" && (
        <IniMenu setMenuState={handlerMenu} />
      )}
      {menuState === "select" && <SelectGameMenu setMenuState={handlerMenu} menuState={previousMenuState} setGameModeId={setGameModeId} />}
      {menuState === "game_twenty_one" && <TwentyOneSelect setMenuState={handlerMenu} gameModeId={gameModeId} />}



    </div>
  );
}

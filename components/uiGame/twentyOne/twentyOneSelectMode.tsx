"use client"
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import ReturnButton from "@/components/uiGame/returnButton";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mode } from "@/interface/gameData";
import { MenuStatus } from "@/interface/menuStatus";
import { SimpleCombobox } from "@/components/ui/simpleComboBox";
import QuantitySelector from "@/components/ui/quantitySelector";
import { difficulties } from "@/interface/gameData";

import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import TwentyOneTableSolo from "./twentyOneTableSolo";
import TwentyOneTableDealer from "./twentyOneTableDealer";
import { useUser } from "@/hooks/useUser";
interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;

}

export default function TwentyOneSelect({ setMenuState }: TwentyOneTableProps) {
    const locale = useLocale()
    const t = useTranslations("twentyOne");
    const [openDifficultDialog, setOpenDifficultDialog] = useState<boolean>(true);
    const [difficulty, setDifficulty] = useState<keyof typeof difficulties>("medium");
    const { user } = useUser();
    const [rounds, setRounds] = useState<number>(5)
    const modes: Mode[] = [
        { label_es: "Solitario", label_en: "Solo", value: "solo" },
        { label_es: "Contra Dealer", label_en: "VS Dealer", value: "dealer" },

    ] as const;
    const [mode, setMode] = useState("solo");
    const difficultyDisabled = mode === "dealer";



    return (

        <div className="h-full w-full">

            <DialogSelectDifficult
                open={openDifficultDialog}
                onOpenChange={setOpenDifficultDialog}
                title={t("selectDifficulty")}
                childrenBottom={
                    <div className="flex justify-center w-full">
                        <ReturnButton
                            setMenuState={setMenuState}
                            menuState="select"
                            className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-900
                                        text-white rounded-lg  font-bold
                                        transition-all hover:scale-105"

                        >
                            {t("exitGame")}
                        </ReturnButton>
                    </div>
                }
            >

                <div className="flex flex-col w-full h-full gap-5">
                    <div className="flex flex-col w-full">
                        <p className="text-base sm:text-lg font-bold text-gray-800 pb-4 dark:text-white">
                            Select mode:
                        </p>
                        <SimpleCombobox
                            items={modes}
                            value={mode}
                            languaje={locale}
                            onChange={setMode}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
                            Rounds:
                        </p>

                        <QuantitySelector
                            value={rounds}
                            onChange={setRounds}
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="text-base sm:text-lg font-bold text-gray-800 pb-4 dark:text-white text-center">
                            <p>{t("difficultyText")}</p>
                        </div>

                        <div className="flex flex-row sm:flex-row justify-center border-2 gap-4 sm:gap-6 rounded-lg p-4 w-full">

                            {difficulties &&
                                Object.entries(difficulties).map(([key, value]) => (
                                    <label
                                        key={key}
                                        className="flex flex-row items-center justify-center sm:justify-start gap-2 cursor-pointer"
                                    >
                                        <Checkbox
                                            checked={difficulty === key}
                                            disabled={difficultyDisabled}
                                            onCheckedChange={() => {
                                                setDifficulty(key as keyof typeof difficulties);
                                            }}
                                            className=" border-gray-400 data-[state=checked]:bg-blue-600"
                                        />

                                        <div className="flex flex-row sm:flex-row gap-1 sm:gap-2 items-center text-center">
                                            <span className="text-sm sm:text-lg font-medium text-gray-800 dark:text-white">
                                                {value[`name_${locale}` as keyof typeof value]}
                                            </span>

                                            <Popover>
                                                <PopoverTrigger>
                                                    <span className="text-sm text-gray-500 dark:text-gray-300">
                                                        (?)
                                                    </span>
                                                </PopoverTrigger>

                                                <PopoverContent className="max-w-62.5 sm:max-w-xs">
                                                    <p className="text-sm">
                                                        {value[`description_${locale}` as keyof typeof value]}, {`${t("youNeed")} `}
                                                        {value.requerimentPoints *
                                                            (rounds)}
                                                        {` ${t("pointsTo")}.`}
                                                    </p>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </label>
                                ))}
                        </div>
                    </div>
                </div>




            </DialogSelectDifficult>


            {!openDifficultDialog && (
                <>
                    {mode === "solo" && (
                        <TwentyOneTableSolo
                            setMenuState={setMenuState}
                            difficulty={difficulty}
                            rounds={rounds}
                            onChangeDifficulty={setDifficulty}
                            setRounds={setRounds}
                            userId={user?.id || ""}
                            userName={user?.name || ""}

                        />
                    )}

                    {mode === "dealer" && (
                        <TwentyOneTableDealer
                            setMenuState={setMenuState}
                            rounds={rounds}
                            setRounds={setRounds}
                            userId={user?.id || ""}
                            userName={user?.name || ""}
                        />
                    )}
                </>
            )}

        </div>
    )
}
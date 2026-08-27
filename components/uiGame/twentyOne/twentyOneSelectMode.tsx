"use client"
import DialogSelectDifficult from "@/components/ui/dialogSelectDifficult";
import ReturnButton from "@/components/uiGame/returnButton";
import { useEffect, useState } from "react";
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
import { gameModeTypeDTO } from "@/interface/responseDB";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

interface TwentyOneTableProps {
    setMenuState: (state: MenuStatus) => void;
    gameModeId: number
}

export default function TwentyOneSelect({ setMenuState, gameModeId }: TwentyOneTableProps) {
    const locale = useLocale()
    const t = useTranslations("twentyOneSelectMode");
    const [openDifficultDialog, setOpenDifficultDialog] = useState<boolean>(true);
    const [difficulty, setDifficulty] = useState<keyof typeof difficulties>("medium");
    const { user } = useUser();
    const [rounds, setRounds] = useState<number>(5)
    const [modes, setModes] = useState<gameModeTypeDTO[]>([])
    const [mode, setMode] = useState("solo");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const difficultyDisabled = mode === "dealer";

    useEffect(() => {
        const fetchModeTypes = async () => {
            const response = await fetch(
                `/api/dataBase/gameModeType?gameModeId=${gameModeId}&locale=${locale}`
            );

            const data = await response.json();
            if (!data) return;
            setModes(data);

        }
        fetchModeTypes()
    }, [])

    useEffect(() => {
        if (modes) {
            setIsLoading(false);
        }
    }, [modes])
    const selectedModeType = modes.find((m) => m.value === mode);
    const currentGameModeTypeId = selectedModeType?.game_mode_type_id;
    return (

        <div className="h-full">

            <DialogSelectDifficult
                open={openDifficultDialog}
                onOpenChange={setOpenDifficultDialog}
                title={t("gameSettings")}
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
                            {t("selectMode")}
                        </p>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-9 w-full rounded-md border border-input px-4 py-2" />
                            </>
                        ) : (
                            <>
                                <SimpleCombobox
                                    items={modes}
                                    value={mode}
                                    onChange={setMode}
                                />
                            </>
                        )}

                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-base sm:text-lg font-bold text-gray-800 dark:text-white">
                            {t("numberOfRounds")}:
                        </p>

                        <QuantitySelector
                            value={rounds}
                            onChange={setRounds}
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <div className="text-base sm:text-lg font-bold text-gray-800 pb-4 dark:text-white text-center">
                            <p>{t("difficultyText")}:</p>
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
                    {!user && (
                        <div></div>
                    )}
                    {(mode === "solo" && user) && (
                        <TwentyOneTableSolo
                            setMenuState={setMenuState}
                            difficulty={difficulty}
                            rounds={rounds}
                            onChangeDifficulty={setDifficulty}
                            setRounds={setRounds}
                            user={user}
                            gameTypeId={currentGameModeTypeId ?? 0}

                        />
                    )}

                    {(mode === "dealer" && user) && (
                        <TwentyOneTableDealer
                            setMenuState={setMenuState}
                            rounds={rounds}
                            setRounds={setRounds}
                            user={user}
                            gameTypeId={currentGameModeTypeId ?? 0}
                        />
                    )}
                </>
            )}

        </div>
    )
}
"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { MenuStatus } from "@/interface/menuStatus";
import ReturnButton from "./returnButton";
import { ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import CardSelectGame from "./cardSelectGame";
import DialogHowToPlay21Game from "@/components/uiGame/twentyOne/dialogHowToPlay21Game";
import { ScrollArea } from "@/components/ui/scroll-area";
import { gameModeDTO } from "@/interface/responseDB";
import { useEffect, useState } from "react";
import { gameModeTypeDTO } from "@/interface/responseDB";
import { SimpleCombobox } from "../ui/simpleComboBox";
import { comboBoxItems } from "@/interface/comboBox";
import { RecordTableColumn, RecordTableRow, RecordTableResponse } from "@/interface/responseDB";
import { Skeleton } from "@/components/ui/skeleton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
interface SelectGameMenuProps {
    menuState: MenuStatus;
    setMenuState: (state: MenuStatus) => void;

}

export default function Record({ setMenuState }: SelectGameMenuProps) {

    const locale = useLocale()
    const t = useTranslations("selectGameMenu");
    const [gameMode, setGameMode] = useState<gameModeDTO[]>([]);
    const [gameModeType, setgameModeType] = useState<gameModeTypeDTO[]>([])

    const [comboBoxGameMode, setComboBoxGameMode] = useState<comboBoxItems[]>([]);
    const [gameModeSelected, setGameModeSelected] = useState<string>();



    const [comboBoxGameModeType, setComboBoxGameModeType] = useState<comboBoxItems[]>([]);
    const [gameModeTypeSelected, setGameModeTypeSelected] = useState<string>();


    const [records, setRecords] = useState<RecordTableRow[]>([]);
    const [recordColumns, setRecordColumns] = useState<RecordTableColumn[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(false);
    useEffect(() => {
        const fetchGameModes = async () => {
            try {
                const response = await fetch(`/api/dataBase/gameMode?locale=${locale}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch game modes");
                }
                const data: gameModeDTO[] = await response.json();

                const comboBoxItems: comboBoxItems[] = data.map((gameMode) => ({
                    value: String(gameMode.game_mode_id),
                    label: gameMode.title,
                }));


                setGameModeSelected(String(data[0].game_mode_id))
                setComboBoxGameMode(comboBoxItems);
                setGameMode(data);
            } catch (error) {
                console.error("Error fetching game modes:", error);
            }
        };

        fetchGameModes();
    }, [locale]);

    useEffect(() => {
        if (!gameModeSelected) return;
        console.log(gameModeSelected)
        const fetchModeTypes = async () => {


            const response = await fetch(
                `/api/dataBase/gameModeType?gameModeId=${gameModeSelected}&locale=${locale}`
            );

            const data: gameModeTypeDTO[] = await response.json();
            console.log(data)
            if (!data) return;
            const comboBoxItems: comboBoxItems[] = data.map((gameMode) => ({
                value: String(gameMode.game_mode_type_id),
                label: gameMode.label,
            }));

            setGameModeTypeSelected(String(data[0].game_mode_type_id));
            setComboBoxGameModeType(comboBoxItems);

        }
        fetchModeTypes()
    }, [gameModeSelected])

    useEffect(() => {
        if (!gameModeTypeSelected) return;

        const fetchRecords = async () => {
            try {
                setRecordsLoading(true);

                const response = await fetch(
                    `/api/dataBase/record?gameModeType=${gameModeTypeSelected}&locale=${locale}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch records");
                }

                const data: RecordTableResponse = await response.json();

                setRecords(data.records);
                setRecordColumns(data.columns);

            } catch (error) {
                console.error("Error fetching records:", error);

                setRecords([]);
                setRecordColumns([]);

            } finally {
                setRecordsLoading(false);
            }
        };

        fetchRecords();

    }, [gameModeTypeSelected]);

    return (
        <div className="flex items-center justify-center w-full h-full p-4 s">
            <Card className="relative w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

                <ReturnButton
                    className=" absolute top-1 left-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100
                     dark:hover:bg-gray-700 transition-colors rounded-full
          "
                    setMenuState={setMenuState}
                    menuState="main"
                >
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="pt-6 pb-6 mb-2 text-center border-b">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                        {t("title")}
                    </CardTitle>

                </CardHeader>
                <div className="flex w-full h-full flex-row gap-6">
                    {(comboBoxGameMode && comboBoxGameModeType && gameModeTypeSelected) ? (
                        <div className="flex w-full ml-6 mr-6">
                            <div className="flex flex-1 flex-col gap-2 ">
                                <p className="text-sm font-medium">GameMode:</p>

                                <SimpleCombobox
                                    items={comboBoxGameMode}
                                    onChange={setGameModeSelected}
                                    value={gameModeSelected}
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                                <p className="text-sm font-medium">Game Type:</p>

                                <SimpleCombobox
                                    items={comboBoxGameModeType}
                                    onChange={setGameModeTypeSelected}
                                    value={gameModeTypeSelected}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex w-full ml-6 mr-6">
                            <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            <div className="flex flex-1 flex-col gap-2">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                    )}
                </div>
                <CardContent className="px-4 sm:px-8 lg:px-12 pb-8">

                    {recordsLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : records.length === 0 ? (
                        <div className="flex items-center justify-center py-10">
                            <p className="text-muted-foreground">
                                No hay registros.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center justify-center">Record ID</TableHead>
                                        <TableHead className="text-center justify-center">Rounds</TableHead>
                                        <TableHead className="text-center justify-center">Fecha</TableHead>

                                        {recordColumns.map((column) => (
                                            <TableHead className="text-center justify-center" key={column.key}>
                                                {column.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {records.map((record) => (
                                        <TableRow key={record.record_id}>
                                            <TableCell className="text-center justify-center">
                                                {record.record_id}
                                            </TableCell>

                                            <TableCell className="text-center justify-center">
                                                {record.rounds}
                                            </TableCell>

                                            <TableCell className="text-center justify-center">
                                                {new Date(
                                                    record.created_at
                                                ).toLocaleDateString(locale)}
                                            </TableCell >

                                            {recordColumns.map((column) => (
                                                <TableCell className="text-center justify-center" key={column.key}>
                                                    {record.properties[column.key] ?? "-"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                </CardContent>

            </Card>

        </div>
    );
}
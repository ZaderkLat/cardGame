"use client";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { MenuStatus } from "@/interface/menuStatus";
import ReturnButton from "./returnButton";
import { ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { gameModeDTO } from "@/interface/responseDB";
import { useCallback, useEffect, useMemo, useState } from "react";
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

type SortField = "rounds" | "created_at";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "win" | "lose";

export default function Record({ setMenuState }: SelectGameMenuProps) {

    const locale = useLocale()
    const t = useTranslations("selectGameMenu");

    const [comboBoxGameMode, setComboBoxGameMode] = useState<comboBoxItems[]>([]);
    const [gameModeSelected, setGameModeSelected] = useState<string>();



    const [comboBoxGameModeType, setComboBoxGameModeType] = useState<comboBoxItems[]>([]);
    const [gameModeTypeSelected, setGameModeTypeSelected] = useState<string>();


    const [records, setRecords] = useState<RecordTableRow[]>([]);
    const [recordColumns, setRecordColumns] = useState<RecordTableColumn[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState<SortField>("created_at");
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

    const normalizeStatusValue = useCallback((value?: string) => value?.trim().toLowerCase() ?? "", []);

    const matchesStatusFilter = useCallback((record: RecordTableRow) => {
        if (statusFilter === "all") return true;

        const statusValue =
            record.properties.status ??
            record.properties.state ??
            record.properties.result ??
            "";

        const normalized = normalizeStatusValue(statusValue);

        if (statusFilter === "win") {
            return ["win", "ganó", "gano"].includes(normalized);
        }

        return ["lose", "lost", "perdió", "perdio"].includes(normalized);
    }, [normalizeStatusValue, statusFilter]);

    const matchesDateFilter = useCallback((record: RecordTableRow) => {
        const recordDate = new Date(record.created_at);

        if (Number.isNaN(recordDate.getTime())) {
            return true;
        }

        if (startDate) {
            const start = new Date(`${startDate}T00:00:00`);
            if (recordDate < start) return false;
        }

        if (endDate) {
            const end = new Date(`${endDate}T23:59:59.999`);
            if (recordDate > end) return false;
        }

        return true;
    }, [endDate, startDate]);

    const filteredRecords = useMemo(() => {
        return [...records]
            .filter((record) => matchesStatusFilter(record) && matchesDateFilter(record))
            .sort((a, b) => {
                const leftValue = sortField === "rounds" ? a.rounds : new Date(a.created_at).getTime();
                const rightValue = sortField === "rounds" ? b.rounds : new Date(b.created_at).getTime();

                if (leftValue < rightValue) return sortDirection === "asc" ? -1 : 1;
                if (leftValue > rightValue) return sortDirection === "asc" ? 1 : -1;
                return 0;
            });
    }, [records, matchesDateFilter, matchesStatusFilter, sortField, sortDirection]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
        }

        setSortField(field);
        setSortDirection(field === "rounds" ? "desc" : "desc");
    };
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
            } catch (error) {
                console.error("Error fetching game modes:", error);
            }
        };

        fetchGameModes();
    }, [locale]);

    useEffect(() => {
        if (!gameModeSelected) return;

        const fetchModeTypes = async () => {
            const response = await fetch(
                `/api/dataBase/gameModeType?gameModeId=${gameModeSelected}&locale=${locale}`
            );

            const data: gameModeTypeDTO[] = await response.json();
            if (!data) return;
            const comboBoxItems: comboBoxItems[] = data.map((gameMode) => ({
                value: String(gameMode.game_mode_type_id),
                label: gameMode.label,
            }));

            setGameModeTypeSelected(String(data[0].game_mode_type_id));
            setComboBoxGameModeType(comboBoxItems);

        }
        fetchModeTypes()
    }, [gameModeSelected, locale])

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

    }, [gameModeTypeSelected, locale]);

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
                                <p className="text-sm font-medium">Game Mode:</p>

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
                <CardContent className="flex flex-col items-center px-4 sm:px-8 lg:px-12 pb-8">
                    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-muted/20 p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Estado
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="all">Todos</option>
                                    <option value="win">Win</option>
                                    <option value="lose">Lose</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Fecha desde
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(event) => setStartDate(event.target.value)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                            </label>

                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Fecha hasta
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(event) => setEndDate(event.target.value)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                />
                            </label>

                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Ordenar por
                                <select
                                    value={sortField}
                                    onChange={(event) => setSortField(event.target.value as SortField)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="created_at">Fecha</option>
                                    <option value="rounds">Rondas</option>
                                </select>
                            </label>

                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                Orden
                                <select
                                    value={sortDirection}
                                    onChange={(event) => setSortDirection(event.target.value as SortDirection)}
                                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                >
                                    <option value="desc">Descendente</option>
                                    <option value="asc">Ascendente</option>
                                </select>
                            </label>

                            <button
                                type="button"
                                onClick={() => {
                                    setStatusFilter("all");
                                    setStartDate("");
                                    setEndDate("");
                                    setSortField("created_at");
                                    setSortDirection("desc");
                                }}
                                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Reiniciar
                            </button>
                        </div>
                    </div>

                    {recordsLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="flex items-center justify-center py-10">
                            <p className="text-muted-foreground">
                                No hay registros.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto w-full">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center justify-center">Record ID</TableHead>
                                        <TableHead className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleSort("rounds")}
                                                className="mx-auto flex items-center justify-center gap-1 font-semibold"
                                            >
                                                Rounds
                                                {sortField === "rounds" &&
                                                    (sortDirection === "asc" ? " ↑" : " ↓")}
                                            </button>
                                        </TableHead>

                                        <TableHead className="text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleSort("created_at")}
                                                className="mx-auto flex items-center justify-center gap-1 font-semibold"
                                            >
                                                Fecha
                                                {sortField === "created_at" &&
                                                    (sortDirection === "asc" ? " ↑" : " ↓")}
                                            </button>
                                        </TableHead>

                                        {recordColumns.map((column) => (
                                            <TableHead className="text-center justify-center" key={column.key}>
                                                {column.label}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredRecords.map((record) => (
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
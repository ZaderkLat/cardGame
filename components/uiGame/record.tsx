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
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Filter, RotateCcw } from "lucide-react";

interface SelectGameMenuProps {
    menuState: MenuStatus;
    setMenuState: (state: MenuStatus) => void;

}

type SortField = "rounds" | "created_at";
type SortDirection = "asc" | "desc";
type StatusFilter = "all" | "win" | "lose";

export default function Record({ setMenuState }: SelectGameMenuProps) {

    const locale = useLocale()
    const t = useTranslations("record");

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

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (statusFilter !== "all") count++;
        if (startDate) count++;
        if (endDate) count++;
        if (sortField !== "created_at" || sortDirection !== "desc") count++;
        return count;
    }, [statusFilter, startDate, endDate, sortField, sortDirection]);

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
        <div className="flex h-dvh min-h-0 w-full items-center justify-center p-4">
            <Card className="relative flex h-full min-h-0 w-full max-w-6xl flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-xl">

                <ReturnButton
                    className=" absolute top-1 left-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-100
                     dark:hover:bg-gray-700 transition-colors rounded-full
          "
                    setMenuState={setMenuState}
                    menuState="main"
                >
                    <ArrowLeft />
                </ReturnButton>

                <CardHeader className="shrink-0 pt-6 pb-6 mb-2 text-center border-b">
                    <CardTitle className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
                        {t("title")}
                    </CardTitle>
                </CardHeader>

                <div className=" flex w-full flex-row gap-6">
                    {(comboBoxGameMode && comboBoxGameModeType && gameModeTypeSelected) ? (
                        <div className="flex flex-col w-full ml-6 mr-6">
                            <div className="flex w-full flex-col gap-4 lg:flex-row">
                                <div className="flex w-full flex-1 flex-col gap-2">
                                    <p className="text-sm font-medium">{t("gameMode")}</p>

                                    <SimpleCombobox
                                        items={comboBoxGameMode}
                                        onChange={setGameModeSelected}
                                        value={gameModeSelected}
                                    />
                                </div>

                                <div className="flex flex-1 flex-col gap-2">
                                    <p className="text-sm font-medium">{t("gameType")}</p>

                                    <SimpleCombobox
                                        items={comboBoxGameModeType}
                                        onChange={setGameModeTypeSelected}
                                        value={gameModeTypeSelected}
                                    />
                                </div>
                            </div>
                            <Accordion type="single" collapsible className="w-full mt-4">
                                <AccordionItem value="filters" className="border-b-0">
                                    <AccordionTrigger className="items-center gap-2 rounded-md border border-gray-300
                                     bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100
                                      hover:no-underline dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4" />

                                            <span>{t("filters")}</span>
                                            {activeFiltersCount > 0 && (
                                                <span className="ml-1 inline-flex h-5 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                                                    {activeFiltersCount}
                                                </span>
                                            )}
                                        </div>

                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {/* Contenedor principal con Scroll vertical y alto máximo */}
                                        <div className="max-h-25 overflow-y-auto rounded-lg border bg-muted/20 p-4">

                                            {/* Grid adaptativo: 1 col (móvil), 2 cols (tablet 'sm'), 3 cols (pantallas grandes 'lg') */}
                                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-end">
                                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {t("status")}
                                                    <select
                                                        value={statusFilter}
                                                        onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                    >
                                                        <option value="all">{t("all")}</option>
                                                        <option value="win">{t("win")}</option>
                                                        <option value="lose">{t("lose")}</option>
                                                    </select>
                                                </label>

                                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {t("dateFrom")}
                                                    <input
                                                        type="date"
                                                        value={startDate}
                                                        onChange={(event) => setStartDate(event.target.value)}
                                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                    />
                                                </label>

                                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {t("dateTo")}
                                                    <input
                                                        type="date"
                                                        value={endDate}
                                                        onChange={(event) => setEndDate(event.target.value)}
                                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                    />
                                                </label>

                                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {t("sortBy")}
                                                    <select
                                                        value={sortField}
                                                        onChange={(event) => setSortField(event.target.value as SortField)}
                                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                    >
                                                        <option value="created_at">{t("date")}</option>
                                                        <option value="rounds">{t("rounds")}</option>
                                                    </select>
                                                </label>

                                                <label className="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {t("sortOrder")}
                                                    <select
                                                        value={sortDirection}
                                                        onChange={(event) => setSortDirection(event.target.value as SortDirection)}
                                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800"
                                                    >
                                                        <option value="desc">{t("descending")}</option>
                                                        <option value="asc">{t("ascending")}</option>
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
                                                    className="flex items-center justify-center gap-2 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <RotateCcw className="h-4 w-4" />
                                                    {t("reset")}
                                                </button>

                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>

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
                <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 sm:px-8 lg:px-12 pb-8">


                    <ScrollArea className="min-h-0 min-w-0 flex-1 w-full">

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
                                    {t("noRecords")}
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border overflow-x-auto w-full">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center justify-center">{t("recordId")}</TableHead>
                                            <TableHead className="text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSort("rounds")}
                                                    className="mx-auto flex items-center justify-center gap-1 font-semibold"
                                                >
                                                    {t("rounds")}
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
                                                    {t("date")}
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
                        <ScrollBar orientation="vertical" />
                        <ScrollBar orientation="horizontal" />


                    </ScrollArea>


                </CardContent>

            </Card>

        </div>
    );
}
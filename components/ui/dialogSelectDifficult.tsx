"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";


export type DialogSelectDifficult = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    children?: React.ReactNode;
    childrenBottom?: React.ReactNode;
};



export default function DialogSelectDifficult({ title, open, children, onOpenChange, childrenBottom }: DialogSelectDifficult) {
    const t = useTranslations("DialogSelectDifficult");
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent
                className={cn(
                    " rounded-2xl p-4 shadow-xl ",
                    "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
                    "duration-300",

                    // Base animation
                    "data-[state=open]:animate-in",
                    "data-[state=closed]:animate-out",

                    // Variants
                    "data-[state=open]:fade-in",
                    "data-[state=open]:zoom-in-95",
                    "data-[state=closed]:fade-out",
                    "data-[state=closed]:zoom-out-95",
                    "justify-center items-center"
                )}
            >

                <DialogHeader className=" text-center">

                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {title}
                    </DialogTitle>
                    <DialogDescription>

                    </DialogDescription>


                </DialogHeader>

                {children}

                <DialogFooter className="mt-2 bg-transparent">
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {childrenBottom}
                        <DialogClose asChild>
                            <Button
                                className={cn(
                                    "active:scale-95 transition-all font-semibold shadow-md hover:shadow-lg hover:bg-zinc-200 bg-green-600 hover:bg-green-700",
                                    "dark:hover:bg-green-800 w-full text-2xl py-5 rounded-lg font-bold  dark:bg-green-700 dark:text-zinc-300",
                                    open && "animate-pulse-once transition-all hover:scale-105"
                                )}
                            >
                                {t("play")}
                            </Button>
                        </DialogClose>

                    </div>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { statusDialog } from "@/interface/dialog";
import { ReactNode } from "react";

export type GameDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    status: "win" | "lose" | "continue";
    backButton: ReactNode;

};

//control the animation of the dialog based on the game status
function getDialogStyle(status: statusDialog) {
    return cn(
        "max-w-md rounded-2xl p-6 shadow-xl",
        "bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
        "duration-300",

        // Base animation
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",

        // Variants
        status === "continue" && [
            "data-[state=open]:fade-in",
            "data-[state=open]:zoom-in-95",
            "data-[state=closed]:fade-out",
            "data-[state=closed]:zoom-out-95",
        ],

        status === "win" && [
            "data-[state=open]:fade-in",
            "data-[state=open]:zoom-in-150", // más impacto
            "data-[state=open]:slide-in-from-bottom-2", // pequeño bounce visual
        ],

        status === "lose" && [
            "data-[state=open]:fade-in",
            "data-[state=open]:zoom-in-90", // entra más “pesado”
            "data-[state=open]:slide-in-from-top-15", // cae
        ]
    );
}

export default function GameDialog({ title, description, open, status, onOpenChange, backButton }: GameDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent
                className={`${getDialogStyle(status)} shine`}
            >

                <DialogHeader className="space-y-3 text-center">

                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {title}
                    </DialogTitle>

                    <DialogDescription className="text-zinc-600 dark:text-zinc-400 whitespace-pre-line">
                        {description}
                    </DialogDescription>

                </DialogHeader>



                <DialogFooter className="mt-4 bg-transparent">
                    <div className="flex flex-1 justify-center gap-10">
                        {backButton}

                        <DialogClose asChild>
                            <Button
                                className={cn(
                                    "active:scale-95 transition-all font-semibold shadow-md hover:shadow-lg text-lg h-full",
                                    open && "animate-pulse-once"
                                )}
                            >
                                Play Again
                            </Button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { Mode } from "@/interface/gameData";
type Option = Mode;

type Props = {
    items: Option[];
    value: string;
    languaje: string
    onChange: (value: string) => void;
};

export function SimpleCombobox({ items, value, languaje, onChange }: Props) {
    const [open, setOpen] = useState(false);

    const selected = items.find(i => i.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                >
                    {selected?.[`label_${languaje}` as keyof typeof selected] ?? ""}
                    <ChevronDown className="size-4 opacity-60" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-1">
                {items.map(item => (
                    <button
                        key={item.value}
                        onClick={() => {
                            onChange(item.value);
                            setOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-accent"
                    >
                        {item[`label_${languaje}` as keyof typeof item]}

                        {item.value === value && (
                            <Check className="size-4" />
                        )}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    );
}
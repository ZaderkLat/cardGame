"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { comboBoxItems } from "@/interface/comboBox";

import { gameModeTypeDTO } from "@/interface/responseDB";
type Option = gameModeTypeDTO | comboBoxItems;

type Props = {
    items: Option[];
    value?: string;
    onChange: (value: string) => void;
};

export function SimpleCombobox({ items, value, onChange }: Props) {
    const [open, setOpen] = useState(false);
    let selected = items.find(i => i.value === value);
    if (!selected) {
        selected = items[0];
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between"
                >
                    {selected?.[`label` as keyof typeof selected] ?? ""}
                    <ChevronDown className="size-4 opacity-60" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-(--radix-popover-trigger-width) p-0 gap-0 space-y-0 overflow-hidden">
                {items.map(item => (
                    <button
                        key={item.value}
                        onClick={() => {
                            onChange(item.value);
                            setOpen(false);
                        }}
                        className="flex w-full items-center rounded-md justify-between px-3 py-2 text-left hover:bg-accent"
                    >
                        {item[`label` as keyof typeof item]}

                        {item.value === value && (
                            <Check className="size-4" />
                        )}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    );
}
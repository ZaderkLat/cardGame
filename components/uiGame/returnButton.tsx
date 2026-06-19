"use client";
import { MenuStatus } from "@/interface/menuStatus";
import { Button } from "../ui/button";


interface ReturnButtonProps {
    setMenuState: (state: MenuStatus) => void;
    //it's to save before menu's state to return to it when the button is clicked
    menuState: MenuStatus;
    children?: React.ReactNode;
    className?: string;
}

export default function ReturnButton({ setMenuState, menuState, children, className }: ReturnButtonProps) {
    return (
        <button
            onClick={() => setMenuState(menuState)}


            className={`min-w-10 min-h-10 top-4 left-4 rounded-full p-2 ${className}`}
        >

            {children}
        </button>
    );
}
"use client";
import { MenuStatus } from "@/interface/menuStatus";


interface ReturnButtonProps {
    setMenuState: (state: MenuStatus) => void;
    //it's to save before menu's state to return to it when the button is clicked
    menuState: MenuStatus;
    children?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export default function ReturnButton({ setMenuState, menuState, children, className, disabled }: ReturnButtonProps) {
    return (
        <button
            onClick={() => setMenuState(menuState)}
            className={`min-w-10 min-h-10 top-4 left-4  p-2 ${className}`}
            disabled={disabled}
        >

            {children}
        </button>
    );
}
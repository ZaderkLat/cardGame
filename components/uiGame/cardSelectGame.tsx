
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ReturnButton from "./returnButton";
import { ArrowLeft } from "lucide-react";
import { MenuStatus } from "@/interface/menuStatus";
interface CardSelectGameProps {
    name: string;
    image: string;
    setMenuState: (state: MenuStatus) => void;
    menuState: MenuStatus;
}

export default function CardSelectGame({ name, image, setMenuState, menuState }: CardSelectGameProps) {
    return (
        <div>
            <button
                key={name}
                onClick={() => setMenuState(menuState)}
                className="group overflow-hidden rounded-xl border bg-card shadow-md transition-all hover:scale-105 hover:shadow-xl"
            >
                <Image
                    src={image}
                    alt={name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                />

                <div className="p-4">
                    <h3 className="text-xl font-semibold">
                        {name}
                    </h3>
                </div>
            </button>
        </div>
    );
}
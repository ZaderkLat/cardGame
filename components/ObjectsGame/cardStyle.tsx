import { card } from "@/interface/card";
import { Heart, Spade, Club, Diamond } from "lucide-react";

export default function cardStyle(playerCard: card) {
    return (
        <div className="w-24 h-36 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col justify-between p-2">

            {/* Top Left */}
            <div className="flex flex-col items-start leading-none">
                <span className="text-lg font-bold text-black">{playerCard.rank}</span>
            </div>

            {/* Center Suit */}
            <div className="flex justify-center items-center text-4xl text-red-500">
                {playerCard.club === "Hearts" && <Heart color="red" fill="red"/>}
                {playerCard.club === "Spades" && <Spade color="blue" fill="blue"/>}
                {playerCard.club === "Clubs" && <Club color="black" fill="black"/>}
                {playerCard.club === "Diamonds" && <Diamond color="orange" fill="orange"/>}
            </div>

            {/* Bottom Right (rotated) */}
            <div className="flex flex-col items-left leading-none rotate-180">
                <span className="text-lg font-bold text-black">{playerCard.rank}</span>

            </div>

        </div>
    );
}
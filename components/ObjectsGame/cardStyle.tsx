import { card } from "@/interface/card";
import { Heart, Spade, Club, Diamond } from "lucide-react";

export default function cardStyle(playerCard: card) {
    return (
        <div className="w-18 h-27 lg:w-24 lg:h-36 bg-white rounded-xl shadow-lg border border-gray-300 flex flex-col justify-between p-1.5 lg:p-2">
            <div className="flex flex-col items-start leading-none">
                <span className="text-base lg:text-lg font-bold text-black">
                    {playerCard.rank}
                </span>
            </div>

            <div className="flex justify-center items-center text-3xl lg:text-4xl">
                {playerCard.club_en === "Hearts" && <Heart color="red" fill="red" />}
                {playerCard.club_en === "Spades" && <Spade color="blue" fill="blue" />}
                {playerCard.club_en === "Clubs" && <Club color="black" fill="black" />}
                {playerCard.club_en === "Diamonds" && <Diamond color="orange" fill="orange" />}
            </div>

            <div className="flex flex-col items-left leading-none rotate-180">
                <span className="text-base lg:text-lg font-bold text-black">
                    {playerCard.rank}
                </span>
            </div>
        </div>
    );
}
"use client";
import Image from "next/image";
export default function Maze() {
    return (
        <div

            className={`w-20 h-32 sm:w-24 sm:h-36 lg:w-28 lg:h-40 overflow-hidden rounded `}
        >
            <Image
                src="/backCard.svg"
                alt="Take card"
                width={96}
                height={144}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
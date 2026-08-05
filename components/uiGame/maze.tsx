"use client";

import Image from "next/image";

export default function Maze() {
    return (
        <div className="w-full h-full overflow-hidden rounded">
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
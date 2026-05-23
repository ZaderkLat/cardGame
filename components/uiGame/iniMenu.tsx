"use client";
import { Button } from "../ui/button";

export default function IniMenu() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Game!</h1>
        <p className="text-lg mb-8">Please select an option to get started.</p>
        <div className="flex space-x-4">
            <Button>Singler Player</Button>
            <Button>Multiplayer</Button>
        </div>
    </div>
  );
}
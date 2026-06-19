"use client";
import { Button } from "../ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MenuStatus } from "@/interface/menuStatus";
interface IniMenuProps {
  setMenuState: (state: MenuStatus) => void;
}
export default function IniMenu({ setMenuState }: IniMenuProps) {
  return (
    <div className="flex items-center justify-center h-full mb-16">
      <Card className="w-full max-w-md h-auto p-16 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-extrabold mb-3">
            <h1 className="text-5xl font-extrabold mb-3">
              Welcome
            </h1>
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Test your luck and strategy. Try to get as close to 21 as possible without going over.
          </CardDescription>
        </CardHeader>
        <CardContent >
          <div className="flex flex-col gap-4">
            <Button
              onClick={() => setMenuState("select")}
              className="h-12 text-lg font-semibold bg-blue-500 hover:bg-blue-700"
            >
              Play Game
            </Button>

            <Button
              onClick={() => setMenuState("info")}
              variant="outline"
              className="h-12 text-lg"
            >
              How to Play
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



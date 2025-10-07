
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Info, PartyPopper, RotateCcw } from "lucide-react";

const TOTAL_NUMBERS = 99;

export default function Home() {
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastDrawn, setLastDrawn] = useState<number | null>(null);
  const [cardInput, setCardInput] = useState("");
  const [checkResult, setCheckResult] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const initializeGame = useCallback(() => {
    setAvailableNumbers(
      Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
    );
    setDrawnNumbers([]);
    setLastDrawn(null);
    setCardInput("");
    setCheckResult(null);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const sortedDrawnNumbers = useMemo(() => {
    return [...drawnNumbers].sort((a, b) => a - b);
  }, [drawnNumbers]);

  const handleDraw = () => {
    if (availableNumbers.length === 0) return;

    setCheckResult(null);
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const newNumber = availableNumbers[randomIndex];

    setLastDrawn(newNumber);
    setDrawnNumbers((prev) => [...prev, newNumber]);
    setAvailableNumbers((prev) => prev.filter((num) => num !== newNumber));
  };

  const handleCheck = () => {
    if (!cardInput.trim()) {
      setCheckResult({
        message: "Please enter your card numbers to check.",
        type: "error",
      });
      return;
    }
    const cardNumbers = [
      ...new Set(
        cardInput
          .split(/[\s,]+/) // Accept space and/or comma as separators
          .map((n) => parseInt(n.trim()))
          .filter((n) => !isNaN(n) && n > 0 && n <= TOTAL_NUMBERS)
      ),
    ];

    if (cardNumbers.length === 0) {
      setCheckResult({
        message: `Invalid input. Please use comma or space-separated numbers from 1 to ${TOTAL_NUMBERS}.`,
        type: "error",
      });
      return;
    }

    const allDrawn = cardNumbers.every((num) => drawnNumbers.includes(num));

    if (allDrawn) {
      setCheckResult({
        message: "BINGO! All your numbers have been drawn.",
        type: "success",
      });
    } else {
      const missingNumbers = cardNumbers.filter(
        (num) => !drawnNumbers.includes(num)
      );
      setCheckResult({
        message: `Not yet! You are still missing: ${missingNumbers.join(
          ", "
        )}.`,
        type: "info",
      });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 py-8 sm:p-8 sm:py-12">
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-primary">
            Bingo Draw
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
            A modern way to play your favorite game. Good luck!
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Draw Number</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <div className="relative w-44 h-44 bg-muted rounded-full flex items-center justify-center shadow-inner">
                  {lastDrawn ? (
                    <span
                      key={lastDrawn}
                      className="text-7xl font-bold text-accent animate-fade-in-scale"
                      aria-live="polite"
                    >
                      {lastDrawn}
                    </span>
                  ) : (
                    <span className="text-xl text-muted-foreground">
                      Ready?
                    </span>
                  )}
                </div>
                <div className="w-full space-y-3">
                  <Button
                    onClick={handleDraw}
                    disabled={availableNumbers.length === 0}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6"
                  >
                    {availableNumbers.length > 0
                      ? "Draw Number"
                      : "All Drawn!"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset Game
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to reset the game?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All drawn numbers will
                          be cleared and the game will start over.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={initializeGame}>
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <p className="text-sm text-muted-foreground">
                  {availableNumbers.length} numbers remaining
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="lg:col-span-2 flex flex-col gap-8">
            <Card className="shadow-lg flex-grow">
              <CardHeader>
                <CardTitle>Drawn Numbers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-secondary-foreground">
                    In Order of Drawing
                  </h3>
                  <div
                    className="p-3 bg-muted rounded-lg min-h-[116px] flex flex-wrap gap-2 items-center"
                    aria-label="Numbers in order they were drawn"
                  >
                    {drawnNumbers.length > 0 ? (
                      drawnNumbers.map((n) => (
                        <span
                          key={`seq-${n}`}
                          className="w-9 h-9 flex items-center justify-center bg-card border rounded-full font-mono font-semibold text-sm shadow-sm"
                        >
                          {n}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm w-full text-center">
                        No numbers drawn yet.
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-secondary-foreground">
                    Sorted Numerically
                  </h3>
                  <div
                    className="p-3 bg-muted rounded-lg min-h-[116px] flex flex-wrap gap-2 items-center"
                    aria-label="All drawn numbers sorted"
                  >
                    {sortedDrawnNumbers.length > 0 ? (
                      sortedDrawnNumbers.map((n) => (
                        <span
                          key={`sort-${n}`}
                          className="w-9 h-9 flex items-center justify-center bg-card border rounded-full font-mono font-semibold text-sm shadow-sm"
                        >
                          {n}
                        </span>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm w-full text-center">
                        No numbers drawn yet.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="lg:col-span-3">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Check Your Card</CardTitle>
                <CardDescription>
                  Enter your bingo card numbers separated by commas or spaces to
                  see if you've hit bingo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Input
                    placeholder="e.g., 5, 12, 23, 45, 67"
                    value={cardInput}
                    onChange={(e) => setCardInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                    className="text-base"
                    aria-label="Bingo card numbers"
                  />
                  <Button
                    onClick={handleCheck}
                    className="w-full sm:w-auto shrink-0"
                  >
                    Check Card
                  </Button>
                </div>
                {checkResult && (
                  <div
                    role="alert"
                    className={`mt-4 p-4 rounded-lg border text-sm flex items-start gap-3 ${
                      checkResult.type === "success"
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : checkResult.type === "error"
                        ? "bg-destructive/10 border-destructive/20 text-destructive"
                        : "bg-secondary border-border text-secondary-foreground"
                    }`}
                  >
                    {checkResult.type === "success" && (
                      <PartyPopper className="h-5 w-5 shrink-0 text-primary" />
                    )}
                    {checkResult.type === "error" && (
                      <Info className="h-5 w-5 shrink-0 text-destructive" />
                    )}
                    {checkResult.type === "info" && (
                      <Info className="h-5 w-5 shrink-0 text-secondary-foreground" />
                    )}
                    <p className="font-medium">{checkResult.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );

}
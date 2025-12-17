"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { BookOpen, BookOpenCheck, BrainCircuit } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";
import { FlashcardMaker } from "./flashcard-maker";
import { LessonPlanner } from "./lesson-planner";
import { StudentTextAssessor } from "./student-text-assessor";

type LessonPlannerToggleProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export function LessonPlannerToggle({
  chatId,
  sendMessage,
}: LessonPlannerToggleProps) {
  const [activeView, setActiveView] = useState<
    "planner" | "flashcards" | "assessor" | null
  >(null);

  if (activeView === "planner") {
    return (
      <div className="w-full">
        <LessonPlanner chatId={chatId} sendMessage={sendMessage} />
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setActiveView(null)}
            type="button"
            variant="ghost"
          >
            Stäng lektionsplaneraren
          </Button>
        </motion.div>
      </div>
    );
  }

  if (activeView === "flashcards") {
    return (
      <div className="w-full">
        <FlashcardMaker chatId={chatId} sendMessage={sendMessage} />
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setActiveView(null)}
            type="button"
            variant="ghost"
          >
            Stäng flashcard-skaparen
          </Button>
        </motion.div>
      </div>
    );
  }

  if (activeView === "assessor") {
    return (
      <div className="w-full">
        <StudentTextAssessor chatId={chatId} sendMessage={sendMessage} />
        <motion.div
          animate={{ opacity: 1 }}
          className="mt-4 flex justify-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setActiveView(null)}
            type="button"
            variant="ghost"
          >
            Stäng bedömningsverktyget
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center gap-4"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 flex flex-col items-center gap-2">
        <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">
          Hej!
        </h1>
        <p className="text-lg text-muted-foreground">
          Hur kan jag hjälpa dig idag?
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          className="h-14 gap-3 px-8 text-base"
          onClick={() => setActiveView("planner")}
          size="lg"
          type="button"
        >
          <BookOpen className="h-5 w-5" />
          Öppna lektionsplaneraren
        </Button>
        <Button
          className="h-14 gap-3 px-8 text-base"
          onClick={() => setActiveView("flashcards")}
          size="lg"
          type="button"
          variant="secondary"
        >
          <BrainCircuit className="h-5 w-5" />
          Gör flashcards
        </Button>
        <Button
          className="h-14 gap-3 px-8 text-base"
          onClick={() => setActiveView("assessor")}
          size="lg"
          type="button"
          variant="outline"
        >
          <BookOpenCheck className="h-5 w-5" />
          Bedöm elevtext
        </Button>
      </div>
      <p className="text-center text-muted-foreground text-sm">
        eller skriv din egen fråga i chattfältet nedan
      </p>
    </motion.div>
  );
}

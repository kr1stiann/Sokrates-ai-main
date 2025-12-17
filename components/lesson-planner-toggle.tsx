"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ChatMessage } from "@/lib/types";
import { LessonPlanner } from "./lesson-planner";

type LessonPlannerToggleProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

export function LessonPlannerToggle({
  chatId,
  sendMessage,
}: LessonPlannerToggleProps) {
  const [showPlanner, setShowPlanner] = useState(false);

  if (showPlanner) {
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
            onClick={() => setShowPlanner(false)}
            type="button"
            variant="ghost"
          >
            Stäng lektionsplaneraren
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
      <div className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Hej!
        </h1>
        <p className="text-lg text-muted-foreground">
          Hur kan jag hjälpa dig idag?
        </p>
      </div>
      <Button
        className="h-14 gap-3 px-8 text-base"
        onClick={() => setShowPlanner(true)}
        size="lg"
        type="button"
      >
        <BookOpen className="h-5 w-5" />
        Öppna lektionsplaneraren
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        eller skriv din egen fråga i chattfältet nedan
      </p>
    </motion.div>
  );
}

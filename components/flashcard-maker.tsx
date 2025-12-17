"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  CheckCircle,
  FileQuestion,
  HelpCircle,
  List,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

type FlashcardMakerProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
};

const SUBJECTS = [
  { value: "matematik", label: "Matematik" },
  { value: "svenska", label: "Svenska" },
  { value: "engelska", label: "Engelska" },
  { value: "no", label: "NO (Naturorienterande ämnen)" },
  { value: "so", label: "SO (Samhällsorienterande ämnen)" },
  { value: "idrott", label: "Idrott och hälsa" },
  { value: "bild", label: "Bild" },
  { value: "musik", label: "Musik" },
  { value: "slojd", label: "Slöjd" },
  { value: "hem", label: "Hem- och konsumentkunskap" },
];

const GRADES = [
  { value: "1", label: "Årskurs 1" },
  { value: "2", label: "Årskurs 2" },
  { value: "3", label: "Årskurs 3" },
  { value: "4", label: "Årskurs 4" },
  { value: "5", label: "Årskurs 5" },
  { value: "6", label: "Årskurs 6" },
  { value: "7", label: "Årskurs 7" },
  { value: "8", label: "Årskurs 8" },
  { value: "9", label: "Årskurs 9" },
  { value: "gymnasiet", label: "Gymnasiet" },
  { value: "vux", label: "Vuxenutbildning" },
];

const ACTIONS = [
  {
    id: "concepts",
    label: "Begrepp",
    icon: List,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa flashcards med viktiga begrepp och förklaringar inom ${subject} för ${grade} som handlar om ${topic}. Formatet ska vara Begrepp på framsidan och Förklaring på baksidan.`,
  },
  {
    id: "qa",
    label: "Frågor & Svar",
    icon: HelpCircle,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa flashcards med frågor och svar inom ${subject} för ${grade} som handlar om ${topic}. Formatet ska vara Fråga på framsidan och Svar på baksidan.`,
  },
  {
    id: "true-false",
    label: "Sant/Falskt",
    icon: CheckCircle,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa flashcards med påståenden inom ${subject} för ${grade} som handlar om ${topic}. Användaren ska avgöra om det är Sant eller Falskt. Ge rätt svar och en kort förklaring på baksidan.`,
  },
  {
    id: "fill-blank",
    label: "Fyll i luckor",
    icon: FileQuestion,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa flashcards där man ska fylla i luckor i meningar (cloze deletions) inom ${subject} för ${grade} som handlar om ${topic}. Svaret (det som ska fyllas i) ska stå på baksidan.`,
  },
];

export function FlashcardMaker({ chatId, sendMessage }: FlashcardMakerProps) {
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [topic, setTopic] = useState<string>("");

  const handleActionClick = (actionId: string) => {
    const action = ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    // Get labels for better prompt readability
    const subjectLabel =
      SUBJECTS.find((s) => s.value === subject)?.label || subject;
    const gradeLabel = GRADES.find((g) => g.value === grade)?.label || grade;

    // Validate inputs
    if (!subject || !grade || !topic) {
      // If fields are empty, use generic prompt
      const genericPrompt = action.prompt(
        subjectLabel || "[ämne]",
        gradeLabel || "[årskurs]",
        topic || "[ämne/tema]"
      );
      window.history.pushState({}, "", `/chat/${chatId}`);
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: genericPrompt }],
      });
      return;
    }

    const prompt = action.prompt(subjectLabel, gradeLabel, topic);
    window.history.pushState({}, "", `/chat/${chatId}`);
    sendMessage({
      role: "user",
      parts: [{ type: "text", text: prompt }],
    });
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-3xl space-y-6 px-4"
      exit={{ opacity: 0, y: 20 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="flex items-center gap-2 font-semibold text-2xl md:text-3xl">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Skapa Flashcards
        </h2>
        <p className="text-base text-muted-foreground md:text-lg">
          Välj ämne, årskurs och tema för att generera studiematerial
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Subject Selector */}
        <div className="space-y-2">
          <label
            className="font-medium text-base text-foreground"
            htmlFor="subject-select"
          >
            Ämne
          </label>
          <Select onValueChange={setSubject} value={subject}>
            <SelectTrigger className="h-12 text-base" id="subject-select">
              <SelectValue placeholder="Välj ämne" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECTS.map((subj) => (
                <SelectItem key={subj.value} value={subj.value}>
                  {subj.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Grade Selector */}
        <div className="space-y-2">
          <label
            className="font-medium text-base text-foreground"
            htmlFor="grade-select"
          >
            Årskurs
          </label>
          <Select onValueChange={setGrade} value={grade}>
            <SelectTrigger className="h-12 text-base" id="grade-select">
              <SelectValue placeholder="Välj årskurs" />
            </SelectTrigger>
            <SelectContent>
              {GRADES.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Topic Input */}
        <div className="space-y-2 sm:col-span-2">
          <label
            className="font-medium text-base text-foreground"
            htmlFor="topic-input"
          >
            Ämne/Tema
          </label>
          <Input
            className="h-12 text-base"
            id="topic-input"
            onChange={(e) => setTopic(e.target.value)}
            placeholder="T.ex. Franska revolutionen, Kemi, Engelska glosor..."
            type="text"
            value={topic}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <h3 className="font-medium text-base text-foreground">
          Vilken typ av kort vill du ha?
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 10 }}
                key={action.id}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Button
                  className={cn(
                    "h-auto w-full flex-col gap-2 py-4 text-base",
                    "transition-transform hover:scale-105"
                  )}
                  onClick={() => handleActionClick(action.id)}
                  type="button"
                  variant="outline"
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{action.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Helper Text */}
      <p className="text-center text-muted-foreground text-sm">
        Du kan också beskriva mer specifikt vad du vill ha i chattfältet nedan
      </p>
    </motion.div>
  );
}

"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  PencilLine,
  Presentation,
  Target,
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

type LessonPlannerProps = {
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
];

const ACTIONS = [
  {
    id: "lesson-plan",
    label: "Lektionsplanering",
    icon: BookOpen,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa en komplett lektionsplanering i ${subject} för ${grade} om ${topic}. Inkludera syfte, centralt innehåll, kunskapskrav enligt Lgr22, lektionsstruktur med tidsangivelser, och bedömning.`,
  },
  {
    id: "exercises",
    label: "Övningar",
    icon: PencilLine,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa övningar i ${subject} för ${grade} om ${topic}. Inkludera övningar på olika nivåer för differentiering (grundläggande, medel, fördjupning).`,
  },
  {
    id: "assessment",
    label: "Bedömning",
    icon: ClipboardCheck,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa bedömningsunderlag i ${subject} för ${grade} om ${topic}. Inkludera bedömningsmatris kopplad till kunskapskraven i Lgr22, samt förslag på formativ och summativ bedömning.`,
  },
  {
    id: "differentiation",
    label: "Differentiering",
    icon: Target,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa differentierade uppgifter och extra anpassningar i ${subject} för ${grade} om ${topic}. Inkludera material för elever som behöver extra stöd och extra utmaningar.`,
  },
  {
    id: "yearly-plan",
    label: "Årsplanering",
    icon: Calendar,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa en årsplanering i ${subject} för ${grade} med fokus på ${topic}. Inkludera arbetsområden, tidsfördelning, och koppling till centralt innehåll och kunskapskrav i Lgr22.`,
  },
  {
    id: "lecture",
    label: "Genomgång",
    icon: Presentation,
    prompt: (subject: string, grade: string, topic: string) =>
      `Skapa en strukturerad genomgång/föreläsning i ${subject} för ${grade} om ${topic}. Inkludera introduktion, huvudmoment, exempel, och sammanfattning.`,
  },
];

export function LessonPlanner({ chatId, sendMessage }: LessonPlannerProps) {
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
        <h2 className="font-semibold text-2xl md:text-3xl">
          Lektionsplanering
        </h2>
        <p className="text-base text-muted-foreground md:text-lg">
          Välj ämne, årskurs och tema för att komma igång
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
            placeholder="T.ex. Fotosyntesen, Multiplikation, Medeltiden..."
            type="text"
            value={topic}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <h3 className="font-medium text-base text-foreground">
          Vad vill du skapa?
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
        Du kan också skriva din egen fråga i chattfältet nedan
      </p>
    </motion.div>
  );
}

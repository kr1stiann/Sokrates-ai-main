"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";

export const Response = memo(
  ({ children, className }: { children: string; className?: string }) => (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-blue-400",
        "prose-pre:border prose-pre:border-border prose-pre:bg-zinc-100 dark:prose-pre:bg-zinc-900",
        "prose-code:font-normal prose-code:text-pink-600 prose-code:before:content-none prose-code:after:content-none dark:prose-code:text-pink-400",
        "[&_span.katex]:text-base", // Fix KaTeX font size consistency
        className
      )}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkMath, remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </div>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";

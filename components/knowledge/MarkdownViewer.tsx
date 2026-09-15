import React, { useMemo } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  const html = useMemo(() => {
    if (!content) return "";

    // Remove any leftover scraped HTML comment tags (e.g. <!-- THEME DEBUG -->)
    const cleaned = content.replace(/<!--[\s\S]*?-->/g, "").trim();

    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    const parsed = marked.parse(cleaned);
    return typeof parsed === "string" ? parsed : "";
  }, [content]);

  return (
    <div
      className={cn(
        "prose prose-lg dark:prose-invert max-w-none text-foreground/90 font-light leading-relaxed",
        "prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground",
        "prose-h1:text-3xl sm:prose-h1:text-4xl prose-h1:mt-10 prose-h1:mb-6",
        "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/40",
        "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-foreground prose-h3:font-semibold",
        "prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2 prose-h4:font-semibold",
        "prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:my-4 prose-p:text-foreground/90",
        "prose-a:text-data prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-data/80 prose-a:transition-colors",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-em:italic",
        "prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2",
        "prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2",
        "prose-li:text-base sm:prose-li:text-lg prose-li:leading-relaxed prose-li:text-foreground/90",
        "prose-blockquote:border-l-4 prose-blockquote:border-data prose-blockquote:pl-4 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-foreground/80 prose-blockquote:bg-muted/20 prose-blockquote:py-2 prose-blockquote:rounded-r-lg",
        "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:bg-muted prose-code:font-mono prose-code:text-xs prose-code:text-foreground",
        "prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:p-4",
        "prose-hr:border-border/60 prose-hr:my-8",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function InlineMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!content) return "";
    const cleaned = content.replace(/<!--[\s\S]*?-->/g, "").trim();
    const parsed = marked.parseInline(cleaned);
    return typeof parsed === "string" ? parsed : "";
  }, [content]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

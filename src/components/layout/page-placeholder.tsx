"use client";

import type { ComponentType } from "react";
import { Construction } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

const STAGES = ["Data modelling", "API endpoints", "Dashboard views", "Polish & QA"];

/** Stand-in used by the sidebar routes that are out of scope for this phase. */
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  const Icon: ComponentType<{ className?: string; strokeWidth?: number }> = Construction;

  return (
    <Card className="items-center justify-center gap-6 px-6 py-16 text-center sm:py-24">
      <span className="flex size-12 items-center justify-center rounded-xl border border-accent-line bg-gradient-to-b from-surface to-accent-soft text-accent shadow-raised">
        <Icon className="size-5" strokeWidth={1.8} />
      </span>

      <div className="max-w-md space-y-2.5">
        <p className="eyebrow">Coming Next</p>
        <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
        <p className="text-[13px] leading-relaxed text-ink-muted">{description}</p>
      </div>

      <ol className="flex flex-wrap items-center justify-center gap-2">
        {STAGES.map((stage, index) => (
          <li
            key={stage}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface-sunken px-3 py-1.5 text-[11.5px] text-ink-muted"
          >
            <span className="numeric flex size-4 items-center justify-center rounded-full bg-line-strong text-[9px] font-semibold text-surface">
              {index + 1}
            </span>
            {stage}
          </li>
        ))}
      </ol>
    </Card>
  );
}
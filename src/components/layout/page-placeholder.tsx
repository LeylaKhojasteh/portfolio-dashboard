"use client";

import type { ComponentType } from "react";
import { Construction } from "lucide-react";
import type { TranslationKey } from "@/locales";
import { useTranslate } from "@/components/layout/locale-provider";
import { Card } from "@/components/ui/card";

interface PagePlaceholderProps {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
}

const STAGE_KEYS: TranslationKey[] = [
  "placeholder.stages.data",
  "placeholder.stages.api",
  "placeholder.stages.views",
  "placeholder.stages.qa",
];

/** Stand-in used by the sidebar routes that are out of scope for this phase. */
export function PagePlaceholder({ titleKey, descriptionKey }: PagePlaceholderProps) {
  const t = useTranslate();
  const Icon: ComponentType<{ className?: string; strokeWidth?: number }> = Construction;

  return (
    <Card className="items-center justify-center gap-5 px-6 py-12 text-center sm:py-16">
      <span className="flex size-14 items-center justify-center rounded-2xl border border-line bg-gradient-to-b from-surface to-surface-sunken text-accent shadow-raised">
        <Icon className="size-6" strokeWidth={1.8} />
      </span>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-ink">{t(titleKey)}</h2>
        <p className="text-sm leading-relaxed text-ink-muted">{t(descriptionKey)}</p>
      </div>

      <ol className="flex flex-wrap items-center justify-center gap-2">
        {STAGE_KEYS.map((stageKey, index) => (
          <li
            key={stageKey}
            className="flex items-center gap-2 rounded-full border border-line bg-surface-sunken px-3 py-1.5 text-xs text-ink-muted"
          >
            <span className="numeric flex size-4 items-center justify-center rounded-full bg-line-strong text-[9px] font-semibold text-surface">
              {index + 1}
            </span>
            {t(stageKey)}
          </li>
        ))}
      </ol>
    </Card>
  );
}
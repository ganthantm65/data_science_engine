"use client";

import { Upload, Settings, Play, BarChart3, Wand2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "upload" | "configure" | "train" | "results" | "predict";

interface WorkflowStepsProps {
  currentStep: Step;
}

const STEPS: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "configure", label: "Configure", icon: Settings },
  { id: "train", label: "Train", icon: Play },
  { id: "results", label: "Results", icon: BarChart3 },
  { id: "predict", label: "Predict", icon: Wand2 },
];

const stepOrder: Step[] = ["upload", "configure", "train", "results", "predict"];

export function WorkflowSteps({ currentStep }: WorkflowStepsProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.id === currentStep;
        const isDone = i < currentIndex;

        return (
          <div key={step.id} className="flex items-center gap-1">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive && "bg-primary/10 text-primary",
                isDone && "bg-secondary text-foreground",
                !isActive && !isDone && "text-muted-foreground"
              )}
            >
              {isDone ? (
                <Check className="h-3 w-3" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-4",
                  i < currentIndex ? "bg-primary/40" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

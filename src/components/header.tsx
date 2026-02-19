import { BrainCircuit } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <BrainCircuit className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            DS Engine
          </h1>
          <p className="text-xs text-muted-foreground">
            Machine Learning Dashboard
          </p>
        </div>
      </div>
      <nav className="flex items-center gap-1">
        <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
          Linear Regression
        </span>
        <span className="rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
          KNN
        </span>
        <span className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          Custom Algorithms
        </span>
      </nav>
    </header>
  );
}

"use client";

import { useCallback, useRef } from "react";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import type { DatasetPreview } from "@/lib/types";

interface UploadPanelProps {
  file: File | null;
  preview: DatasetPreview | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function UploadPanel({
  file,
  preview,
  onFileSelect,
  onClear,
}: UploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile?.name.endsWith(".csv")) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) onFileSelect(selected);
    },
    [onFileSelect]
  );

  if (file && preview) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {preview.rowCount} rows, {preview.columns.length} columns
              </p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Remove file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border border-border scrollbar-thin">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {preview.columns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-medium text-muted-foreground"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.rows.slice(0, 5).map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border/50 last:border-0"
                >
                  {preview.columns.map((col) => (
                    <td
                      key={col}
                      className="px-3 py-2 font-mono text-foreground"
                    >
                      {String(row[col] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current?.click()}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-card/50 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-card"
      role="button"
      tabIndex={0}
      aria-label="Upload CSV file"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
        <Upload className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">
          Drop your CSV file here
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse files
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}

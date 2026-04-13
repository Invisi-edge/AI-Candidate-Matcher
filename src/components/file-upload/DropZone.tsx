"use client";

import { DragEvent, useCallback, useRef, useState } from "react";

type DropZoneProps = {
  accept: string;
  multiple: boolean;
  onFilesSelected: (files: File[]) => void;
  maxFileSize?: number;
  maxFiles?: number;
  label?: string;
  hint?: string;
};

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 50;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DropZone({
  accept,
  multiple,
  onFilesSelected,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxFiles = DEFAULT_MAX_FILES,
  label = "Drop files here or click to browse",
  hint,
}: DropZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedExtensions = accept
    .split(",")
    .map((ext) => ext.trim().toLowerCase());

  const validateFiles = useCallback(
    (files: File[]): { valid: File[]; error: string | null } => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
        const isValidType = acceptedExtensions.some(
          (accepted) => accepted === ext || accepted === file.type
        );

        if (!isValidType) {
          errors.push(`${file.name}: Invalid file type`);
          continue;
        }

        if (file.size > maxFileSize) {
          errors.push(`${file.name}: File too large (max ${formatFileSize(maxFileSize)})`);
          continue;
        }

        validFiles.push(file);
      }

      if (!multiple && validFiles.length > 1) {
        return { valid: [validFiles[0]], error: "Only one file allowed" };
      }

      if (validFiles.length > maxFiles) {
        return {
          valid: validFiles.slice(0, maxFiles),
          error: `Maximum ${maxFiles} files allowed`,
        };
      }

      return {
        valid: validFiles,
        error: errors.length > 0 ? errors.join("; ") : null,
      };
    },
    [acceptedExtensions, maxFileSize, maxFiles, multiple]
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const { valid, error } = validateFiles(Array.from(files));
      setError(error);

      if (valid.length > 0) {
        onFilesSelected(valid);
      }
    },
    [validateFiles, onFilesSelected]
  );

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragActive(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        inputRef.current?.click();
      }
    },
    []
  );

  const containerClass = [
    "dropzone",
    isDragActive && "drag-active",
    error && "has-error",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClass}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <svg
        className="dropzone-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <p className="dropzone-text">
        <strong>Click to upload</strong> or drag and drop
      </p>

      {hint && <p className="dropzone-hint">{hint}</p>}

      {error && <p className="dropzone-error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          border: 0,
        }}
        tabIndex={-1}
      />
    </div>
  );
}

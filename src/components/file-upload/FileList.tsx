"use client";

type FileListProps = {
  files: File[];
  onRemove: (fileName: string) => void;
};

function getFileIcon(fileName: string): { className: string; label: string } {
  const ext = fileName.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pdf":
      return { className: "file-icon file-icon-pdf", label: "PDF" };
    case "doc":
    case "docx":
      return { className: "file-icon file-icon-doc", label: "DOC" };
    case "txt":
      return { className: "file-icon file-icon-txt", label: "TXT" };
    default:
      return { className: "file-icon file-icon-txt", label: ext?.toUpperCase() ?? "?" };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="file-list" role="list" aria-label="Selected files">
      {files.map((file) => {
        const icon = getFileIcon(file.name);
        return (
          <div
            className="file-row"
            key={`${file.name}-${file.lastModified}`}
            role="listitem"
          >
            <span className={icon.className} aria-hidden="true">
              {icon.label}
            </span>
            <span title={file.name}>
              {file.name}
              <small style={{ marginLeft: 8, color: "var(--muted)" }}>
                ({formatFileSize(file.size)})
              </small>
            </span>
            <button
              type="button"
              className="ghost-button"
              onClick={() => onRemove(file.name)}
              aria-label={`Remove ${file.name}`}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

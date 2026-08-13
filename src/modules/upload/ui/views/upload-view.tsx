"use client";

import { useState } from "react";
import { Upload, FileText, X, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { processPDFFile } from "@/modules/upload/actions/process-pdf";

export function UploadView() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  function handleFileChange(selectedFile?: File) {
    setResult(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setResult({
        success: false,
        error: "Please select a PDF file.",
      });
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await processPDFFile(formData);

      setResult(result);

      if (result.success) {
        setFile(null);
      }
    } catch {
      setResult({
        success: false,
        error: "Something went wrong while processing the PDF.",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  function removeFile() {
    setFile(null);
    setResult(null);
  }

  return (
    <div className="w-full max-w-xl space-y-4 ">
      {!file ? (
        <label
          htmlFor="pdf-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center transition-colors hover:bg-muted/50"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
            <Upload className="size-5" />
          </div>

          <p className="font-medium">Upload a PDF</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Click to select a PDF file
          </p>

          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
          />
        </label>
      ) : (
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>

              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {!isProcessing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                aria-label="Remove file"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <Button
            className="mt-4 w-full"
            onClick={handleUpload}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing PDF...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Process PDF
              </>
            )}
          </Button>
        </div>
      )}

      {result?.success && (
        <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 p-3 text-sm">
          <CheckCircle2 className="size-4 text-green-600" />
          <span>{result.message}</span>
        </div>
      )}

      {result?.error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {result.error}
        </div>
      )}
    </div>
  );
}

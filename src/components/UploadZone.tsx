"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ANALYSIS_STEPS = [
  "Reading PDF",
  "Inspecting document",
  "Extracting invoice data",
  "Checking calculations",
  "Preparing results"
];

export function UploadZone() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
    startMockAnalysis();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const startMockAnalysis = () => {
    setAnalyzing(true);
    setCurrentStep(0);
    
    // Simulate steps
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < ANALYSIS_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(interval);
        // Navigate to mock results
        router.push("/results");
      }
    }, 800);
  };

  if (analyzing) {
    return (
      <div className="w-full max-w-xl mx-auto p-8 rounded-2xl glass-card flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
        <h3 className="text-xl font-semibold mb-6">Analyzing Invoice</h3>
        
        <div className="w-full space-y-3">
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;
            
            return (
              <div 
                key={step} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isCurrent ? "bg-secondary/50" : "",
                  isPending ? "opacity-40" : ""
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span className={cn(
                  "font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-[300px] p-6 rounded-2xl glass-card transition-all duration-300 ease-out cursor-pointer hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)]",
          isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border border-border/50",
          error ? "border-destructive/50 bg-destructive/5" : ""
        )}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center pointer-events-none">
          <div className="p-4 rounded-full bg-primary/10 transition-transform group-hover:scale-110">
            <UploadCloud className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold tracking-tight">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PDF invoices up to 10MB
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-4 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
        <File className="h-4 w-4" />
        <span>Your documents are processed securely and not stored.</span>
      </div>
    </div>
  );
}

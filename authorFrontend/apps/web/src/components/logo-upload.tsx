import React, { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Link2, Check, AlertCircle, RefreshCw } from "lucide-react";
import { BrokerLogo, isImageLogo } from "./broker-logo";

interface LogoUploadProps {
  value: string;
  onChange: (value: string) => void;
  brokerName?: string;
  className?: string;
  disabled?: boolean;
}

export function LogoUpload({
  value,
  onChange,
  brokerName = "",
  className = "",
  disabled = false,
}: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    // Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(png|jpe?g|svg|webp)$/i)) {
      setError("Please select a valid image file (PNG, JPG, SVG, or WebP).");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit. Please upload a smaller image.");
      return;
    }

    setFileName(file.name);
    const sizeInKb = (file.size / 1024).toFixed(1);
    setFileSize(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeInKb} KB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
      }
    };
    reader.onerror = () => {
      setError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput.trim());
      onChange(urlInput.trim());
      setFileName("Direct URL Asset");
      setFileSize(null);
      setError(null);
      setShowUrlInput(false);
      setUrlInput("");
    } catch {
      setError("Please enter a valid absolute HTTP or HTTPS URL.");
    }
  };

  const handleRemove = () => {
    onChange("");
    setFileName(null);
    setFileSize(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasImage = isImageLogo(value);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Main Upload Container */}
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Visual Preview Box */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 self-center sm:self-start">
          <div className="relative group">
            <BrokerLogo
              logo={value}
              name={brokerName}
              size="lg"
              className="h-16 w-16 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-500 shadow-sm"
            />
            {hasImage && !disabled && (
              <button
                type="button"
                onClick={handleRemove}
                title="Remove logo"
                className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-rose-500 hover:bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            {hasImage ? "Live Asset" : "Fallback Initial"}
          </span>
        </div>

        {/* Action Controls & Drag Drop Area */}
        <div className="flex-1 min-w-0 space-y-2.5 w-full">
          {/* Dropzone area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3.5 text-center transition-all cursor-pointer select-none ${
              disabled
                ? "opacity-50 cursor-not-allowed border-slate-300 dark:border-slate-800"
                : isDragging
                ? "border-amber-500 bg-amber-500/10 scale-[0.99]"
                : hasImage
                ? "border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-amber-500/50"
                : "border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-50/20 dark:hover:bg-amber-950/10"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                {hasImage ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {hasImage ? "Click or drag to replace logo" : "Click to upload broker logo"}
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-normal"> or drag and drop</span>
              </div>
              <p className="text-[10px] text-slate-400">
                PNG, JPG, SVG or WebP (max 5 MB) • Recommended 256×256 px
              </p>
            </div>
          </div>

          {/* Upload details / info bar */}
          {fileName && (
            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <ImageIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate font-medium">{fileName}</span>
                {fileSize && <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">({fileSize})</span>}
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 ml-2 shrink-0 cursor-pointer font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Toggle URL Input option */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowUrlInput((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer disabled:opacity-50"
            >
              <Link2 className="h-3 w-3" />
              <span>{showUrlInput ? "Hide Web URL input" : "Or use image Web URL"}</span>
            </button>

            {hasImage && !fileName && (
              <button
                type="button"
                disabled={disabled}
                onClick={handleRemove}
                className="text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer font-medium"
              >
                Reset to default initials
              </button>
            )}
          </div>

          {/* Web URL input pop-down */}
          {showUrlInput && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                value={urlInput}
                disabled={disabled}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="flex-1 bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlApply();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleUrlApply}
                disabled={disabled || !urlInput.trim()}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Apply</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 text-xs font-medium pt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

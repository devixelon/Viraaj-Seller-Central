import React, { useState, ChangeEvent } from "react";
import UploadIcon from "@/components/icons/UploadIcon";

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  onChange: (file: File | null) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  name,
  accept = "image/*",
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const hasError = touched && error;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFileName(file?.name || "");
    onChange(file);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        <label
          htmlFor={name}
          className={`w-full px-4 py-3 rounded-lg border-2 border-dashed transition-colors duration-200 cursor-pointer flex items-center justify-center ${
            hasError
              ? "border-red-500 bg-red-50"
              : "border-gray-300 hover:border-teal-500 bg-gray-50"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              {fileName || "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
          </div>
        </label>
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

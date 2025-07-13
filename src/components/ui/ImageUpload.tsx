"use client";

import { useCallback } from "react";
import Image from "next/image";
import { UploadIcon } from "@radix-ui/react-icons";

// Props interface for ImageUpload component
interface ImageUploadProps {
  value: string; // Current value of the uploaded image URL
  setValue: (name: string, value: string, options?: { shouldValidate?: boolean; shouldDirty?: boolean; shouldTouch?: boolean }) => void; // react-hook-form setValue
}

// ImageUpload component - Simplified version without external dependencies
const ImageUpload: React.FC<ImageUploadProps> = ({ value, setValue }) => {
  // Callback function to handle image upload
  const handleUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // For now, create a local URL - in production you'd upload to your preferred service
        const imageUrl = URL.createObjectURL(file);
        setValue("image", imageUrl, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    },
    [setValue]
  );

  return (
    <div
      className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:opacity-80 transition-opacity bg-gray-50"
      style={{
        padding: value ? "100px" : "40px",
        minHeight: "120px",
      }}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      {/* Upload UI */}
      <div className="flex flex-col items-center justify-center gap-3 text-gray-600">
        <UploadIcon width={48} height={48} />
        <p className="text-sm font-medium">Click to upload</p>
      </div>
      
      {/* Render the uploaded image */}
      {value && (
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <Image
            src={value}
            alt="Upload"
            fill
            style={{
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

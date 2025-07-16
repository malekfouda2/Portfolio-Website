import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function ImageUpload({ 
  label = "Upload Image",
  value,
  onChange,
  accept = "image/*",
  maxSize = 5,
  className = ""
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server with auth token
      const token = localStorage.getItem("auth_token");
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;

      // Update preview and call onChange
      setPreview(imageUrl);
      onChange(imageUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <Label>{label}</Label>}
      
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />

        {preview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-3">
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Image, Link, Globe } from "lucide-react";

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
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('url');
  const [urlInput, setUrlInput] = useState(value || '');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url;

      // Update preview and call onChange immediately after successful upload
      setPreview(imageUrl);
      onChange(imageUrl);
      console.log('Image uploaded successfully:', imageUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload image: ${error.message || 'Please try again.'}`);
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
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    
    // Validate URL format
    try {
      new URL(urlInput);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    // Test if image loads
    const img = new Image();
    img.onload = () => {
      setPreview(urlInput);
      onChange(urlInput);
      console.log('Image URL set successfully:', urlInput);
    };
    img.onerror = () => {
      alert('Could not load image from this URL. Please check the URL and try again.');
    };
    img.src = urlInput;
  };

  const convertGoogleDriveUrl = (url: string): string => {
    // Convert Google Drive share URL to direct image URL
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    return url;
  };

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const convertedUrl = convertGoogleDriveUrl(url);
    setUrlInput(convertedUrl);
  };

  return (
    <div className={`w-full ${className}`}>
      <Label className="text-gray-300">{label}</Label>
      
      {/* Upload Method Toggle */}
      <div className="mt-2 flex gap-2 mb-4">
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('url')}
          className={uploadMethod === 'url' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
        >
          <Link className="h-4 w-4 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMethod('file')}
          className={uploadMethod === 'file' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
        >
          <Upload className="h-4 w-4 mr-1" />
          File
        </Button>
      </div>

      {preview ? (
        <div className="mt-2 relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="max-w-full max-h-48 object-contain rounded-lg border border-gray-700"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : uploadMethod === 'url' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Paste image URL here (Google Drive, Imgur, etc.)"
              value={urlInput}
              onChange={handleUrlInputChange}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Globe className="h-4 w-4 mr-1" />
              Set Image
            </Button>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3">
            <p className="text-xs text-gray-300 font-medium mb-2">💡 How to use Google Drive images:</p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Upload image to Google Drive</li>
              <li>Right-click → "Get link" → Set to "Anyone with the link"</li>
              <li>Copy the share URL and paste it above</li>
              <li>It will automatically convert to direct image URL</li>
            </ol>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragging ? 'border-blue-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500'}
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

          <div className="space-y-3">
            {isUploading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-300">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-300">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to {maxSize}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
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

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    // Validate URL format
    try {
      new URL(urlInput);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setIsUploading(true);

    // For Google Drive URLs, try multiple formats
    const urlsToTry = [urlInput];
    
    if (urlInput.includes('drive.google.com')) {
      const fileIdMatch = urlInput.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        urlsToTry.push(
          `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`,
          `https://drive.google.com/uc?export=view&id=${fileId}`,
          `https://drive.google.com/uc?id=${fileId}`,
          `https://lh3.googleusercontent.com/d/${fileId}`
        );
      }
    }

    // Try each URL format
    for (const testUrl of urlsToTry) {
      try {
        const success = await testImageUrl(testUrl);
        if (success) {
          setPreview(testUrl);
          onChange(testUrl);
          setUrlInput(testUrl);
          console.log('Image URL set successfully:', testUrl);
          setIsUploading(false);
          return;
        }
      } catch (error) {
        console.log('Failed to load:', testUrl);
      }
    }

    setIsUploading(false);
    alert('Could not load image from this URL. Make sure the image is publicly accessible and try:\n\n1. Right-click the image in Google Drive\n2. "Get link" → "Anyone with the link"\n3. Or try uploading to imgur.com and use that URL instead');
  };

  const testImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  const convertGoogleDriveUrl = (url: string): string => {
    // Convert Google Drive share URL to direct image URL
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w1000`;
    }
    
    // If already a Google Drive direct URL, try different formats
    if (url.includes('drive.google.com/uc')) {
      const idMatch = url.match(/id=([a-zA-Z0-9-_]+)/);
      if (idMatch) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1000`;
      }
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
              disabled={!urlInput.trim() || isUploading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
              ) : (
                <Globe className="h-4 w-4 mr-1" />
              )}
              {isUploading ? 'Testing...' : 'Set Image'}
            </Button>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded p-3">
            <p className="text-xs text-gray-300 font-medium mb-2">💡 Supported image sources:</p>
            <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li><strong>Google Drive:</strong> Right-click image → "Get link" → "Anyone with the link"</li>
              <li><strong>Imgur:</strong> Upload to imgur.com and copy direct image link</li>
              <li><strong>GitHub:</strong> Upload to repository and use raw.githubusercontent.com URL</li>
              <li><strong>Direct URLs:</strong> Any publicly accessible image URL</li>
            </ul>
            <p className="text-xs text-yellow-400 mt-2">
              Note: Google Drive URLs will be automatically tested with multiple formats to find the working one.
            </p>
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
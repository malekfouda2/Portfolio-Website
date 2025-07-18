import fs from 'fs';
import path from 'path';
import { storage } from './storage';

/**
 * Image cleanup and validation utilities
 */

// Check if uploaded file exists
export const fileExists = (filePath: string): boolean => {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};

// Get absolute path for uploaded file
export const getUploadPath = (filename: string): string => {
  return path.join(process.cwd(), 'uploads', filename);
};

// Extract filename from upload URL
export const extractFilename = (url: string): string | null => {
  if (!url) return null;
  
  // Handle different URL formats
  if (url.startsWith('/uploads/')) {
    return url.replace('/uploads/', '');
  }
  
  if (url.includes('/uploads/')) {
    const parts = url.split('/uploads/');
    return parts[parts.length - 1];
  }
  
  return null;
};

// Validate image URL and return working URL or null
export const validateImageUrl = (url: string | null): string | null => {
  if (!url) return null;
  
  // If it's already a placeholder URL, keep it
  if (url.includes('via.placeholder.com')) {
    return url;
  }
  
  // If it's a full HTTP URL, assume it's external and valid
  if (url.startsWith('http')) {
    return url;
  }
  
  // If it's a local upload, check if file exists
  if (url.startsWith('/uploads/')) {
    const filename = extractFilename(url);
    if (filename && fileExists(getUploadPath(filename))) {
      return url;
    }
  }
  
  return null;
};

// Clean up projects with missing images
export const cleanupProjectImages = async (): Promise<void> => {
  try {
    const projects = await storage.getProjects();
    
    for (const project of projects) {
      const validImageUrl = validateImageUrl(project.image);
      
      if (!validImageUrl && project.image) {
        console.log(`Cleaning up missing image for project ${project.title}: ${project.image}`);
        
        // Update project to use placeholder instead of null
        const placeholderUrl = createPlaceholderUrl(project.title);
        await storage.updateProject(project.id, {
          ...project,
          image: placeholderUrl
        });
      }
    }
  } catch (error) {
    console.error('Error cleaning up project images:', error);
  }
};

// Create placeholder image URLs
export const createPlaceholderUrl = (text: string, width = 600, height = 400): string => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}/1f2937/10b981?text=${encodedText}`;
};

// Get safe image URL with fallback
export const getSafeImageUrl = (originalUrl: string | null, fallbackText: string): string => {
  const validUrl = validateImageUrl(originalUrl);
  return validUrl || createPlaceholderUrl(fallbackText);
};

// List orphaned files (files in uploads but not referenced in database)
export const findOrphanedFiles = async (): Promise<string[]> => {
  const orphaned: string[] = [];
  
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return orphaned;
    }
    
    const files = fs.readdirSync(uploadsDir);
    const projects = await storage.getProjects();
    
    // Get all image URLs referenced in database
    const referencedImages = new Set<string>();
    
    projects.forEach(project => {
      if (project.image) {
        const filename = extractFilename(project.image);
        if (filename) {
          referencedImages.add(filename);
        }
      }
    });
    
    // Find files not referenced in database
    files.forEach(file => {
      if (!referencedImages.has(file)) {
        orphaned.push(file);
      }
    });
    
  } catch (error) {
    console.error('Error finding orphaned files:', error);
  }
  
  return orphaned;
};

// Remove orphaned files
export const removeOrphanedFiles = async (): Promise<void> => {
  try {
    const orphaned = await findOrphanedFiles();
    
    for (const file of orphaned) {
      const filePath = getUploadPath(file);
      if (fileExists(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Removed orphaned file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error removing orphaned files:', error);
  }
};
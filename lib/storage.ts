"use client";

/**
 * 🛡️ AFRIDAM CLINICAL IMAGE VAULT
 * Optimized for Mobile Webviews and High-Res Clinical Scans.
 */

const STORAGE_KEY = "afridam_clinical_vault";
// 🛡️ RE-ENFORCED: Reduced to 4.5MB to stay under the 5MB browser hard-limit
const MAX_LOCAL_QUOTA = 4.5 * 1024 * 1024; 

interface StoredImage {
  id: string;
  data: string;
  timestamp: number;
  fileName: string;
}

/**
 * 🛡️ RE-ENFORCED: Compresses or prevents overflow before saving
 */
export function saveImageToStorage(id: string, imageData: string, fileName: string): void {
  if (typeof window === "undefined") return;

  try {
    const images = getStoredImages();

    // Calculate current payload size
    const newItemSize = imageData.length;
    let currentTotal = images.reduce((sum, img) => sum + img.data.length, 0);

    // 🛡️ OGA FIX: FIFO (First In First Out) cleanup to prevent QuotaExceededError
    while (currentTotal + newItemSize > MAX_LOCAL_QUOTA && images.length > 0) {
      const removed = images.shift();
      if (removed) currentTotal -= removed.data.length;
    }

    // If a single image is bigger than the entire quota, we cannot store it locally
    if (newItemSize > MAX_LOCAL_QUOTA) {
      console.warn("Image too large for local cache. Cloud sync required.");
      return;
    }

    images.push({
      id,
      data: imageData,
      timestamp: Date.now(),
      fileName,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch (error) {
    // 🛡️ RE-ENFORCED: Critical safety catch for Play Store stability
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.error("Local vault full. Purging all images to prevent crash.");
      clearAllImages();
    }
  }
}

/**
 * 🛡️ RE-ENFORCED: Safe retrieval with error handling
 */
export function getStoredImages(): StoredImage[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Clinical Vault Retrieval Error:", error);
    return [];
  }
}

export function getImageById(id: string): StoredImage | undefined {
  const images = getStoredImages();
  return images.find((img) => img.id === id);
}

export function deleteImage(id: string): void {
  try {
    const images = getStoredImages();
    const filtered = images.filter((img) => img.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Clinical Vault Delete Error:", error);
  }
}

export function clearAllImages(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
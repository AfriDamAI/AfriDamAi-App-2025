// Client-side storage utilities for managing image data

const STORAGE_KEY = "dermatology_app_images"
const MAX_STORAGE_SIZE = 50 * 1024 * 1024 // 50MB

interface StoredImage {
  id: string
  data: string
  timestamp: number
  fileName: string
}

export function saveImageToStorage(id: string, imageData: string, fileName: string): void {
  try {
    const images = getStoredImages()

    // Check storage size
    const totalSize = images.reduce((sum, img) => sum + img.data.length, 0) + imageData.length
    if (totalSize > MAX_STORAGE_SIZE) {
      // Remove oldest image if storage is full
      if (images.length > 0) {
        images.shift()
      }
    }

    images.push({
      id,
      data: imageData,
      timestamp: Date.now(),
      fileName,
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(images))
  } catch (error) {
    console.error("Storage error:", error)
  }
}

export function getStoredImages(): StoredImage[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Storage retrieval error:", error)
    return []
  }
}

export function getImageById(id: string): StoredImage | undefined {
  const images = getStoredImages()
  return images.find((img) => img.id === id)
}

export function deleteImage(id: string): void {
  try {
    const images = getStoredImages()
    const filtered = images.filter((img) => img.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Delete error:", error)
  }
}

export function clearAllImages(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Clear error:", error)
  }
}

// API client utilities for frontend calls

export async function uploadImage(file: File): Promise<{ imageId: string; fileName: string }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Upload failed")
  }

  return response.json()
}

export async function analyzeSkinImage(imageId: string, imageData?: string): Promise<any> {
  const response = await fetch("/api/analyze-skin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageId, imageData }),
  })

  if (!response.ok) {
    throw new Error("Analysis failed")
  }

  return response.json()
}

export async function analyzeIngredients(ingredients: string): Promise<any> {
  const response = await fetch("/api/analyze-ingredients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ingredients }),
  })

  if (!response.ok) {
    throw new Error("Analysis failed")
  }

  return response.json()
}

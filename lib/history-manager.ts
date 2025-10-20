export interface ScanRecord {
  id: string
  type: "skin" | "ingredient"
  timestamp: number
  imageUrl?: string
  results: {
    conditions?: Array<{ name: string; severity: string; confidence: number }>
    ingredients?: string[]
    safetyScore?: number
  }
  notes?: string
}

const STORAGE_KEY = "dermai_history"
const MAX_RECORDS = 50

export function addToHistory(record: Omit<ScanRecord, "id" | "timestamp">) {
  try {
    const history = getHistory()
    const newRecord: ScanRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }
    history.unshift(newRecord)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_RECORDS)))
    return newRecord
  } catch (error) {
    console.error("Error adding to history:", error)
    return null
  }
}

export function getHistory(): ScanRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error retrieving history:", error)
    return []
  }
}

export function deleteHistoryRecord(id: string) {
  try {
    const history = getHistory()
    const filtered = history.filter((record) => record.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error("Error deleting history record:", error)
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Error clearing history:", error)
  }
}

export function getHistoryStats() {
  const history = getHistory()
  return {
    totalScans: history.length,
    skinScans: history.filter((r) => r.type === "skin").length,
    ingredientAnalyses: history.filter((r) => r.type === "ingredient").length,
    lastScan: history[0]?.timestamp || null,
  }
}

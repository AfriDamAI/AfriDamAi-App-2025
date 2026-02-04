"use client"

import { apiClient } from "./api-client";

/**
 * 🛡️ AFRIDAM AESTHETIC & BEAUTY HISTORY
 * Target Audience: Skincare, Women, and Children.
 * Optimized for 2026 Google Play Wellness Compliance.
 */

export interface ScanRecord {
  id: string
  type: "skin" | "ingredient"
  timestamp: number
  imageUrl?: string // 🛡️ Cloud URL reference
  results: {
    // 🛡️ RE-ENFORCED: Reframed from medical 'conditions' to aesthetic 'concerns'
    concerns?: Array<{ name: string; intensity: string; confidence: number }>
    ingredients?: string[]
    safetyScore?: number
    isChildSafe?: boolean // 👶 NEW: Pediatric safety indicator for mothers
  }
  notes?: string
}

const STORAGE_KEY = "afridam_aesthetic_cache"
const MAX_RECORDS = 50

/** 🛡️ RE-ENFORCED: Sync with NestJS Backend + Local Cache **/
export async function addToHistory(record: Omit<ScanRecord, "id" | "timestamp">) {
  try {
    // 1. Persist to Cloud first (Aesthetic Node Sync)
    const response = await apiClient.post("/history/sync", record);
    const syncedRecord = response.data;

    // 2. Update Local Cache for Instant UI updates
    const history = getHistory();
    history.unshift(syncedRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_RECORDS)));
    
    return syncedRecord;
  } catch (error) {
    console.warn("Cloud Sync Failed, falling back to Local Protocol", error);
    
    // Fallback: Local-only storage if offline
    const localRecord: ScanRecord = {
      ...record,
      id: `offline-${Date.now()}`,
      timestamp: Date.now(),
    };
    
    // 🛡️ OGA FIX: Strip large image data to prevent LocalStorage crash
    if (localRecord.imageUrl?.startsWith('data:')) {
       localRecord.imageUrl = "pending_upload"; 
    }

    const history = getHistory();
    history.unshift(localRecord);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_RECORDS)));
    return localRecord;
  }
}

/** 🛡️ RE-ENFORCED: Fetching from Cloud + Local Hybrid **/
export function getHistory(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    return []
  }
}

export async function fetchFullHistory(): Promise<ScanRecord[]> {
  try {
    const response = await apiClient.get("/history/all");
    const cloudHistory = response.data;
    
    // Sync local cache with the latest from cloud
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudHistory.slice(0, MAX_RECORDS)));
    return cloudHistory;
  } catch (error) {
    console.error("Aesthetic Node Fetch Failed:", error);
    return getHistory();
  }
}

export async function deleteHistoryRecord(id: string) {
  try {
    // 1. Remove from Cloud
    await apiClient.delete(`/history/${id}`);
    
    // 2. Clear from Local Cache
    const history = getHistory();
    const filtered = history.filter((record) => record.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting aesthetic record:", error);
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getHistoryStats() {
  const history = getHistory()
  return {
    totalAnalyses: history.length,
    skinChecks: history.filter((r) => r.type === "skin").length,
    ingredientAnalyses: history.filter((r) => r.type === "ingredient").length,
    lastAnalysis: history[0]?.timestamp || null,
  }
}
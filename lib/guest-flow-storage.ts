export const GUEST_SCAN_RESULT_KEY = "afridam:guest-scan-result"
export const AUTH_RETURN_TO_KEY = "afridam:auth-return-to"

const GUEST_SCAN_RESULT_TTL_MS = 6 * 60 * 60 * 1000

export interface GuestScanSnapshot {
  finding?: string
  recommendations?: unknown[]
  description?: string
  severity?: number
  conditions?: unknown[]
  overlays?: unknown[]
  id?: string
  savedAt: number
}

export function saveGuestScanSnapshot(result: Omit<GuestScanSnapshot, "savedAt"> & { image?: string }) {
  try {
    // Do not persist the captured face image in browser storage.
    const snapshot: GuestScanSnapshot = {
      finding: result.finding,
      recommendations: result.recommendations,
      description: result.description,
      severity: result.severity,
      conditions: result.conditions,
      overlays: result.overlays,
      id: result.id,
      savedAt: Date.now(),
    }
    sessionStorage.setItem(GUEST_SCAN_RESULT_KEY, JSON.stringify(snapshot))
  } catch {
    // A full/disabled session storage must not block a successful scan.
  }
}

export function readGuestScanSnapshot(): GuestScanSnapshot | null {
  try {
    const raw = sessionStorage.getItem(GUEST_SCAN_RESULT_KEY)
    if (!raw) return null

    const snapshot = JSON.parse(raw) as GuestScanSnapshot
    if (!snapshot.savedAt || Date.now() - snapshot.savedAt > GUEST_SCAN_RESULT_TTL_MS) {
      sessionStorage.removeItem(GUEST_SCAN_RESULT_KEY)
      return null
    }

    return snapshot
  } catch {
    try { sessionStorage.removeItem(GUEST_SCAN_RESULT_KEY) } catch { /* Storage unavailable. */ }
    return null
  }
}

export function clearGuestScanSnapshot() {
  try {
    sessionStorage.removeItem(GUEST_SCAN_RESULT_KEY)
  } catch {
    // Ignore unavailable browser storage.
  }
}

export function saveAuthReturnTo(path: string) {
  if (typeof window === "undefined") return

  try {
    const target = new URL(path, window.location.origin)
    if (target.origin !== window.location.origin || isAuthRoute(target.pathname)) return
    sessionStorage.setItem(AUTH_RETURN_TO_KEY, `${target.pathname}${target.search}${target.hash}`)
  } catch {
    // Ignore malformed destinations and let login use its normal fallback.
  }
}

export function consumeAuthReturnTo(fallback = "/dashboard") {
  if (typeof window === "undefined") return fallback

  try {
    const storedPath = sessionStorage.getItem(AUTH_RETURN_TO_KEY)
    sessionStorage.removeItem(AUTH_RETURN_TO_KEY)
    if (!storedPath || storedPath.startsWith("//") || storedPath.includes("\\")) return fallback

    const target = new URL(storedPath, window.location.origin)
    if (target.origin !== window.location.origin || isAuthRoute(target.pathname)) return fallback
    return `${target.pathname}${target.search}${target.hash}`
  } catch {
    return fallback
  }
}

function isAuthRoute(pathname: string) {
  return ["/login", "/register", "/verify-email"].includes(pathname)
}

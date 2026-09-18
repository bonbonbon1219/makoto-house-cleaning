export const ESTIMATE_STORAGE_KEY = "makoto-estimate-draft";
export const ESTIMATE_EVENT = "makoto:estimate-draft";

export type EstimateDraft = {
  message: string;
  service: string;
  totalLabel: string;
};

export function saveEstimateDraft(draft: EstimateDraft) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(draft));
  window.dispatchEvent(new CustomEvent(ESTIMATE_EVENT, { detail: draft }));
}

export function readEstimateDraft(): EstimateDraft | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(ESTIMATE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EstimateDraft;
  } catch {
    return null;
  }
}

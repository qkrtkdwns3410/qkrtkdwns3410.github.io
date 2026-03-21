const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || "";
const ADMIN_PW_HASH = process.env.NEXT_PUBLIC_ADMIN_PW_HASH || "";

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyCredentials(
  id: string,
  password: string
): Promise<boolean> {
  if (!ADMIN_ID || !ADMIN_PW_HASH) return false;
  const pwHash = await hashPassword(password);
  return id === ADMIN_ID && pwHash === ADMIN_PW_HASH;
}

const AUTH_KEY = "blog_admin_auth";
const PAT_KEY = "blog_github_pat";

export function getAuthState(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthState(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, "true");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export function getGithubPat(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PAT_KEY);
}

export function setGithubPat(pat: string): void {
  localStorage.setItem(PAT_KEY, pat);
}

export function clearGithubPat(): void {
  localStorage.removeItem(PAT_KEY);
}

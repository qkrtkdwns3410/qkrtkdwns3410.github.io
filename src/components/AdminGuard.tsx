"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  verifyCredentials,
  getAuthState,
  setAuthState,
  getGithubPat,
  setGithubPat,
} from "@/lib/auth";
import { Lock, Key, LogIn } from "lucide-react";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [authed, setAuthed] = useState(false);
  const [hasPat, setHasPat] = useState(false);
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pat, setPat] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"login" | "pat">("login");

  useEffect(() => {
    const isAuthed = getAuthState();
    const savedPat = getGithubPat();
    setAuthed(isAuthed);
    setHasPat(!!savedPat);
    if (isAuthed && savedPat) {
      setStep("pat"); // already done
    } else if (isAuthed) {
      setStep("pat");
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    setError("");
    const valid = await verifyCredentials(id, pw);
    if (valid) {
      setAuthState(true);
      setAuthed(true);
      const savedPat = getGithubPat();
      if (savedPat) {
        setHasPat(true);
      } else {
        setStep("pat");
      }
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const handlePatSave = () => {
    if (!pat.trim()) {
      setError("GitHub PAT를 입력해주세요.");
      return;
    }
    setGithubPat(pat.trim());
    setHasPat(true);
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-muted-foreground">로딩 중...</div>
    );
  }

  if (authed && hasPat) {
    return <>{children}</>;
  }

  return (
    <div className="py-20 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">관리자 로그인</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {step === "login"
              ? "관리자 계정으로 로그인하세요."
              : "GitHub Personal Access Token을 입력하세요."}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === "login" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                아이디
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="관리자 아이디"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                비밀번호
              </label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="비밀번호"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              로그인
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                GitHub PAT
              </label>
              <input
                type="password"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                className="w-full h-11 px-3 text-sm bg-background rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                onKeyDown={(e) => e.key === "Enter" && handlePatSave()}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                repo 권한이 있는 PAT가 필요합니다. 브라우저에 저장되며 서버로
                전송되지 않습니다.
              </p>
            </div>
            <button
              onClick={handlePatSave}
              className="w-full h-11 flex items-center justify-center gap-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Key className="w-4 h-4" />
              저장 후 진입
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { CircleCheck, X } from "lucide-react";
import { projects as initialProjects } from "@/lib/data";
import type { Project } from "@/lib/types";

const LoginDialog = dynamic(() =>
  import("@/components/login-dialog").then((m) => m.LoginDialog),
);
const CreateProjectDialog = dynamic(() =>
  import("@/components/create-project-dialog").then(
    (m) => m.CreateProjectDialog,
  ),
);
interface SiteContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  openLogin: () => void;
  openCreate: () => void;
  notify: (message: string) => void;
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}
const SiteContext = createContext<SiteContextType | null>(null);
export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("SiteProvider is required");
  return context;
}
export function SiteProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loginOpen, setLoginOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toast, setToast] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
    },
    [],
  );
  function notify(message: string) {
    setToast(message);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setToast(""), 6500);
  }
  return (
    <SiteContext.Provider
      value={{
        projects,
        addProject: (project) =>
          setProjects((previous) => [project, ...previous]),
        openLogin: () => setLoginOpen(true),
        openCreate: () => setCreateOpen(true),
        notify,
        loggedIn,
        setLoggedIn,
        theme,
        toggleTheme: () =>
          setTheme((value) => (value === "dark" ? "light" : "dark")),
      }}
    >
      {children}
      {loginOpen ? (
        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      ) : null}
      {createOpen ? (
        <CreateProjectDialog open={createOpen} onOpenChange={setCreateOpen} />
      ) : null}
      <div className="toast-region" aria-live="polite" aria-atomic="true">
        {toast ? (
          <div className="success-toast">
            <CircleCheck size={21} />
            <p>{toast}</p>
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              <X size={17} />
            </button>
          </div>
        ) : null}
      </div>
    </SiteContext.Provider>
  );
}

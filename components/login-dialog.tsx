"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, PasswordInput } from "@/components/form-field";
import { useSite } from "@/components/site-provider";
import { validEmail } from "@/lib/validation";
import { api } from "@/lib/services";
import { readableApiError } from "@/lib/api-client";

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { notify, setLoggedIn } = useSite();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const emailError =
    touched.email && !validEmail(email.trim())
      ? "Enter a valid email, such as student@example.com."
      : undefined;
  const passwordError =
    touched.password && !password ? "Enter your password." : undefined;
  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (!validEmail(email.trim()) || !password || pending) return;
    setPending(true);
    setError("");
    try {
      const result = await api.login({
        email: email.trim(),
        password,
        rememberMe,
      });
      setLoggedIn(true);
      notify(result.message);
      onOpenChange(false);
    } catch (error) {
      setError(readableApiError(error));
    } finally {
      setPending(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="auth-dialog">
        <DialogHeader>
          <div className="dialog-icon">
            <LogIn size={22} />
          </div>
          <DialogTitle>Welcome back.</DialogTitle>
          <DialogDescription>
            Good ideas are better together. Log in to your community.
          </DialogDescription>
        </DialogHeader>
        <form noValidate onSubmit={submit} className="form-stack">
          <Field
            id="login-email"
            label="Email address"
            required
            error={emailError}
          >
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((value) => ({ ...value, email: true }))}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "login-email-error" : undefined}
            />
          </Field>
          <Field
            id="login-password"
            label="Password"
            required
            error={passwordError}
          >
            <PasswordInput
              id="login-password"
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() =>
                setTouched((value) => ({ ...value, password: true }))
              }
              aria-invalid={!!passwordError}
              aria-describedby={
                passwordError ? "login-password-error" : undefined
              }
            />
          </Field>
          <div className="checkbox-row">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={setRememberMe}
            />
            <label htmlFor="remember-me">
              Remember me{" "}
              <span className="text-muted-foreground">(this session)</span>
            </label>
          </div>
          {error ? (
            <p className="form-alert" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            type="submit"
            className="submit-button"
            disabled={pending || !validEmail(email.trim()) || !password}
          >
            {pending ? <LoaderCircle className="animate-spin" /> : null}
            {pending ? "Logging in…" : "Log in"}
            {!pending ? <ArrowRight size={16} /> : null}
          </Button>
        </form>
        <div className="auth-bottom">
          <Link href="/register" onClick={() => onOpenChange(false)}>
            I don’t have an account yet <ArrowRight size={14} />
          </Link>
          <p>Demonstration mode · Use any valid email and password.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CircleCheck,
  LoaderCircle,
  Sparkles,
  BookOpen,
  Users,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Field, PasswordInput, CourseSelect } from "@/components/form-field";
import { useSite } from "@/components/site-provider";
import { api } from "@/lib/services";
import { ApiError, readableApiError } from "@/lib/api-client";
import {
  validateRegistration,
  type RegistrationErrors,
} from "@/lib/validation";
import type { RegisterRequest } from "@/lib/types";

const initialValues: RegisterRequest = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  courseArea: "",
  ra: "",
};

export function RegisterForm() {
  const { openLogin, notify } = useSite();
  const [values, setValues] = useState(initialValues);
  const [terms, setTerms] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverFields, setServerFields] = useState<RegistrationErrors>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const errors = validateRegistration(values, terms);
  function update(key: keyof RegisterRequest, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setServerFields((previous) => ({ ...previous, [key]: undefined }));
    setError("");
  }
  function blur(key: string) {
    setTouched((previous) => ({ ...previous, [key]: true }));
  }
  function fieldError(key: keyof RegistrationErrors) {
    return (
      serverFields[key] ||
      (touched[key] || (key === "confirmPassword" && values.confirmPassword)
        ? errors[key]
        : undefined)
    );
  }
  function inputProps(key: keyof RegisterRequest) {
    const error = fieldError(key);
    return {
      id: key,
      name: key,
      required: true,
      value: values[key],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        update(
          key,
          key === "ra"
            ? event.target.value.replace(/\D/g, "")
            : event.target.value,
        ),
      onBlur: () => blur(key),
      "aria-invalid": !!error,
      "aria-describedby": error
        ? `${key}-error`
        : key === "password"
          ? "password-hint"
          : undefined,
    };
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setTouched(
      Object.fromEntries(
        [...Object.keys(values), "terms"].map((key) => [key, true]),
      ),
    );
    // Revalidate the original value before sanitizing at the API boundary.
    if (Object.keys(validateRegistration(values, terms)).length || pending)
      return;
    const request: RegisterRequest = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      ra: values.ra.replace(/\D/g, ""),
    };
    if (Object.keys(validateRegistration(request, terms)).length) return;
    setPending(true);
    setError("");
    try {
      const result = await api.register(request);
      setSuccess(true);
      setValues(initialValues);
      notify(result.message);
    } catch (error) {
      setError(readableApiError(error));
      if (error instanceof ApiError)
        setServerFields(
          Object.fromEntries(
            Object.keys(error.fields)
              .filter((key) => key in initialValues)
              .map((key) => [key, "Please review this field and try again."]),
          ),
        );
    } finally {
      setPending(false);
    }
  }
  return (
    <main id="main-content" className="register-page page-container">
      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to projects
      </Link>
      <div className="register-layout">
        <aside className="register-intro">
          <div className="eyebrow">
            <span className="status-dot" /> YOUR IDEAS BELONG HERE
          </div>
          <h1>
            A curious mind.
            <br />
            <span>
              A world of
              <br />
              possibilities.
            </span>
          </h1>
          <p>
            Join a community turning academic curiosity into real-world impact.
          </p>
          <div className="register-benefits">
            {[
              {
                icon: BookOpen,
                title: "Discover something inspiring",
                text: "Explore projects across every field of study.",
              },
              {
                icon: Lightbulb,
                title: "Put your ideas out into the world",
                text: "Give your research a place to grow.",
              },
              {
                icon: Users,
                title: "Find your kind of curious",
                text: "Connect with students and professors.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span>
                  <Icon size={20} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="register-quote">
            <Sparkles size={22} />
            <p>
              Every great project starts with a question.
              <br />
              <strong>What’s yours?</strong>
            </p>
          </div>
        </aside>
        <Card className="register-card">
          {success ? (
            <div className="registration-success" role="status">
              <div className="success-icon">
                <CircleCheck size={35} />
              </div>
              <span className="section-kicker">YOU’RE PART OF THE LAB</span>
              <h2>Let curiosity lead.</h2>
              <p>
                Your demo account has been created successfully. You’re ready to
                discover something inspiring.
              </p>
              <Link href="/" className="primary-link">
                Explore projects <ArrowRight size={17} />
              </Link>
              <Button variant="ghost" onClick={openLogin}>
                Log in to the demo
              </Button>
            </div>
          ) : (
            <>
              <div className="register-card-heading">
                <span className="small-label">A COMMUNITY OF POSSIBILITY</span>
                <h2>Create your account</h2>
                <p>Your next chapter starts with an idea.</p>
              </div>
              <form noValidate onSubmit={submit} className="form-stack">
                <Field
                  id="name"
                  label="Full name"
                  required
                  error={fieldError("name")}
                >
                  <Input
                    {...inputProps("name")}
                    autoComplete="name"
                    placeholder="Alex Morgan"
                  />
                </Field>
                <Field
                  id="email"
                  label="Email address"
                  required
                  error={fieldError("email")}
                >
                  <Input
                    {...inputProps("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="you@university.edu"
                  />
                </Field>
                <div className="form-grid">
                  <Field
                    id="password"
                    label="Password"
                    required
                    error={fieldError("password")}
                    hint="At least 8 characters."
                  >
                    <PasswordInput
                      {...inputProps("password")}
                      autoComplete="new-password"
                      placeholder="Create a password"
                    />
                  </Field>
                  <Field
                    id="confirmPassword"
                    label="Confirm password"
                    required
                    error={fieldError("confirmPassword")}
                  >
                    <PasswordInput
                      {...inputProps("confirmPassword")}
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                    />
                  </Field>
                </div>
                <Field
                  id="courseArea"
                  label="Course area"
                  required
                  error={fieldError("courseArea")}
                >
                  <CourseSelect
                    id="courseArea"
                    value={values.courseArea}
                    onChange={(value) => update("courseArea", value)}
                    onBlur={() => blur("courseArea")}
                    error={fieldError("courseArea")}
                  />
                </Field>
                <Field
                  id="ra"
                  label="Student ID / RA"
                  required
                  error={fieldError("ra")}
                  hint="Numbers only, for example 2024123456."
                >
                  <Input
                    {...inputProps("ra")}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    placeholder="2024123456"
                  />
                </Field>
                <div>
                  <div className="checkbox-row">
                    <Checkbox
                      id="terms"
                      checked={terms}
                      onCheckedChange={(value) => {
                        setTerms(value);
                        blur("terms");
                      }}
                      aria-invalid={!!fieldError("terms")}
                      aria-describedby={
                        fieldError("terms") ? "terms-error" : undefined
                      }
                      required
                    />
                    <label htmlFor="terms">
                      I agree to the{" "}
                      <button
                        type="button"
                        className="inline-link"
                        onClick={() => setTermsOpen(true)}
                      >
                        terms and conditions
                      </button>
                      .
                    </label>
                  </div>
                  {fieldError("terms") ? (
                    <p id="terms-error" className="field-error" role="alert">
                      {fieldError("terms")}
                    </p>
                  ) : null}
                </div>
                {error ? (
                  <p className="form-alert" role="alert">
                    {error}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  className="submit-button"
                  disabled={pending || Object.keys(errors).length > 0}
                >
                  {pending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Check size={17} />
                  )}
                  {pending ? "Creating your account…" : "Create account"}
                  {!pending ? <ArrowRight size={17} /> : null}
                </Button>
                <p className="demo-note">
                  Demonstration mode. No personal data is stored.
                </p>
              </form>
              <p className="register-login">
                Already part of the community?{" "}
                <button className="inline-link" onClick={openLogin}>
                  Log in <ArrowUpRightInline />
                </button>
              </p>
            </>
          )}
        </Card>
      </div>
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="auth-dialog">
          <DialogTitle>Demo terms and conditions</DialogTitle>
          <DialogDescription>
            This is a demonstration of projeto.lab. Accounts and submissions
            exist only in the current session and are cleared when you reload.
            Use sample information when exploring the demo. Share only project
            content you have permission to use, respect other members, and
            credit your collaborators.
          </DialogDescription>
          <Button
            onClick={() => {
              setTerms(true);
              blur("terms");
              setTermsOpen(false);
            }}
          >
            I understand and agree
          </Button>
        </DialogContent>
      </Dialog>
    </main>
  );
}
function ArrowUpRightInline() {
  return <ArrowRight size={13} />;
}

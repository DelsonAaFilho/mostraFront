"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseAreas } from "@/lib/types";

export function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="required" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function PasswordInput(props: ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-wrap">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="pr-12"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="password-toggle"
        aria-label={`${visible ? "Hide" : "Show"} ${props.id?.includes("confirm") ? "confirmation password" : "password"}`}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </Button>
    </div>
  );
}

export function CourseSelect({
  id,
  value,
  onChange,
  error,
  onBlur,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <Select
      value={value || null}
      onValueChange={(value) => onChange(value ?? "")}
      items={courseAreas.map((area) => ({ label: area, value: area }))}
    >
      <SelectTrigger
        id={id}
        className="w-full"
        aria-required="true"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onBlur={onBlur}
      >
        <SelectValue placeholder="Select a course area" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false}>
        {courseAreas.map((area) => (
          <SelectItem key={area} value={area}>
            {area}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

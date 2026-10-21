import { courseAreas, type RegisterRequest } from "@/lib/types";

const emailPattern =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;
export function validEmail(value: string) {
  const local = value.split("@")[0];
  return (
    value.length <= 254 &&
    local.length <= 64 &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..") &&
    emailPattern.test(value)
  );
}
export function validUrl(value: string, host?: string) {
  try {
    const url = new URL(value);
    return (
      ["http:", "https:"].includes(url.protocol) &&
      (!host || url.hostname === host || url.hostname.endsWith(`.${host}`))
    );
  } catch {
    return false;
  }
}
export type RegistrationErrors = Partial<
  Record<keyof RegisterRequest | "terms", string>
>;
export function validateRegistration(
  values: RegisterRequest,
  terms: boolean,
): RegistrationErrors {
  const errors: RegistrationErrors = {};
  if (values.name.trim().length < 2)
    errors.name = "Enter your full name (at least 2 characters).";
  if (!validEmail(values.email.trim()))
    errors.email = "Enter a valid email, such as student@example.com.";
  if (values.password.length < 8)
    errors.password = "Use at least 8 characters for your password.";
  if (!values.confirmPassword)
    errors.confirmPassword = "Please confirm your password.";
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Your passwords do not match.";
  if (!courseAreas.includes(values.courseArea as (typeof courseAreas)[number]))
    errors.courseArea = "Choose your course area.";
  if (!/^\d+$/.test(values.ra))
    errors.ra = "Enter your student ID using numbers only.";
  if (!terms) errors.terms = "Accept the terms and conditions to continue.";
  return errors;
}

export function youtubeEmbed(value: string): string | null {
  try {
    const url = new URL(value);
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
    ) {
      id =
        url.searchParams.get("v") ||
        (/^\/(embed|shorts)\//.test(url.pathname)
          ? url.pathname.split("/")[2]
          : null);
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : null;
  } catch {
    return null;
  }
}

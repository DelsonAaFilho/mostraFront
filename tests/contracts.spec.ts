import { test, expect } from "@playwright/test";
import {
  validateRegistration,
  validEmail,
  youtubeEmbed,
} from "../lib/validation";
import { ApiError, readableApiError } from "../lib/api-client";
import type { RegisterRequest } from "../lib/types";

const validRegistration: RegisterRequest = {
  name: "Alex Morgan",
  email: "alex@university.edu",
  password: "Curiosity2026",
  confirmPassword: "Curiosity2026",
  courseArea: "Technology",
  ra: "2024123456",
};

test("registration rejects unsafe RA values and malformed domains", () => {
  expect(validateRegistration(validRegistration, true)).toEqual({});
  for (const ra of ["", "2024 123", "2024-123", "2024abc", "１２３", "123!"]) {
    expect(
      validateRegistration({ ...validRegistration, ra }, true).ra,
    ).toBeTruthy();
  }
  for (const email of [
    "student",
    "student@example",
    "student@@example.com",
    "student@-example.com",
    "student@example..com",
    "student@exam_ple.com",
    ".student@example.com",
    "student @example.com",
  ]) {
    expect(validEmail(email), email).toBe(false);
  }
  expect(validEmail("student+research@science.example.edu")).toBe(true);
});

test("registration enforces exact password confirmation, course area, and terms", () => {
  const invalid = validateRegistration(
    {
      ...validRegistration,
      password: "short",
      confirmPassword: "SHORT",
      courseArea: "Invalid",
    },
    false,
  );
  expect(Object.keys(invalid).sort()).toEqual([
    "confirmPassword",
    "courseArea",
    "password",
    "terms",
  ]);
  expect(Object.values(invalid).join(" ")).not.toContain("SHORT");
});

test("API errors remain readable without exposing raw backend details", () => {
  for (const code of [
    "validation",
    "conflict",
    "unauthorized",
    "server",
    "network",
    "unexpected",
  ] as const) {
    expect(readableApiError(new ApiError(code))).toBeTruthy();
  }
  expect(
    readableApiError(new Error("Database connection failed: secret-password")),
  ).not.toMatch(/Database|secret-password/);
  expect(readableApiError(new TypeError("Failed to fetch"))).toContain(
    "connection",
  );
});

test("video embeds only accept recognized YouTube hosts and video IDs", () => {
  expect(youtubeEmbed("https://youtu.be/aqz-KE-bpKQ")).toBe(
    "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ",
  );
  expect(
    youtubeEmbed("https://youtube.com.evil.example/watch?v=aqz-KE-bpKQ"),
  ).toBeNull();
  expect(youtubeEmbed("https://www.youtube.com/watch?v=invalid")).toBeNull();
});

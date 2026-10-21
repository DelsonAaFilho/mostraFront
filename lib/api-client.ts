import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Project,
  ProjectRequest,
} from "@/lib/types";

export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
};
export interface ApiClient {
  register: (request: RegisterRequest) => Promise<RegisterResponse>;
  login: (request: LoginRequest) => Promise<LoginResponse>;
  createProject: (request: ProjectRequest) => Promise<Project>;
}
export type ApiErrorCode =
  | "validation"
  | "conflict"
  | "unauthorized"
  | "server"
  | "network"
  | "unexpected";
export class ApiError extends Error {
  constructor(
    public code: ApiErrorCode,
    public fields: Record<string, string> = {},
  ) {
    super(code);
    this.name = "ApiError";
  }
}
const messages: Record<ApiErrorCode, string> = {
  validation: "Please review the highlighted fields and try again.",
  conflict: "This email or student ID is already registered. Try logging in.",
  unauthorized: "We couldn’t verify your details. Please try logging in again.",
  server: "Something went wrong on our side. Please try again shortly.",
  network: "We couldn’t connect. Check your internet connection and try again.",
  unexpected: "We couldn’t complete your request. Please try again.",
};
export function readableApiError(error: unknown): string {
  return error instanceof ApiError
    ? messages[error.code]
    : error instanceof TypeError
      ? messages.network
      : messages.unexpected;
}
// No endpoint, headers, wire format, or authentication assumptions are made here.
// Implement ApiClient with documented Java endpoints and inject it in services.ts.

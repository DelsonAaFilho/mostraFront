import type { ApiClient } from "@/lib/api-client";
import { mockApiClient } from "@/lib/mock-service";

// Integration boundary: replace this adapter after the Java API is documented.
export const api: ApiClient = mockApiClient;

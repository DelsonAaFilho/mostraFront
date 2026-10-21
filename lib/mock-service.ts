import { ApiError, type ApiClient } from "@/lib/api-client";
import { validateRegistration, validEmail } from "@/lib/validation";

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 650));
/** DEMO ONLY: no network calls, database, tokens, or persisted user data. */
export const mockApiClient: ApiClient = {
  async register(request) {
    const errors = validateRegistration(request, true);
    if (Object.keys(errors).length) throw new ApiError("validation", errors);
    await delay();
    return { message: "Your demo account is ready. Welcome to projeto.lab!" };
  },
  async login(request) {
    if (!validEmail(request.email) || !request.password)
      throw new ApiError("validation");
    await delay();
    return {
      message: "You’re signed in to the demo. Let’s make something great.",
      user: { name: "Alex Morgan", email: request.email },
    };
  },
  async createProject(request) {
    await delay();
    return {
      ...request,
      id: `demo-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    };
  },
};

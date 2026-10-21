# projeto.lab

A responsive academic project showcase built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui (Base UI), and Lucide icons.

## Run locally

```sh
bun install
bun dev
```

Open http://localhost:3000. For a production preview, run `bun run build` followed by `bun start`.

## Explore the demo

- Browse 12 academic projects, six per page. Search by title, author, professor, course, or area; filter by discipline and sort by date or title.
- Open any project for its full description, members, professor, external links, and optional video.
- Log in using any valid email and a nonempty password. This is a mock login, with no real authentication.
- Create a project by choosing a discipline, completing the form, adding authors, and selecting a professor. Published demo projects appear in the current session and have their own detail page.
- Register at `/register`. The form validates name, email, eight-character password, matching confirmation, course area, digits-only student ID, and accepted terms. Passwords have independent visibility controls.
- Switch between dark and light themes. All state lives in React memory and resets on reload; no localStorage, cookies, database, or authentication provider is used.

## Future Java API integration

`lib/types.ts` contains frontend request/response contracts. They are provisional and can be mapped to the Java documentation later.

- `lib/api-client.ts`: configurable base URL, typed client interface, and reusable safe error handling for validation, conflicts, unauthorized requests, server errors, network errors, and unexpected responses.
- `lib/mock-service.ts`: clearly marked mock implementations with simulated latency. No requests leave the application.
- `lib/services.ts`: the single adapter injection point. Replace `mockApiClient` with a documented Java adapter here.
- `lib/validation.ts` and `lib/project-validation.ts`: reusable validation independent of the UI.
- `.env.example`: reserves `NEXT_PUBLIC_API_BASE_URL`. This value is intentionally unused by mocks.

No endpoints, authentication headers, tokens, or Java wire formats are assumed. When documentation arrives, implement the `ApiClient` interface, map documented responses to the frontend contracts, and normalize documented backend errors into `ApiError`. Keep raw exceptions out of user-facing messages. Frontend validation is also repeated before mock submission; the future backend must independently validate incoming requests.

## Verification

```sh
bun run typecheck
bun run build
bunx playwright install chromium
bun run test:e2e
```

The browser suite starts the production server on port 3101, so build first. It covers pagination and search, course filters and themes, details and optional media, registration and RA sanitation, login, project creation with multiple authors and a professor, session-only behavior, keyboard dismissal, and mobile overflow.

## Assets

Project and profile photographs are locally bundled public demonstration images from [Unsplash](https://unsplash.com). Names, accounts, repositories, and website links are illustrative. The embedded video is sample media. Geist is self-hosted with `next/font/local` under the SIL Open Font License; see `public/fonts/OFL.txt`.

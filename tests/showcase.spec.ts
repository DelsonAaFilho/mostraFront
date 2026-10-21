import { test, expect } from "@playwright/test";

test("browses six projects per page, preserves search, and clears an empty result", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-card")).toHaveCount(6);
  await expect(
    page.getByRole("button", { name: "Previous page" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
  await expect(
    page.getByRole("heading", { name: "Stellar: mapping the night sky" }),
  ).toBeVisible();
  const search = page.getByRole("textbox", {
    name: "Search projects, authors, professors, or course areas",
  });
  await search.fill("Dr.");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(search).toHaveValue("Dr.");
  await expect(page.locator(".project-card")).toHaveCount(6);
  await search.fill("Sofia Rodrigues");
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "Mindful: care that connects" }),
  ).toBeVisible();
  await search.fill("no-project-matches-this");
  await expect(
    page.getByRole("heading", { name: "No projects found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();
  await expect(search).toHaveValue("");
  await expect(page.locator(".project-card")).toHaveCount(6);
});

test("filters course areas, sorts projects, and switches theme", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Technology", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.getByRole("combobox", { name: "Sort projects" }).click();
  await page.getByRole("option", { name: "Title A–Z" }).click();
  await expect(page.locator(".project-card h3").first()).toContainText(
    "EcoSense",
  );
  await page.getByRole("combobox", { name: "More course areas" }).click();
  await page.getByRole("option", { name: "Humanities" }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card h3")).toContainText("Memory Atlas");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("navigates to complete project details and hides missing optional media", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^View EcoSense/ }).click();
  await expect(page).toHaveURL(/\/projects\/1$/);
  await expect(
    page.getByRole("heading", { name: "EcoSense: a smarter, greener campus" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "The project team" }),
  ).toBeVisible();
  await expect(page.locator(".detail-member")).toHaveCount(2);
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie.com\/embed\//,
  );
  for (const link of await page.locator('a[target="_blank"]').all())
    await expect(link).toHaveAttribute("rel", "noreferrer");
  await page.goto("/projects/3");
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Project website/ })).toHaveCount(
    0,
  );
  await page.getByRole("link", { name: "Back to projects" }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await page.goto("/projects/invalid");
  await expect(
    page.getByRole("heading", { name: "There’s more to discover." }),
  ).toBeVisible();
});

test("validates registration live, sanitizes RA, and completes mock registration", async ({
  page,
}) => {
  await page.goto("/register");
  const submit = page.getByRole("button", {
    name: "Create account",
    exact: true,
  });
  await expect(submit).toBeDisabled();
  await page.getByLabel("Full name").fill("A");
  await page.getByLabel("Full name").blur();
  await expect(
    page.getByText("Enter your full name (at least 2 characters)."),
  ).toBeVisible();
  await page.getByLabel("Full name").fill("Alex Morgan");
  await expect(
    page.getByText("Enter your full name (at least 2 characters)."),
  ).toHaveCount(0);
  await page.getByLabel("Email address").fill("invalid@");
  await page.getByLabel("Email address").blur();
  await expect(page.getByLabel("Email address")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.getByLabel("Email address").fill("alex@university.edu");
  await expect(page.getByLabel("Email address")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await page.locator("#password").fill("short");
  await page.locator("#password").blur();
  await expect(
    page.getByText("Use at least 8 characters for your password."),
  ).toBeVisible();
  await page.locator("#password").fill("Curiosity2026");
  await page
    .getByRole("button", { name: "Show password", exact: true })
    .click();
  await expect(page.locator("#password")).toHaveAttribute("type", "text");
  await page
    .getByRole("button", { name: "Hide password", exact: true })
    .click();
  await page.locator("#confirmPassword").fill("different");
  await expect(page.getByText("Your passwords do not match.")).toBeVisible();
  await page.locator("#confirmPassword").fill("Curiosity2026");
  await expect(page.getByText("Your passwords do not match.")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Show confirmation password" })
    .click();
  await expect(page.locator("#confirmPassword")).toHaveAttribute(
    "type",
    "text",
  );
  await page.getByRole("combobox", { name: "Course area" }).click();
  await expect(
    page.getByRole("option", { name: "Communication and Arts" }),
  ).toBeVisible();
  await page.getByRole("option", { name: "Technology", exact: true }).click();
  await page.getByLabel("Student ID / RA").fill("20abc! 24-123456");
  await expect(page.getByLabel("Student ID / RA")).toHaveValue("2024123456");
  await expect(submit).toBeDisabled();
  await page.getByRole("checkbox", { name: /I agree to the/ }).check();
  await expect(submit).toBeEnabled();
  await submit.click();
  await expect(
    page.getByRole("heading", { name: "Let curiosity lead." }),
  ).toBeVisible();
});

test("opens an accessible login dialog and signs in with mock credentials", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Welcome back." });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Log in", exact: true }),
  ).toBeDisabled();
  await dialog.getByLabel("Email address").fill("alex@university.edu");
  await dialog.locator("#login-password").fill("Demo2026!");
  await dialog.getByRole("checkbox", { name: /Remember me/ }).check();
  await dialog.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Alex Morgan" })).toBeVisible();
});

test("creates a project with a professor and additional author, then opens its details", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Technology", exact: true })
    .last()
    .click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const dialog = page.getByRole("dialog", {
    name: "Bring your project to the lab.",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(".main-author-summary")).toContainText(
    "Alex Morgan",
  );
  await expect(
    dialog.getByText(
      "Image hosting suggestion: Imgur. Paste the direct URL of the hosted image here.",
    ),
  ).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Publish project" }),
  ).toBeDisabled();
  await dialog.getByLabel("Project title").fill("Campus Connect");
  await dialog
    .getByLabel("Project image URL")
    .fill("https://images.unsplash.com/photo-1518770660439-4636190af475");
  await dialog
    .getByLabel("Project description")
    .fill(
      "An open student collaboration platform connecting campus research and community ideas.",
    );
  await dialog
    .getByLabel("Project GitHub URL")
    .fill("https://github.com/university/campus-connect");
  await dialog.getByRole("button", { name: "Add author" }).click();
  await dialog.locator("#author-1-name").fill("Jamie Chen");
  await dialog.locator("#author-1-github").fill("https://github.com/jamiechen");
  await dialog
    .locator("#author-1-linkedin")
    .fill("https://linkedin.com/in/jamiechen");
  await dialog.getByRole("combobox", { name: "Assigned professor" }).click();
  const professor = page.getByRole("option", { name: /Dr. Ana Silva/ });
  await expect(professor).toContainText("ana.silva@university.edu");
  await expect(professor).toContainText("Technology & Computer Science");
  await professor.click();
  await expect(dialog.locator(".professor-summary")).toContainText(
    "ana.silva@university.edu",
  );
  await dialog.getByRole("button", { name: "Add author" }).click();
  await expect(
    dialog.getByRole("button", { name: "Publish project" }),
  ).toBeDisabled();
  await dialog.getByRole("button", { name: "Remove author 3" }).click();
  await expect(
    dialog.getByRole("button", { name: "Publish project" }),
  ).toBeEnabled();
  await dialog.getByRole("button", { name: "Publish project" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".project-card")).toHaveCount(6);
  await page.getByRole("link", { name: /^View Campus Connect/ }).click();
  await expect(page).toHaveURL(/\/projects\/demo-/);
  await expect(
    page.getByRole("heading", { name: "Campus Connect" }),
  ).toBeVisible();
  await expect(page.getByText("Jamie Chen", { exact: true })).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "This project isn’t in the lab yet." }),
  ).toBeVisible();
});

test("fits compact screens, keeps dialogs usable, and provides keyboard dismissal", async ({
  page,
}) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 812 });
    for (const path of ["/", "/register", "/projects/1"]) {
      await page.goto(path);
      await expect(page.locator("main")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

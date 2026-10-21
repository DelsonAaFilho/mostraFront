import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("pages meet automated WCAG AA checks in dark and light modes", async ({
  page,
}) => {
  for (const path of ["/", "/register", "/projects/3"]) {
    await page.goto(path);
    for (const mode of ["dark", "light"]) {
      if (mode === "light")
        await page
          .getByRole("button", { name: "Switch to light mode" })
          .click();
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations,
        `${path} in ${mode}: ${JSON.stringify(result.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((node) => node.target) })))}`,
      ).toEqual([]);
    }
  }
});

test("dialogs have accessible labels and course dropdown options stay visible", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  const login = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(login.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Technology", exact: true })
    .click();
  await page.getByRole("button", { name: "Continue" }).click();
  const creation = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(creation.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.goto("/register");
  for (const mode of ["dark", "light"]) {
    if (mode === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.getByRole("combobox", { name: "Course area" }).click();
    await expect(page.getByRole("option")).toHaveCount(9);
    for (const option of await page.getByRole("option").all()) {
      await expect(option).toBeVisible();
      expect((await option.innerText()).trim()).not.toBe("");
    }
    await page.keyboard.press("Escape");
  }
});

test("registration submit handler rejects invalid input independently of the disabled button", async ({
  page,
}) => {
  await page.goto("/register");
  await page
    .locator("form")
    .evaluate((form) =>
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      ),
    );
  await expect(
    page.getByText("Enter a valid email, such as student@example.com."),
  ).toBeVisible();
  await expect(
    page.getByText("Enter your student ID using numbers only."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Let curiosity lead." }),
  ).toHaveCount(0);
});

import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, prop } from "./helpers";

/**
 * The form field on its own page. What it owns is the wiring between a caption, a message and the control between
 * them, so each test asks the control what it is called, what describes it and whether it says it is wrong. The
 * caption's words are the page's; the test reads the name through the control rather than spelling the caption out,
 * and takes the message from the knob that sets it.
 */
const DOCS = "/src/App/Pages/FormFieldPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const IN_FORM = docsDemo(DOCS, "InForm");

const control = (scope: string) => `${scope} input`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

const describedText = (page: Page, scope: string) =>
    page.locator(control(scope)).evaluate((element) =>
        (element.getAttribute("aria-describedby") ?? "")
            .split(" ")
            .filter(Boolean)
            .map((id) => document.getElementById(id)?.textContent ?? "")
            .join(" ")
            .trim(),
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/form-field/docs");
    await expect(page.locator(control(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("the caption names the control", async ({ page }) => {
    const caption = await page.locator(BASIC).evaluate((element) => {
        const input = element.querySelector("input");
        const ids = (input?.getAttribute("aria-labelledby") ?? "").split(" ").filter(Boolean);

        return ids
            .map((id) => document.getElementById(id)?.textContent ?? "")
            .join(" ")
            .trim();
    });

    expect(caption, "the control is labelled by an element that is drawn").not.toBe("");
    await expect(page.locator(control(BASIC))).toHaveAccessibleName(caption);
});

test("the message describes the control, and only while there is one", async ({ page }) => {
    await knob(page, "message").fill("");

    expect(await describedText(page, BASIC), "with no message, nothing describes it").toBe("");

    await knob(page, "message").fill("Shown on your profile");

    await expect.poll(() => describedText(page, BASIC)).toBe("Shown on your profile");
});

test("an error on the field reaches the control", async ({ page }) => {
    await expect(page.locator(control(BASIC))).not.toHaveAttribute("aria-invalid", "true");

    await knob(page, "hasError").click();

    await expect(page.locator(control(BASIC))).toHaveAttribute("aria-invalid", "true");
});

test("a required field says so on the control", async ({ page }) => {
    await knob(page, "isRequired").click();

    await expect(page.locator(control(BASIC))).toHaveAttribute("aria-required", "true");
});

/**
 * The example starts with its field in error, so the form refuses to send until the error is switched off. What the
 * line under it says is the page's; the test asks only whether the typed name appears in it.
 */
test("a field in error holds its form back, and once cleared, what was typed is sent", async ({ page }) => {
    const readout = page.locator(`${IN_FORM} [data-readout]`);

    await page.locator(control(IN_FORM)).click();
    await page.keyboard.type("Ada");
    await page.keyboard.press("Enter");

    await expect(page.locator(control(IN_FORM)), "the field in error says so").toHaveAttribute("aria-invalid", "true");
    await expect(readout, "and nothing is sent").not.toContainText("Ada");

    await knob(page, "inFormHasError").click();
    await page.locator(control(IN_FORM)).click();
    await page.keyboard.press("Enter");

    await expect(readout).toContainText("Ada");
});

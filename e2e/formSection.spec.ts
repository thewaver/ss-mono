import { type Page, expect, test } from "@playwright/test";

import { demo } from "./helpers";

const FORM = `${demo("sections")} form`;
const SECTIONS = `${FORM} fieldset`;
const SUBMIT = `${FORM} button[type="submit"]`;

const GOOD_EMAIL = "me@example.com";
const GOOD_PASSWORD = "longenough";

const identitySection = (page: Page) => page.locator(SECTIONS).nth(0);
const passwordSection = (page: Page) => page.locator(SECTIONS).nth(1);

const emailField = (page: Page) => page.locator(`${FORM} input`).nth(0);
const passwordField = (page: Page) => page.locator(`${FORM} input`).nth(1);
const confirmField = (page: Page) => page.locator(`${FORM} input`).nth(2);

/**
 * A section sits between a form and its fields and collects the same thing a form collects. The whole of
 * what it adds is that the collecting stops at the nearest one: a field reports to its section, a section
 * reports its verdict upward, and the form ends up hearing one answer per section rather than one per field.
 * Everything here is written against that, because it is the only behaviour a consumer can be surprised by.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/form");
    await expect(page.locator(FORM)).toBeVisible();
});

test("a section is a real fieldset, named by the legend the page painted", async ({ page }) => {
    await expect(page.locator(SECTIONS), "the example groups its fields into two").toHaveCount(2);
    await expect(
        identitySection(page),
        "a fieldset is a group already, so the library adds no role of its own",
    ).toHaveRole("group");
    await expect(
        identitySection(page),
        "and its name comes from the legend, with no id wiring in the consumer's markup",
    ).toHaveAccessibleName("Who you are");
    await expect(passwordSection(page)).toHaveAccessibleName("Pick a password");
});

test("a field's error reaches the form through the section that holds it", async ({ page }) => {
    await expect(page.locator(SUBMIT), "an empty email is not an email, so the form refuses").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await emailField(page).fill(GOOD_EMAIL);
    await passwordField(page).fill(GOOD_PASSWORD);
    await confirmField(page).fill(GOOD_PASSWORD);

    await expect(
        page.locator(SUBMIT),
        "and stops refusing once every field in every section is happy",
    ).not.toHaveAttribute("aria-disabled");

    await emailField(page).fill("nope");

    await expect(
        page.locator(SUBMIT),
        "one field going bad again is enough, which is the report travelling field to section to form",
    ).toHaveAttribute("aria-disabled", "true");
});

/**
 * The case a section exists for. "These two do not match" is answerable from neither field on its own, so
 * neither field can carry it — both are individually fine, and the form still has to refuse. Without the
 * section there is nowhere for that rule to live except the consumer's own state beside the form.
 */
test("a rule belonging to no single field still stops the form", async ({ page }) => {
    await emailField(page).fill(GOOD_EMAIL);
    await passwordField(page).fill(GOOD_PASSWORD);
    await confirmField(page).fill("somethingelse");

    await expect(
        passwordSection(page).locator('[aria-invalid="true"]'),
        "neither field reports an error of its own",
    ).toHaveCount(0);
    await expect(page.locator(SUBMIT), "and the form refuses anyway, on the section's word").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await confirmField(page).fill(GOOD_PASSWORD);

    await expect(page.locator(SUBMIT), "and allows it the moment the two agree").not.toHaveAttribute("aria-disabled");
});

/**
 * A section cannot mark itself invalid the way a field does — `aria-invalid` is not an attribute the group
 * role takes — so the only route an assistive technology has to a section-level rule is the text of it. It
 * is therefore wired both ways: announced when it appears, and readable afterwards as the group's own
 * description.
 */
test("a section's own rule is announced, and describes the group afterwards", async ({ page }) => {
    await expect(
        passwordSection(page),
        "two empty boxes match each other, so the section has nothing to say",
    ).not.toHaveAttribute("aria-describedby");

    await emailField(page).fill(GOOD_EMAIL);
    await passwordField(page).fill(GOOD_PASSWORD);
    await confirmField(page).fill("somethingelse");

    const describedBy = await passwordSection(page).getAttribute("aria-describedby");

    expect(describedBy, "the group points at its own message once it has one").toBeTruthy();
    await expect(
        page.locator(`#${describedBy}`),
        "which is a live region, so it is read out when it turns up rather than only on the next visit",
    ).toHaveAttribute("role", "alert");
    expect(
        (await page.locator(`#${describedBy}`).textContent())?.trim(),
        "and it says which rule was broken",
    ).toContain("do not match");
});

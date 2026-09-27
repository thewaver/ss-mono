import { type Page, expect, test } from "@playwright/test";

/**
 * The React `FormSection` between the React `Form` and its fields. The cases follow `e2e/formSection.spec.ts`, which
 * covers the Solid one. The whole of what a section adds is that collecting stops at the nearest one: a field reports
 * to its section, a section reports its verdict upward, and the form hears one answer per section rather than one per
 * field — including a verdict of the section's own that belongs to no single field.
 */
const SECTIONS = "fieldset";
const SUBMIT = "#submit";

const GOOD_EMAIL = "me@example.com";
const GOOD_PASSWORD = "longenough";

const identitySection = (page: Page) => page.locator(SECTIONS).nth(0);
const passwordSection = (page: Page) => page.locator(SECTIONS).nth(1);

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id);

test("a section is a real fieldset, named by the legend the story painted", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Sections");

    await expect(page.locator(SECTIONS), "the story groups its fields into two").toHaveCount(2);
    await expect(identitySection(page), "a fieldset is a group already, so the library adds no role").toHaveRole(
        "group",
    );
    await expect(identitySection(page), "and its name comes from the legend").toHaveAccessibleName("Who you are");
    await expect(passwordSection(page)).toHaveAccessibleName("Pick a password");
});

test("a field's error reaches the form through the section that holds it", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Sections");

    await expect(page.locator(SUBMIT), "an empty email is not an email, so the form refuses").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator("#email").fill(GOOD_EMAIL);
    await page.locator("#password").fill(GOOD_PASSWORD);
    await page.locator("#confirm").fill(GOOD_PASSWORD);

    await expect(
        page.locator(SUBMIT),
        "and stops refusing once every field in every section is happy",
    ).not.toHaveAttribute("aria-disabled");

    await page.locator("#email").fill("nope");

    await expect(
        page.locator(SUBMIT),
        "one field going bad again is enough, which is the report traveling field to section to form",
    ).toHaveAttribute("aria-disabled", "true");
});

test("a rule belonging to no single field still stops the form", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Sections");

    await page.locator("#email").fill(GOOD_EMAIL);
    await page.locator("#password").fill(GOOD_PASSWORD);
    await page.locator("#confirm").fill("somethingelse");

    await expect(
        passwordSection(page).locator('[aria-invalid="true"]'),
        "neither field reports an error of its own",
    ).toHaveCount(0);
    await expect(page.locator(SUBMIT), "and the form refuses anyway, on the section's word").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator("#confirm").fill(GOOD_PASSWORD);

    await expect(page.locator(SUBMIT), "and allows it the moment the two agree").not.toHaveAttribute("aria-disabled");
});

test("a section's own rule is announced, and describes the group afterwards", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Sections");

    await expect(
        passwordSection(page),
        "two empty boxes match each other, so the section has nothing to say",
    ).not.toHaveAttribute("aria-describedby");

    await page.locator("#email").fill(GOOD_EMAIL);
    await page.locator("#password").fill(GOOD_PASSWORD);
    await page.locator("#confirm").fill("somethingelse");

    const describedBy = await passwordSection(page).getAttribute("aria-describedby");

    expect(describedBy, "the group points at its own message once it has one").toBeTruthy();
    await expect(page.locator(`[id="${describedBy}"]`), "which is a live region").toHaveAttribute("role", "alert");
    await expect(page.locator(`[id="${describedBy}"]`), "and it says which rule was broken").toContainText(
        "do not match",
    );
});

/**
 * The story's own button refuses while the form is invalid, so the form is sent the way a script would send it. What
 * is asserted is where focus goes, not whether the page lets the reader send it.
 */
test("a section in error on its own rule hands the form its first field to focus", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Sections");

    await page.locator("#email").fill(GOOD_EMAIL);
    await page.locator("#password").fill(GOOD_PASSWORD);
    await page.locator("#confirm").fill("somethingelse");

    await page.locator("form").evaluate((form: HTMLFormElement) => form.requestSubmit());

    await expect.poll(() => activeId(page), "focus lands on the section's first field").toBe("password");
});

test("sections nest, and each level hears only the level below it", async ({ page, mount }) => {
    await mount("Essentials/FormSection/Nested");

    await expect(page.locator('[data-readout="inner"]'), "an empty card number fails the inner section").toHaveText(
        "false",
    );
    await expect(page.locator('[data-readout="outer"]'), "which fails the outer one").toHaveText("false");

    await page.locator("#street").fill("Rua Augusta");
    await page.locator("#card").fill("1234");

    await expect(page.locator('[data-readout="inner"]')).toHaveText("true");
    await expect(page.locator('[data-readout="outer"]')).toHaveText("true");
    await expect(page.locator('[data-readout="form"]'), "and the form hears it through both").toHaveText("true");

    await page.locator("#card").fill("12");

    await expect(page.locator('[data-readout="form"]'), "a field two sections down still stops the form").toHaveText(
        "false",
    );

    await page.locator(SUBMIT).click();

    await expect.poll(() => activeId(page), "and a submit reaches down through both to focus it").toBe("card");
});

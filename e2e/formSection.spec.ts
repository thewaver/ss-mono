import { type Locator, type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

const DOCS = "/src/App/Pages/FormSectionPage/Docs";

const SECTIONS_DEMO = docsDemo(DOCS, "Sections");
const NESTED_DEMO = docsDemo(DOCS, "Nested");

const FORM = `${SECTIONS_DEMO} form`;
const SECTIONS = `${FORM} fieldset`;
const SUBMIT = "#sectionsSubmit";
const STATUS = `${SECTIONS_DEMO} [data-readout]`;

const GOOD_EMAIL = "me@example.com";
const GOOD_PASSWORD = "longenough";

const identitySection = (page: Page) => page.locator(SECTIONS).nth(0);
const passwordSection = (page: Page) => page.locator(SECTIONS).nth(1);

const emailField = (page: Page) => page.locator(`${FORM} input`).nth(0);
const passwordField = (page: Page) => page.locator(`${FORM} input`).nth(1);
const confirmField = (page: Page) => page.locator(`${FORM} input`).nth(2);

/** Replaces a field's text the way a person does: click into it, select everything, type over it. */
const typeOver = async (page: Page, field: Locator, text: string) => {
    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text);
};

const statusText = async (page: Page, selector: string) => ((await page.locator(selector).textContent()) ?? "").trim();

/**
 * A section sits between a form and its fields and collects the same thing a form collects. The whole of
 * what it adds is that the collecting stops at the nearest one: a field reports to its section, a section
 * reports its verdict upward, and the form ends up hearing one answer per section rather than one per field.
 * Everything here is written against that, because it is the only behavior a consumer can be surprised by.
 *
 * The submit button is never disabled; the example's status line reads the form's `isValid` instead. So the
 * form's verdict is read off that line: the text it shows while the form starts out refusing is the "refused"
 * text, and the form accepts once the line says something else.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/form-section/docs");
    await expect(page.locator(FORM)).toBeVisible();
    await docsSettled(page);
});

test("a section is a real fieldset, named by the legend the page painted", async ({ page }) => {
    await expect(page.locator(SECTIONS), "the example groups its fields into two").toHaveCount(2);

    for (const section of [identitySection(page), passwordSection(page)]) {
        const legend = ((await section.locator("legend").first().textContent()) ?? "").trim();

        await expect(section, "a fieldset is a group already, so the library adds no role of its own").toHaveRole(
            "group",
        );
        expect(legend, "the section has a legend with words").not.toBe("");
        await expect(
            section,
            "and its name comes from the legend, with no id wiring in the consumer's markup",
        ).toHaveAccessibleName(legend);
    }
});

/** A field's caption names its control through `aria-labelledby`, so the control's name is the caption's words. */
test("each field's caption names its control", async ({ page }) => {
    for (const field of [emailField(page), passwordField(page), confirmField(page)]) {
        const labelledBy = await field.getAttribute("aria-labelledby");

        expect(labelledBy, "the control points at its caption").toBeTruthy();

        const caption = ((await page.locator(`#${labelledBy}`).textContent()) ?? "").trim();

        expect(caption, "which has words").not.toBe("");
        await expect(field, "and the control's name is those words alone").toHaveAccessibleName(caption);
    }
});

test("a field's error reaches the form through the section that holds it", async ({ page }) => {
    await expect(page.locator(SUBMIT), "the submit button is never disabled").not.toHaveAttribute("aria-disabled");

    const refused = await statusText(page, STATUS);

    await typeOver(page, emailField(page), GOOD_EMAIL);
    await typeOver(page, passwordField(page), GOOD_PASSWORD);
    await typeOver(page, confirmField(page), GOOD_PASSWORD);

    await expect(
        page.locator(STATUS),
        "the form stops refusing once every field in every section is happy",
    ).not.toHaveText(refused);

    await typeOver(page, emailField(page), "nope");

    await expect(
        page.locator(STATUS),
        "one field going bad again is enough, which is the report traveling field to section to form",
    ).toHaveText(refused);
});

/**
 * The case a section exists for. "These two do not match" is answerable from neither field on its own, so
 * neither field can carry it — both are individually fine, and the form still has to refuse. Without the
 * section there is nowhere for that rule to live except the consumer's own state beside the form.
 */
test("a rule belonging to no single field still stops the form", async ({ page }) => {
    const refused = await statusText(page, STATUS);

    await typeOver(page, emailField(page), GOOD_EMAIL);
    await typeOver(page, passwordField(page), GOOD_PASSWORD);
    await typeOver(page, confirmField(page), "somethingelse");

    await expect(
        passwordSection(page).locator('[aria-invalid="true"]'),
        "neither field reports an error of its own",
    ).toHaveCount(0);
    await expect(page.locator(STATUS), "and the form refuses anyway, on the section's word").toHaveText(refused);

    await page.locator(SUBMIT).click();

    await expect(page.locator(STATUS), "so pressing the button sends nothing").toHaveText(refused);

    await typeOver(page, confirmField(page), GOOD_PASSWORD);

    await expect(page.locator(STATUS), "and the form allows it the moment the two agree").not.toHaveText(refused);

    const ready = await statusText(page, STATUS);

    await page.locator(SUBMIT).click();

    await expect(page.locator(STATUS), "and then pressing the button sends").not.toHaveText(ready);
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

    await typeOver(page, emailField(page), GOOD_EMAIL);
    await typeOver(page, passwordField(page), GOOD_PASSWORD);
    await typeOver(page, confirmField(page), "somethingelse");

    const describedBy = await passwordSection(page).getAttribute("aria-describedby");

    expect(describedBy, "the group points at its own message once it has one").toBeTruthy();
    await expect(
        page.locator(`#${describedBy}`),
        "which is a live region, so it is read out when it turns up rather than only on the next visit",
    ).toHaveAttribute("role", "alert");
    expect(
        (await page.locator(`#${describedBy}`).textContent())?.trim(),
        "and it says which rule was broken",
    ).toBeTruthy();
});

/** A section inside a section reports to the one around it, so a field two sections deep still reaches the form. */
test("a field inside a nested section still holds the form back", async ({ page }) => {
    const status = `${NESTED_DEMO} [data-readout]`;
    const fields = page.locator(`${NESTED_DEMO} input`);
    const refused = await statusText(page, status);

    await typeOver(page, fields.nth(0), "1 High Street");

    await expect(page.locator(status), "the outer field alone is not enough").toHaveText(refused);

    await typeOver(page, fields.nth(1), "1234");

    await expect(page.locator(status), "the inner section's field completes it").not.toHaveText(refused);
});

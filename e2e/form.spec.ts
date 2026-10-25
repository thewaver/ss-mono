import { type Locator, type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

const DOCS = "/src/App/Pages/FormPage/Docs";

const FORM = `${docsDemo(DOCS, "Basic")} form`;
const SUBMITTED = `${docsDemo(DOCS, "Submitted")} form`;

const submit = (scope: string) => `${scope} button[type="submit"]`;
const reset = (scope: string) => `${scope} button[type="reset"]`;

const email = (page: Page) => page.locator(`${FORM} input`).first();
const password = (page: Page) => page.locator(`${FORM} input`).nth(1);
const terms = (page: Page) => page.locator(`${FORM} input[type="checkbox"]`);

/**
 * Each form shows its outcome in a line of its own under its buttons. Only whether that line changed is read, and what
 * it holds of the spec's own typing, never its wording.
 */
const statusLine = (page: Page, scope: string) => page.locator(`${scope} [data-readout]`);

/** Replaces whatever a text field holds, the way a person does: click in, select everything, type over it. */
const typeInto = async (page: Page, field: Locator, text: string) => {
    await field.click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(text);
};

const fillValidly = async (page: Page) => {
    await typeInto(page, email(page), "me@example.com");
    await typeInto(page, password(page), "longenough");
    await terms(page).click();
};

/**
 * The library validates nothing here — every message and every `hasError` in the page is the consumer's
 * own. What is worth asserting is the wiring the library does own: that a control points at its message,
 * that an error message announces itself, and that a form's validity is the union of what its fields
 * report.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/form/docs");
    await expect(page.locator(FORM)).toBeVisible();
    await docsSettled(page);
});

test("a field points its control at its own message", async ({ page }) => {
    const describedBy = await email(page).getAttribute("aria-describedby");

    expect(describedBy, "the control carries a description reference it did not have to be given").toBeTruthy();
    await expect(
        page.locator(`${FORM} [id="${describedBy}"]`),
        "which resolves to a message in the same form",
    ).not.toBeEmpty();

    await typeInto(page, email(page), "me@example.com");

    const nextDescribedBy = await email(page).getAttribute("aria-describedby");

    await expect(
        page.locator(`${FORM} [id="${nextDescribedBy}"]`),
        "and still does once the message has changed to a hint",
    ).not.toBeEmpty();
});

/**
 * A field's caption names its control: the control's `aria-labelledby` points at the caption, so its name is the
 * caption's words alone. Checked on every control the two forms hold — text fields, a checkbox and the pickers,
 * whose name has to reach the combobox a screen reader lands on.
 */
test("each field's caption names its control", async ({ page }) => {
    const controls = page.locator(`${FORM} input, ${SUBMITTED} [role="combobox"]`);
    const count = await controls.count();

    expect(count, "the forms hold controls").toBeGreaterThan(0);

    for (let index = 0; index < count; index++) {
        const control = controls.nth(index);
        const labelledBy = await control.getAttribute("aria-labelledby");

        expect(labelledBy, "the control points at its field's caption").toBeTruthy();

        const caption = ((await page.locator(`[id="${labelledBy}"]`).textContent()) ?? "").trim();

        expect(caption, "which has words").not.toBe("");
        await expect(control, "and the control's name is those words alone").toHaveAccessibleName(caption);
    }
});

test("an error message announces itself, and a hint does not", async ({ page }) => {
    await typeInto(page, email(page), "me@example.com");

    const describedBy = await email(page).getAttribute("aria-describedby");

    await expect(page.locator(`[id="${describedBy}"]`), "a plain hint is not an alert").not.toHaveAttribute("role");
    await expect(email(page), "and the control is not marked invalid").not.toHaveAttribute("aria-invalid", "true");

    await typeInto(page, email(page), "nope");

    await expect(
        page.locator(`[id="${describedBy}"]`),
        "an error one is, so it is read out when it appears",
    ).toHaveAttribute("role", "alert");
    await expect(email(page), "and the control is marked invalid").toHaveAttribute("aria-invalid", "true");
});

/**
 * The submit button is never disabled: the form's `isValid` drives the status line instead. So the union is read off
 * that line — it says one thing while any field reports an error, whichever field it is, and something else once none
 * does.
 */
test("the form's validity is the union of what its fields report", async ({ page }) => {
    await expect(
        page.locator(submit(FORM)),
        "the submit button stays enabled while fields are in error",
    ).not.toHaveAttribute("aria-disabled");

    const invalid = await statusLine(page, FORM).textContent();

    await typeInto(page, email(page), "me@example.com");
    await typeInto(page, password(page), "longenough");
    await expect(statusLine(page, FORM), "one field still in error keeps the form invalid").toHaveText(invalid!);

    await terms(page).click();
    await expect(statusLine(page, FORM), "and once none is, the form is valid").not.toHaveText(invalid!);

    await terms(page).click();
    await expect(statusLine(page, FORM), "any one field going back into error makes it invalid again").toHaveText(
        invalid!,
    );
});

test("sending a form with errors moves focus to the first field in error", async ({ page }) => {
    await typeInto(page, password(page), "longenough");
    await page.locator(submit(FORM)).click();

    await expect(email(page), "the first field in error takes focus, so the reader lands on the problem").toBeFocused();
});

test("submit and reset run without the page reloading", async ({ page }) => {
    await page.evaluate(() => {
        (window as unknown as { notReloaded: boolean }).notReloaded = true;
    });

    const untouched = await statusLine(page, FORM).textContent();

    await fillValidly(page);
    await page.locator(submit(FORM)).click();

    await expect(statusLine(page, FORM), "the submit handler ran with what was typed").toContainText("me@example.com");

    await page.locator(reset(FORM)).click();

    await expect(statusLine(page, FORM), "and reset puts the form back where it started").toHaveText(untouched!);
    await expect(email(page), "fields included").toHaveValue("");
    expect(
        await page.evaluate(() => (window as unknown as { notReloaded?: boolean }).notReloaded),
        "all without the page reloading",
    ).toBe(true);
});

test("a message that empties takes the description reference with it", async ({ page }) => {
    await expect(password(page), "an incomplete password is described by its rule").toHaveAttribute(
        "aria-describedby",
        /.+/,
    );

    await typeInto(page, password(page), "longenough");

    await expect(password(page), "and once it passes there is nothing left to point at").not.toHaveAttribute(
        "aria-describedby",
    );
});

/**
 * With `hasSubmitted`, a field keeps its error to itself until the form has been sent once: the page opens with both
 * pickers empty and nothing marked, and the first send marks them and moves focus to the first.
 */
test("a form that shows errors once sent marks nothing until it is sent", async ({ page }) => {
    const pickers = page.locator(`${SUBMITTED} [role="combobox"]`);

    await expect(pickers.first(), "an empty required field is not marked before the form is sent").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
    await expect(page.locator(`${SUBMITTED} [role="alert"]`), "and no error is announced").toHaveCount(0);

    await page.locator(submit(SUBMITTED)).click();

    await expect(pickers.first(), "sending marks it").toHaveAttribute("aria-invalid", "true");
    await expect(pickers.first(), "points it at its message").toHaveAttribute("aria-describedby", /.+/);
    await expect(pickers.first(), "and moves focus to it, the first field in error").toBeFocused();
});

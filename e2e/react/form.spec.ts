import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Form` and `FormField`, with the React `TextField`, `Checkbox` and `Button` inside. The cases follow
 * `e2e/form.spec.ts`, which covers the Solid pair. The library validates nothing here — every message and every
 * `hasError` in the stories is the story's own — so what is asserted is the wiring the library does own: a control
 * points at its field's message, an error message announces itself, the form's validity is the union of what its
 * fields report, and a submit moves focus to the first field in error.
 */
const SUBMIT = "#submit";

const activeId = (page: Page) => page.evaluate(() => document.activeElement?.id);

const describedText = async (page: Page, selector: string) => {
    const describedBy = await page.locator(selector).getAttribute("aria-describedby");

    return describedBy ? page.locator(`[id="${describedBy.split(" ").at(-1)}"]`) : undefined;
};

test("a field points its control at its own message", async ({ page, mount }) => {
    await mount("Essentials/Form/SignUp");

    const message = await describedText(page, "#email");

    expect(message, "the control carries a description reference it did not have to be given").toBeTruthy();
    await expect(message!, "and it resolves to the field's message").toContainText("sign you in");
});

test("an error message announces itself, and a hint does not", async ({ page, mount }) => {
    await mount("Essentials/Form/SignUp");

    const hint = await describedText(page, "#email");

    await expect(hint!, "a plain hint is not an alert").not.toHaveAttribute("role");

    await page.locator("#email").fill("nope");

    const error = await describedText(page, "#email");

    await expect(error!, "an error one is, so it is read out when it appears").toHaveAttribute("role", "alert");
    await expect(page.locator("#email"), "and the control is marked invalid").toHaveAttribute("aria-invalid", "true");
});

test("the form's validity is the union of what its fields report", async ({ page, mount }) => {
    await mount("Essentials/Form/SignUp");

    await expect(page.locator(SUBMIT), "submit refuses while any field reports an error").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator("#email").fill("me@example.com");
    await page.locator("#password").fill("longenough");

    await expect(page.locator(SUBMIT), "one field still in error is enough to refuse").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator("#terms").click();

    await expect(page.locator(SUBMIT), "and it allows it once none do").not.toHaveAttribute("aria-disabled");

    await page.locator("#terms").click();

    await expect(page.locator(SUBMIT), "and refuses again the moment one goes back").toHaveAttribute(
        "aria-disabled",
        "true",
    );
});

test("submit and reset run without the page reloading", async ({ page, mount }) => {
    await mount("Essentials/Form/SignUp");

    await page.locator("#email").fill("me@example.com");
    await page.locator("#password").fill("longenough");
    await page.locator("#terms").click();

    await page.locator(SUBMIT).click();

    await expect(page.locator('[data-readout="outcome"]')).toHaveText("submitted as me@example.com");
    await expect(page.locator('[data-readout="state"]'), "and the form knows it was sent").toHaveText(
        "valid: true | submitted: true",
    );

    await page.locator("#reset").click();

    await expect(page.locator('[data-readout="outcome"]')).toHaveText("not submitted");
    await expect(page.locator('[data-readout="state"]')).toHaveText("valid: true | submitted: false");
});

test("a message that empties takes the description reference with it", async ({ page, mount }) => {
    await mount("Essentials/Form/SignUp");

    const password = page.locator("#password");

    await expect(password, "an incomplete password is described by its rule").toHaveAttribute("aria-describedby", /.+/);

    await password.fill("longenough");

    await expect(password, "and once it passes there is nothing left to point at").not.toHaveAttribute(
        "aria-describedby",
    );
});

/**
 * The errors in this story only show once the form has been sent, so they arrive in the same render the submit
 * causes. Focus has to wait for that render; moving it from inside the handler would find nothing in error.
 */
test("submitting moves focus to the first field in error, in the order the fields were drawn", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Form/FocusOnError");

    await page.locator(SUBMIT).click();

    await expect(page.locator('[data-readout="submissions"]'), "the handler runs either way").toHaveText("1");
    await expect.poll(() => activeId(page), "and focus lands on the first field in error").toBe("plan");
    await expect(page.locator("#plan")).toHaveAttribute("aria-invalid", "true");
});

test("a field already valid is passed over for the first one in error", async ({ page, mount }) => {
    await mount("Essentials/Form/FocusOnError", { initialPlan: "Team" });

    await page.locator(SUBMIT).click();

    await expect.poll(() => activeId(page)).toBe("topic");
});

test("a control of the consumer's own gets the same wiring through the React hooks", async ({ page, mount }) => {
    await mount("Essentials/Form/Foreign");

    const describedBy = (await page.locator("#foreign").getAttribute("aria-describedby")) ?? "";
    const [own, field] = describedBy.split(" ");

    expect(own, "the input's own description comes first").toBe("own-hint");
    await expect(page.locator(`[id="${field}"]`), "and the field's message is added after it").toHaveText(
        "Something is off.",
    );

    await page.locator(SUBMIT).click();

    await expect.poll(() => activeId(page), "and a submit focuses it, since it registered itself").toBe("foreign");

    await page.locator("#fix").click();

    await expect(page.locator("#foreign"), "and the field's id leaves once the message does").toHaveAttribute(
        "aria-describedby",
        "own-hint",
    );
});

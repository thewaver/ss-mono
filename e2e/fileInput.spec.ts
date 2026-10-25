import { type Page, expect, test } from "@playwright/test";

import { activeMatches, clickIsAllowed, docsDemo, docsSettled, inputValue, pickFiles, prop, tabIndex } from "./helpers";

const DOCS = "/src/App/Pages/FileInputPage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const REFUSING = docsDemo(DOCS, "Refusing");
const DROP_ZONE = docsDemo(DOCS, "DropZone");

const BASIC_INPUT = `${BASIC} input`;
const MULTIPLE = `${docsDemo(DOCS, "Multiple")} input`;
const IMAGES = `${docsDemo(DOCS, "Images")} input`;
const REFUSING_INPUT = `${REFUSING} input`;
const DROP_ZONE_INPUT = `${DROP_ZONE} input`;
const TOOLTIP_INPUT = `${docsDemo(DOCS, "Tooltip")} input`;
const LABELED_INPUT = `${docsDemo(DOCS, "Labeled")} input`;

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

test.beforeEach(async ({ page }) => {
    await page.goto("/file-input/docs");
    await expect(page.locator(BASIC_INPUT)).toBeAttached();
    await docsSettled(page);
});

test("the control is a real file input and passes its attributes through", async ({ page }) => {
    await expect(page.locator(BASIC_INPUT), "the control is a real file input").toHaveAttribute("type", "file");
    await expect(page.locator(MULTIPLE), "multiple is passed through").toHaveAttribute("multiple", "");
    expect(await page.locator(IMAGES).getAttribute("accept"), "so is accept").toBeTruthy();
    await expect(page.locator(BASIC_INPUT), "and a plain one carries neither").not.toHaveAttribute("multiple");
});

test("a pick is drawn by the painter", async ({ page }) => {
    await pickFiles(page.locator(BASIC_INPUT), [{ name: "notes.txt", size: 10, type: "text/plain" }]);

    await expect(
        page.locator(`${BASIC} [aria-hidden="true"]`).first(),
        "the painter draws the pick from the flags, since the native rendering is suppressed",
    ).toContainText("notes.txt");
});

/**
 * The Refusing example's rule is one only the consumer can make — no space in a file's name — so a name with a space
 * is refused and one without is kept.
 */
test("a refusing owner can refuse a pick and the input is cleared to match", async ({ page }) => {
    await pickFiles(page.locator(REFUSING_INPUT), [{ name: "my notes.txt", size: 10, type: "text/plain" }]);

    await expect(page.locator(`${REFUSING} [data-readout]`), "a refusing owner can refuse a pick").toContainText(
        "my notes.txt",
    );
    expect(
        await inputValue(page.locator(REFUSING_INPUT)),
        "and the input is cleared to match, so re-picking the same file still fires a change",
    ).toBe("");
    await expect(page.locator(REFUSING_INPUT), "with the field announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
    await expect(
        page.locator(`${REFUSING} [aria-hidden="true"]`).first(),
        "and the refused file is not drawn",
    ).not.toContainText("my notes.txt");

    await pickFiles(page.locator(REFUSING_INPUT), [{ name: "notes.txt", size: 10, type: "text/plain" }]);

    await expect(page.locator(REFUSING_INPUT), "an accepted pick clears the error").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
    await expect(page.locator(`${REFUSING} [aria-hidden="true"]`).first(), "and lands").toContainText("notes.txt");
});

/**
 * Every arrival, picked or dropped, is checked against `accept` before it is kept, since the dialog can be switched
 * to show every kind of file. A refused file goes to `onReject`, which the drop zone's readout lists.
 */
test("a file of a kind the control does not accept is refused, and reported", async ({ page }) => {
    const readout = page.locator(`${DROP_ZONE} [data-readout]`);

    await expect(readout, "nothing is refused before anything arrives").not.toContainText("notes.txt");

    await pickFiles(page.locator(DROP_ZONE_INPUT), [{ name: "notes.txt", size: 10, type: "text/plain" }]);

    await expect(readout, "a file of another kind is refused and reported by name").toContainText("notes.txt");
});

test("a disabled field cancels the click that would open the OS dialog", async ({ page }) => {
    await knob(page, "isDisabled").click();

    await expect(page.locator("input[disabled]"), "no field carries the native attribute").toHaveCount(0);
    await expect(page.locator(BASIC_INPUT), "a disabled field says so through ARIA").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(await tabIndex(page.locator(BASIC_INPUT)), "and is out of the tab order").toBe(-1);

    expect(
        await clickIsAllowed(page.locator(BASIC_INPUT)),
        "activation is refused by canceling the click, which is the only thing that can stop a native file dialog",
    ).toBe(false);

    await page.locator(BASIC_INPUT).click({ force: true });
    expect(await activeMatches(page, BASIC_INPUT), "and clicking it does not focus it either").toBe(false);
});

test("a disabled field kept reachable keeps its tab stop and explains itself", async ({ page }) => {
    await knob(page, "tooltipIsReachableWhenDisabled").click();
    await knob(page, "tooltipIsDisabled").click();

    await expect(page.locator(TOOLTIP_INPUT)).toHaveAttribute("aria-disabled", "true");
    expect(await tabIndex(page.locator(TOOLTIP_INPUT)), "a reachable disabled field keeps its tab stop").toBe(0);
    expect(await clickIsAllowed(page.locator(TOOLTIP_INPUT)), "while still refusing to open the dialog").toBe(false);

    await page.locator(TOOLTIP_INPUT).hover({ force: true });
    await expect(page.locator('[role="tooltip"]'), "and reveals the tooltip explaining why").toBeVisible();
});

/** Inside a Label the caption alone names the control, through `aria-labelledby`. */
test("inside a Label the caption names the control", async ({ page }) => {
    const labelledBy = await page.locator(LABELED_INPUT).getAttribute("aria-labelledby");

    expect(labelledBy, "the control points at its caption").toBeTruthy();

    const words = ((await page.locator(`#${labelledBy}`).textContent()) ?? "").trim();

    expect(words, "the caption has words").not.toBe("");
    await expect(page.locator(LABELED_INPUT), "and the control's name is those words alone").toHaveAccessibleName(
        words,
    );
});

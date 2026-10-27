import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled } from "./helpers";

const FORM_DOCS = "/src/App/Pages/FormPage/Docs";
const SELECT_DOCS = "/src/App/Pages/SelectPage/Docs";
const COLOR_DOCS = "/src/App/Pages/ColorInputPage/Docs";
const DATE_DOCS = "/src/App/Pages/DateInputPage/Docs";
const TIME_DOCS = "/src/App/Pages/TimeInputPage/Docs";

const SUBMITTED = `${docsDemo(FORM_DOCS, "Submitted")} form`;
const OPTION = '[role="listbox"] [role="option"]';

const ISO_DATE = /-?\d{4,6}-\d{2}-\d{2}/;
const ISO_TIME = /\d{2}:\d{2}(?::\d{2})?/;

const hiddenIn = (scope: string) => `${scope} input[type="hidden"]`;

const readoutOf = (scope: string) => `${scope} [data-readout]`;

/**
 * What a native submit of the form would carry for one name, read the way the browser reads it: through `FormData`,
 * which collects the hidden inputs the same way a real submit does.
 */
const submittedFor = (page: Page, name: string) =>
    page.locator(SUBMITTED).evaluate((form, key) => new FormData(form as HTMLFormElement).getAll(key), name);

const openDocs = async (page: Page, route: string, scope: string) => {
    await page.goto(route);
    await expect(page.locator(scope)).toBeVisible();
    await docsSettled(page);
};

/** Clicks the field, selects whatever it holds and types over it, the way a person does. */
const typeInto = async (page: Page, selector: string, text: string) => {
    await page.locator(selector).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text, { delay: 15 });
};

/**
 * `Select` and `MultiSelect` draw no native field, so a plain form around them used to send nothing. What the form
 * carries is read off the form itself, and compared with what the person picked rather than with a spelled-out value.
 */
test.describe("a form around a select", () => {
    const comboboxes = (page: Page) => page.locator(`${SUBMITTED} [role="combobox"]`);

    test.beforeEach(async ({ page }) => {
        await openDocs(page, "/form/docs", SUBMITTED);
    });

    test("carries an empty entry for a single select and none for a multiple one while nothing is picked", async ({
        page,
    }) => {
        expect(await submittedFor(page, "plan"), "a single select still names itself, with nothing in it").toEqual([
            "",
        ]);
        expect(await submittedFor(page, "topics"), "a multiple one adds an entry per pick, so none").toEqual([]);
    });

    test("carries what was picked", async ({ page }) => {
        await comboboxes(page).nth(0).click();
        await expect(page.locator(OPTION).first()).toBeVisible();
        await page.locator(OPTION).first().click();

        const plan = (await comboboxes(page).nth(0).textContent())?.trim();

        expect(plan, "the field states what was picked").toBeTruthy();
        expect(await submittedFor(page, "plan"), "which is what the form sends").toEqual([plan]);

        await comboboxes(page).nth(1).click();
        await expect(page.locator(OPTION).first()).toBeVisible();
        await page.locator(OPTION).nth(0).click();
        await page.locator(OPTION).nth(1).click();
        await page.keyboard.press("Escape");

        const topics = ((await comboboxes(page).nth(1).textContent()) ?? "").split(", ").map((topic) => topic.trim());

        expect(topics, "the field states both picks").toHaveLength(2);
        expect(
            [...(await submittedFor(page, "topics"))].sort(),
            "a multiple select sends one entry per picked option under its one name",
        ).toEqual([...topics].sort());
    });

    test("goes back to nothing when the form is reset", async ({ page }) => {
        await comboboxes(page).nth(0).click();
        await expect(page.locator(OPTION).first()).toBeVisible();
        await page.locator(OPTION).first().click();

        expect((await submittedFor(page, "plan"))[0], "something is sent once a plan is picked").not.toBe("");

        await page.locator(`${SUBMITTED} button[type="reset"]`).click();

        await expect.poll(() => submittedFor(page, "plan"), "and the entry empties again with the reset").toEqual([""]);
    });
});

/**
 * Options hold records, not strings, so what a form sends needs a spelling. The Records example names the airport and
 * hands over a writer that sends its code; the Described example names the delivery and hands over nothing, so its
 * record goes as JSON. Each is compared with what the page shows rather than with a value written down here.
 */
test.describe("a select of records", () => {
    const optionOf = (page: Page) => page.locator(OPTION).first();

    test("sends what the caller's writer makes of the picked record", async ({ page }) => {
        const RECORDS = docsDemo(SELECT_DOCS, "Records");

        await openDocs(page, "/select/docs", RECORDS);

        await expect(page.locator(hiddenIn(RECORDS)), "nothing picked sends an empty entry").toHaveValue("");

        await page.locator(`${RECORDS} [role="combobox"]`).click();
        await expect(optionOf(page)).toBeVisible();

        const optionText = (await optionOf(page).textContent()) ?? "";

        await optionOf(page).click();

        const sent = await page.locator(hiddenIn(RECORDS)).inputValue();

        expect(sent, "something is sent once a record is picked").not.toBe("");
        expect(optionText, "and it is the code the option shows beside the city").toContain(`(${sent})`);
        expect(sent, "not the record as text").not.toContain("{");
    });

    test("sends the picked record as JSON when no writer is given", async ({ page }) => {
        const DESCRIBED = docsDemo(SELECT_DOCS, "Described");

        await openDocs(page, "/select/docs", DESCRIBED);

        await page.locator(`${DESCRIBED} [role="combobox"]`).click();
        await expect(optionOf(page)).toBeVisible();
        await optionOf(page).click();

        const shown = ((await page.locator(`${DESCRIBED} [role="combobox"]`).textContent()) ?? "").trim();
        const sent = JSON.parse(await page.locator(hiddenIn(DESCRIBED)).inputValue());

        expect(typeof sent, "what is sent reads back as the record").toBe("object");
        expect(sent.name, "and it is the record the field shows").toBe(shown);
    });
});

test("a select given no name draws no hidden input", async ({ page }) => {
    await openDocs(page, "/select/docs", docsDemo(SELECT_DOCS, "Basic"));

    await expect(page.locator(hiddenIn(docsDemo(SELECT_DOCS, "Basic")))).toHaveCount(0);
});

/**
 * The date and time fields used to put `name` on the field the person types into, so a form sent the text on screen.
 * The value that is sent is the one the field holds, which the example's own line under the field also states, so the
 * two are compared rather than a date being spelled out here.
 */
test.describe("a date field", () => {
    const BASIC = docsDemo(DATE_DOCS, "Basic");
    const FIELD = `${BASIC} input:not([type="hidden"])`;

    test.beforeEach(async ({ page }) => {
        await openDocs(page, "/date-input/docs", BASIC);
    });

    test("sends an empty entry until it holds a date", async ({ page }) => {
        await expect(page.locator(hiddenIn(BASIC))).toHaveValue("");
    });

    test("sends the date it holds, never the text on screen", async ({ page }) => {
        await expect(page.locator(FIELD), "the field you type into carries no name of its own").not.toHaveAttribute(
            "name",
            /.+/,
        );

        await typeInto(page, FIELD, "11111111");
        await expect(page.locator(readoutOf(BASIC))).toContainText(ISO_DATE);

        const held = (await page.locator(readoutOf(BASIC)).textContent())!.match(ISO_DATE)![0];

        await expect(
            page.locator(hiddenIn(BASIC)),
            "the form carries that date in a form a server can read",
        ).toHaveValue(held);
    });

    test("keeps sending the last whole date while the text is half edited", async ({ page }) => {
        await typeInto(page, FIELD, "11111111");
        await expect(page.locator(readoutOf(BASIC))).toContainText(ISO_DATE);

        const held = (await page.locator(readoutOf(BASIC)).textContent())!.match(ISO_DATE)![0];

        await page.keyboard.press("Backspace");

        await expect(
            page.locator(hiddenIn(BASIC)),
            "an unfinished date is not a value, so the last one stands",
        ).toHaveValue(held);
    });
});

test.describe("a time field", () => {
    const BASIC = docsDemo(TIME_DOCS, "Basic");
    const FIELD = `${BASIC} input:not([type="hidden"])`;

    test.beforeEach(async ({ page }) => {
        await openDocs(page, "/time-input/docs", BASIC);
    });

    test("sends an empty entry until it holds a time", async ({ page }) => {
        await expect(page.locator(hiddenIn(BASIC))).toHaveValue("");
    });

    test("sends the time it holds, never the text on screen", async ({ page }) => {
        await expect(page.locator(FIELD), "the field you type into carries no name of its own").not.toHaveAttribute(
            "name",
            /.+/,
        );

        await typeInto(page, FIELD, "1230");
        await expect(page.locator(readoutOf(BASIC))).toContainText(ISO_TIME);

        const held = (await page.locator(readoutOf(BASIC)).textContent())!.match(ISO_TIME)![0];

        await expect(
            page.locator(hiddenIn(BASIC)),
            "the form carries that time in a form a server can read",
        ).toHaveValue(held);
    });
});

/**
 * The color input took a `name` and dropped it. Its default description is the color as written, so what the form
 * carries is compared with that text rather than with a color spelled out here.
 */
test("a color input sends its color as written", async ({ page }) => {
    const BASIC = docsDemo(COLOR_DOCS, "Basic");

    await openDocs(page, "/color-input/docs", BASIC);

    const written = await page.locator(`${BASIC} button[aria-haspopup="dialog"]`).evaluate((element) =>
        (element.getAttribute("aria-describedby") ?? "")
            .split(" ")
            .filter(Boolean)
            .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
            .join(" "),
    );

    expect(written, "the field states its color").not.toBe("");
    await expect(page.locator(hiddenIn(BASIC))).toHaveValue(written);
});

import { type Locator, type Page, expect, test } from "@playwright/test";

import { accessibleText, docsDemo, docsSettled, inlineStyle, inputValue, prop } from "./helpers";

const DOCS = "/src/App/Pages/ProgressPage/Docs";

const bar = (name: string) => `${docsDemo(DOCS, name)} [role="progressbar"]`;
const METER = `${docsDemo(DOCS, "DiskMeter")} [role="meter"]`;

const offsetWidth = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetWidth);

const knob = (page: Page, key: string) => page.locator(`${prop(key)} input`);

/** Replaces what a field holds, the way a person does: click in, select everything, type over it. */
const typeOver = async (page: Page, key: string, text: string) => {
    await knob(page, key).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(text);
    await page.keyboard.press("Tab");
};

test.beforeEach(async ({ page }) => {
    await page.goto("/progress/docs");
    await expect(page.locator(bar("Basic"))).toBeVisible();
    await docsSettled(page);
});

/**
 * Basic's Value knob is the bar's value, so what ARIA reports is compared against the knob rather than against a
 * number written here; the range is the library's default of 0 to 1, which the page states in its knob's hint.
 */
test("a determinate bar carries its value and both ends of its range", async ({ page }) => {
    const value = await inputValue(knob(page, "value"));

    expect(
        Number(await page.locator(bar("Basic")).getAttribute("aria-valuenow")),
        "a value reaches aria-valuenow",
    ).toBe(Number(value));
    await expect(page.locator(bar("Basic")), "with both ends of the range").toHaveAttribute("aria-valuemin", "0");
    await expect(page.locator(bar("Basic")), "stated explicitly").toHaveAttribute("aria-valuemax", "1");
    await expect(page.locator(bar("Basic")), "and a name of its own").toHaveAttribute("aria-label", /\S/);
});

test("a new value reaches ARIA and the painter together", async ({ page }) => {
    const fill = page.locator(`${bar("Basic")} > div > div > div`);
    const before = parseFloat(await inlineStyle(fill, "width"));
    const start = Number(await inputValue(knob(page, "value")));
    const next = start < 0.5 ? "0.9" : "0.1";

    await typeOver(page, "value", next);

    await expect(page.locator(bar("Basic")), "the owner's new value reaches aria-valuenow").toHaveAttribute(
        "aria-valuenow",
        next,
    );

    const after = parseFloat(await inlineStyle(fill, "width"));

    expect(Math.sign(after - before), "and the fill moves the same way the value did").toBe(
        Math.sign(Number(next) - start),
    );
});

test("an absent value is how ARIA spells indeterminate", async ({ page }) => {
    await expect(
        page.locator(bar("Indeterminate")),
        "an absent value omits aria-valuenow, which is how ARIA spells indeterminate",
    ).not.toHaveAttribute("aria-valuenow");
    await expect(page.locator(bar("Indeterminate")), "while the range it would fill is still declared").toHaveAttribute(
        "aria-valuemin",
        "0",
    );
});

/**
 * The upload ticks on a clock, so the bar and the readout under it are read in one evaluation: a tick cannot land
 * between them.
 */
test("a real unit range reaches ARIA unscaled, with a readable text", async ({ page }) => {
    const sample = await page.locator(docsDemo(DOCS, "LiveRange")).evaluate((demo) => {
        const progress = demo.querySelector('[role="progressbar"]')!;

        return {
            max: Number(progress.getAttribute("aria-valuemax")),
            text: progress.getAttribute("aria-valuetext"),
            readout: (demo.querySelector("[data-readout]")?.textContent ?? "").trim(),
        };
    });

    expect(sample.max, "a real unit range reaches ARIA unscaled, not as the default 1").toBeGreaterThan(1);
    expect(sample.text, "and aria-valuetext carries a reading a bare number cannot give").toMatch(/\D/);
    expect(sample.readout, "the same reading the page shows under the bar").toContain(sample.text!);
});

test("a value past the end is clamped for the painter but reported as given", async ({ page }) => {
    expect(
        await inlineStyle(page.locator(`${bar("OutOfRange")} > div > div > div`), "width"),
        "a value past the end reaches the painter as a clamped ratio, drawn full",
    ).toBe("100%");

    const now = Number(await page.locator(bar("OutOfRange")).getAttribute("aria-valuenow"));
    const max = Number(await page.locator(bar("OutOfRange")).getAttribute("aria-valuemax"));

    expect(now, "though ARIA still reports what the owner actually said, past the end").toBeGreaterThan(max);
});

test("an errored bar is announced invalid", async ({ page }) => {
    await expect(page.locator(bar("Basic")), "a bar nobody marked errored is not invalid").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );

    await knob(page, "hasError").click();

    await expect(page.locator(bar("Basic")), "an errored bar is announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

/**
 * Basic fills by default and the ring asks for `fit-content`, so each is compared against the box it sits in: the
 * filling bar takes all of it and the fitted one does not.
 */
test("a filling bar takes its container's width and a fitted one does not", async ({ page }) => {
    const fillWidth = await offsetWidth(page.locator(bar("Basic")));
    const fillRoom = await offsetWidth(page.locator(docsDemo(DOCS, "Basic")));
    const fitWidth = await offsetWidth(page.locator(bar("Ring")));
    const fitRoom = await offsetWidth(page.locator(docsDemo(DOCS, "Ring")));

    expect(fillWidth, "the default sizing fills the container").toBe(fillRoom);
    expect(fitWidth, "while fit-content leaves room beside it, so the sizing does something").toBeLessThan(fitRoom);
});

test("a meter is announced as a gauge, with a reading rather than work that will finish", async ({ page }) => {
    await expect(page.locator(METER), "the disk reading carries the meter role").toHaveCount(1);
    await expect(
        page.locator(`${docsDemo(DOCS, "DiskMeter")} [role="progressbar"]`),
        "and nothing in it also claims to be a progress bar",
    ).toHaveCount(0);

    const reading = await page.locator(METER).evaluate((element) => ({
        now: element.getAttribute("aria-valuenow"),
        min: element.getAttribute("aria-valuemin"),
        max: element.getAttribute("aria-valuemax"),
        text: element.getAttribute("aria-valuetext") ?? "",
    }));

    expect(reading.now, "a meter always has a value").not.toBeNull();
    expect(Number(reading.now), "read against both ends of its scale").toBeGreaterThanOrEqual(Number(reading.min));
    expect(Number(reading.now)).toBeLessThanOrEqual(Number(reading.max));
    expect(reading.text, "with the reading spelled out in its own units").toContain(reading.now!);
    expect(reading.text).toContain(reading.max!);
    await expect(page.locator(METER), "and the name both roles require").toHaveAttribute("aria-label", /\S/);
});

test("the ring is the same progress bar, painted round a circle", async ({ page }) => {
    await expect(page.locator(bar("Ring")), "a ring is still one progress bar").toHaveCount(1);
    await expect(page.locator(bar("Ring")), "with a name of its own").toHaveAttribute("aria-label", /\S/);

    const ring = await page.locator(bar("Ring")).evaluate((element) => ({
        max: element.getAttribute("aria-valuemax"),
        text: element.getAttribute("aria-valuetext"),
    }));
    const upload = await page.locator(bar("LiveRange")).evaluate((element) => ({
        max: element.getAttribute("aria-valuemax"),
    }));

    expect(ring.max, "measured in the upload's real units, the same as the bar's").toBe(upload.max);
    expect(ring.text, "and a readable text for them").toMatch(/\D/);
    expect(
        await accessibleText(page.locator(bar("Ring"))),
        "the ring's drawing and its painted percentage are hidden, so a screen reader hears the ARIA reading once",
    ).toBe("");
});

/**
 * The upload loops on a clock, so the ring's value is sampled rather than pinned: it has to move, and at
 * any one moment the percentage painted in the middle has to agree with the value ARIA announces, and the
 * readout under it with the text ARIA reads. All are read in the same evaluation so a tick cannot land between them.
 */
test("the ring follows the upload, and its painted percentage agrees with what ARIA announces", async ({ page }) => {
    const ring = page.locator(bar("Ring"));
    const first = await ring.getAttribute("aria-valuenow");

    await expect
        .poll(() => ring.getAttribute("aria-valuenow"), { message: "the ring's value moves with the upload" })
        .not.toBe(first);

    const sample = await page.locator(docsDemo(DOCS, "Ring")).evaluate((demo) => {
        const element = demo.querySelector('[role="progressbar"]')!;

        return {
            now: Number(element.getAttribute("aria-valuenow")),
            max: Number(element.getAttribute("aria-valuemax")),
            text: element.getAttribute("aria-valuetext") ?? "",
            painted: (element.textContent ?? "").trim(),
            readout: (demo.querySelector("[data-readout]")?.textContent ?? "").trim(),
        };
    });

    expect(sample.painted, "the painted percentage is the announced value's share of the total").toBe(
        `${Math.round((sample.now / sample.max) * 100)}%`,
    );
    expect(sample.readout, "and the readout shows what ARIA reads out").toContain(sample.text);
});

import { expect, test } from "@playwright/test";

import { accessibleText, demo, inlineStyle } from "./helpers";

const bar = (key: string) => `${demo(key)} [role="progressbar"]`;
const METER = `${demo("diskMeter")} [role="meter"]`;

test.beforeEach(async ({ page }) => {
    await page.goto("/progress");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("a determinate bar carries its value and both ends of its range", async ({ page }) => {
    await expect(page.locator(bar("determinate")), "a value reaches aria-valuenow").toHaveAttribute(
        "aria-valuenow",
        "0.4",
    );
    await expect(page.locator(bar("determinate")), "with both ends of the range").toHaveAttribute("aria-valuemin", "0");
    await expect(page.locator(bar("determinate")), "stated explicitly").toHaveAttribute("aria-valuemax", "1");
    await expect(page.locator(bar("determinate")), "and a name of its own").toHaveAttribute(
        "aria-label",
        "Setup progress",
    );
});

test("an absent value is how ARIA spells indeterminate", async ({ page }) => {
    await expect(
        page.locator(bar("indeterminate")),
        "an absent value omits aria-valuenow, which is how ARIA spells indeterminate",
    ).not.toHaveAttribute("aria-valuenow");
    await expect(page.locator(bar("indeterminate")), "while the range it would fill is still declared").toHaveAttribute(
        "aria-valuemin",
        "0",
    );
});

test("a real unit range reaches ARIA unscaled, with a readable text", async ({ page }) => {
    await expect(page.locator(bar("liveRange")), "a real unit range reaches ARIA unscaled").toHaveAttribute(
        "aria-valuemax",
        "2400000",
    );
    await expect(
        page.locator(bar("liveRange")),
        "and aria-valuetext carries the reading a bare number cannot give",
    ).toHaveAttribute("aria-valuetext", /^\d+ of 2400 kB$/);
});

test("a value past the end is clamped for the painter but reported as given", async ({ page }) => {
    expect(
        await inlineStyle(page.locator(`${bar("outOfRange")} > div > div > div`), "width"),
        "a value past the end reaches the painter as a clamped ratio, not as 5",
    ).toBe("100%");
    await expect(
        page.locator(bar("outOfRange")),
        "though ARIA still reports what the owner actually said",
    ).toHaveAttribute("aria-valuenow", "5");
});

test("an errored bar is announced invalid", async ({ page }) => {
    await expect(page.locator(bar("errored")), "an errored bar is announced invalid").toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

test("the filling variant is wider than the fit-content one", async ({ page }) => {
    const fitWidth = await page.locator(bar("determinate")).evaluate((element) => (element as HTMLElement).offsetWidth);
    const fillWidth = await page
        .locator(bar("fillingContainer"))
        .evaluate((element) => (element as HTMLElement).offsetWidth);

    expect(fillWidth > fitWidth, "the fill sizing is wider than fit-content, so the variant does something").toBe(true);
});

test("a meter is announced as a gauge, with a reading rather than work that will finish", async ({ page }) => {
    await expect(page.locator(METER), "the disk reading carries the meter role").toHaveCount(1);
    await expect(
        page.locator(`${demo("diskMeter")} [role="progressbar"]`),
        "and nothing in it also claims to be a progress bar",
    ).toHaveCount(0);
    await expect(page.locator(METER), "a meter always has a value").toHaveAttribute("aria-valuenow", "412");
    await expect(page.locator(METER), "read against both ends of its scale").toHaveAttribute("aria-valuemin", "0");
    await expect(page.locator(METER)).toHaveAttribute("aria-valuemax", "512");
    await expect(page.locator(METER), "with the reading spelled out in its own units").toHaveAttribute(
        "aria-valuetext",
        "412 of 512 GB used",
    );
    await expect(page.locator(METER), "and the name both roles require").toHaveAttribute("aria-label", "Disk usage");
});

test("the ring is the same progress bar, painted round a circle", async ({ page }) => {
    await expect(page.locator(bar("ring")), "a ring is still one progress bar").toHaveCount(1);
    await expect(page.locator(bar("ring")), "with a name of its own").toHaveAttribute(
        "aria-label",
        "Upload, drawn as a ring",
    );
    await expect(page.locator(bar("ring")), "measured in the upload's real units").toHaveAttribute(
        "aria-valuemax",
        "2400000",
    );
    await expect(page.locator(bar("ring")), "and a readable text for them").toHaveAttribute(
        "aria-valuetext",
        /^\d+ of 2400 kB$/,
    );
    expect(
        await accessibleText(page.locator(bar("ring"))),
        "the ring's drawing and its painted percentage are hidden, so a screen reader hears the ARIA reading once",
    ).toBe("");
});

/**
 * The upload loops on a clock, so the ring's value is sampled rather than pinned: it has to move, and at
 * any one moment the percentage painted in the middle has to agree with the value ARIA announces. Both are
 * read in the same evaluation so a tick cannot land between them.
 */
test("the ring follows the upload, and its painted percentage agrees with what ARIA announces", async ({ page }) => {
    const ring = page.locator(bar("ring"));
    const first = await ring.getAttribute("aria-valuenow");

    await expect
        .poll(() => ring.getAttribute("aria-valuenow"), { message: "the ring's value moves with the upload" })
        .not.toBe(first);

    const sample = await ring.evaluate((element) => ({
        now: Number(element.getAttribute("aria-valuenow")),
        max: Number(element.getAttribute("aria-valuemax")),
        painted: (element.textContent ?? "").trim(),
    }));

    expect(sample.painted, "the painted percentage is the announced value's share of the total").toBe(
        `${Math.round((sample.now / sample.max) * 100)}%`,
    );
});

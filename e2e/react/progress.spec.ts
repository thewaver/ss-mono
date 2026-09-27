import { expect, test } from "@playwright/test";

import { accessibleText, inlineStyle } from "../helpers";

/**
 * The React `Progress`. The cases follow `e2e/progress.spec.ts`, which covers the Solid one: the value and range
 * reach ARIA as given, an absent value is indeterminate, the painter is handed a clamped ratio, and a meter always
 * carries a reading. The Playground's ring and its styled track are furniture, so the painter here is a bare bar that
 * prints its own percentage.
 */
const BAR = '[role="progressbar"]';
const METER = '[role="meter"]';

test("a determinate bar carries its value and both ends of its range", async ({ mount }) => {
    const component = await mount("Essentials/Progress/Determinate");

    await expect(component.locator(BAR), "a value reaches aria-valuenow").toHaveAttribute("aria-valuenow", "0.4");
    await expect(component.locator(BAR), "with both ends of the range").toHaveAttribute("aria-valuemin", "0");
    await expect(component.locator(BAR), "stated explicitly").toHaveAttribute("aria-valuemax", "1");
    await expect(component.locator(BAR), "and a name of its own").toHaveAttribute("aria-label", "Setup progress");
});

test("an absent value is how ARIA spells indeterminate", async ({ mount }) => {
    const component = await mount("Essentials/Progress/Indeterminate");

    await expect(component.locator(BAR)).not.toHaveAttribute("aria-valuenow");
    await expect(component.locator(BAR), "while the range it would fill is still declared").toHaveAttribute(
        "aria-valuemin",
        "0",
    );
    await expect(component.getByTestId("painted"), "and the painter is told there is no ratio").toHaveText("working");
});

test("a real unit range reaches ARIA unscaled, with a readable text", async ({ mount }) => {
    const component = await mount("Essentials/Progress/LiveRange");

    await expect(component.locator(BAR)).toHaveAttribute("aria-valuemax", "2400000");
    await expect(component.locator(BAR)).toHaveAttribute("aria-valuetext", /^\d+ of 2400 kB$/);
});

test("a value past the end is clamped for the painter but reported as given", async ({ mount }) => {
    const component = await mount("Essentials/Progress/OutOfRange");

    expect(await inlineStyle(component.getByTestId("fill"), "width")).toBe("100%");
    await expect(component.locator(BAR)).toHaveAttribute("aria-valuenow", "5");
});

test("an errored bar is announced invalid", async ({ mount }) => {
    const component = await mount("Essentials/Progress/Errored");

    await expect(component.locator(BAR)).toHaveAttribute("aria-invalid", "true");

    const plain = await mount("Essentials/Progress/Determinate");

    await expect(plain.locator(BAR), "and a bar without an error is not").not.toHaveAttribute("aria-invalid");
});

test("the filling variant is wider than the fit-content one", async ({ mount }) => {
    const component = await mount("Essentials/Progress/Sizings");

    const fitWidth = await component.locator("#fit").evaluate((element) => (element as HTMLElement).offsetWidth);
    const fillWidth = await component.locator("#fill").evaluate((element) => (element as HTMLElement).offsetWidth);

    expect(fillWidth > fitWidth).toBe(true);
});

test("a meter is announced as a gauge, with a reading rather than work that will finish", async ({ mount }) => {
    const component = await mount("Essentials/Progress/DiskMeter");

    await expect(component.locator(METER)).toHaveCount(1);
    await expect(component.locator(BAR), "and nothing in it also claims to be a progress bar").toHaveCount(0);
    await expect(component.locator(METER)).toHaveAttribute("aria-valuenow", "412");
    await expect(component.locator(METER)).toHaveAttribute("aria-valuemin", "0");
    await expect(component.locator(METER)).toHaveAttribute("aria-valuemax", "512");
    await expect(component.locator(METER)).toHaveAttribute("aria-valuetext", "412 of 512 GB used");
    await expect(component.locator(METER)).toHaveAttribute("aria-label", "Disk usage");
});

test("a bar named by another element points at it", async ({ mount }) => {
    const component = await mount("Essentials/Progress/Labelled");

    await expect(component.locator(BAR)).toHaveAttribute("aria-labelledby", "caption");
    await expect(component.locator(BAR)).not.toHaveAttribute("aria-label");
});

test("a live bar follows its value, and its painted percentage agrees with what ARIA announces", async ({ mount }) => {
    const component = await mount("Essentials/Progress/LiveRange");
    const bar = component.locator(BAR);
    const first = await bar.getAttribute("aria-valuenow");

    await expect.poll(() => bar.getAttribute("aria-valuenow")).not.toBe(first);

    const sample = await bar.evaluate((element) => ({
        now: Number(element.getAttribute("aria-valuenow")),
        max: Number(element.getAttribute("aria-valuemax")),
        painted: element.querySelector('[data-testid="painted"]')?.textContent ?? "",
    }));

    expect(sample.painted).toBe(`${Math.round((sample.now / sample.max) * 100)}%`);
    expect(await accessibleText(bar), "the painted percentage is hidden, so the ARIA reading is heard once").toBe("");
});

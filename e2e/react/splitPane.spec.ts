import { type Locator, type Page, expect, test } from "@playwright/test";

import { inlineStyle } from "../helpers";

/**
 * The React `SplitPane`. The cases follow `e2e/splitPane.spec.ts` and the `SplitPane` half of
 * `e2e/rightToLeft.spec.ts`, which cover the Solid one: the split is one grid template built from the ratios, a gutter
 * is a separator carrying a value, the keyboard and the pointer both move it, and a drag stops where the pixel bounds
 * do. Enter's collapse and restore, Home and End, and a press that steps rather than drags are recorded in
 * `decisions.md` rather than in the Solid spec, and are pinned here as well.
 */
const STORY = "Essentials/SplitPane/Default";
const ROOT = '[role="group"]';
const GUTTER = '[role="separator"]';
const OVERSHOOT_PX = 2000;
const DRAG_PX = 60;

const ratiosReadout = async (page: Page) =>
    ((await page.locator('[data-readout="ratios"]').textContent()) ?? "").trim();

const box = async (locator: Locator) => {
    const rect = (await locator.boundingBox())!;

    return { ...rect, centerX: rect.x + rect.width * 0.5, centerY: rect.y + rect.height * 0.5 };
};

const paneWidths = (page: Page) =>
    page.locator(ROOT).evaluate((element) =>
        Array.from(element.children)
            .filter((child) => child.tagName === "DIV")
            .map((child) => (child as HTMLElement).offsetWidth),
    );

const drag = async (page: Page, index: number, dx: number) => {
    const handle = await box(page.locator(GUTTER).nth(index));

    await page.mouse.move(handle.centerX, handle.centerY);
    await page.mouse.down();
    await page.mouse.move(handle.centerX + dx, handle.centerY, { steps: 10 });
    await page.mouse.up();
};

test("the split is a grid template built from the ratios", async ({ page, mount }) => {
    await mount(STORY);

    const template = await inlineStyle(page.locator(ROOT), "grid-template-columns");

    expect(template, "the ratio becomes a share of the container minus its gutters").toContain("30%");
    expect(template, "and the gutter is a fixed track between the panes").toContain("8px");

    await mount(STORY, { preset: "stacked" });

    expect(await inlineStyle(page.locator(ROOT), "grid-template-rows"), "the other axis writes rows").not.toBe("");
    expect(await inlineStyle(page.locator(ROOT), "grid-template-columns"), "and nothing on the other").toBe("");
});

test("a bounded pane is a clamp around its share", async ({ page, mount }) => {
    await mount(STORY, { preset: "bounded" });

    const template = await inlineStyle(page.locator(ROOT), "grid-template-columns");

    expect(template).toContain("clamp(120px");
    expect(template).toContain("220px");
});

test("a gutter is a separator with a value, and arrows move it", async ({ page, mount }) => {
    await mount(STORY);

    const first = page.locator(GUTTER);

    await expect(first).toHaveAttribute("aria-orientation", "vertical");
    await expect(first).toHaveAttribute("aria-valuenow", "30");
    await expect(first).toHaveAttribute("aria-valuemin", "0");
    await expect(first).toHaveAttribute("aria-valuemax", "100");
    await expect(first, "it names the pane it resizes").toHaveAttribute("aria-controls", "split-pair-start");
    await expect(first).toHaveAttribute("aria-label", "Resize navigation");

    await first.focus();
    await page.keyboard.press("ArrowRight");

    expect(await ratiosReadout(page), "an arrow moves the boundary by a step").toContain("ratios: 32% / 68%");

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(await ratiosReadout(page), "and back the other way").toContain("ratios: 28% / 72%");
});

test("a stacked split takes the other pair of arrows", async ({ page, mount }) => {
    await mount(STORY, { preset: "stacked" });

    const first = page.locator(GUTTER);

    await expect(first).toHaveAttribute("aria-orientation", "horizontal");

    await first.focus();
    await page.keyboard.press("ArrowRight");
    expect(await ratiosReadout(page), "the cross-axis arrows do nothing").toContain("ratios: 40% / 60%");

    await page.keyboard.press("ArrowDown");
    expect(await ratiosReadout(page), "and its own axis moves it").toContain("ratios: 42% / 58%");
});

test("a gutter moves its two neighbors and leaves the rest alone", async ({ page, mount }) => {
    await mount(STORY, { preset: "triple" });

    await expect(page.locator(GUTTER)).toHaveCount(2);

    await page.locator(GUTTER).first().focus();
    await page.keyboard.press("ArrowRight");

    expect(await ratiosReadout(page)).toContain("ratios: 27% / 48% / 25%");
});

test("a disabled split is out of the tab order and refuses the keyboard", async ({ page, mount }) => {
    await mount(STORY, { isDisabled: true });

    const first = page.locator(GUTTER);

    await expect(first).toHaveAttribute("aria-disabled", "true");
    await expect(first).toHaveAttribute("tabindex", "-1");

    await first.evaluate((element) => (element as HTMLElement).focus());
    await page.keyboard.press("ArrowRight");
    expect(await ratiosReadout(page)).toContain("ratios: 30% / 70%");
});

test("minimums that cannot fit overflow rather than shrink", async ({ page, mount }) => {
    await mount(STORY, { preset: "cramped" });

    const overflow = await page.locator(ROOT).evaluate((element) => ({
        content: element.scrollWidth,
        box: element.clientWidth,
    }));

    expect(overflow.content).toBeGreaterThan(overflow.box);
});

test("a drag stops where the pixel bounds do, rather than writing past them", async ({ page, mount }) => {
    const tracks = () =>
        page.locator(ROOT).evaluate((element) => ({
            box: (element as HTMLElement).offsetWidth,
            sum: Array.from(element.children).reduce((total, child) => total + (child as HTMLElement).offsetWidth, 0),
            panes: Array.from(element.children)
                .filter((child) => child.tagName === "DIV")
                .map((child) => (child as HTMLElement).offsetWidth),
        }));

    await mount(STORY, { preset: "triple" });
    await drag(page, 1, -OVERSHOOT_PX);

    const triple = await tracks();

    expect(triple.panes[1], "the middle pane stops on its 80px floor").toBe(80);
    expect(triple.sum, "and the tracks still add up to the container").toBe(triple.box);

    await mount(STORY, { preset: "bounded" });
    await drag(page, 0, OVERSHOOT_PX);

    const bounded = await tracks();

    expect(bounded.panes[1], "a drag the other way stops on the neighbor's floor instead").toBe(160);
    expect(bounded.sum).toBe(bounded.box);
});

test("the gutter reports a drag to its painter while it lasts", async ({ page, mount }) => {
    await mount(STORY);

    const handle = await box(page.locator(GUTTER));

    await page.mouse.move(handle.centerX, handle.centerY);
    await page.mouse.down();
    await expect(page.locator("[data-dragging]")).toHaveAttribute("data-dragging", "true");
    await page.mouse.up();
    await expect(page.locator("[data-dragging]")).toHaveAttribute("data-dragging", "false");
});

test("a press that does not drag steps the boundary toward the half it landed on", async ({ page, mount }) => {
    await mount(STORY);

    const handle = await box(page.locator(GUTTER));

    await page.mouse.click(handle.x + 1, handle.centerY);
    expect(await ratiosReadout(page), "a press on the leading half steps back").toContain("ratios: 28% / 72%");

    const moved = await box(page.locator(GUTTER));

    await page.mouse.click(moved.x + moved.width - 1, moved.centerY);
    expect(await ratiosReadout(page), "and one on the trailing half steps on").toContain("ratios: 30% / 70%");
});

test("Home and End send the boundary to either end", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(GUTTER).focus();
    await page.keyboard.press("End");
    expect(await ratiosReadout(page)).toContain("ratios: 100% / 0%");

    await page.keyboard.press("Home");
    expect(await ratiosReadout(page)).toContain("ratios: 0% / 100%");
});

test("Enter collapses the pane before the gutter and a second Enter restores it", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(GUTTER).focus();
    await page.keyboard.press("Enter");
    expect(await ratiosReadout(page), "collapsed").toContain("ratios: 0% / 100%");

    await page.keyboard.press("Enter");
    expect(await ratiosReadout(page), "and back where it was").toContain("ratios: 30% / 70%");
});

test("a collapse is forgotten once the boundary moves, whoever moves it", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(GUTTER).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    expect(await ratiosReadout(page), "an arrow after the collapse forgot it, so Enter collapses again").toContain(
        "ratios: 0% / 100%",
    );

    await page.getByTestId("reset").click();
    expect(await ratiosReadout(page), "the consumer writes an even split").toContain("ratios: 50% / 50%");

    await page.locator(GUTTER).focus();
    await page.keyboard.press("Enter");
    expect(await ratiosReadout(page), "the consumer's own write counts too").toContain("ratios: 0% / 100%");
});

test.describe("in a right-to-left box", () => {
    test("the first pane sits on the right, and ArrowLeft grows it", async ({ page, mount }) => {
        await mount(STORY, { preset: "rtl" });

        const first = page.locator(`${ROOT} > div`).first();
        const second = page.locator(`${ROOT} > div`).last();

        expect((await box(first)).centerX).toBeGreaterThan((await box(second)).centerX);

        const boundary = async () => Number(await page.locator(GUTTER).getAttribute("aria-valuenow"));
        const startBoundary = await boundary();
        const [startFirst] = await paneWidths(page);

        await page.locator(GUTTER).focus();
        await page.keyboard.press("ArrowLeft");

        await expect.poll(boundary).toBeGreaterThan(startBoundary);
        expect((await paneWidths(page))[0]).toBeGreaterThan(startFirst);

        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");

        await expect.poll(boundary).toBeLessThan(startBoundary);
        expect((await paneWidths(page))[0]).toBeLessThan(startFirst);
    });

    test("a drag moves the divider the way the pointer went", async ({ page, mount }) => {
        await mount(STORY, { preset: "rtl" });

        const before = await box(page.locator(GUTTER));
        const [startFirst] = await paneWidths(page);

        await drag(page, 0, -DRAG_PX);

        expect((await box(page.locator(GUTTER))).centerX).toBeLessThan(before.centerX);
        expect((await paneWidths(page))[0]).toBeGreaterThan(startFirst);
    });
});

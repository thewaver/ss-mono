import { type Page, expect, test } from "@playwright/test";

import { example, prop, readout } from "./helpers";

/**
 * The component's whole job is arithmetic over a window, so nothing here pins a pixel. Every check is a
 * relationship: a block's share of the width against the span its own accessible name states, one lane
 * against the next, a window after a gesture against the window before it. The times in the page's data may
 * be rewritten tomorrow and none of these should go red for it.
 *
 * The window is read back from the page's readout rather than from anything private, which is also the only
 * thing a visitor can see, and the blocks are read as a list because that is what the component builds — the
 * ticks are one decorative layer with `aria-hidden` on it and are never part of a count.
 */
const MEETINGS = example("meetings");
const TRACKS = example("tracks");
const BLOCK = `${MEETINGS} li [role="button"]`;

const SETTLE_MS = 150;

type Block = {
    label: string;
    left: number;
    width: number;
    top: number;
};

const readBlocks = (page: Page, scope: string) =>
    page.evaluate((value) => {
        const items = [...document.querySelectorAll(`${value} li`)] as HTMLElement[];

        return items.map((item) => ({
            label: item.querySelector("[role='button']")?.getAttribute("aria-label") ?? "",
            left: Number.parseFloat(item.style.left),
            width: Number.parseFloat(item.style.width),
            top: Number.parseFloat(item.style.top),
        }));
    }, scope);

const blockNamed = async (page: Page, name: string, scope = MEETINGS) =>
    (await readBlocks(page, scope)).find((block) => block.label.startsWith(name))!;

/** "Standup, 9:00 to 9:15, Kitchen" — the times the page put in the name are what the geometry is checked against. */
const spanOf = (block: Block) => {
    const [from, to] = (block.label.match(/\d+:\d\d/g) ?? []).map((clock) => {
        const [hour, minute] = clock.split(":").map(Number);

        return hour * 60 + minute;
    });

    return to - from;
};

/** The readout says "showing 8:00 to 19:00"; a window is the pair of numbers in it, in the page's own unit. */
const readWindow = async (page: Page, key: string) => {
    const [from, to] = ((await readout(page, key)).match(/\d+:\d\d/g) ?? []).map((clock) => {
        const [first, second] = clock.split(":").map(Number);

        return first * 60 + second;
    });

    return { from, to, extent: to - from };
};

/** The readout is written in whole minutes, so two windows of the same width can read a minute apart. */
const ROUNDING = 1;

/** The component's own root, which is the element the gestures are on: the one holding the list of blocks. */
const surface = (scope: string) => `${scope} [data-demo] div:has(> ul)`;

const dragFrom = async (page: Page, at: { x: number; y: number }, byX: number) => {
    await page.mouse.move(at.x, at.y);
    await page.mouse.down();
    await page.mouse.move(at.x + byX, at.y, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(SETTLE_MS);
};

const dragSurface = async (page: Page, scope: string, byX: number) => {
    const box = (await page.locator(surface(scope)).first().boundingBox())!;

    await dragFrom(page, { x: box.x + box.width / 2, y: box.y + box.height - 4 }, byX);
};

test.beforeEach(async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.locator(BLOCK).first()).toBeVisible();
});

/**
 * A block's left and width are shares of the window, written as percentages, so two blocks in the same
 * window can be compared against the spans their names state without anything knowing the pixel width.
 */
test("a block is as wide a share of the window as its span is of the time on screen", async ({ page }) => {
    const blocks = await readBlocks(page, MEETINGS);
    const window = await readWindow(page, "meetings");
    const longest = blocks.reduce((widest, block) => (spanOf(block) > spanOf(widest) ? block : widest));
    const shortest = blocks.reduce((thinnest, block) => (spanOf(block) < spanOf(thinnest) ? block : thinnest));

    expect(longest.width / shortest.width, "the ratio of the widths is the ratio of the two spans").toBeCloseTo(
        spanOf(longest) / spanOf(shortest),
        1,
    );
    expect(shortest.width, "and a span is its share of the window, in percent").toBeCloseTo(
        (spanOf(shortest) / window.extent) * 100,
        1,
    );
});

test("blocks that overlap in time are given lanes of their own, and ones that do not share a lane", async ({
    page,
}) => {
    const standup = await blockNamed(page, "Standup");
    const review = await blockNamed(page, "Design review");
    const interview = await blockNamed(page, "Interview");

    expect(standup.top, "the standup ends before the review starts, so both sit in the first lane").toBe(review.top);
    expect(interview.top, "the interview runs across the review, so it is pushed to the next one").toBeGreaterThan(
        review.top,
    );
});

/**
 * The other example hands the component a lane per item instead of letting it pack them, which is the same
 * placement arithmetic reading a different answer — so the check is that every clip of one track shares a
 * top and that the tracks come out in the order the page listed them.
 */
test("a consumer that names the lanes gets those lanes rather than packed ones", async ({ page }) => {
    const blocks = await readBlocks(page, TRACKS);
    const tops = (name: string) => blocks.filter((block) => block.label.includes(name)).map((block) => block.top);
    const video = tops("Video");
    const audio = tops("Audio");

    expect(new Set(video).size, "every clip on a track sits at the same height").toBe(1);
    expect(new Set(audio).size).toBe(1);
    expect(audio[0], "and the tracks are stacked in the order the page named them").toBeGreaterThan(video[0]);
});

test("the arrows walk the blocks in time order, whatever order the page listed them in", async ({ page }) => {
    await page.keyboard.press("Tab");
    await page.locator(BLOCK).first().focus();

    const first = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

    await page.keyboard.press("ArrowRight");

    const second = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

    expect(first, "the first stop is the earliest block").toContain("Standup");
    expect(second, "and the next one is the block that starts after it").toContain("Design review");
});

test("a block the page marked as off limits is stepped over rather than landed on", async ({ page }) => {
    const cancelled = page.locator(`${MEETINGS} [aria-label*="Budget"]`);

    await expect(cancelled, "it says so rather than going missing").toHaveAttribute("aria-disabled", "true");

    await page.locator(`${MEETINGS} [aria-label*="Retro"]`).focus();
    await page.keyboard.press("ArrowRight");

    expect(
        await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? ""),
        "the walk goes past it to the next one that will take a press",
    ).toContain("Handover");
});

/**
 * Walking off the edge of the window is the case that decides whether the keyboard is usable at all: the
 * block being walked to has to be brought into view, or focus lands on something nobody can see.
 */
test("walking to a block that is off screen brings the window to it", async ({ page }) => {
    await page.locator(`${prop("minTickGap")} input`).fill("24");

    const box = (await page.locator(surface(MEETINGS)).first().boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 4);

    for (let notch = 0; notch < 6; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "meetings");

    await page.locator(BLOCK).first().focus();
    await page.keyboard.press("Home");
    await page.waitForTimeout(SETTLE_MS);

    const home = await readWindow(page, "meetings");

    await page.keyboard.press("End");
    await page.waitForTimeout(SETTLE_MS);

    const end = await readWindow(page, "meetings");
    const last = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

    expect(zoomed.extent, "the wheel narrowed the window").toBeLessThan(660);
    expect(Math.abs(end.extent - zoomed.extent), "which is still the width it was after the jump").toBeLessThanOrEqual(
        ROUNDING,
    );
    expect(end.to, "the window has moved on to reach the last block").toBeGreaterThan(home.to);
    expect(last).toContain("Handover");
});

test("the wheel zooms about the pointer and a drag moves the window without resizing it", async ({ page }) => {
    const before = await readWindow(page, "meetings");
    const box = (await page.locator(surface(MEETINGS)).first().boundingBox())!;

    await page.mouse.move(box.x + box.width / 4, box.y + box.height - 4);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "meetings");

    expect(zoomed.extent, "the window is narrower than it was").toBeLessThan(before.extent);

    await dragSurface(page, MEETINGS, -80);

    const dragged = await readWindow(page, "meetings");

    expect(
        Math.abs(dragged.extent - zoomed.extent),
        "a drag changes where the window is and not how wide",
    ).toBeLessThanOrEqual(ROUNDING);
    expect(dragged.from, "and dragging to the left moves it later in the day").toBeGreaterThan(zoomed.from);
});

test("a button that resets the window puts it back exactly", async ({ page }) => {
    const before = await readWindow(page, "tracks");

    await page.locator(`${TRACKS} [data-demo] button`, { hasText: "Zoom in" }).first().click();
    await page.waitForTimeout(SETTLE_MS);

    await page.locator(`${TRACKS} [data-demo] button`, { hasText: "Whole reel" }).first().click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "tracks")).extent).toBe(before.extent);
});

/**
 * The gestures belong to the component now, and this is the case that decides whether that was worth doing:
 * a press and a drag start identically, so the only thing separating "pick this block" from "move the
 * window" is how far the pointer travelled before it came up.
 */
test("a press on a block picks it and a drag from the same block moves the window instead", async ({ page }) => {
    const surfaceBox = (await page.locator(surface(MEETINGS)).first().boundingBox())!;

    await page.mouse.move(surfaceBox.x + surfaceBox.width / 2, surfaceBox.y + surfaceBox.height - 4);

    for (let notch = 0; notch < 4; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);

    const block = page.locator(`${MEETINGS} [aria-label*="Pairing"]`);
    const box = (await block.boundingBox())!;
    const middle = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const before = await readWindow(page, "meetings");

    await dragFrom(page, middle, -60);

    const dragged = await readWindow(page, "meetings");

    expect(dragged.from, "the drag moved the window").toBeGreaterThan(before.from);
    await expect(page.locator(prop("picked")), "and picked nothing on the way").toContainText("nothing yet");

    await block.click();

    await expect(page.locator(prop("picked")), "a press that stays put still picks it").toContainText("Pairing");
});

test("the buttons pan as well as zoom, which is the route for anyone who cannot drag", async ({ page }) => {
    const before = await readWindow(page, "tracks");

    await page.locator(`${TRACKS} [data-demo] button`, { hasText: "Zoom in" }).first().click();
    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "tracks");

    expect(zoomed.extent, "zooming in shows less of the reel").toBeLessThan(before.extent);

    await page.locator(`${TRACKS} [data-demo] button`, { hasText: "Later" }).first().click();
    await page.waitForTimeout(SETTLE_MS);

    const panned = await readWindow(page, "tracks");

    expect(panned.from, "and later moves the window on without resizing it").toBeGreaterThan(zoomed.from);
    expect(Math.abs(panned.extent - zoomed.extent)).toBeLessThanOrEqual(ROUNDING);
});

test("the gestures can be switched off, and the buttons still work when they are", async ({ page }) => {
    await page.locator(`${prop("isPannable")} input`).uncheck();
    await page.locator(`${prop("isZoomable")} input`).uncheck();
    await page.waitForTimeout(SETTLE_MS);

    const before = await readWindow(page, "tracks");
    const box = (await page.locator(surface(TRACKS)).first().boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 4);
    await page.mouse.wheel(0, -300);
    await dragSurface(page, TRACKS, -80);

    const after = await readWindow(page, "tracks");

    expect(after, "neither the wheel nor the drag reaches it").toEqual(before);

    await page.locator(`${TRACKS} [data-demo] button`, { hasText: "Zoom in" }).first().click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "tracks")).extent, "the controller is untouched by the switch").toBeLessThan(
        before.extent,
    );
});

test("a press reports the block it landed on", async ({ page }) => {
    await page.locator(`${MEETINGS} [aria-label*="Pairing"]`).click();

    await expect(page.locator(prop("picked")), "the page is told which one, not that something happened").toContainText(
        "Pairing",
    );
});

test("a disabled timeline is out of the tab order and refuses the keyboard", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).check();
    await page.waitForTimeout(SETTLE_MS);

    const before = await readWindow(page, "meetings");

    await expect(page.locator(BLOCK).first()).toHaveAttribute("aria-disabled", "true");
    expect(
        await page
            .locator(BLOCK)
            .first()
            .evaluate((element) => (element as HTMLElement).tabIndex),
        "nothing in it is a tab stop",
    ).toBe(-1);

    await page.locator(`${MEETINGS} [data-demo]`).press("End");
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "meetings")).from, "and the keyboard moves nothing").toBe(before.from);
});

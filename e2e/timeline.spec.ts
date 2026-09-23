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

/** The "Three tracks" row of buttons, found by the ids the page gave them rather than by what they say. */
const TRACKS_PLAY = "#tracksPlay";
const TRACKS_PAUSE = "#tracksPause";
const TRACKS_LATER = "#tracksLater";
const TRACKS_ZOOM_IN = "#tracksZoomIn";
const TRACKS_WHOLE_REEL = "#tracksWholeReel";

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

    await dragFrom(page, { x: box.x + box.width * 0.5, y: box.y + box.height - 4 }, byX);
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
    const canceled = page.locator(`${MEETINGS} [aria-label*="Budget"]`);

    await expect(canceled, "it says so rather than going missing").toHaveAttribute("aria-disabled", "true");

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
    const box = (await page.locator(surface(MEETINGS)).first().boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height - 4);

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

    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height - 4);
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

    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    await page.locator(TRACKS_WHOLE_REEL).click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "tracks")).extent).toBe(before.extent);
});

/**
 * The gestures belong to the component now, and this is the case that decides whether that was worth doing:
 * a press and a drag start identically, so the only thing separating "pick this block" from "move the
 * window" is how far the pointer traveled before it came up.
 */
test("a press on a block picks it and a drag from the same block moves the window instead", async ({ page }) => {
    const surfaceBox = (await page.locator(surface(MEETINGS)).first().boundingBox())!;

    await page.mouse.move(surfaceBox.x + surfaceBox.width * 0.5, surfaceBox.y + surfaceBox.height - 4);

    for (let notch = 0; notch < 4; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);

    const block = page.locator(`${MEETINGS} [aria-label*="Pairing"]`);
    const box = (await block.boundingBox())!;
    const middle = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
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

    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "tracks");

    expect(zoomed.extent, "zooming in shows less of the reel").toBeLessThan(before.extent);

    await page.locator(TRACKS_LATER).click();
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

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height - 4);
    await page.mouse.wheel(0, -300);
    await dragSurface(page, TRACKS, -80);

    const after = await readWindow(page, "tracks");

    expect(after, "neither the wheel nor the drag reaches it").toEqual(before);

    await page.locator(TRACKS_ZOOM_IN).click();
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

/**
 * Markers are paint on a layer of their own, placed by the value the page names. The layer carries
 * `aria-hidden` like the ticks and comes after the list, so a marker is read as the ratio the component wrote
 * on its wrapper — the same share-of-the-window unit the blocks use — and whether the page's painter drew
 * anything inside it, which is where the "is it in view" flag shows: this page's painter draws only while
 * the flag says the marker is on screen.
 */
const TRIM = example("trim");
const MARKER = (scope: string) => `${surface(scope)} > ul ~ div[aria-hidden="true"] > div`;

type Marker = {
    left: number;
    isPainted: boolean;
};

const readMarkers = (page: Page, scope: string): Promise<Marker[]> =>
    page.evaluate(
        (selector) =>
            ([...document.querySelectorAll(selector)] as HTMLElement[]).map((marker) => ({
                left: Number.parseFloat(marker.style.left),
                isPainted: marker.childElementCount > 0,
            })),
        MARKER(scope),
    );

const playhead = async (page: Page) => (await readMarkers(page, TRACKS))[0];

/** The time a marker stands for, worked back from where it was drawn and the window the readout names. */
const markerTime = async (page: Page) => {
    const window = await readWindow(page, "tracks");

    return window.from + ((await playhead(page)).left / 100) * window.extent;
};

const playFor = async (page: Page, seconds: number) => {
    await page.locator(TRACKS_PLAY).click();
    await expect.poll(() => markerTime(page), { message: "the playhead sets off" }).toBeGreaterThan(seconds);
    await page.locator(TRACKS_PAUSE).click();
};

/**
 * Where a marker sits inside a block, as a share of the block: the same after any zoom or pan that keeps
 * both on screen.
 */
const shareOfBlock = (marker: Marker, block: Block) => (marker.left - block.left) / block.width;

const markerClientX = (page: Page, scope: string) =>
    page.evaluate((selector) => document.querySelector(selector)!.getBoundingClientRect().left, MARKER(scope));

test("the playhead moves while the page plays and stands still when it pauses", async ({ page }) => {
    const start = await playhead(page);

    await page.locator(TRACKS_PLAY).click();
    await expect
        .poll(async () => (await playhead(page)).left, { message: "Play moves the marker on" })
        .toBeGreaterThan(start.left);

    await page.locator(TRACKS_PAUSE).click();

    const paused = await playhead(page);

    await page.waitForTimeout(SETTLE_MS * 3);

    expect((await playhead(page)).left, "and Pause leaves it where it was").toBe(paused.left);
});

/**
 * The thing a marker promises is that it means a time, not a spot on the screen: zoom in about it and move
 * the window, and it has to stay at the same point inside the clip it is crossing while its own position
 * across the box changes.
 */
test("the playhead keeps its place among the clips when the window is zoomed and moved", async ({ page }) => {
    await playFor(page, 3);

    const coldOpen = () => blockNamed(page, "Cold open", TRACKS);
    const before = await playhead(page);
    const share = shareOfBlock(before, await coldOpen());
    const box = (await page.locator(surface(TRACKS)).first().boundingBox())!;

    await page.mouse.move(await markerClientX(page, TRACKS), box.y + box.height - 4);

    for (let notch = 0; notch < 10; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await playhead(page);

    expect(zoomed.isPainted, "it is still on screen after zooming in about it").toBe(true);
    expect(zoomed.left, "its place across the box has changed").not.toBeCloseTo(before.left, 1);
    expect(shareOfBlock(zoomed, await coldOpen()), "but not its place in the clip").toBeCloseTo(share, 3);

    await dragSurface(page, TRACKS, 30);

    const panned = await playhead(page);

    expect(panned.left, "dragging to the right moves the window earlier, so the marker further across").toBeGreaterThan(
        zoomed.left,
    );
    expect(shareOfBlock(panned, await coldOpen()), "and it is still at the same point in the clip").toBeCloseTo(
        share,
        3,
    );
});

/**
 * A marker the window has moved away from is not dropped: the component still hands it over, placed outside
 * the box and flagged, and this page's painter answers the flag by drawing nothing.
 */
test("a marker outside the window is still handed over, flagged, and the painter draws nothing for it", async ({
    page,
}) => {
    await playFor(page, 3);
    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    const window = await readWindow(page, "tracks");
    const away = await readMarkers(page, TRACKS);

    expect(window.from, "zooming in about the middle has left the playhead behind").toBeGreaterThan(
        await markerTime(page),
    );
    expect(away.length, "the marker is still in the layer").toBe(1);
    expect(away[0].left, "placed before the start of the box").toBeLessThan(0);
    expect(away[0].isPainted, "and the painter was told it is out of view").toBe(false);

    await page.locator(TRACKS_WHOLE_REEL).click();
    await page.waitForTimeout(SETTLE_MS);

    const back = await playhead(page);

    expect(back.isPainted, "bringing it back into the window draws it again").toBe(true);
    expect(back.left).toBeGreaterThanOrEqual(0);
});

/**
 * The day example's marker is the clock on this computer, so the clock is fixed for the test: at half past
 * twelve it stands halfway through lunch, and before the day shown starts it is handed over flagged.
 */
test("a marker is placed by the time it names, and one before the day shown is flagged", async ({ page }) => {
    await page.clock.setFixedTime(new Date(2026, 0, 5, 12, 30));
    await page.reload();
    await expect(page.locator(BLOCK).first()).toBeVisible();

    const [now] = await readMarkers(page, MEETINGS);

    expect(now.isPainted, "half past twelve is inside the day").toBe(true);
    expect(shareOfBlock(now, await blockNamed(page, "Lunch")), "and it is halfway through lunch").toBeCloseTo(0.5, 2);

    await page.clock.setFixedTime(new Date(2026, 0, 5, 7, 0));
    await page.reload();
    await expect(page.locator(BLOCK).first()).toBeVisible();

    const [early] = await readMarkers(page, MEETINGS);

    expect(early.left, "seven o'clock is before the window").toBeLessThan(0);
    expect(early.isPainted, "so the painter is told, and draws nothing").toBe(false);
});

/**
 * The trim example turns edges on. Its spans are read from the blocks' accessible names — "Interview, Video,
 * 0:22 to 1:36" — which is what a screen reader hears and what the page rewrites when it is told of a change,
 * and the readout is read only for whether the page has been told anything at all.
 */
const trimBlock = (name: string) => `${TRIM} [role="button"][aria-label^="${name}"]`;

const toSeconds = (clock: string) => {
    const [minute, second] = clock.split(":").map(Number);

    return minute * 60 + second;
};

const trimSpan = async (page: Page, name: string) => {
    const [from, to] = ((await page.locator(trimBlock(name)).getAttribute("aria-label")) ?? "")
        .match(/\d+:\d\d/g)!
        .map(toSeconds);

    return { from, to };
};

/** The readout names times only once the page has been told of a trim; before that it has none. */
const trimTold = async (page: Page) => (await readout(page, "trim")).match(/\d+:\d\d/g)?.map(toSeconds);

const trimWidth = async (page: Page, name: string) => (await blockNamed(page, name, TRIM)).width;

const focusedLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

const holdByKey = async (page: Page, name: string) => {
    await page.locator(trimBlock(name)).focus();
    await page.keyboard.press("Enter");
};

test("Enter takes hold of a clip's end rather than pressing it, and Space still presses it", async ({ page }) => {
    await expect(page.locator(trimBlock("Interview")), "the hold is described to a screen reader").toHaveAttribute(
        "aria-describedby",
        /.+/,
    );

    const hint = await page.locator(trimBlock("Interview")).getAttribute("aria-describedby");

    await expect(
        page.locator(`${TRIM} [id="${hint}"]`),
        "by an element that is there and says something",
    ).not.toBeEmpty();

    await holdByKey(page, "Interview");
    await page.keyboard.press("Escape");

    await expect(page.locator(prop("picked")), "Enter did not pick the clip").toContainText("nothing yet");

    await page.keyboard.press("Space");

    await expect(page.locator(prop("picked")), "Space still does").toContainText("Interview");
});

/**
 * The held end is drawn at its new place while it is held, and the page hears nothing until the drop — the
 * readout staying bare while the block has already changed is the proof of that.
 */
test("the arrows move the held end a notch at a time, and the drop is what tells the page", async ({ page }) => {
    const before = await trimSpan(page, "Interview");
    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");

    expect(await trimWidth(page, "Interview"), "the block is drawn longer while the end is held").toBeGreaterThan(
        width,
    );
    expect(await trimTold(page), "but the page has not been told yet").toBeUndefined();

    await page.keyboard.press("Enter");

    const once = await trimSpan(page, "Interview");
    const notch = once.to - before.to;

    expect(notch, "the end moved later").toBeGreaterThan(0);
    expect(Number.isInteger(notch), "onto a snapped value").toBe(true);
    expect(once.from, "and the start stayed where it was").toBe(before.from);
    expect(await trimTold(page), "the drop is what the page hears").toEqual([once.from, once.to]);
    expect(await focusedLabel(page), "focus stays on the clip").toContain("Interview");

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");

    expect((await trimSpan(page, "Interview")).to - once.to, "two presses are two notches").toBe(notch * 2);
});

test("Home and End choose which end is held, without walking to another clip", async ({ page }) => {
    const before = await trimSpan(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("Home");

    expect(await focusedLabel(page), "Home switched ends rather than going to the first clip").toContain("Interview");

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");

    const started = await trimSpan(page, "Interview");

    expect(started.from, "the start moved earlier").toBeLessThan(before.from);
    expect(started.to, "and the end did not").toBe(before.to);

    await page.keyboard.press("Enter");
    await page.keyboard.press("Home");
    await page.keyboard.press("End");

    expect(await focusedLabel(page), "End switched back rather than going to the last clip").toContain("Interview");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    const ended = await trimSpan(page, "Interview");

    expect(ended.to, "the end moved later").toBeGreaterThan(started.to);
    expect(ended.from, "and the start stayed where the first drop left it").toBe(started.from);
});

test("Escape puts the held end back as it was", async ({ page }) => {
    const before = await trimSpan(page, "Interview");
    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");

    expect(await trimWidth(page, "Interview"), "the block is its old length again").toBe(width);
    expect(await trimSpan(page, "Interview"), "its name still gives the old times").toEqual(before);
    expect(await trimTold(page), "and the page was never told").toBeUndefined();
    expect(await focusedLabel(page), "focus stays where it was").toContain("Interview");
});

/**
 * `Tab` is never taken by a hold: pressing it leaves the timeline as it always does, and leaving while
 * holding lets go of the end rather than dropping it somewhere nobody is looking.
 */
test("Tab still leaves while an end is held, and leaving puts the end back", async ({ page }) => {
    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => document.querySelector(selector)!.contains(document.activeElement), TRIM),
        "focus has left the example",
    ).toBe(false);
    expect(await trimWidth(page, "Interview"), "the block is back to its old length").toBe(width);
    expect(await trimTold(page), "and nothing was dropped").toBeUndefined();
});

/** A strip is aria-hidden paint over each end of an editable block, the start's first and the end's second. */
const edgeStrip = (name: string, edge: "start" | "end") =>
    `${TRIM} li:has([aria-label^="${name}"]) > [aria-hidden="true"] >> nth=${edge === "start" ? 0 : 1}`;

/**
 * Every other edge in this example is shared with the next clip, and there the next clip's strip lies over
 * this one's, so the opening clip's start is used: nothing else is at the beginning of the reel on its lane.
 * The window is zoomed first so that a pan is possible at all, which is what makes "the press did not pan"
 * worth checking.
 */
const zoomTrimAtStart = async (page: Page) => {
    const box = (await page.locator(surface(TRIM)).first().boundingBox())!;

    await page.mouse.move(box.x + 2, box.y + box.height - 4);

    for (let notch = 0; notch < 3; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);
};

const stripPoint = async (page: Page, name: string, edge: "start" | "end") => {
    const box = (await page.locator(edgeStrip(name, edge)).boundingBox())!;

    return { x: box.x + box.width * 0.75, y: box.y + box.height * 0.5 };
};

test("dragging a clip's end strip changes its span and leaves the window where it was", async ({ page }) => {
    await zoomTrimAtStart(page);

    const before = await trimSpan(page, "Cold open");
    const interview = await blockNamed(page, "Interview", TRIM);

    await dragFrom(page, await stripPoint(page, "Cold open", "start"), 60);

    const after = await trimSpan(page, "Cold open");

    expect(after.from, "the start was dragged later").toBeGreaterThan(before.from);
    expect(after.to, "and the end stayed put").toBe(before.to);
    expect(await trimTold(page), "the page was told on the release").toEqual([after.from, after.to]);
    expect(
        (await blockNamed(page, "Interview", TRIM)).left,
        "the press on the strip was not also a drag of the window",
    ).toBeCloseTo(interview.left, 3);
});

/**
 * The single-pointer route 2.5.7 Dragging Movements asks for: a press on a strip that never travels picks
 * the end up, and the next press puts it down where it lands — without that second press also pressing the
 * clip underneath it.
 */
test("a press on an end strip picks the end up and the next press puts it down", async ({ page }) => {
    const before = await trimSpan(page, "Cold open");
    const from = await stripPoint(page, "Cold open", "start");

    await page.mouse.click(from.x, from.y);

    expect(await focusedLabel(page), "the clip whose end is held takes focus").toContain("Cold open");
    expect(await trimTold(page), "nothing has changed yet").toBeUndefined();

    await page.mouse.move(from.x + 30, from.y, { steps: 4 });
    await page.mouse.click(from.x + 60, from.y);
    await page.waitForTimeout(SETTLE_MS);

    const after = await trimSpan(page, "Cold open");

    expect(after.from, "the second press put the start down later").toBeGreaterThan(before.from);
    expect(after.to).toBe(before.to);
    await expect(page.locator(prop("picked")), "and did not press the clip it landed on").toContainText("nothing yet");
});

test("dragging a clip's body still moves the window, and trims nothing", async ({ page }) => {
    await zoomTrimAtStart(page);

    const before = await readBlocks(page, TRIM);
    const roomTone = page.locator(trimBlock("Room tone"));
    const box = (await roomTone.boundingBox())!;

    await dragFrom(page, { x: box.x + box.width * 0.3, y: box.y + box.height * 0.5 }, -60);

    const after = await readBlocks(page, TRIM);
    const shift = (name: string) =>
        after.find((block) => block.label.startsWith(name))!.left -
        before.find((block) => block.label.startsWith(name))!.left;

    expect(shift("Interview"), "dragging to the left moves every clip left").toBeLessThan(0);
    expect(shift("Theme"), "by the same amount").toBeCloseTo(shift("Interview"), 3);
    expect(await trimTold(page), "and no span was changed").toBeUndefined();
});

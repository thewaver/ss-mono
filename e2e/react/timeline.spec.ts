import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Timeline`, over the React `InteractionWrapper`, `CarrierReactUtils` and the shared `TimelineUtils` — the
 * window arithmetic, the key map, the pan and pinch tracker and the edge zone the Solid timeline runs on too. The
 * cases follow `e2e/timeline.spec.ts`, which covers the Solid one, so the two frameworks are held to the same
 * behavior, and like it nothing here pins a pixel: every check is a relationship between a block's share of the
 * width and the span its own name states, one lane and the next, or a window before and after a gesture.
 *
 * The stories are the Playground's three examples rebuilt without its styling. The meetings story holds the window
 * itself and prints it; the tracks story prints the window it reads through the controller's `subscribe`, which is
 * the React controller's promise; the trim story turns the edges on. The gesture switches are mount props rather
 * than a panel.
 */
const MEETINGS = "Exotics/Timeline/Meetings";
const TRACKS = "Exotics/Timeline/Tracks";
const TRIM = "Exotics/Timeline/Trim";

const scopeOf = (key: string) => `[data-testid="${key}"]`;
const BLOCK = `${scopeOf("meetings")} li [role="button"]`;
const PICKED = '[data-readout="picked"]';

const TRACKS_PLAY = "#tracksPlay";
const TRACKS_PAUSE = "#tracksPause";
const TRACKS_LATER = "#tracksLater";
const TRACKS_ZOOM_IN = "#tracksZoomIn";
const TRACKS_WHOLE_REEL = "#tracksWholeReel";

const SETTLE_MS = 150;
const ROUNDING = 1;

type Block = { label: string; left: number; width: number; top: number };

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`).innerText();

const readBlocks = (page: Page, key: string): Promise<Block[]> =>
    page.evaluate((scope) => {
        const items = [...document.querySelectorAll(`${scope} li`)] as HTMLElement[];

        return items.map((item) => ({
            label: item.querySelector("[role='button']")?.getAttribute("aria-label") ?? "",
            left: Number.parseFloat(item.style.left),
            width: Number.parseFloat(item.style.width),
            top: Number.parseFloat(item.style.top),
        }));
    }, scopeOf(key));

const blockNamed = async (page: Page, name: string, key = "meetings") =>
    (await readBlocks(page, key)).find((block) => block.label.startsWith(name))!;

const toUnits = (clock: string) => {
    const [first, second] = clock.split(":").map(Number);

    return first * 60 + second;
};

const spanOf = (block: Block) => {
    const [from, to] = (block.label.match(/\d+:\d\d/g) ?? []).map(toUnits);

    return to - from;
};

const readWindow = async (page: Page, key: string) => {
    const [from, to] = ((await readout(page, key)).match(/\d+:\d\d/g) ?? []).map(toUnits);

    return { from, to, extent: to - from };
};

/** The component's own root, which is the element the gestures are on: the one holding the list of blocks. */
const surface = (key: string) => `${scopeOf(key)} [data-demo] div:has(> ul)`;

const dragFrom = async (page: Page, at: { x: number; y: number }, byX: number) => {
    await page.mouse.move(at.x, at.y);
    await page.mouse.down();
    await page.mouse.move(at.x + byX, at.y, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(SETTLE_MS);
};

const dragSurface = async (page: Page, key: string, byX: number) => {
    const box = (await page.locator(surface(key)).first().boundingBox())!;

    await dragFrom(page, { x: box.x + box.width * 0.5, y: box.y + box.height - 4 }, byX);
};

const wheelOver = async (page: Page, key: string, xRatio: number, notches: number) => {
    const box = (await page.locator(surface(key)).first().boundingBox())!;

    await page.mouse.move(box.x + box.width * xRatio, box.y + box.height - 4);

    for (let notch = 0; notch < notches; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);
};

const activeLabel = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? "");

test("a block is as wide a share of the window as its span is of the time on screen", async ({ page, mount }) => {
    await mount(MEETINGS);

    const blocks = await readBlocks(page, "meetings");
    const window = await readWindow(page, "meetings");
    const longest = blocks.reduce((widest, block) => (spanOf(block) > spanOf(widest) ? block : widest));
    const shortest = blocks.reduce((thinnest, block) => (spanOf(block) < spanOf(thinnest) ? block : thinnest));

    expect(longest.width / shortest.width).toBeCloseTo(spanOf(longest) / spanOf(shortest), 1);
    expect(shortest.width).toBeCloseTo((spanOf(shortest) / window.extent) * 100, 1);
});

test("blocks that overlap in time are given lanes of their own, and ones that do not share a lane", async ({
    page,
    mount,
}) => {
    await mount(MEETINGS);

    const standup = await blockNamed(page, "Standup");
    const review = await blockNamed(page, "Design review");
    const interview = await blockNamed(page, "Interview");

    expect(standup.top).toBe(review.top);
    expect(interview.top).toBeGreaterThan(review.top);
});

test("a consumer that names the lanes gets those lanes rather than packed ones", async ({ page, mount }) => {
    await mount(TRACKS);

    const blocks = await readBlocks(page, "tracks");
    const tops = (name: string) => blocks.filter((block) => block.label.includes(name)).map((block) => block.top);

    expect(new Set(tops("Video")).size).toBe(1);
    expect(new Set(tops("Audio")).size).toBe(1);
    expect(tops("Audio")[0]).toBeGreaterThan(tops("Video")[0]);
});

test("each block says where it sits among all of them, not only among those on screen", async ({ page, mount }) => {
    await mount(MEETINGS);

    const first = page.locator(`${scopeOf("meetings")} li`).first();

    await expect(first).toHaveAttribute("aria-posinset", "1");
    await expect(first).toHaveAttribute("aria-setsize", "10");
});

test("the arrows walk the blocks in time order, whatever order the page listed them in", async ({ page, mount }) => {
    await mount(MEETINGS);
    await page.locator(BLOCK).first().focus();

    const first = await activeLabel(page);

    await page.keyboard.press("ArrowRight");

    expect(first).toContain("Standup");
    expect(await activeLabel(page)).toContain("Design review");
});

test("the timeline is one tab stop", async ({ page, mount }) => {
    await mount(MEETINGS);

    const stops = await page
        .locator(BLOCK)
        .evaluateAll((elements) => elements.filter((element) => (element as HTMLElement).tabIndex === 0).length);

    expect(stops).toBe(1);
});

test("a block the page marked as off limits is stepped over rather than landed on", async ({ page, mount }) => {
    await mount(MEETINGS);

    await expect(page.locator(`${scopeOf("meetings")} [aria-label*="Budget"]`)).toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator(`${scopeOf("meetings")} [aria-label*="Retro"]`).focus();
    await page.keyboard.press("ArrowRight");

    expect(await activeLabel(page)).toContain("Handover");
});

test("walking to a block that is off screen brings the window to it", async ({ page, mount }) => {
    await mount(MEETINGS);
    await wheelOver(page, "meetings", 0.5, 6);

    const zoomed = await readWindow(page, "meetings");

    await page.locator(BLOCK).first().focus();
    await page.keyboard.press("Home");
    await page.waitForTimeout(SETTLE_MS);

    const home = await readWindow(page, "meetings");

    await page.keyboard.press("End");
    await page.waitForTimeout(SETTLE_MS);

    const end = await readWindow(page, "meetings");

    expect(zoomed.extent, "the wheel narrowed the window").toBeLessThan(660);
    expect(Math.abs(end.extent - zoomed.extent)).toBeLessThanOrEqual(ROUNDING);
    expect(end.to, "the window has moved on to reach the last block").toBeGreaterThan(home.to);
    expect(await activeLabel(page), "and focus is on it").toContain("Handover");
});

test("the wheel zooms about the pointer and a drag moves the window without resizing it", async ({ page, mount }) => {
    await mount(MEETINGS);

    const before = await readWindow(page, "meetings");
    const box = (await page.locator(surface("meetings")).first().boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height - 4);
    await page.mouse.wheel(0, -300);
    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "meetings");

    expect(zoomed.extent).toBeLessThan(before.extent);

    await dragSurface(page, "meetings", -80);

    const dragged = await readWindow(page, "meetings");

    expect(Math.abs(dragged.extent - zoomed.extent)).toBeLessThanOrEqual(ROUNDING);
    expect(dragged.from).toBeGreaterThan(zoomed.from);
});

test("the wheel over the timeline zooms it rather than scrolling the page", async ({ page, mount }) => {
    await mount(MEETINGS);
    await page.evaluate(() => {
        document.body.style.height = "4000px";
    });

    const before = await page.evaluate(() => window.scrollY);

    await wheelOver(page, "meetings", 0.5, 3);

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
});

test("a button that resets the window puts it back exactly", async ({ page, mount }) => {
    await mount(TRACKS);

    const before = await readWindow(page, "tracks");

    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);
    await page.locator(TRACKS_WHOLE_REEL).click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "tracks")).extent).toBe(before.extent);
});

test("a press on a block picks it and a drag from the same block moves the window instead", async ({ page, mount }) => {
    await mount(MEETINGS);
    await wheelOver(page, "meetings", 0.5, 4);

    const block = page.locator(`${scopeOf("meetings")} [aria-label*="Pairing"]`);
    const box = (await block.boundingBox())!;
    const before = await readWindow(page, "meetings");

    await dragFrom(page, { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 }, -60);

    expect((await readWindow(page, "meetings")).from).toBeGreaterThan(before.from);
    await expect(page.locator(PICKED), "and picked nothing on the way").toHaveText("nothing yet");

    await block.click();

    await expect(page.locator(PICKED), "a press that stays put still picks it").toHaveText("Pairing");
});

test("the controller pans as well as zooms, and its subscribers hear both", async ({ page, mount }) => {
    await mount(TRACKS);

    const before = await readWindow(page, "tracks");

    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await readWindow(page, "tracks");

    expect(zoomed.extent, "the readout follows getView through subscribe").toBeLessThan(before.extent);

    await page.locator(TRACKS_LATER).click();
    await page.waitForTimeout(SETTLE_MS);

    const panned = await readWindow(page, "tracks");

    expect(panned.from).toBeGreaterThan(zoomed.from);
    expect(Math.abs(panned.extent - zoomed.extent)).toBeLessThanOrEqual(ROUNDING);
});

test("the gestures can be switched off, and the controller still works when they are", async ({ page, mount }) => {
    await mount(TRACKS, { isPannable: false, isZoomable: false });

    const before = await readWindow(page, "tracks");

    await wheelOver(page, "tracks", 0.5, 3);
    await dragSurface(page, "tracks", -80);

    expect(await readWindow(page, "tracks"), "neither the wheel nor the drag reaches it").toEqual(before);

    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "tracks")).extent).toBeLessThan(before.extent);
});

test("a press reports the block it landed on", async ({ page, mount }) => {
    await mount(MEETINGS);
    await page.locator(`${scopeOf("meetings")} [aria-label*="Pairing"]`).click();

    await expect(page.locator(PICKED)).toHaveText("Pairing");
});

test("a disabled timeline is out of the tab order and refuses the keyboard", async ({ page, mount }) => {
    await mount(MEETINGS, { isDisabled: true });

    const before = await readWindow(page, "meetings");

    await expect(page.locator(BLOCK).first()).toHaveAttribute("aria-disabled", "true");
    expect(
        await page
            .locator(BLOCK)
            .first()
            .evaluate((element) => (element as HTMLElement).tabIndex),
    ).toBe(-1);

    await page.locator(`${scopeOf("meetings")} [data-demo]`).press("End");
    await page.waitForTimeout(SETTLE_MS);

    expect((await readWindow(page, "meetings")).from).toBe(before.from);
});

const MARKER = (key: string) => `${surface(key)} > ul ~ div[aria-hidden="true"] > div`;

type Marker = { left: number; isPainted: boolean };

const readMarkers = (page: Page, key: string): Promise<Marker[]> =>
    page.evaluate(
        (selector) =>
            ([...document.querySelectorAll(selector)] as HTMLElement[]).map((marker) => ({
                left: Number.parseFloat(marker.style.left),
                isPainted: marker.childElementCount > 0,
            })),
        MARKER(key),
    );

const playhead = async (page: Page) => (await readMarkers(page, "tracks"))[0];

const markerTime = async (page: Page) => {
    const window = await readWindow(page, "tracks");

    return window.from + ((await playhead(page)).left / 100) * window.extent;
};

const playFor = async (page: Page, seconds: number) => {
    await page.locator(TRACKS_PLAY).click();
    await expect.poll(() => markerTime(page)).toBeGreaterThan(seconds);
    await page.locator(TRACKS_PAUSE).click();
};

const shareOfBlock = (marker: Marker, block: Block) => (marker.left - block.left) / block.width;

test("the playhead moves while the page plays and stands still when it pauses", async ({ page, mount }) => {
    await mount(TRACKS);

    const start = await playhead(page);

    await page.locator(TRACKS_PLAY).click();
    await expect.poll(async () => (await playhead(page)).left).toBeGreaterThan(start.left);
    await page.locator(TRACKS_PAUSE).click();

    const paused = await playhead(page);

    await page.waitForTimeout(SETTLE_MS * 3);

    expect((await playhead(page)).left).toBe(paused.left);
});

test("the playhead keeps its place among the clips when the window is zoomed and moved", async ({ page, mount }) => {
    await mount(TRACKS);
    await playFor(page, 3);

    const coldOpen = () => blockNamed(page, "Cold open", "tracks");
    const before = await playhead(page);
    const share = shareOfBlock(before, await coldOpen());
    const box = (await page.locator(surface("tracks")).first().boundingBox())!;
    const markerX = await page.evaluate(
        (selector) => document.querySelector(selector)!.getBoundingClientRect().left,
        MARKER("tracks"),
    );

    await page.mouse.move(markerX, box.y + box.height - 4);

    for (let notch = 0; notch < 10; notch++) await page.mouse.wheel(0, -100);

    await page.waitForTimeout(SETTLE_MS);

    const zoomed = await playhead(page);

    expect(zoomed.isPainted).toBe(true);
    expect(zoomed.left).not.toBeCloseTo(before.left, 1);
    expect(shareOfBlock(zoomed, await coldOpen())).toBeCloseTo(share, 3);

    await dragSurface(page, "tracks", 30);

    const panned = await playhead(page);

    expect(panned.left).toBeGreaterThan(zoomed.left);
    expect(shareOfBlock(panned, await coldOpen())).toBeCloseTo(share, 3);
});

test("a marker outside the window is still handed over, flagged, and the painter draws nothing for it", async ({
    page,
    mount,
}) => {
    await mount(TRACKS);
    await playFor(page, 3);
    await page.locator(TRACKS_ZOOM_IN).click();
    await page.waitForTimeout(SETTLE_MS);

    const window = await readWindow(page, "tracks");
    const away = await readMarkers(page, "tracks");

    expect(window.from).toBeGreaterThan(await markerTime(page));
    expect(away.length).toBe(1);
    expect(away[0].left).toBeLessThan(0);
    expect(away[0].isPainted).toBe(false);

    await page.locator(TRACKS_WHOLE_REEL).click();
    await page.waitForTimeout(SETTLE_MS);

    const back = await playhead(page);

    expect(back.isPainted).toBe(true);
    expect(back.left).toBeGreaterThanOrEqual(0);
});

test("a marker is placed by the time it names, and one before the day shown is flagged", async ({ page, mount }) => {
    await page.clock.setFixedTime(new Date(2026, 0, 5, 12, 30));
    await mount(MEETINGS);

    const [now] = await readMarkers(page, "meetings");

    expect(now.isPainted).toBe(true);
    expect(shareOfBlock(now, await blockNamed(page, "Lunch"))).toBeCloseTo(0.5, 2);

    await page.clock.setFixedTime(new Date(2026, 0, 5, 7, 0));
    await page.reload();
    await mount(MEETINGS);

    const [early] = await readMarkers(page, "meetings");

    expect(early.left).toBeLessThan(0);
    expect(early.isPainted).toBe(false);
});

const trimBlock = (name: string) => `${scopeOf("trim")} [role="button"][aria-label^="${name}"]`;

const trimSpan = async (page: Page, name: string) => {
    const [from, to] = ((await page.locator(trimBlock(name)).getAttribute("aria-label")) ?? "")
        .match(/\d+:\d\d/g)!
        .map(toUnits);

    return { from, to };
};

const trimTold = async (page: Page) => (await readout(page, "trim")).match(/\d+:\d\d/g)?.map(toUnits);

const trimWidth = async (page: Page, name: string) => (await blockNamed(page, name, "trim")).width;

const holdByKey = async (page: Page, name: string) => {
    await page.locator(trimBlock(name)).focus();
    await page.keyboard.press("Enter");
};

test("Enter takes hold of a clip's end rather than pressing it, and Space still presses it", async ({
    page,
    mount,
}) => {
    await mount(TRIM);

    const hint = await page.locator(trimBlock("Interview")).getAttribute("aria-describedby");

    expect(hint, "the hold is described to a screen reader").toBeTruthy();
    await expect(page.locator(`${scopeOf("trim")} [id="${hint}"]`)).not.toBeEmpty();

    await holdByKey(page, "Interview");
    await page.keyboard.press("Escape");

    await expect(page.locator(PICKED), "Enter did not pick the clip").toHaveText("nothing yet");

    await page.keyboard.press("Space");

    await expect(page.locator(PICKED), "Space still does").toHaveText("Interview");
});

test("the arrows move the held end a notch at a time, and the drop is what tells the page", async ({ page, mount }) => {
    await mount(TRIM);

    const before = await trimSpan(page, "Interview");
    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");

    await expect
        .poll(() => trimWidth(page, "Interview"), { message: "drawn longer while held" })
        .toBeGreaterThan(width);
    expect(await trimTold(page), "but the page has not been told yet").toBeUndefined();

    await page.keyboard.press("Enter");

    const once = await trimSpan(page, "Interview");
    const notch = once.to - before.to;

    expect(notch).toBeGreaterThan(0);
    expect(Number.isInteger(notch)).toBe(true);
    expect(once.from).toBe(before.from);
    expect(await trimTold(page)).toEqual([once.from, once.to]);
    expect(await activeLabel(page), "focus stays on the clip").toContain("Interview");

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");

    expect((await trimSpan(page, "Interview")).to - once.to, "two presses are two notches").toBe(notch * 2);
});

test("Home and End choose which end is held, without walking to another clip", async ({ page, mount }) => {
    await mount(TRIM);

    const before = await trimSpan(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("Home");

    expect(await activeLabel(page)).toContain("Interview");

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Enter");

    const started = await trimSpan(page, "Interview");

    expect(started.from).toBeLessThan(before.from);
    expect(started.to).toBe(before.to);

    await page.keyboard.press("Enter");
    await page.keyboard.press("Home");
    await page.keyboard.press("End");

    expect(await activeLabel(page)).toContain("Interview");

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    const ended = await trimSpan(page, "Interview");

    expect(ended.to).toBeGreaterThan(started.to);
    expect(ended.from).toBe(started.from);
});

test("Escape puts the held end back as it was", async ({ page, mount }) => {
    await mount(TRIM);

    const before = await trimSpan(page, "Interview");
    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");

    await expect.poll(() => trimWidth(page, "Interview")).toBe(width);
    expect(await trimSpan(page, "Interview")).toEqual(before);
    expect(await trimTold(page)).toBeUndefined();
    expect(await activeLabel(page)).toContain("Interview");
});

test("Tab still leaves while an end is held, and leaving puts the end back", async ({ page, mount }) => {
    await mount(TRIM);

    const width = await trimWidth(page, "Interview");

    await holdByKey(page, "Interview");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Tab");

    expect(
        await page.evaluate(
            (selector) => document.querySelector(selector)!.contains(document.activeElement),
            scopeOf("trim"),
        ),
        "focus has left the timeline",
    ).toBe(false);
    await expect.poll(() => trimWidth(page, "Interview")).toBe(width);
    expect(await trimTold(page)).toBeUndefined();
});

const edgeStrip = (name: string, edge: "start" | "end") =>
    `${scopeOf("trim")} li:has([aria-label^="${name}"]) > [aria-hidden="true"] >> nth=${edge === "start" ? 0 : 1}`;

const stripPoint = async (page: Page, name: string, edge: "start" | "end") => {
    const box = (await page.locator(edgeStrip(name, edge)).boundingBox())!;

    return { x: box.x + box.width * 0.75, y: box.y + box.height * 0.5 };
};

test("dragging a clip's end strip changes its span and leaves the window where it was", async ({ page, mount }) => {
    await mount(TRIM);
    await wheelOver(page, "trim", 0.0025, 3);

    const before = await trimSpan(page, "Cold open");
    const interview = await blockNamed(page, "Interview", "trim");

    await dragFrom(page, await stripPoint(page, "Cold open", "start"), 60);

    const after = await trimSpan(page, "Cold open");

    expect(after.from).toBeGreaterThan(before.from);
    expect(after.to).toBe(before.to);
    expect(await trimTold(page)).toEqual([after.from, after.to]);
    expect((await blockNamed(page, "Interview", "trim")).left, "the press was not also a pan").toBeCloseTo(
        interview.left,
        3,
    );
});

test("a press on an end strip picks the end up and the next press puts it down", async ({ page, mount }) => {
    await mount(TRIM);

    const before = await trimSpan(page, "Cold open");
    const from = await stripPoint(page, "Cold open", "start");

    await page.mouse.click(from.x, from.y);

    expect(await activeLabel(page), "the clip whose end is held takes focus").toContain("Cold open");
    expect(await trimTold(page)).toBeUndefined();

    await page.mouse.move(from.x + 30, from.y, { steps: 4 });
    await page.mouse.click(from.x + 60, from.y);
    await page.waitForTimeout(SETTLE_MS);

    const after = await trimSpan(page, "Cold open");

    expect(after.from).toBeGreaterThan(before.from);
    expect(after.to).toBe(before.to);
    await expect(page.locator(PICKED), "and did not press the clip it landed on").toHaveText("nothing yet");
});

test("dragging a clip's body still moves the window, and trims nothing", async ({ page, mount }) => {
    await mount(TRIM);
    await wheelOver(page, "trim", 0.0025, 3);

    const before = await readBlocks(page, "trim");
    const box = (await page.locator(trimBlock("Room tone")).boundingBox())!;

    await dragFrom(page, { x: box.x + box.width * 0.3, y: box.y + box.height * 0.5 }, -60);

    const after = await readBlocks(page, "trim");
    const shift = (name: string) =>
        after.find((block) => block.label.startsWith(name))!.left -
        before.find((block) => block.label.startsWith(name))!.left;

    expect(shift("Interview")).toBeLessThan(0);
    expect(shift("Theme")).toBeCloseTo(shift("Interview"), 3);
    expect(await trimTold(page)).toBeUndefined();
});

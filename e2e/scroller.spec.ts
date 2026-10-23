import { type Locator, type Page, expect, test } from "@playwright/test";

import { demo, prop, readout, waitUntilStill } from "./helpers";

const SPLIT = demo("split");
const TABBED = demo("tabbed");

/**
 * The `Scroller` owns one number — how far its track is scrolled — and everything observable about it is a
 * consequence: which button is dead, where a step lands, and whether a focused child was brought into view.
 * Reading that number back is the whole of this suite, and it has to be read in layout space rather than
 * from a client rect, because the Playground scales everything inside its `Viewport`.
 */
const scrollOf = (page: Page, scope: string) =>
    page.evaluate((selector) => {
        const track = [...document.querySelectorAll(`${selector} div`)].find(
            (element) => element.scrollWidth > element.clientWidth,
        );

        return { left: track?.scrollLeft ?? -1, visible: track?.clientWidth ?? 0, total: track?.scrollWidth ?? 0 };
    }, scope);

test.beforeEach(async ({ page }) => {
    await page.goto("/scroller");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("the buttons report the ends rather than wrapping round", async ({ page }) => {
    const buttons = page.locator(`${SPLIT} button`);

    await expect(buttons.first(), "nothing is scrolled off the start yet, so the back button is dead").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(buttons.last(), "but there is more to come, so the forward button is live").not.toHaveAttribute(
        "aria-disabled",
        "true",
    );
});

test("the buttons leave entirely when everything fits", async ({ page }) => {
    const buttons = page.locator(`${SPLIT} button`);
    const itemCount = page.locator(`${prop("itemCount")} input`);

    await expect(buttons, "twelve items overrun the strip, so both buttons are there").toHaveCount(2);

    await itemCount.fill("3");
    await itemCount.press("Enter");

    await expect(buttons, "three fit, so the pair goes rather than sitting there dead").toHaveCount(0);

    await itemCount.fill("30");
    await itemCount.press("Enter");

    await expect(buttons, "and comes back when there is somewhere to go again").toHaveCount(2);
});

test("a step moves the track forward and brings the back button to life", async ({ page }) => {
    const buttons = page.locator(`${SPLIT} button`);
    const before = await scrollOf(page, SPLIT);

    await buttons.last().click();

    await expect
        .poll(async () => (await scrollOf(page, SPLIT)).left, { message: "the track moved forward by about a page" })
        .toBeGreaterThan(before.left + before.visible * 0.5);
    await expect(buttons.first(), "and the back button is no longer dead").not.toHaveAttribute("aria-disabled", "true");
});

/**
 * Waits for a smooth scroll to come to rest, for the cases that need to read where a step landed.
 *
 * It counts animation frames rather than polling on a clock, and will not call it rest inside the first few
 * frames. Both matter: a smooth scroll takes a frame or two to get going, so two equal readings taken
 * straight after the press are two readings of a scroll that has not started, and the caller would go on to
 * measure a track still sitting where it began. Counting frames also means a loaded machine simply waits
 * longer rather than reporting rest early.
 */
const waitForRest = (page: Page, scope: string) =>
    page.evaluate(
        (value) =>
            new Promise<void>((resolve, reject) => {
                const STILL_FRAMES = 2;
                const MIN_FRAMES = 6;
                const LIMIT_MS = 5_000;
                const started = performance.now();

                let previous = -1;
                let frames = 0;
                let stillFor = 0;

                const step = () => {
                    const track = [...document.querySelectorAll(`${value.scope} div`)].find(
                        (element) => element.scrollWidth > element.clientWidth,
                    );
                    const left = track?.scrollLeft ?? -1;

                    stillFor = left === previous ? stillFor + 1 : 0;
                    previous = left;
                    frames++;

                    if (frames >= MIN_FRAMES && stillFor >= STILL_FRAMES) return resolve();

                    if (performance.now() - started > LIMIT_MS) {
                        return reject(new Error("the track was still moving when the wait ran out"));
                    }

                    requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            }),
        { scope },
    );

/**
 * A step glides, and a press made during the glide is measured from where the glide is heading rather than from
 * where the track happens to be, so quick presses go as far as slow ones. Two presses are made back to back, and
 * where they come to rest is compared with two presses made one after the other with a rest in between, on a page
 * loaded afresh between the two — the same two pages either way, with no distance written down.
 */
test("two quick presses go as far as two slow ones", async ({ page }) => {
    const buttons = page.locator(`${SPLIT} button`);

    await buttons.last().click();
    await waitForRest(page, SPLIT);
    await buttons.last().click();
    await waitForRest(page, SPLIT);

    const slow = (await scrollOf(page, SPLIT)).left;

    await page.reload();
    await expect(buttons.last()).toBeVisible();
    expect((await scrollOf(page, SPLIT)).left, "the track starts over at the start").toBe(0);

    await buttons.last().click();
    await buttons.last().click();
    await waitForRest(page, SPLIT);

    expect((await scrollOf(page, SPLIT)).left, "and two quick presses forward land where the slow ones did").toBe(slow);
});

test("stepping to the far end kills the forward button and not the other one", async ({ page }) => {
    const buttons = page.locator(`${SPLIT} button`);

    for (let step = 0; step < 20; step++) {
        if ((await buttons.last().getAttribute("aria-disabled")) === "true") break;

        await buttons.last().click();
        await waitForRest(page, SPLIT);
    }

    await expect(buttons.last(), "there is nothing further to reach").toHaveAttribute("aria-disabled", "true");
    await expect(buttons.first(), "and everything is behind us").not.toHaveAttribute("aria-disabled", "true");
});

/**
 * The position goes both ways, which is the whole of the `*Signal` bargain: the strip reports where it is,
 * and a number written from outside moves it. The page's own field is the second half — a page dots row or a
 * "3 of 12" readout is the consumer this exists for, and neither can be painted from inside the track.
 */
test.describe("the position is the owner's as well as the track's", () => {
    test("reports how far along the strip is as it moves", async ({ page }) => {
        const buttons = page.locator(`${SPLIT} button`);

        expect(await readout(page, "split"), "nothing is scrolled off yet").toContain("0% along");

        await buttons.last().click();
        await waitForRest(page, SPLIT);

        const reported = Number(/(\d+)% along/.exec(await readout(page, "split"))?.[1]);

        expect(reported, `a page forward is some way along, and the readout said ${reported}%`).toBeGreaterThan(0);
    });

    test("a position written from outside scrolls the strip to it", async ({ page }) => {
        const position = page.locator(`${prop("position")} input`);

        await position.fill("100");
        await position.press("Enter");
        await waitForRest(page, SPLIT);

        const { left, visible, total } = await scrollOf(page, SPLIT);

        expect(left, "the whole way along is the end of the track").toBeGreaterThan(total - visible - 2);
        await expect(
            page.locator(`${SPLIT} button`).last(),
            "so the forward button has nothing left to reach",
        ).toHaveAttribute("aria-disabled", "true");

        await position.fill("0");
        await position.press("Enter");
        await waitForRest(page, SPLIT);

        expect((await scrollOf(page, SPLIT)).left, "and zero is back at the start").toBeLessThan(2);
    });
});

test("the arrow keys still belong to whatever is inside, and focus drags the track along", async ({ page }) => {
    await page.locator(`${TABBED} [role="tab"]`).first().focus();

    const before = await scrollOf(page, TABBED);

    for (let step = 0; step < 6; step++) await page.keyboard.press("ArrowRight");

    await expect(page.locator(`${TABBED} [role="tab"]:focus`), "the tab list moved its own focus").toHaveText("July");
    await expect
        .poll(async () => (await scrollOf(page, TABBED)).left, { message: "and the track followed the focus" })
        .toBeGreaterThan(before.left);
});

test("focusing something already in view leaves the track alone", async ({ page }) => {
    await page.locator(`${TABBED} [role="tab"]`).nth(1).focus();

    expect((await scrollOf(page, TABBED)).left, "the second tab is whole already, so there is nothing to reveal").toBe(
        0,
    );
});

test("focusing something cut off by the edge scrolls it whole and no further", async ({ page }) => {
    const tabs = page.locator(`${TABBED} [role="tab"]`);
    const cut = await tabs.evaluateAll((elements) => {
        const track = elements[0].closest("[role='tablist']")!.parentElement!;
        const offsetWithin = (element: HTMLElement) => {
            let offset = 0;
            let node: HTMLElement | null = element;

            while (node && node !== track) {
                offset += node.offsetLeft;
                node = node.offsetParent as HTMLElement | null;
            }

            return offset;
        };

        const boxes = elements.map((element) => ({
            left: offsetWithin(element as HTMLElement),
            width: (element as HTMLElement).offsetWidth,
        }));
        const index = boxes.findIndex((box) => box.left + box.width > track.clientWidth);

        return {
            index,
            ...boxes[index],
            visible: track.clientWidth,
            padding: Number.parseFloat(getComputedStyle(track).paddingBlockStart),
        };
    });

    await tabs.nth(cut.index).focus();

    await expect
        .poll(async () => Math.round((await scrollOf(page, TABBED)).left), {
            message: "the strip stopped the moment the tab fitted, rather than carrying it to the middle",
        })
        .toBe(Math.round(cut.left + cut.width + cut.padding - cut.visible));
});

test("a focused child is never flush against the edge, so its ring has somewhere to paint", async ({ page }) => {
    const tabs = page.locator(`${TABBED} [role="tab"]`);

    await tabs.first().focus();
    for (let step = 0; step < 4; step++) await page.keyboard.press("ArrowRight");

    await expect
        .poll(
            async () =>
                page.evaluate((selector) => {
                    const focused = document.querySelector(`${selector} [role="tab"]:focus`) as HTMLElement;
                    const track = focused.closest("[role='tablist']")!.parentElement!;
                    const gap = track.getBoundingClientRect().right - focused.getBoundingClientRect().right;

                    return Math.round(gap);
                }, TABBED),
            { message: "the focused tab stops short of the track's edge by the room its ring needs" },
        )
        .toBeGreaterThan(0);
});

/**
 * The overlap count is how many items of the view just left stay in view after a step. The knob is set, its own
 * value read back, and the items wholly in view before a step forward are counted again after it: exactly that many
 * of them are still wholly in view. Positions are read in layout space, off the track's own children.
 */
test("a step keeps as many of the items just in view as the overlap count says", async ({ page }) => {
    const knob = page.locator(`${prop("overlapCount")} input`);

    await knob.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("1");
    await page.keyboard.press("Enter");

    const overlapCount = Number(await knob.inputValue());
    const wholeInView = () =>
        page.evaluate((selector) => {
            const track = [...document.querySelectorAll(`${selector} div`)].find(
                (element) => element.scrollWidth > element.clientWidth,
            ) as HTMLElement;

            return [...track.children]
                .map((child, index) => ({ child: child as HTMLElement, index }))
                .filter(
                    ({ child }) =>
                        child.offsetLeft >= track.scrollLeft &&
                        child.offsetLeft + child.offsetWidth <= track.scrollLeft + track.clientWidth,
                )
                .map(({ index }) => index);
        }, SPLIT);

    const before = await wholeInView();

    await page.locator(`${SPLIT} button`).last().click();
    await waitForRest(page, SPLIT);

    const after = await wholeInView();

    expect(
        before.filter((index) => after.includes(index)),
        "the last of the items in view before the step are still in view",
    ).toEqual(before.slice(before.length - overlapCount));
});

/**
 * The drawn bar. Each one is a `role="scrollbar"` whose `aria-controls` names the box it scrolls, so the box is found
 * through the bar rather than by a structural guess, and a bar that names the wrong box fails here first.
 *
 * Inside it is the Playground's painter: a root, the track it handed the library, and the thumb inside the track.
 * The painter is the only one of its kind in each demo, so the two are found by that structure.
 */
const bar = (key: string, orientation?: "horizontal" | "vertical") =>
    `${demo(key)} [role="scrollbar"]${orientation ? `[aria-orientation="${orientation}"]` : ""}`;

const painterOf = (scrollbar: string) => `${scrollbar} > *`;

const trackOf = (scrollbar: string) => `${scrollbar} > * > *`;

const thumbOf = (scrollbar: string) => `${scrollbar} > * > * > *`;

const boxOf = async (page: Page, scrollbar: string) =>
    page.locator(`#${await page.locator(scrollbar).first().getAttribute("aria-controls")}`);

/**
 * A step button found by the grid area the scroller places its group in. The area names are the library's own
 * (`xLeading`, `xTrailing`, `yLeading`, `yTrailing`), so the lookup says which direction a button steps without
 * reading its label.
 */
const stepButton = (key: string, area: "xLeading" | "xTrailing" | "yLeading" | "yTrailing") =>
    `${demo(key)} [style*="grid-area: ${area}"] button`;

/** How far a box is scrolled, as a share of how far it can go on each axis, plus the raw numbers behind it. */
const readBox = (box: Locator) =>
    box.evaluate((element) => {
        const rangeX = element.scrollWidth - element.clientWidth;
        const rangeY = element.scrollHeight - element.clientHeight;

        return {
            left: element.scrollLeft,
            top: element.scrollTop,
            rangeX,
            rangeY,
            visibleX: element.clientWidth,
            visibleY: element.clientHeight,
            ratioX: rangeX > 0 ? element.scrollLeft / rangeX : 0,
            ratioY: rangeY > 0 ? element.scrollTop / rangeY : 0,
        };
    });

const center = (rect: { x: number; y: number; width: number; height: number }) => ({
    x: rect.x + rect.width * 0.5,
    y: rect.y + rect.height * 0.5,
});

/**
 * WCAG 4.1.2: a drawn bar is something a person operates, so it is exposed as a scrollbar with its orientation and
 * value, and it names the box it scrolls. It takes no tab stop — the keyboard scrolls the box itself, as Windows'
 * own bar works — so the value is driven here from the box with the End key, and the bar has to follow it to its
 * maximum, read off the bar rather than written down.
 */
test("a drawn bar is a scrollbar naming the box it scrolls, and its value follows the box", async ({ page }) => {
    const scrollbar = page.locator(bar("verticalStrip"));
    const box = await boxOf(page, bar("verticalStrip"));

    await expect(scrollbar, "the column's bar runs down").toHaveAttribute("aria-orientation", "vertical");
    await expect(box, "and names a box that is there").toHaveCount(1);
    expect((await readBox(box)).rangeY, "and that scrolls down").toBeGreaterThan(0);
    await expect(scrollbar, "the bar takes no tab stop of its own").not.toHaveAttribute("tabindex", /.*/);
    await expect(scrollbar, "nothing is scrolled yet, so it sits at its minimum").toHaveAttribute(
        "aria-valuenow",
        (await scrollbar.getAttribute("aria-valuemin"))!,
    );

    await box.focus();
    await page.keyboard.press("End");

    await expect(scrollbar, "scrolled to the end, the bar reads its maximum").toHaveAttribute(
        "aria-valuenow",
        (await scrollbar.getAttribute("aria-valuemax"))!,
    );
});

/**
 * One box scrolling both ways keeps a bar and a pair of step buttons per direction. Stepping across moves the box
 * across by about a view, as a step does in a strip, and leaves it where it was down, and the other way round; each
 * bar reports only its own direction.
 */
test("a box scrolling both ways has a bar and a pair of steps per direction, each moving only its own", async ({
    page,
}) => {
    const across = page.locator(bar("bothWays", "horizontal"));
    const down = page.locator(bar("bothWays", "vertical"));
    const box = await boxOf(page, bar("bothWays"));

    await expect(across, "there is a bar across").toHaveCount(1);
    await expect(down, "and one down").toHaveCount(1);
    expect(await down.getAttribute("aria-controls"), "and both name the same box").toBe(
        await across.getAttribute("aria-controls"),
    );

    await page.locator(stepButton("bothWays", "xTrailing")).click();
    await waitUntilStill(box);

    const afterAcross = await readBox(box);

    expect(afterAcross.left, "the step across moved the box across by about a view").toBeGreaterThan(
        afterAcross.visibleX * 0.5,
    );
    expect(afterAcross.top, "and not down").toBe(0);
    await expect(across, "the bar across reports it").not.toHaveAttribute("aria-valuenow", "0");
    await expect(down, "and the bar down does not").toHaveAttribute("aria-valuenow", "0");

    await page.locator(stepButton("bothWays", "yTrailing")).click();
    await waitUntilStill(box);

    const afterDown = await readBox(box);

    expect(afterDown.top, "the step down moved the box down by about a view").toBeGreaterThan(afterDown.visibleY * 0.5);
    expect(afterDown.left, "and left it where it was across").toBe(afterAcross.left);
    await expect(down, "and the bar down reports it").not.toHaveAttribute("aria-valuenow", "0");
});

/**
 * Dragging the thumb scrolls the box by the same share of its run as the thumb has moved along its track's free
 * length, and dragging past the track's end stops the box at its end. Both sides are measured in the window's
 * pixels, so the `Viewport` scale cancels out of the share.
 */
test("dragging the thumb scrolls the box by the share of the track it moved", async ({ page }) => {
    const scrollbar = bar("verticalStrip");
    const thumb = page.locator(thumbOf(scrollbar));
    const box = await boxOf(page, scrollbar);

    await thumb.scrollIntoViewIfNeeded();

    const trackRect = (await page.locator(trackOf(scrollbar)).boundingBox())!;
    const thumbRect = (await thumb.boundingBox())!;
    const travel = trackRect.height - thumbRect.height;
    const start = center(thumbRect);

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x, start.y + travel * 0.5, { steps: 10 });

    await expect
        .poll(async () => (await readBox(box)).ratioY, { message: "half the thumb's travel is half the box's run" })
        .toBeCloseTo(0.5, 1);

    await page.mouse.move(start.x, start.y + travel * 2, { steps: 10 });

    await expect
        .poll(
            async () => {
                const { top, rangeY } = await readBox(box);

                return rangeY - top;
            },
            { message: "dragging past the track's end stops the box at its end" },
        )
        .toBeLessThanOrEqual(1);

    await page.mouse.up();

    await expect(page.locator(scrollbar), "and the bar reads its maximum").toHaveAttribute(
        "aria-valuenow",
        (await page.locator(scrollbar).getAttribute("aria-valuemax"))!,
    );
});

/**
 * A press on the track beyond the thumb pages one view toward the press — the same distance the forward step button
 * goes. Both are made on a page loaded afresh, and where they come to rest is compared, with no distance written
 * down. The track's far end is pressed, so a press that jumped to the spot would land at the end instead.
 */
test("a press on the track pages one view toward the press, as a step does", async ({ page }) => {
    const scrollbar = bar("shortTrack");
    const box = await boxOf(page, scrollbar);
    const track = page.locator(trackOf(scrollbar));

    await track.scrollIntoViewIfNeeded();

    const trackRect = (await track.boundingBox())!;

    await page.mouse.click(trackRect.x + trackRect.width - 2, center(trackRect).y);
    await waitUntilStill(box);

    const pressed = await readBox(box);

    expect(pressed.left, "the press moved the box forward").toBeGreaterThan(0);
    expect(pressed.left, "but not all the way to the end").toBeLessThan(pressed.rangeX);

    await page.reload();
    await expect(page.locator(stepButton("shortTrack", "xTrailing"))).toBeVisible();

    const reloadedBox = await boxOf(page, scrollbar);

    await page.locator(stepButton("shortTrack", "xTrailing")).click();
    await waitUntilStill(reloadedBox);

    expect(
        Math.abs((await readBox(reloadedBox)).left - pressed.left),
        "the forward step lands where the track press did",
    ).toBeLessThanOrEqual(1);
});

/**
 * Held down, a press on the track keeps paging, the way a held step button would, until the thumb reaches the
 * pressed spot. The far end is held, and the run is first checked to be longer than one view, so arriving at the end
 * takes more than one page.
 */
test("a press held on the track keeps paging until the thumb reaches it", async ({ page }) => {
    const scrollbar = bar("shortTrack");
    const box = await boxOf(page, scrollbar);
    const track = page.locator(trackOf(scrollbar));

    await track.scrollIntoViewIfNeeded();

    const before = await readBox(box);

    expect(before.rangeX, "the run is longer than one view").toBeGreaterThan(before.visibleX);

    const trackRect = (await track.boundingBox())!;

    await page.mouse.move(trackRect.x + trackRect.width - 2, center(trackRect).y);
    await page.mouse.down();

    await expect
        .poll(
            async () => {
                const { left, rangeX } = await readBox(box);

                return rangeX - left;
            },
            { message: "holding the press pages on until the box reaches the end" },
        )
        .toBeLessThanOrEqual(1);

    await page.mouse.up();
});

/**
 * With Alt held (Option on a Mac), a press on the track jumps instead of paging: the thumb's middle lands on the
 * spot. The track's middle is pressed, which on a straight track is half the box's run whatever the thumb's length.
 */
test("a press on the track with Alt held jumps to the spot", async ({ page }) => {
    const scrollbar = bar("shortTrack");
    const box = await boxOf(page, scrollbar);
    const track = page.locator(trackOf(scrollbar));

    await track.scrollIntoViewIfNeeded();

    const middle = center((await track.boundingBox())!);

    await page.keyboard.down("Alt");
    await page.mouse.click(middle.x, middle.y);
    await page.keyboard.up("Alt");

    await expect
        .poll(async () => (await readBox(box)).ratioX, { message: "the box jumped to half its run" })
        .toBeCloseTo(0.5, 1);
});

/**
 * A fading bar shows while the box scrolls and for the hide delay after the last scroll, then fades, and stays in
 * the page while faded. Its look is the painter's, so the spec reads the mapping: the painter's classes while
 * scrolling differ from its classes at rest, and come back to the resting ones afterwards.
 *
 * The box is scrolled from the keyboard so the pointer never moves over it — a moving pointer also shows the bar.
 * The page records when the box last scrolled and when the painter's classes went back, and the gap between them
 * must be at least the delay the page's own knob holds.
 */
test("a fading bar shows while the box scrolls and fades the hide delay after it stops", async ({ page }) => {
    const scrollbar = bar("overlaidAutoHiding");
    const painter = page.locator(painterOf(scrollbar));
    const box = await boxOf(page, scrollbar);
    const hideDelayMs = Number(await page.locator(`${prop("hideDelayMs")} input`).inputValue());
    const resting = (await painter.getAttribute("class")) ?? "";

    await box.focus();
    await box.evaluate((element, painterSelector) => {
        const record = { lastScrollAt: 0, changes: [] as Array<{ at: number; className: string }> };
        const painterElement = document.querySelector(painterSelector)!;

        (window as unknown as { fadeRecord: typeof record }).fadeRecord = record;

        element.addEventListener("scroll", () => (record.lastScrollAt = performance.now()), { passive: true });
        new MutationObserver(() =>
            record.changes.push({ at: performance.now(), className: painterElement.getAttribute("class") ?? "" }),
        ).observe(painterElement, { attributes: true, attributeFilter: ["class"] });
    }, painterOf(scrollbar));

    await page.keyboard.press("PageDown");

    await expect
        .poll(
            () =>
                page.evaluate(
                    () => (window as unknown as { fadeRecord: { changes: unknown[] } }).fadeRecord.changes.length,
                ),
            {
                message: "scrolling showed the bar, and the delay faded it again",
            },
        )
        .toBeGreaterThanOrEqual(2);

    const record = await page.evaluate(
        () =>
            (
                window as unknown as {
                    fadeRecord: { lastScrollAt: number; changes: Array<{ at: number; className: string }> };
                }
            ).fadeRecord,
    );
    const shown = record.changes[0];
    const faded = record.changes[record.changes.length - 1];

    expect(shown.className, "while scrolling, the painter is not in its resting state").not.toBe(resting);
    expect(faded.className, "afterwards it is back in its resting state").toBe(resting);
    expect(
        faded.at - record.lastScrollAt,
        `and it went back no sooner than the ${hideDelayMs}ms delay after the last scroll`,
    ).toBeGreaterThanOrEqual(hideDelayMs - 1);
    await expect(page.locator(scrollbar), "a faded bar stays in the page").toHaveCount(1);
});

/** Hovering counts from real pointer movement, so moving over the box shows a faded bar and leaving fades it. */
test("a fading bar shows while the pointer moves over the box", async ({ page }) => {
    const scrollbar = bar("overlaidAutoHiding");
    const painter = page.locator(painterOf(scrollbar));
    const box = await boxOf(page, scrollbar);

    await box.scrollIntoViewIfNeeded();

    const resting = (await painter.getAttribute("class")) ?? "";
    const middle = center((await box.boundingBox())!);

    await page.mouse.move(middle.x, middle.y, { steps: 4 });
    await expect(painter, "the pointer over the box shows the bar").not.toHaveAttribute("class", resting);

    await page.mouse.move(0, 0, { steps: 4 });
    await expect(painter, "and leaving fades it").toHaveAttribute("class", resting);
});

/**
 * A kept bar has a strip of its own beside the content and never covers it; an overlaid one floats over the content's
 * edge. The two are the same demo either side of its knob, compared by whether each bar's box meets the scrolling
 * box's — measured in the window's pixels, where the `Viewport` scale applies to both alike.
 */
test("a kept bar sits beside the content, and an overlaid one over its edge", async ({ page }) => {
    const scrollbars = page.locator(bar("bothWays"));
    const box = await boxOf(page, bar("bothWays"));

    const overlaps = async () => {
        const boxRect = (await box.boundingBox())!;
        const bars = await scrollbars.all();

        return Promise.all(
            bars.map(async (scrollbar) => {
                const rect = (await scrollbar.boundingBox())!;

                return (
                    Math.min(rect.x + rect.width, boxRect.x + boxRect.width) - Math.max(rect.x, boxRect.x) > 1 &&
                    Math.min(rect.y + rect.height, boxRect.y + boxRect.height) - Math.max(rect.y, boxRect.y) > 1
                );
            }),
        );
    };

    await box.scrollIntoViewIfNeeded();

    const keptCount = await scrollbars.count();

    expect(keptCount, "the demo scrolls both ways, so it has a bar each way").toBe(2);
    expect(await overlaps(), "kept, neither bar covers the box").toEqual([false, false]);

    await page.locator(`${prop("isBarOverlaid")} input`).check();

    await expect.poll(overlaps, { message: "overlaid, both bars float over the box's edge" }).toEqual([true, true]);
});

/**
 * A curved bar reads the pointer by its angle round the arc, through `computeProgressAtPoint`, not by how far across
 * the bar it is. The arched example's arc is half a circle, so a point a quarter of the way along its length is a
 * quarter of the way round it, and the box has to follow it there; read straight across, the same point sits near
 * the start, at about 15% of the width. The points are taken from the painter's own path, so no geometry is written
 * down here.
 */
test("dragging a curved bar's thumb follows the pointer round the arc", async ({ page }) => {
    const scrollbar = bar("arched");
    const thumb = page.locator(`${trackOf(scrollbar)} > div`);
    const box = await boxOf(page, scrollbar);

    await thumb.scrollIntoViewIfNeeded();

    const pointAlong = (share: number) =>
        page.locator(`${trackOf(scrollbar)} path`).evaluate((element, value) => {
            const path = element as SVGPathElement;
            const point = path.getPointAtLength(path.getTotalLength() * value);
            const matrix = path.getScreenCTM()!;

            return {
                x: matrix.a * point.x + matrix.c * point.y + matrix.e,
                y: matrix.b * point.x + matrix.d * point.y + matrix.f,
            };
        }, share);

    for (const share of [0.25, 0.75]) {
        const from = center((await thumb.boundingBox())!);
        const to = await pointAlong(share);

        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await page.mouse.move(to.x, to.y, { steps: 10 });
        await page.mouse.up();

        await expect
            .poll(async () => (await readBox(box)).ratioX, {
                message: `a point ${share * 100}% of the way round the arc puts the box ${share * 100}% of the way along`,
            })
            .toBeCloseTo(share, 1);
    }
});

/**
 * A drag ends with the browser's click on the element that held the pointer, and a page acting on clicks there would
 * take a finished drag for a press. The scroller swallows exactly that one click, and a press that never moved is
 * still a click. Clicks are counted by a listener on the document, which a click reaches unless something stopped it
 * on the way.
 */
test("the click that ends a drag is swallowed, and a press that never moved still clicks", async ({ page }) => {
    const scrollbar = bar("verticalStrip");
    const thumb = page.locator(thumbOf(scrollbar));

    await thumb.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
        const counter = window as unknown as { clicks: number };

        counter.clicks = 0;
        document.addEventListener("click", () => counter.clicks++);
    });

    const clicks = () => page.evaluate(() => (window as unknown as { clicks: number }).clicks);
    const from = center((await thumb.boundingBox())!);
    const trackRect = (await page.locator(trackOf(scrollbar)).boundingBox())!;

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(from.x, from.y + trackRect.height * 0.25, { steps: 10 });
    await page.mouse.up();

    expect(await clicks(), "the click that ended the drag never arrived").toBe(0);

    const at = center((await thumb.boundingBox())!);

    await page.mouse.move(at.x, at.y);
    await page.mouse.down();
    await page.mouse.up();

    expect(await clicks(), "a press that never moved is a click like any other").toBe(1);
});

import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Scroller`. The cases follow `e2e/scroller.spec.ts`, which covers the Solid one: the strip owns how far
 * its track is scrolled, and everything observable follows from it — which button is dead, where a step lands, what
 * position is reported, and whether a focused child was brought into view. The Playground's `Tabs` is stood in for
 * by a bare roving tab list, since what matters is only that something inside owns the arrow keys.
 */
const CHIPS = "Essentials/Scroller/Chips";
const TABBED = "Essentials/Scroller/Tabbed";
const STRIP = "[data-strip]";

const scrollOf = (page: Page) =>
    page.evaluate((selector) => {
        const track = [...document.querySelectorAll(`${selector} div`)].find(
            (element) => element.scrollWidth > element.clientWidth,
        );

        return { left: track?.scrollLeft ?? -1, visible: track?.clientWidth ?? 0, total: track?.scrollWidth ?? 0 };
    }, STRIP);

/** Waits for a smooth scroll to come to rest, counted in frames and never inside the first few. */
const waitForRest = (page: Page) =>
    page.evaluate(
        (scope) =>
            new Promise<void>((resolve, reject) => {
                const STILL_FRAMES = 2;
                const MIN_FRAMES = 6;
                const LIMIT_MS = 5_000;
                const started = performance.now();

                let previous = -1;
                let frames = 0;
                let stillFor = 0;

                const step = () => {
                    const track = [...document.querySelectorAll(`${scope} div`)].find(
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
        STRIP,
    );

const progressReadout = async (page: Page) =>
    ((await page.locator('[data-readout="progress"]').textContent()) ?? "").trim();

test("the buttons report the ends rather than wrapping round", async ({ page, mount }) => {
    await mount(CHIPS);

    const buttons = page.locator(`${STRIP} button`);

    await expect(buttons.first(), "nothing is scrolled off the start yet").toHaveAttribute("aria-disabled", "true");
    await expect(buttons.last(), "but there is more to come").not.toHaveAttribute("aria-disabled", "true");
});

test("the buttons leave entirely when everything fits", async ({ page, mount }) => {
    await mount(CHIPS);

    const buttons = page.locator(`${STRIP} button`);
    const itemCount = page.getByTestId("itemCount");

    await expect(buttons, "twelve items overrun the strip, so both buttons are there").toHaveCount(2);

    await itemCount.fill("3");

    await expect(buttons, "three fit, so the pair goes rather than sitting there dead").toHaveCount(0);

    await itemCount.fill("30");

    await expect(buttons, "and comes back when there is somewhere to go again").toHaveCount(2);
});

test("the buttons sit where they are placed", async ({ page, mount }) => {
    await mount(CHIPS, { buttonPlacement: "end" });

    const order = await page.locator(STRIP).evaluate((strip) => {
        const root = strip.firstElementChild!;

        return [...root.children].map((child) =>
            child.querySelector("button") || child.matches("button") ? "b" : "t",
        );
    });

    expect(order.join(""), "both after the track").toMatch(/^t+b+$/);
});

test("a step moves the track forward and brings the back button to life", async ({ page, mount }) => {
    await mount(CHIPS);

    const buttons = page.locator(`${STRIP} button`);
    const before = await scrollOf(page);

    await buttons.last().click();

    await expect
        .poll(async () => (await scrollOf(page)).left, { message: "the track moved forward by about a page" })
        .toBeGreaterThan(before.left + before.visible * 0.5);
    await expect(buttons.first(), "and the back button is no longer dead").not.toHaveAttribute("aria-disabled", "true");
});

test("stepping to the far end kills the forward button and not the other one", async ({ page, mount }) => {
    await mount(CHIPS);

    const buttons = page.locator(`${STRIP} button`);

    for (let step = 0; step < 20; step++) {
        if ((await buttons.last().getAttribute("aria-disabled")) === "true") break;

        await buttons.last().click();
        await waitForRest(page);
    }

    await expect(buttons.last(), "there is nothing further to reach").toHaveAttribute("aria-disabled", "true");
    await expect(buttons.first(), "and everything is behind us").not.toHaveAttribute("aria-disabled", "true");
});

test.describe("the position is the owner's as well as the track's", () => {
    test("reports how far along the strip is as it moves", async ({ page, mount }) => {
        await mount(CHIPS);

        expect(await progressReadout(page), "nothing is scrolled off yet").toContain("0% along");

        await page.locator(`${STRIP} button`).last().click();
        await waitForRest(page);

        const reported = Number(/(\d+)% along/.exec(await progressReadout(page))?.[1]);

        expect(reported, `a page forward is some way along, and the readout said ${reported}%`).toBeGreaterThan(0);
    });

    test("a position written from outside scrolls the strip to it", async ({ page, mount }) => {
        await mount(CHIPS);

        const position = page.getByTestId("position");

        await position.fill("100");
        await waitForRest(page);

        const { left, visible, total } = await scrollOf(page);

        expect(left, "the whole way along is the end of the track").toBeGreaterThan(total - visible - 2);
        await expect(page.locator(`${STRIP} button`).last()).toHaveAttribute("aria-disabled", "true");

        await position.fill("0");
        await waitForRest(page);

        expect((await scrollOf(page)).left, "and zero is back at the start").toBeLessThan(2);
    });
});

test("the arrow keys still belong to whatever is inside, and focus drags the track along", async ({ page, mount }) => {
    await mount(TABBED);

    await page.locator(`${STRIP} [role="tab"]`).first().focus();

    const before = await scrollOf(page);

    for (let step = 0; step < 6; step++) await page.keyboard.press("ArrowRight");

    await expect(page.locator(`${STRIP} [role="tab"]:focus`), "the tab list moved its own focus").toHaveText("July");
    await expect
        .poll(async () => (await scrollOf(page)).left, { message: "and the track followed the focus" })
        .toBeGreaterThan(before.left);
});

test("focusing something already in view leaves the track alone", async ({ page, mount }) => {
    await mount(TABBED);

    await page.locator(`${STRIP} [role="tab"]`).nth(1).focus();

    expect((await scrollOf(page)).left, "the second tab is whole already, so there is nothing to reveal").toBe(0);
});

test("focusing something cut off by the edge scrolls it whole and no further", async ({ page, mount }) => {
    await mount(TABBED);

    const tabs = page.locator(`${STRIP} [role="tab"]`);
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
        .poll(async () => Math.round((await scrollOf(page)).left), {
            message: "the strip stopped the moment the tab fitted, rather than carrying it to the middle",
        })
        .toBe(Math.round(cut.left + cut.width + cut.padding - cut.visible));
});

test("a focused child is never flush against the edge, so its ring has somewhere to paint", async ({ page, mount }) => {
    await mount(TABBED);

    const tabs = page.locator(`${STRIP} [role="tab"]`);

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
                }, STRIP),
            { message: "the focused tab stops short of the track's edge by the room its ring needs" },
        )
        .toBeGreaterThan(0);
});

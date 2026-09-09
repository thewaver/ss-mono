import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

/**
 * The wheel's fast path: press the opener, move a short way toward a wedge, let go, and that wedge runs —
 * the pointer never travels as far as the item it picks, which is the whole point of picking by direction
 * rather than by hit-testing.
 *
 * Three routes to the same five actions live on this page's `flick` example and all three are checked here,
 * because the gesture is only allowed to exist while the other two do. WCAG 2.5.1 Pointer Gestures asks that
 * "all functionality that uses multipoint or path-based gestures for operation can be operated with a single
 * pointer without a path-based gesture", and its understanding document names flicking in a straight line as
 * path-based; 2.5.7 Dragging Movements asks the same of anything operated by dragging. The click-open route
 * answers both — click the opener, click a wedge, no path and no drag. 2.5.2 Pointer Cancellation is the one
 * that shapes the gesture itself rather than sitting beside it: because the press opens the wheel, the
 * down-event is doing part of the work, so the only clause left is "completion of the function is on the
 * up-event, and a mechanism is available to abort the function before completion". Coming back to the middle
 * is that abort, and it is a test rather than a note for exactly that reason.
 *
 * Nothing here pins a coordinate. Each flick is aimed at a wedge whose centre the page itself reports, and
 * travels a fraction of the way there, so re-tuning the hole, the band or the threshold cannot turn into a
 * red run — what is asserted is that aiming at a wedge picks that wedge and aiming at nothing picks nothing.
 */
const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';
const NOTHING_RUN = "nothing run yet";
const FLICK = "flick";

/** Far enough past the threshold to count, and nowhere near far enough to be over the wedge itself. */
const FLICK_SHARE = 0.45;
const ABORT_SHARE = 0.05;

const trigger = `${demo(FLICK)} [aria-haspopup="menu"]`;

const centreOf = async (page: Page, selector: string) => {
    const box = await page.locator(selector).boundingBox();

    if (!box) throw new Error(`nothing to measure at ${selector}`);

    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

const wedge = (page: Page, name: string) =>
    page.locator(MENU).nth(0).locator(ITEM_ROLE).filter({ hasText: name }).first();

/** A level is ready once it holds focus, which is the open-and-focus race the other menu specs wait on too. */
const openedLevel = async (page: Page) => {
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(page.locator(MENU).nth(0)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(0)).toBeFocused();
};

/**
 * Presses the opener, moves the given share of the way toward the named wedge, and lets go. The move is split
 * into two steps because one jump from the press point can be delivered as a single event that arrives before
 * the level has laid itself out; a person's flick is a stream of moves and this is the cheapest way to be one.
 */
const flickToward = async (page: Page, name: string, share: number) => {
    const from = await centreOf(page, trigger);

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await openedLevel(page);

    const box = await wedge(page, name).boundingBox();

    if (!box) throw new Error(`no wedge named ${name}`);

    const to = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

    for (const step of [share / 2, share]) {
        await page.mouse.move(from.x + (to.x - from.x) * step, from.y + (to.y - from.y) * step);
    }

    return { from, release: () => page.mouse.up() };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/wheel-menu");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("holding the opener brings the wheel up under the pointer, before anything is chosen", async ({ page }) => {
    const from = await centreOf(page, trigger);

    await page.mouse.move(from.x, from.y);
    await page.mouse.down();

    await expect(page.locator(MENU), "the press alone opens it").toHaveCount(1);
    await openedLevel(page);
    expect(await readout(page, FLICK), "and nothing has run, because the function completes on release").toContain(
        NOTHING_RUN,
    );

    await page.mouse.up();
});

test("a short move toward a wedge picks that wedge, without the pointer reaching it", async ({ page }) => {
    const flick = await flickToward(page, "Paste", FLICK_SHARE);

    expect(
        await wedge(page, "Paste").getAttribute("id"),
        "the wedge being aimed at is the one the level says is chosen",
    ).toBe(await page.locator(MENU).nth(0).getAttribute("aria-activedescendant"));

    await flick.release();

    await expect(page.locator(MENU), "releasing runs it and shuts the wheel").toHaveCount(0);
    expect(await readout(page, FLICK)).toContain("Paste");
});

test("which wedge runs is the direction it was aimed in, not the one the pointer happened to be over", async ({
    page,
}) => {
    const flick = await flickToward(page, "Delete", FLICK_SHARE);

    await flick.release();

    expect(await readout(page, FLICK)).toContain("Delete");
});

test("coming back to the middle before letting go is the abort, and it runs nothing", async ({ page }) => {
    await flickToward(page, "Copy", FLICK_SHARE);

    expect(await readout(page, FLICK), "still nothing, since the press has not been released").toContain(NOTHING_RUN);

    const back = await flickToward(page, "Copy", ABORT_SHARE);

    await back.release();

    expect(await readout(page, FLICK), "and letting go near the middle picks nothing at all").toContain(NOTHING_RUN);
    await expect(page.locator(MENU), "leaving the wheel standing, which is the click-open route").toHaveCount(1);
});

test("a press that never moves leaves the wheel open to be clicked through instead", async ({ page }) => {
    await page.locator(trigger).click();

    await expect(page.locator(MENU), "the click that opened it does not shut it again").toHaveCount(1);
    await openedLevel(page);
    expect(await readout(page, FLICK)).toContain(NOTHING_RUN);

    await wedge(page, "Cut").click();

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, FLICK), "so every action is reachable with no path and no drag").toContain("Cut");
});

test("the keyboard route is untouched by the gesture", async ({ page }) => {
    await page.locator(trigger).focus();
    await page.keyboard.press("Enter");

    await openedLevel(page);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page, FLICK)).toContain("Copy");
});

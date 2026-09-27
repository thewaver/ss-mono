import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `WheelMenu`, a `Menu` laid out as bands round a hole with a close control in the middle. The cases
 * follow `e2e/wheelMenu.spec.ts` and `e2e/wheelMenuFlick.spec.ts`: bands nest concentrically, the close control is
 * an item the walk reaches and has a name, all four arrows walk the ring and `Escape` steps out one band, and the
 * hold-and-flick fast path picks by direction, aborts when brought back to the middle, and leaves the click and
 * keyboard routes untouched — WCAG 2.5.1 and 2.5.7 ask that the gesture never be the only way, and 2.5.2 that it
 * completes on release and can be aborted before it.
 *
 * Nothing pins a coordinate or a radius: levels are compared with each other, and each flick is aimed at a wedge
 * whose center the page reports.
 */
const MENU = '[role="menu"]';
const ITEM_ROLE = '[role="menuitem"]';
const TRIGGER = "#trigger";
const NOTHING_RUN = "nothing run yet";
const STORY = "Essentials/WheelMenu/Default";
const FLICK_SHARE = 0.45;
const ABORT_SHARE = 0.05;

const readout = (page: Page) => page.locator('[data-readout="last"]').textContent();

const openedLevel = async (page: Page, depth: number) => {
    await expect(page.locator(MENU)).toHaveCount(depth + 1);
    await expect(page.locator(MENU).nth(depth)).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(page.locator(MENU).nth(depth)).toBeFocused();
};

const itemAt = (page: Page, depth: number, name: string) =>
    page.locator(MENU).nth(depth).locator(ITEM_ROLE).filter({ hasText: name }).first();

const highlightAt = async (page: Page, depth: number) => {
    const id = await page.locator(MENU).nth(depth).getAttribute("aria-activedescendant");

    return page.locator(`[id="${id}"]`).textContent();
};

const activeId = (page: Page, depth: number) => page.locator(MENU).nth(depth).getAttribute("aria-activedescendant");

const closerOf = (page: Page, depth: number) => page.locator(MENU).nth(depth).locator(`${ITEM_ROLE}[aria-label]`);

/**
 * A level is sized by its own layout and moved by a transform the `Popover` writes, both in layout space, so the
 * center comes off the element itself rather than out of a client rect.
 */
const boxOf = (locator: Locator) =>
    locator.evaluate((node: HTMLElement) => {
        const [x, y] = (node.style.transform.match(/-?[\d.]+/g) ?? ["0", "0"]).map(Number);

        return { centerX: x + node.offsetWidth * 0.5, centerY: y + node.offsetHeight * 0.5, width: node.offsetWidth };
    });

const open = async (page: Page) => {
    await page.locator(TRIGGER).click();
    await openedLevel(page, 0);
};

test("a submenu is a wider band round the center its parent already had", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentric" });
    await open(page);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "From template").hover();
    await openedLevel(page, 2);

    const levels = await Promise.all([0, 1, 2].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    levels.forEach((level, depth) => {
        if (depth === 0) return;

        expect(level.centerX, "every level is centered on the root's point").toBeCloseTo(levels[0].centerX, 0);
        expect(level.centerY).toBeCloseTo(levels[0].centerY, 0);
        expect(level.width, "and each one encloses the level above it").toBeGreaterThan(levels[depth - 1].width);
    });
});

test("a half wheel nests the same way, one wider arc round the last", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentricHalves" });
    await open(page);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    const [root, band] = await Promise.all([0, 1].map((depth) => boxOf(page.locator(MENU).nth(depth))));

    expect(band.centerX).toBeCloseTo(root.centerX, 0);
    expect(band.centerY).toBeCloseTo(root.centerY, 0);
    expect(band.width).toBeGreaterThan(root.width);
});

test("the hole holds a close control the walk reaches, and it has a name of its own", async ({ page, mount }) => {
    await mount(STORY);
    await open(page);

    await expect(closerOf(page, 0), "one close control").toHaveCount(1);
    expect((await closerOf(page, 0).getAttribute("aria-label")) ?? "", "and it is named").not.toBe("");

    expect(await highlightAt(page, 0), "a wheel opens onto its first wedge").toContain("Cut");

    await itemAt(page, 0, "Copy").hover();
    expect(await highlightAt(page, 0), "the pointer moves the choice").toContain("Copy");

    await closerOf(page, 0).hover();
    expect(await activeId(page, 0), "coming back to the hole takes the choice off the wedge").toBe(
        await closerOf(page, 0).getAttribute("id"),
    );

    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0), "it is a stop in the same walk").toContain("Cut");

    await page.keyboard.press("Enter");
    await expect(page.locator(MENU), "activating a wedge closes the wheel").toHaveCount(0);
});

test("clicking the close control shuts the wheel and runs nothing", async ({ page, mount }) => {
    await mount(STORY);
    await open(page);

    await closerOf(page, 0).click();

    await expect(page.locator(MENU)).toHaveCount(0);
    expect(await readout(page)).toContain(NOTHING_RUN);
    await expect(page.locator(TRIGGER), "and focus goes back to the opener it covered").toBeFocused();
});

test("hovering the hole drops the bands below it", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentric" });
    await open(page);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await itemAt(page, 1, "Project").hover();
    expect(await highlightAt(page, 1)).toContain("Project");

    await closerOf(page, 0).hover();

    await expect(page.locator(MENU), "the hole takes the wheel back to one band").toHaveCount(1);
    expect(await activeId(page, 0)).toBe(await closerOf(page, 0).getAttribute("id"));
});

test("a deeper band brings no second closer", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentric" });
    await open(page);

    await itemAt(page, 0, "New").hover();
    await openedLevel(page, 1);

    await expect(closerOf(page, 1)).toHaveCount(0);
    await expect(closerOf(page, 0)).toHaveCount(1);
});

test("all four arrows walk the ring, and a band is entered and left without them", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentric" });
    await open(page);

    const first = await highlightAt(page, 0);

    await page.keyboard.press("ArrowRight");
    expect(await highlightAt(page, 0), "ArrowRight moves on rather than diving into a band").not.toBe(first);
    await expect(page.locator(MENU), "and opens nothing").toHaveCount(1);

    await page.keyboard.press("ArrowLeft");
    expect(await highlightAt(page, 0)).toBe(first);

    await page.keyboard.press("ArrowDown");
    expect(await highlightAt(page, 0)).not.toBe(first);

    await page.keyboard.press("ArrowUp");
    expect(await highlightAt(page, 0)).toBe(first);
});

test("a band is entered by activating its wedge and left one at a time with Escape", async ({ page, mount }) => {
    await mount(STORY, { variant: "concentric" });
    await open(page);

    await page.keyboard.press("Enter");
    await openedLevel(page, 1);

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "Escape drops the outer band rather than the whole wheel").toHaveCount(1);
    await expect(page.locator(MENU).nth(0), "leaving focus in the band it came back to").toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU), "and the next one closes the wheel itself").toHaveCount(0);
});

test.describe("hold and flick", () => {
    const centerOf = async (locator: Locator) => {
        const box = (await locator.boundingBox())!;

        return { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
    };

    const flickToward = async (page: Page, name: string, share: number) => {
        const from = await centerOf(page.locator(TRIGGER));

        await page.mouse.move(from.x, from.y);
        await page.mouse.down();
        await openedLevel(page, 0);

        const to = await centerOf(itemAt(page, 0, name));

        for (const step of [share * 0.5, share]) {
            await page.mouse.move(from.x + (to.x - from.x) * step, from.y + (to.y - from.y) * step);
        }

        return { release: () => page.mouse.up() };
    };

    test("holding the opener brings the wheel up under the pointer, before anything is chosen", async ({
        page,
        mount,
    }) => {
        await mount(STORY, { variant: "flick" });

        const from = await centerOf(page.locator(TRIGGER));

        await page.mouse.move(from.x, from.y);
        await page.mouse.down();

        await openedLevel(page, 0);
        expect(await readout(page), "nothing has run, because the function completes on release").toContain(
            NOTHING_RUN,
        );

        await page.mouse.up();
    });

    test("a short move toward a wedge picks that wedge, without the pointer reaching it", async ({ page, mount }) => {
        await mount(STORY, { variant: "flick" });

        const flick = await flickToward(page, "Paste", FLICK_SHARE);

        expect(await itemAt(page, 0, "Paste").getAttribute("id"), "the wedge aimed at is the one chosen").toBe(
            await activeId(page, 0),
        );

        await flick.release();

        await expect(page.locator(MENU), "releasing runs it and shuts the wheel").toHaveCount(0);
        expect(await readout(page)).toContain("Paste");
    });

    test("which wedge runs is the direction it was aimed in", async ({ page, mount }) => {
        await mount(STORY, { variant: "flick" });

        const flick = await flickToward(page, "Delete", FLICK_SHARE);

        await flick.release();

        expect(await readout(page)).toContain("Delete");
    });

    test("coming back to the middle before letting go is the abort, and it runs nothing", async ({ page, mount }) => {
        await mount(STORY, { variant: "flick" });

        await flickToward(page, "Copy", FLICK_SHARE);
        expect(await readout(page)).toContain(NOTHING_RUN);

        const back = await flickToward(page, "Copy", ABORT_SHARE);

        await back.release();

        expect(await readout(page), "letting go near the middle picks nothing").toContain(NOTHING_RUN);
        await expect(page.locator(MENU), "leaving the wheel standing").toHaveCount(1);
    });

    test("a press that never moves leaves the wheel open to be clicked through instead", async ({ page, mount }) => {
        await mount(STORY, { variant: "flick" });

        await page.locator(TRIGGER).click();

        await expect(page.locator(MENU), "the click that opened it does not shut it again").toHaveCount(1);
        await openedLevel(page, 0);
        expect(await readout(page)).toContain(NOTHING_RUN);

        await itemAt(page, 0, "Cut").click();

        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await readout(page), "every action is reachable with no path and no drag").toContain("Cut");
    });

    test("the keyboard route is untouched by the gesture", async ({ page, mount }) => {
        await mount(STORY, { variant: "flick" });

        await page.locator(TRIGGER).focus();
        await page.keyboard.press("Enter");
        await openedLevel(page, 0);

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        await expect(page.locator(MENU)).toHaveCount(0);
        expect(await readout(page)).toContain("Copy");
    });
});

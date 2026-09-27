import { type Page, expect, test } from "@playwright/test";

import { turnDegrees } from "../helpers";

/**
 * The React `Sortable`, over the React `Carrier` hooks. The cases follow `e2e/sortable.spec.ts` and the `Sortable`
 * block of `e2e/rightToLeft.spec.ts`, which cover the Solid one, so the two frameworks are held to the same three
 * routes in — a drag, a keyboard pick-move-drop, and a tap to pick and a tap to place — and the same refusals. Each
 * story keys its lists' boxes by `data-testid` in place of the Playground's example keys.
 *
 * The Solid spec's check under a scaled `Viewport` has no counterpart here: the gallery has no React viewport to
 * scale, so the landing place can only be checked at a scale of 1.
 */
const STORY = "Essentials/Sortable";

const scope = (key: string) => `[data-testid="${key}"]`;
const list = (key: string, label: string) => `${scope(key)} [role="list"][aria-label="${label}"]`;
const item = (key: string, label: string) => `${scope(key)} [role="listitem"][aria-label="${label}"]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="order"]`).textContent();

const dragBetween = async (page: Page, source: string, target: string, offsetFromBottom = 4) => {
    const from = await page.locator(source).boundingBox();
    const to = await page.locator(target).boundingBox();

    if (!from || !to) throw new Error("a drag needs both boxes to exist");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width * 0.5 + 20, from.y + from.height * 0.5, { steps: 5 });
    await page.mouse.move(to.x + to.width * 0.5, to.y + to.height - offsetFromBottom, { steps: 10 });
    await page.mouse.up();
};

/** The marker is the only child of a list that is not one of its items, so counting those says whether it is up. */
const carriedCount = (page: Page, key: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="list"]`)].reduce(
                (count, element) => count + [...element.children].filter((child) => !child.getAttribute("role")).length,
                0,
            ),
        scope(key),
    );

const markerTop = (page: Page, key: string) =>
    page.evaluate((selector) => {
        const element = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
        const marker = [...element.children].find((child) => !child.getAttribute("role"));

        return marker ? Math.round(marker.getBoundingClientRect().top) : -1;
    }, scope(key));

const itemTops = (page: Page, key: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="listitem"]`)].map((element) =>
                Math.round(element.getBoundingClientRect().top),
            ),
        scope(key),
    );

test.describe("single lists", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Default`);
        await expect(page.locator(item("reorder", "First"))).toBeVisible();
    });

    test("a list owns its role and its items carry their place in it", async ({ page }) => {
        await expect(page.locator(`${scope("reorder")} [role="list"]`), "the library owns the list role").toHaveCount(
            1,
        );
        await expect(page.locator(`${scope("reorder")} [role="listitem"]`), "one item per record").toHaveCount(4);

        await expect(page.locator(item("reorder", "First")), "and each says where it sits").toHaveAttribute(
            "aria-posinset",
            "1",
        );
        await expect(page.locator(item("reorder", "First")), "out of how many").toHaveAttribute("aria-setsize", "4");
    });

    test("a list is one tab stop, and the arrows walk it", async ({ page }) => {
        await page.locator(item("reorder", "First")).focus();

        expect(
            await page.locator(item("reorder", "First")).evaluate((element) => (element as HTMLElement).tabIndex),
            "the item focus is on is the one tab stop",
        ).toBe(0);
        expect(
            await page.locator(item("reorder", "Third")).evaluate((element) => (element as HTMLElement).tabIndex),
            "and every other item is out of the tab order",
        ).toBe(-1);

        await page.keyboard.press("ArrowDown");
        await expect(page.locator(item("reorder", "Third")), "the walk skips the disabled second item").toBeFocused();
    });

    test("keyboard: a pick, two moves and a drop land two places along", async ({ page }) => {
        await page.locator(item("reorder", "First")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(await readout(page, "reorder"), "the first item has passed two of its neighbors").toContain(
            "Second — locked, Third, First, Fourth",
        );
    });

    test("keyboard: Escape puts the item back where it was", async ({ page }) => {
        await page.locator(item("row", "Ember Sprite")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Escape");

        expect(await readout(page, "row"), "a canceled carry changes nothing").toContain(
            "Ember Sprite, Gale Warden, Tide Caller",
        );
    });

    test("pointer: a tap-carry re-aims as the pointer moves, with no button held", async ({ page }) => {
        await page.locator(item("reorder", "First")).click();

        const box = await page.locator(`${scope("reorder")} [role="list"]`).boundingBox();

        if (!box) throw new Error("the list has to be somewhere");

        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3, { steps: 3 });

        const near = await markerTop(page, "reorder");

        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.8, { steps: 3 });

        await expect
            .poll(() => markerTop(page, "reorder"), { message: "the landing place tracks the pointer" })
            .not.toBe(near);

        await page.mouse.down();
        await page.mouse.up();

        expect(await readout(page, "reorder"), "and the drop lands where it was marked").toContain(
            "Second — locked, Third, First, Fourth",
        );
    });

    test("a drag that has finished leaves nothing being carried", async ({ page }) => {
        await dragBetween(page, item("reorder", "First"), item("reorder", "Third"));

        expect(await carriedCount(page, "reorder"), "nothing is still in hand after the release").toBe(0);
        expect(await readout(page, "reorder"), "and the move committed once, not twice and not at all").toContain(
            "Second — locked, Third, First, Fourth",
        );

        await dragBetween(page, item("reorder", "Third"), item("reorder", "Fourth"));

        expect(await carriedCount(page, "reorder"), "and the same holds for a second drag").toBe(0);
    });

    test("carrying an item does not move the items being dragged past", async ({ page }) => {
        const source = await page.locator(item("reorder", "First")).boundingBox();
        const target = await page.locator(item("reorder", "Fourth")).boundingBox();

        if (!source || !target) throw new Error("a drag needs both boxes to exist");

        await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5 + 8, { steps: 4 });
        await page.mouse.move(target.x + target.width * 0.5, target.y + target.height - 2, { steps: 10 });

        await expect.poll(() => carriedCount(page, "reorder"), { message: "the destination is marked" }).toBe(1);

        const before = await itemTops(page, "reorder");

        await page.mouse.move(target.x + target.width * 0.5, target.y + target.height - 4, { steps: 2 });

        expect(await itemTops(page, "reorder"), "and the list does not shuffle under the pointer").toEqual(before);

        await page.mouse.up();
    });

    for (const [key, label, axis] of [
        ["reorder", "First", "column"],
        ["row", "Ember Sprite", "row"],
    ] as const) {
        test(`the ${axis} marker spans its list, stays inside it and clears every card`, async ({ page }) => {
            const source = await page.locator(item(key, label)).boundingBox();
            const box = await page.locator(`${scope(key)} [role="list"]`).boundingBox();

            if (!source || !box) throw new Error("a drag needs both boxes to exist");

            await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5);
            await page.mouse.down();
            await page.mouse.move(source.x + source.width * 0.5 + 8, source.y + source.height * 0.5 + 8, { steps: 4 });

            for (const along of [0.01, 0.3, 0.55, 0.8, 0.99]) {
                await page.mouse.move(
                    axis === "row" ? box.x + box.width * along : box.x + box.width * 0.5,
                    axis === "row" ? box.y + box.height * 0.5 : box.y + box.height * along,
                    { steps: 2 },
                );

                const fit = await page.evaluate((selector) => {
                    const element = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
                    const marker = [...element.children].find((child) => !child.getAttribute("role")) as HTMLElement;

                    if (!marker) return "no marker";

                    const listRect = element.getBoundingClientRect();
                    const markerRect = marker.getBoundingClientRect();
                    const overlaps = [...element.querySelectorAll('[role="listitem"]')].filter((entry) => {
                        const rect = entry.getBoundingClientRect();

                        return (
                            markerRect.right > rect.left + 0.5 &&
                            markerRect.left < rect.right - 0.5 &&
                            markerRect.bottom > rect.top + 0.5 &&
                            markerRect.top < rect.bottom - 0.5
                        );
                    });

                    const cardRect = (
                        element.querySelector('[role="listitem"]') as HTMLElement
                    ).getBoundingClientRect();

                    return {
                        spansAcross:
                            Math.round(markerRect.width) === Math.round(cardRect.width) ||
                            Math.round(markerRect.height) === Math.round(cardRect.height),
                        inside:
                            markerRect.top >= listRect.top - 0.5 &&
                            markerRect.bottom <= listRect.bottom + 0.5 &&
                            markerRect.left >= listRect.left - 0.5 &&
                            markerRect.right <= listRect.right + 0.5,
                        cardsCovered: overlaps.length,
                    };
                }, scope(key));

                expect(fit, `the marker is whole and clear of every card at ${along} along the list`).toEqual({
                    spansAcross: true,
                    inside: true,
                    cardsCovered: 0,
                });
            }

            await page.mouse.up();
        });
    }

    test("a disabled list moves nothing, by pointer or by key", async ({ page }) => {
        await expect(page.locator(list("disabled", "Disabled list")), "the list says it is disabled").toHaveAttribute(
            "aria-disabled",
            "true",
        );

        await page.locator(item("disabled", "Ember Sprite")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(await readout(page, "disabled"), "the keyboard route is inert").toContain(
            "Ember Sprite, Gale Warden, Tide Caller",
        );

        await dragBetween(page, item("disabled", "Ember Sprite"), list("disabled", "Disabled list"));

        expect(await readout(page, "disabled"), "and so is the drag").toContain(
            "Ember Sprite, Gale Warden, Tide Caller",
        );
    });

    test("a disabled item cannot be picked up, by any route", async ({ page }) => {
        await page.locator(item("reorder", "First")).focus();
        await page.keyboard.press("ArrowDown");

        await expect(page.locator(item("reorder", "Third")), "the arrows never land on it").toBeFocused();

        await page.locator(item("reorder", "Second — locked")).click();
        await page.locator(item("reorder", "Fourth")).click();

        expect(await readout(page, "reorder"), "and a tap on it starts nothing").toContain(
            "First, Second — locked, Third, Fourth",
        );
    });
});

test.describe("pairs of lists", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Pairs`);
        await expect(page.locator(item("pair", "Ember Sprite"))).toBeVisible();
    });

    test("keyboard: Tab moves the carried item to the other list", async ({ page }) => {
        await page.locator(item("pair", "Ember Sprite")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        expect(await readout(page, "pair"), "it left the hand").toContain("hand: Gale Warden, Tide Caller");
        expect(await readout(page, "pair"), "and arrived at the end of the board").toContain(
            "board: Root Golem, Ember",
        );
    });

    test("pointer: a drag carries an item into the other list", async ({ page }) => {
        await dragBetween(page, item("pair", "Gale Warden"), list("pair", "Board"));

        expect(await readout(page, "pair"), "it left the hand").toContain("hand: Ember Sprite, Tide Caller");
        expect(await readout(page, "pair"), "and landed on the board").toContain("board: Root Golem, Gale Warden");
    });

    test("pointer: a tap picks up and a second tap places, with no dragging at all", async ({ page }) => {
        await page.locator(item("pair", "Tide Caller")).click();
        await page.locator(item("pair", "Root Golem")).click();

        expect(await readout(page, "pair"), "it left the hand").toContain("hand: Ember Sprite, Gale Warden");
        expect(await readout(page, "pair"), "and landed on the board").toContain("board:");
    });

    test("a list that refuses an item is not offered as a destination", async ({ page }) => {
        await page.locator(item("picky", "Tide Caller")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        expect(await readout(page, "picky"), "the expensive card is still in the hand").toContain(
            "hand: Ember Sprite, Gale Warden, Tide Caller",
        );
        expect(await readout(page, "picky"), "and the board is still empty").toContain("board: empty");

        await page.locator(item("picky", "Ember Sprite")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        await page.keyboard.press("Enter");

        expect(await readout(page, "picky"), "while a cheap one crosses").toContain("board: Ember Sprite");
    });

    test("a locked list can still be reordered from inside", async ({ page }) => {
        await page.locator(item("locked", "Root Golem")).focus();

        await page.keyboard.press("Enter");
        await page.keyboard.press("Escape");

        expect(await readout(page, "locked"), "nothing crossed into it").toContain("board: Root Golem");

        await dragBetween(page, item("locked", "Ember Sprite"), list("locked", "Board"));

        expect(await readout(page, "locked"), "and a drag into it is refused as well").toContain(
            "hand: Ember Sprite, Gale Warden, Tide Caller",
        );
    });
});

test.describe("a ring", () => {
    const RING = scope("ring");

    const ringCards = (page: Page) =>
        page
            .locator(`${RING} [role="listitem"]`)
            .evaluateAll((elements) => elements.map((element) => element.ariaLabel));

    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Ring`);
        await expect(page.locator(`${RING} [role="listitem"]`).first()).toBeVisible();
    });

    test("picks the nearest place to drop into, having no axis to compare", async ({ page }) => {
        const before = await ringCards(page);

        expect(before.length, "the ring has cards to move").toBeGreaterThan(2);

        await dragBetween(page, `${RING} [role="listitem"] >> nth=0`, `${RING} [role="listitem"] >> nth=2`, 0);

        const after = await ringCards(page);

        expect(after, "the same cards, in a different order").toHaveLength(before.length);
        expect(
            after.indexOf(before[0]),
            "the card dragged onto the third place is no longer the first",
        ).toBeGreaterThan(0);
    });

    test("keeps the keyboard route, which never had an axis to lose", async ({ page }) => {
        const before = await ringCards(page);

        await page.locator(`${RING} [role="listitem"]`).first().focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");

        expect(await ringCards(page), "picking a place with the arrows still moves the card").not.toEqual(before);
    });

    test("marks the gap it would land in, turned to lie across it", async ({ page }) => {
        const cards = page.locator(`${RING} [role="listitem"]`);
        const marker = page.locator(`${RING} [data-marker]`);

        await expect(marker, "nothing is marked while nothing is being carried").toHaveCount(0);

        const from = (await cards.nth(0).boundingBox())!;
        const to = (await cards.nth(2).boundingBox())!;

        await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(from.x + from.width * 0.5 + 20, from.y + from.height * 0.5, { steps: 5 });
        await page.mouse.move(to.x + to.width * 0.5, to.y + to.height * 0.5, { steps: 10 });

        await expect(marker, "one mark, for the one place it would land").toHaveCount(1);

        const box = page
            .locator(`${RING} [role="presentation"]`)
            .filter({ has: page.locator("[data-marker]") })
            .last();
        const turn = await turnDegrees(box);

        expect(turn % 360, "the mark is placed the way an item is, and turned to a real bearing").not.toBe(0);

        await page.mouse.up();
        await expect(marker, "and it goes once the card is put down").toHaveCount(0);
    });

    test("the four gaps of a ring are a quarter turn apart, the last one included", async ({ page }) => {
        const box = (await page.locator(`${RING} [role="list"]`).boundingBox())!;
        const cards = page.locator(`${RING} [role="listitem"]`);
        const first = (await cards.nth(0).boundingBox())!;
        const center = { x: box.x + box.width * 0.5, y: box.y + box.height * 0.5 };
        const reach = Math.min(box.width, box.height) * 0.34;

        await page.mouse.move(first.x + first.width * 0.5, first.y + first.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(first.x + first.width * 0.5 + 20, first.y + first.height * 0.5, { steps: 5 });

        const placed = page.locator(`${RING} [role="presentation"]`).filter({ has: page.locator("[data-marker]") });
        const bearings: number[] = [];

        for (const spot of [
            { x: reach, y: 0 },
            { x: 0, y: reach },
            { x: -reach, y: 0 },
            { x: 0, y: -reach },
        ]) {
            await page.mouse.move(center.x + spot.x, center.y + spot.y, { steps: 6 });
            await expect(placed.last()).toBeAttached();

            const degrees = await turnDegrees(placed.last());

            bearings.push(((degrees % 360) + 360) % 360);
        }

        await page.mouse.up();

        expect(new Set(bearings).size, "four gaps, four different bearings").toBe(bearings.length);

        const QUARTER_TURN = 90;
        const TOLERANCE = 12;

        for (let index = 1; index < bearings.length; index++) {
            const step = (((bearings[index] - bearings[index - 1]) % 360) + 360) % 360;

            expect(
                Math.min(Math.abs(step - QUARTER_TURN), Math.abs(step - (360 - QUARTER_TURN))),
                `gap ${index} is a quarter turn from the one before it`,
            ).toBeLessThan(TOLERANCE);
        }
    });
});

test.describe("right to left", () => {
    const RTL = "rightToLeft";

    test("a carried item moves later with the left arrow and earlier with the right", async ({ page, mount }) => {
        await mount(`${STORY}/RightToLeft`);

        const gale = (await page.locator(item(RTL, "Gale Warden")).boundingBox())!;
        const ember = (await page.locator(item(RTL, "Ember Sprite")).boundingBox())!;

        expect(gale.x + gale.width * 0.5, "the second card is drawn to the left of the first").toBeLessThan(
            ember.x + ember.width * 0.5,
        );

        await page.locator(item(RTL, "Ember Sprite")).focus();
        await page.keyboard.press("ArrowLeft");
        await expect(
            page.locator(item(RTL, "Gale Warden")),
            "with nothing carried, ArrowLeft walks forward",
        ).toBeFocused();

        await page.locator(item(RTL, "Ember Sprite")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowLeft");
        await page.keyboard.press("Enter");

        expect(await readout(page, RTL), "and a carried card goes one place later").toContain(
            "Gale Warden, Ember Sprite, Tide Caller",
        );

        await page.locator(item(RTL, "Tide Caller")).focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");

        expect(await readout(page, RTL), "while ArrowRight carries one place earlier").toContain(
            "Gale Warden, Tide Caller, Ember Sprite",
        );
    });
});

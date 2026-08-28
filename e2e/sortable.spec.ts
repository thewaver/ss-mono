import { type Page, expect, test } from "@playwright/test";

import { demo, readout } from "./helpers";

const list = (key: string, label: string) => `${demo(key)} [role="list"][aria-label="${label}"]`;
const item = (key: string, label: string) => `${demo(key)} [role="listitem"][aria-label="${label}"]`;

/**
 * The three ways in are the point of the control, so each is driven separately rather than through one
 * helper: a drag, a keyboard pick-move-drop, and — for anyone who can use a pointer but not hold a
 * button down while moving it — a tap to pick and a tap to place. Success criterion 2.5.7 asks for the
 * third and 2.1.1 for the second, so a spec that only covered the drag would be checking the easy third.
 */
const dragBetween = async (page: Page, source: string, target: string, offsetFromBottom = 4) => {
    const from = await page.locator(source).boundingBox();
    const to = await page.locator(target).boundingBox();

    if (!from || !to) throw new Error("a drag needs both boxes to exist");

    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();

    // The first move only has to beat the slop distance, which is what separates a drag from a click.
    await page.mouse.move(from.x + from.width / 2 + 20, from.y + from.height / 2, { steps: 5 });
    await page.mouse.move(to.x + to.width / 2, to.y + to.height - offsetFromBottom, { steps: 10 });
    await page.mouse.up();
};

/**
 * The marker is the only child of a list that is not one of its items, so counting those says whether
 * something is being carried without reading a class name off the consumer's paint.
 */
const carriedCount = (page: Page, key: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="list"]`)].reduce(
                (count, list) => count + [...list.children].filter((child) => !child.getAttribute("role")).length,
                0,
            ),
        demo(key),
    );

/**
 * The carried copy is portalled away from the list, so it is the aria-hidden element outside every list
 * that the component has written a transform onto — the transform being how it is positioned at all.
 * Its position is part of the answer here, since what is being tested is that it moves.
 */
const carriedPreview = (page: Page) =>
    page.evaluate(() => {
        const found = [...document.querySelectorAll('[aria-hidden="true"][style*="translate"]')].find(
            (element) => !element.closest('[role="list"]'),
        );

        if (!found) return "none";

        const rect = found.getBoundingClientRect();

        return `${(found.textContent ?? "").trim()}@${Math.round(rect.x)},${Math.round(rect.y)}`;
    });

const markerTop = (page: Page, key: string) =>
    page.evaluate((selector) => {
        const list = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
        const marker = [...list.children].find((child) => !child.getAttribute("role"));

        return marker ? Math.round(marker.getBoundingClientRect().top) : -1;
    }, demo(key));

const itemTops = (page: Page, key: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="listitem"]`)].map((element) =>
                Math.round(element.getBoundingClientRect().top),
            ),
        demo(key),
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/sortable");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("a list owns its role and its items carry their place in it", async ({ page }) => {
    await expect(page.locator(`${demo("reorder")} [role="list"]`), "the library owns the list role").toHaveCount(1);
    await expect(page.locator(`${demo("reorder")} [role="listitem"]`), "one item per record").toHaveCount(4);

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

/**
 * Two presses of the arrow have to move the item two places. The trap here is that the landing place
 * either side of an item is the same place — an item put "after itself" has not moved — so a naive
 * implementation spends the first press going nowhere. The component therefore counts in settled
 * positions, where the carried item is already out of the list, and converts to a landing place only
 * when the drop commits.
 */
test("keyboard: a pick, two moves and a drop land two places along", async ({ page }) => {
    await page.locator(item("reorder", "First")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await readout(page, "reorder"), "the first item has passed two of its neighbours").toContain(
        "Second — locked, Third, First, Fourth",
    );
});

test("keyboard: Escape puts the item back where it was", async ({ page }) => {
    await page.locator(item("row", "Ember Sprite")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");

    expect(await readout(page, "row"), "a cancelled carry changes nothing").toContain(
        "Ember Sprite, Gale Warden, Tide Caller",
    );
});

test("keyboard: Tab moves the carried item to the other list", async ({ page }) => {
    await page.locator(item("pair", "Ember Sprite")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    expect(await readout(page, "pair"), "it left the hand").toContain("hand: Gale Warden, Tide Caller");
    expect(await readout(page, "pair"), "and arrived at the end of the board").toContain("board: Root Golem, Ember");
});

test("pointer: a drag carries an item into the other list", async ({ page }) => {
    await dragBetween(page, item("pair", "Gale Warden"), list("pair", "Board"));

    expect(await readout(page, "pair"), "it left the hand").toContain("hand: Ember Sprite, Tide Caller");
    expect(await readout(page, "pair"), "and landed on the board").toContain("board: Root Golem, Gale Warden");
});

/**
 * The single-pointer route 2.5.7 asks for. A press that never moves far enough to be a drag is a click,
 * and a click picks up; the next click places. The two are one state machine with the keyboard route,
 * which is why cancelling works the same way for both.
 */
/**
 * A tap-carry is not a drag with the button up: nothing is holding the pointer, so the moves arrive at the
 * document rather than at the item. The first build listened for them only to move the copy under the
 * cursor and never to re-aim, so the copy followed the pointer while the landing place stayed where it had
 * been picked up — the drop then landed somewhere the page had never marked.
 */
test("pointer: a tap-carry re-aims as the pointer moves, with no button held", async ({ page }) => {
    await page.locator(item("reorder", "First")).click();

    const list = await page.locator(`${demo("reorder")} [role="list"]`).boundingBox();

    if (!list) throw new Error("the list has to be somewhere");

    await page.mouse.move(list.x + list.width / 2, list.y + list.height * 0.3, { steps: 3 });

    const near = await markerTop(page, "reorder");

    await page.mouse.move(list.x + list.width / 2, list.y + list.height * 0.8, { steps: 3 });

    expect(await markerTop(page, "reorder"), "the landing place tracks the pointer").not.toBe(near);

    await page.mouse.down();
    await page.mouse.up();

    expect(await readout(page, "reorder"), "and the drop lands where it was marked").toContain(
        "Second — locked, Third, First, Fourth",
    );
});

test("pointer: a tap picks up and a second tap places, with no dragging at all", async ({ page }) => {
    await page.locator(item("pair", "Tide Caller")).click();
    await page.locator(item("pair", "Root Golem")).click();

    expect(await readout(page, "pair"), "it left the hand").toContain("hand: Ember Sprite, Gale Warden");
    expect(await readout(page, "pair"), "and landed on the board").toContain("board:");
});

/**
 * A press and release on the same spot is a click, and the browser sends one after a drag too. The first
 * build let that click straight through to the handler that picks an item up, so releasing a drag
 * immediately picked the item back up: it stayed dimmed, the list stayed lit, and nothing the user did
 * afterwards looked connected to anything. The click a drag leaves behind is swallowed in the capture
 * phase, the way the swipe gesture already does it.
 */
test("a drag that has finished leaves nothing being carried", async ({ page }) => {
    await dragBetween(page, item("reorder", "First"), item("reorder", "Third"));

    expect(await carriedCount(page, "reorder"), "nothing is still in hand after the release").toBe(0);
    expect(await readout(page, "reorder"), "and the move committed once, not twice and not at all").toContain(
        "Second — locked, Third, First, Fourth",
    );

    await dragBetween(page, item("reorder", "Third"), item("reorder", "Fourth"));

    expect(await carriedCount(page, "reorder"), "and the same holds for a second drag").toBe(0);
});

/**
 * The insertion marker is positioned rather than laid out, and that is not a styling preference. A marker
 * placed *between* two items pushes every item after it along — which moves the very rects that decide
 * where the marker belongs, so the answer changes, so the marker moves, and a column list spent the whole
 * drag oscillating instead of pointing anywhere. Out of flow, the geometry the drag reads is fixed.
 */
test("carrying an item does not move the items being dragged past", async ({ page }) => {
    const source = await page.locator(item("reorder", "First")).boundingBox();
    const target = await page.locator(item("reorder", "Fourth")).boundingBox();

    if (!source || !target) throw new Error("a drag needs both boxes to exist");

    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2 + 8, { steps: 4 });
    await page.mouse.move(target.x + target.width / 2, target.y + target.height - 2, { steps: 10 });

    expect(await carriedCount(page, "reorder"), "the destination is marked while the carry is live").toBe(1);

    const before = await itemTops(page, "reorder");

    await page.mouse.move(target.x + target.width / 2, target.y + target.height - 4, { steps: 2 });

    expect(await itemTops(page, "reorder"), "and the list does not shuffle under the pointer").toEqual(before);

    await page.mouse.up();
});

/**
 * What the library owes the marker is a box: as wide (or as tall) as the cards it sits between, inside the
 * list's own bounds, and clear of every card. All three were wrong at once and each hid the others.
 * The box had no extent across a column, so the consumer's bar drew nothing and the landing place looked
 * unmarked. The landing place past the last card was clamped back inside the list and so sat *on* that
 * card. Sizes are the consumer's business, so this asserts the span, the containment and the clearance,
 * never a thickness — and it walks the whole list, because only the two ends were ever wrong.
 */
for (const [key, label, axis] of [
    ["reorder", "First", "column"],
    ["row", "Ember Sprite", "row"],
] as const) {
    test(`the ${axis} marker spans its list, stays inside it and clears every card`, async ({ page }) => {
        const source = await page.locator(item(key, label)).boundingBox();
        const list = await page.locator(`${demo(key)} [role="list"]`).boundingBox();

        if (!source || !list) throw new Error("a drag needs both boxes to exist");

        await page.mouse.move(source.x + source.width / 2, source.y + source.height / 2);
        await page.mouse.down();
        await page.mouse.move(source.x + source.width / 2 + 8, source.y + source.height / 2 + 8, { steps: 4 });

        // Every landing place the list has, the two ends included — those were the only ones that failed.
        for (const along of [0.01, 0.3, 0.55, 0.8, 0.99]) {
            await page.mouse.move(
                axis === "row" ? list.x + list.width * along : list.x + list.width / 2,
                axis === "row" ? list.y + list.height / 2 : list.y + list.height * along,
                { steps: 2 },
            );

            const fit = await page.evaluate((selector) => {
                const list = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
                const marker = [...list.children].find((child) => !child.getAttribute("role")) as HTMLElement;

                if (!marker) return "no marker";

                const listRect = list.getBoundingClientRect();
                const markerRect = marker.getBoundingClientRect();
                const overlaps = [...list.querySelectorAll('[role="listitem"]')].filter((element) => {
                    const rect = element.getBoundingClientRect();

                    return (
                        markerRect.right > rect.left + 0.5 &&
                        markerRect.left < rect.right - 0.5 &&
                        markerRect.bottom > rect.top + 0.5 &&
                        markerRect.top < rect.bottom - 0.5
                    );
                });

                const card = (list.querySelector('[role="listitem"]') as HTMLElement).getBoundingClientRect();

                return {
                    spansAcross:
                        Math.round(markerRect.width) === Math.round(card.width) ||
                        Math.round(markerRect.height) === Math.round(card.height),
                    inside:
                        markerRect.top >= listRect.top - 0.5 &&
                        markerRect.bottom <= listRect.bottom + 0.5 &&
                        markerRect.left >= listRect.left - 0.5 &&
                        markerRect.right <= listRect.right + 0.5,
                    cardsCovered: overlaps.length,
                };
            }, demo(key));

            expect(fit, `the marker is whole and clear of every card at ${along} along the list`).toEqual({
                spansAcross: true,
                inside: true,
                cardsCovered: 0,
            });
        }

        await page.mouse.up();
    });
}

/**
 * The Playground anchors its `Viewport` to `window.screen.height` while the box it fills is the browser
 * window, so the scale is 1 only when the two happen to match — which is never on a real machine and
 * always in a headless one. That is why this needs its own spec: every other check here runs at a scale of
 * 1 and cannot see the fault. The marker is placed from on-screen measurements but written as a layout
 * offset, so the two have to be divided apart; before that it landed at a fraction of where it belonged
 * and sat squarely on a card.
 */
test("the landing place is right when the viewport is scaled", async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(window.screen, "height", { value: 1400, configurable: true });
        Object.defineProperty(window.screen, "width", { value: 2400, configurable: true });
    });
    await page.setViewportSize({ width: 1200, height: 700 });
    await page.goto("/sortable");
    await expect(page.locator("[data-example]").first()).toBeVisible();

    await page.locator(item("reorder", "First")).click();

    const list = await page.locator(`${demo("reorder")} [role="list"]`).boundingBox();

    if (!list) throw new Error("the list has to be somewhere");

    for (const along of [0.3, 0.55, 0.8]) {
        await page.mouse.move(list.x + list.width / 2, list.y + list.height * along, { steps: 3 });

        const placed = await page.evaluate((selector) => {
            const list = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
            const marker = [...list.children].find((child) => !child.getAttribute("role")) as HTMLElement;

            if (!marker) return "no marker";

            const markerRect = marker.getBoundingClientRect();
            const listRect = list.getBoundingClientRect();

            return {
                isScaled: Math.abs(listRect.width / list.offsetWidth - 1) > 0.05,
                sitsOnCard: [...list.querySelectorAll('[role="listitem"]')].some((element) => {
                    const rect = element.getBoundingClientRect();

                    return markerRect.bottom > rect.top + 0.5 && markerRect.top < rect.bottom - 0.5;
                }),
            };
        }, demo("reorder"));

        expect(placed, `scaled, and clear of every card at ${along} along the list`).toEqual({
            isScaled: true,
            sitsOnCard: false,
        });
    }
});

/**
 * A list that refuses a card is refused at every route, not only at the drop. `Tab` skips it entirely
 * while carrying something it will not take, so a keyboard user never arrives somewhere that cannot
 * accept them and then finds out on pressing Enter.
 */
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

    expect(await readout(page, "disabled"), "and so is the drag").toContain("Ember Sprite, Gale Warden, Tide Caller");
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

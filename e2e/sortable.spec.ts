import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsSettled, prop, turnDegrees } from "./helpers";

const DOCS = "/src/App/Pages/SortablePage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const PAIR = docsDemo(DOCS, "Pair");
const PICKY = docsDemo(DOCS, "Picky");
const RING = docsDemo(DOCS, "Ring");

const list = (scope: string, label?: string) =>
    `${scope} [role="list"]${label === undefined ? "" : `[aria-label="${label}"]`}`;
const item = (scope: string, label: string) => `${scope} [role="listitem"][aria-label="${label}"]`;

/**
 * No example prints its lists, so the order a list holds is read off the items themselves: each is a
 * `listitem` named by its card, in the order the list draws them.
 */
const orderOf = (page: Page, scope: string, label?: string) =>
    page
        .locator(`${list(scope, label)} [role="listitem"]`)
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("aria-label") ?? ""));

/** The order a list should hold once the card at `from` has been taken out and put back in at `to`. */
const moved = (order: string[], from: number, to: number) => {
    const next = order.filter((_, index) => index !== from);

    next.splice(to, 0, order[from]);

    return next;
};

const chooseProp = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();

    const options = page.locator(`[id="${await picker.getAttribute("aria-controls")}"]`);

    await options.getByRole("option", { name, exact: true }).click();
};

/**
 * The three ways in are the point of the control, so each is driven separately rather than through one
 * helper: a drag, a keyboard pick-move-drop, and — for anyone who can use a pointer but not hold a
 * button down while moving it — a tap to pick and a tap to place. Success criterion 2.5.7 asks for the
 * third and 2.1.1 for the second, so a spec that only covered the drag would be checking the easy third.
 */
const dragBetween = async (page: Page, source: string, target: string, offsetFromBottom = 4) => {
    // A mouse moved to a point outside the window reaches nothing, and the page has grown long enough that an
    // example lower down starts below the fold. Both ends are brought into view before either box is read.
    await page.locator(target).scrollIntoViewIfNeeded();
    await page.locator(source).scrollIntoViewIfNeeded();

    const from = await page.locator(source).boundingBox();
    const to = await page.locator(target).boundingBox();

    if (!from || !to) throw new Error("a drag needs both boxes to exist");

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();

    // The first move only has to beat the slop distance, which is what separates a drag from a click.
    await page.mouse.move(from.x + from.width * 0.5 + 20, from.y + from.height * 0.5, { steps: 5 });
    await page.mouse.move(to.x + to.width * 0.5, to.y + to.height - offsetFromBottom, { steps: 10 });
    await page.mouse.up();
};

/**
 * The marker is the only child of a list that is not one of its items, so counting those says whether
 * something is being carried without reading a class name off the consumer's paint.
 */
const carriedCount = (page: Page, scope: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="list"]`)].reduce(
                (count, list) => count + [...list.children].filter((child) => !child.getAttribute("role")).length,
                0,
            ),
        scope,
    );

const markerTop = (page: Page, scope: string) =>
    page.evaluate((selector) => {
        const list = document.querySelector(`${selector} [role="list"]`) as HTMLElement;
        const marker = [...list.children].find((child) => !child.getAttribute("role"));

        return marker ? Math.round(marker.getBoundingClientRect().top) : -1;
    }, scope);

const itemTops = (page: Page, scope: string) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(`${selector} [role="listitem"]`)].map((element) =>
                Math.round(element.getBoundingClientRect().top),
            ),
        scope,
    );

test.beforeEach(async ({ page }) => {
    await page.goto("/sortable/docs");
    await expect(page.locator(list(BASIC))).toBeVisible();
    await docsSettled(page);
});

test("a list owns its role and its items carry their place in it", async ({ page }) => {
    await expect(page.locator(list(BASIC)), "the library owns the list role").toHaveCount(1);
    await expect(page.locator(`${BASIC} [role="listitem"]`), "one item per record").toHaveCount(4);

    await expect(page.locator(item(BASIC, "First")), "and each says where it sits").toHaveAttribute(
        "aria-posinset",
        "1",
    );
    await expect(page.locator(item(BASIC, "First")), "out of how many").toHaveAttribute("aria-setsize", "4");
});

test("a list is one tab stop, and the arrows walk it", async ({ page }) => {
    await page.locator(item(BASIC, "First")).focus();

    expect(
        await page.locator(item(BASIC, "First")).evaluate((element) => (element as HTMLElement).tabIndex),
        "the item focus is on is the one tab stop",
    ).toBe(0);
    expect(
        await page.locator(item(BASIC, "Third")).evaluate((element) => (element as HTMLElement).tabIndex),
        "and every other item is out of the tab order",
    ).toBe(-1);

    await page.keyboard.press("ArrowDown");
    await expect(page.locator(item(BASIC, "Third")), "the walk skips the disabled second item").toBeFocused();
});

/**
 * Two presses of the arrow have to move the item two places. The trap here is that the landing place
 * either side of an item is the same place — an item put "after itself" has not moved — so a naive
 * implementation spends the first press going nowhere. The component therefore counts in settled
 * positions, where the carried item is already out of the list, and converts to a landing place only
 * when the drop commits.
 */
test("keyboard: a pick, two moves and a drop land two places along", async ({ page }) => {
    const before = await orderOf(page, BASIC);

    await page.locator(item(BASIC, "First")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect
        .poll(() => orderOf(page, BASIC), { message: "the first item has passed two of its neighbors" })
        .toEqual(moved(before, 0, 2));
});

test("keyboard: Escape puts the item back where it was", async ({ page }) => {
    await chooseProp(page, "orientation", "horizontal");

    const before = await orderOf(page, BASIC);

    await page.locator(item(BASIC, "First")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");

    expect(await orderOf(page, BASIC), "a canceled carry changes nothing").toEqual(before);
});

test("keyboard: Tab moves the carried item to the other list", async ({ page }) => {
    const hand = await orderOf(page, PAIR, "Hand");
    const board = await orderOf(page, PAIR, "Board");

    await page.locator(item(PAIR, "Ember Sprite")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect
        .poll(() => orderOf(page, PAIR, "Hand"), { message: "it left the hand" })
        .toEqual(hand.filter((label) => label !== "Ember Sprite"));
    expect(await orderOf(page, PAIR, "Board"), "and arrived at the end of the board").toEqual([
        ...board,
        "Ember Sprite",
    ]);
});

test("pointer: a drag carries an item into the other list", async ({ page }) => {
    const hand = await orderOf(page, PAIR, "Hand");
    const board = await orderOf(page, PAIR, "Board");

    await dragBetween(page, item(PAIR, "Gale Warden"), list(PAIR, "Board"));

    await expect
        .poll(() => orderOf(page, PAIR, "Hand"), { message: "it left the hand" })
        .toEqual(hand.filter((label) => label !== "Gale Warden"));
    expect(await orderOf(page, PAIR, "Board"), "and landed on the board").toEqual([...board, "Gale Warden"]);
});

/**
 * A tap-carry is not a drag with the button up: nothing is holding the pointer, so the moves arrive at the
 * document rather than at the item. The first build listened for them only to move the copy under the
 * cursor and never to re-aim, so the copy followed the pointer while the landing place stayed where it had
 * been picked up — the drop then landed somewhere the page had never marked.
 */
test("pointer: a tap-carry re-aims as the pointer moves, with no button held", async ({ page }) => {
    const before = await orderOf(page, BASIC);

    await page.locator(item(BASIC, "First")).click();

    const box = await page.locator(list(BASIC)).boundingBox();

    if (!box) throw new Error("the list has to be somewhere");

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.3, { steps: 3 });

    const near = await markerTop(page, BASIC);

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.8, { steps: 3 });

    expect(await markerTop(page, BASIC), "the landing place tracks the pointer").not.toBe(near);

    await page.mouse.down();
    await page.mouse.up();

    await expect
        .poll(() => orderOf(page, BASIC), { message: "and the drop lands where it was marked" })
        .toEqual(moved(before, 0, 2));
});

/**
 * The single-pointer route 2.5.7 asks for. A press that never moves far enough to be a drag is a click,
 * and a click picks up; the next click places. The two are one state machine with the keyboard route,
 * which is why canceling works the same way for both.
 */
test("pointer: a tap picks up and a second tap places, with no dragging at all", async ({ page }) => {
    const hand = await orderOf(page, PAIR, "Hand");

    await page.locator(item(PAIR, "Tide Caller")).click();
    await page.locator(item(PAIR, "Root Golem")).click();

    await expect
        .poll(() => orderOf(page, PAIR, "Hand"), { message: "it left the hand" })
        .toEqual(hand.filter((label) => label !== "Tide Caller"));
    expect(await orderOf(page, PAIR, "Board"), "and landed on the board").toContain("Tide Caller");
});

/**
 * A press and release on the same spot is a click, and the browser sends one after a drag too. The first
 * build let that click straight through to the handler that picks an item up, so releasing a drag
 * immediately picked the item back up: it stayed dimmed, the list stayed lit, and nothing the user did
 * afterwards looked connected to anything. The click a drag leaves behind is swallowed in the capture
 * phase, the way the swipe gesture already does it.
 */
test("a drag that has finished leaves nothing being carried", async ({ page }) => {
    const before = await orderOf(page, BASIC);

    await dragBetween(page, item(BASIC, "First"), item(BASIC, "Third"));

    expect(await carriedCount(page, BASIC), "nothing is still in hand after the release").toBe(0);
    await expect
        .poll(() => orderOf(page, BASIC), { message: "and the move committed once, not twice and not at all" })
        .toEqual(moved(before, 0, 2));

    await dragBetween(page, item(BASIC, "Third"), item(BASIC, "Fourth"));

    expect(await carriedCount(page, BASIC), "and the same holds for a second drag").toBe(0);
});

/**
 * The insertion marker is positioned rather than laid out, and that is not a styling preference. A marker
 * placed *between* two items pushes every item after it along — which moves the very rects that decide
 * where the marker belongs, so the answer changes, so the marker moves, and a column list spent the whole
 * drag oscillating instead of pointing anywhere. Out of flow, the geometry the drag reads is fixed.
 */
test("carrying an item does not move the items being dragged past", async ({ page }) => {
    const source = await page.locator(item(BASIC, "First")).boundingBox();
    const target = await page.locator(item(BASIC, "Fourth")).boundingBox();

    if (!source || !target) throw new Error("a drag needs both boxes to exist");

    await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5 + 8, { steps: 4 });
    await page.mouse.move(target.x + target.width * 0.5, target.y + target.height - 2, { steps: 10 });

    expect(await carriedCount(page, BASIC), "the destination is marked while the carry is live").toBe(1);

    const before = await itemTops(page, BASIC);

    await page.mouse.move(target.x + target.width * 0.5, target.y + target.height - 4, { steps: 2 });

    expect(await itemTops(page, BASIC), "and the list does not shuffle under the pointer").toEqual(before);

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
for (const [orientation, axis] of [
    ["vertical", "column"],
    ["horizontal", "row"],
] as const) {
    test(`the ${axis} marker spans its list, stays inside it and clears every card`, async ({ page }) => {
        if (orientation === "horizontal") await chooseProp(page, "orientation", orientation);

        const source = await page.locator(item(BASIC, "First")).boundingBox();
        const box = await page.locator(list(BASIC)).boundingBox();

        if (!source || !box) throw new Error("a drag needs both boxes to exist");

        await page.mouse.move(source.x + source.width * 0.5, source.y + source.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(source.x + source.width * 0.5 + 8, source.y + source.height * 0.5 + 8, { steps: 4 });

        // Every landing place the list has, the two ends included — those were the only ones that failed.
        for (const along of [0.01, 0.3, 0.55, 0.8, 0.99]) {
            await page.mouse.move(
                axis === "row" ? box.x + box.width * along : box.x + box.width * 0.5,
                axis === "row" ? box.y + box.height * 0.5 : box.y + box.height * along,
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
            }, BASIC);

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
    await page.goto("/sortable/docs");
    await expect(page.locator(list(BASIC))).toBeVisible();
    await docsSettled(page);

    await page.locator(item(BASIC, "First")).click();

    const box = await page.locator(list(BASIC)).boundingBox();

    if (!box) throw new Error("the list has to be somewhere");

    for (const along of [0.3, 0.55, 0.8]) {
        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * along, { steps: 3 });

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
        }, BASIC);

        expect(placed, `scaled, and clear of every card at ${along} along the list`).toEqual({
            isScaled: true,
            sitsOnCard: false,
        });
    }
});

/**
 * A list that refuses a card is refused at every route, not only at the drop. `Tab` skips it entirely
 * while carrying something it will not take, so a keyboard user never arrives somewhere that cannot
 * accept them and then finds out on pressing Enter. Which cards the board refuses is the example's data —
 * the hand's dearest card is refused and its cheapest taken.
 */
test("a list that refuses an item is not offered as a destination", async ({ page }) => {
    const hand = await orderOf(page, PICKY, "Hand");

    await page.locator(item(PICKY, "Tide Caller")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    expect(await orderOf(page, PICKY, "Hand"), "the expensive card is still in the hand").toEqual(hand);
    expect(await orderOf(page, PICKY, "Board"), "and the board is still empty").toEqual([]);

    await page.locator(item(PICKY, "Ember Sprite")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    await expect
        .poll(() => orderOf(page, PICKY, "Board"), { message: "while a cheap one crosses" })
        .toEqual(["Ember Sprite"]);
});

test("a locked list can still be reordered from inside", async ({ page }) => {
    await page.locator(`${prop("isBoardLocked")} input`).click();

    const hand = await orderOf(page, PAIR, "Hand");
    const board = await orderOf(page, PAIR, "Board");

    await page.locator(item(PAIR, "Root Golem")).focus();

    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");

    expect(await orderOf(page, PAIR, "Board"), "nothing crossed into it").toEqual(board);

    await dragBetween(page, item(PAIR, "Ember Sprite"), list(PAIR, "Board"));

    expect(await orderOf(page, PAIR, "Hand"), "and a drag into it is refused as well").toEqual(hand);
    expect(await orderOf(page, PAIR, "Board"), "leaving the board as it was").toEqual(board);
});

test("a disabled list moves nothing, by pointer or by key", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();

    await expect(page.locator(list(BASIC)), "the list says it is disabled").toHaveAttribute("aria-disabled", "true");

    const before = await orderOf(page, BASIC);

    await page.locator(item(BASIC, "First")).focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    expect(await orderOf(page, BASIC), "the keyboard route is inert").toEqual(before);

    await dragBetween(page, item(BASIC, "First"), list(BASIC));

    expect(await orderOf(page, BASIC), "and so is the drag").toEqual(before);
});

test("a disabled item cannot be picked up, by any route", async ({ page }) => {
    const before = await orderOf(page, BASIC);

    await page.locator(item(BASIC, "First")).focus();
    await page.keyboard.press("ArrowDown");

    await expect(page.locator(item(BASIC, "Third")), "the arrows never land on it").toBeFocused();

    await page.locator(item(BASIC, "Second")).click();
    await page.locator(item(BASIC, "Fourth")).click();

    expect(await orderOf(page, BASIC), "and a tap on it starts nothing").toEqual(before);
});

/**
 * A row decides where a drop lands by comparing one coordinate against each item's midpoint. A ring has no
 * such coordinate — the item at twelve o'clock is neither before nor after the one at three — so a placed
 * list asks the layout which placement is nearest instead, which is what `PlacementUtils.pickIndex` was
 * built for and what nothing had called until now.
 *
 * The check is a relationship rather than a position: drag the first card to where the third one is drawn
 * and the third card's place is what it should take. Nothing here writes down a coordinate.
 */
const ringCards = (page: Page) => orderOf(page, RING);

test("a ring picks the nearest place to drop into, having no axis to compare", async ({ page }) => {
    const before = await ringCards(page);

    expect(before.length, "the ring has cards to move").toBeGreaterThan(2);

    await dragBetween(page, `${RING} [role="listitem"] >> nth=0`, `${RING} [role="listitem"] >> nth=2`, 0);

    const after = await ringCards(page);

    expect(after, "the same cards, in a different order").toHaveLength(before.length);
    expect(after.indexOf(before[0]), "the card dragged onto the third place is no longer the first").toBeGreaterThan(0);
});

test("a placed list keeps the keyboard route, which never had an axis to lose", async ({ page }) => {
    const before = await ringCards(page);

    await page.locator(`${RING} [role="listitem"]`).first().focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");

    expect(await ringCards(page), "picking a place with the arrows still moves the card").not.toEqual(before);
});

/**
 * A row can put a landing mark at an offset along itself. A ring has no offset to put one at, so the mark is
 * placed like an item: the abstract works out the gap between the two neighbors the card would land
 * between — measured from the borders that face each other rather than from the two centers — and turns it to
 * lie across the line joining them. What a spec can read off that is the turn, which a row's mark never has.
 */
test("a ring marks the gap it would land in, turned to lie across it", async ({ page }) => {
    const cards = page.locator(`${RING} [role="listitem"]`);
    const marker = page.locator(`${RING} [data-marker]`);

    await expect(marker, "nothing is marked while nothing is being carried").toHaveCount(0);

    await page.locator(list(RING)).scrollIntoViewIfNeeded();

    const from = (await cards.nth(0).boundingBox())!;
    const to = (await cards.nth(2).boundingBox())!;

    await page.mouse.move(from.x + from.width * 0.5, from.y + from.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(from.x + from.width * 0.5 + 20, from.y + from.height * 0.5, { steps: 5 });
    await page.mouse.move(to.x + to.width * 0.5, to.y + to.height * 0.5, { steps: 10 });

    await expect(marker, "one mark, for the one place it would land").toHaveCount(1);

    // The mark's own element is the consumer's paint; the box the library placed is the one above it.
    // Every presentational ancestor holds the mark, and the innermost of them is the box the layout placed.
    const box = page
        .locator(`${RING} [role="presentation"]`)
        .filter({ has: page.locator("[data-marker]") })
        .last();
    const turn = await turnDegrees(box);

    expect(turn % 360, "the mark is placed the way an item is, and turned to a real bearing as well as moved").not.toBe(
        0,
    );

    await page.mouse.up();
    await expect(marker, "and it goes once the card is put down").toHaveCount(0);
});

/**
 * Four items round a ring leave four gaps a quarter turn apart, so the marks for them should be a quarter
 * turn apart too. Checking them as a set rather than one at a time is what catches a single wrong one: the
 * gap at the end of the list is the only one with an imagined neighbor, and aiming it by reversing the last
 * join instead of by carrying the ring round put it a quarter turn out — correct-looking on its own, and
 * obvious the moment the four are compared.
 */
test("the four gaps of a ring are a quarter turn apart, the last one included", async ({ page }) => {
    await page.locator(list(RING)).scrollIntoViewIfNeeded();

    const box = (await page.locator(list(RING)).boundingBox())!;
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

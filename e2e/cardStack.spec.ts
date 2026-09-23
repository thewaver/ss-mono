import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { demo, prop, readout, waitUntilStill } from "./helpers";

/**
 * The stack renders the pile and nothing else, so every button here is the page's own — four sends and a
 * recall beside the deck, two sends beside the endless one — and each is looked up by its id. What the
 * checks read back is the pile itself: which card is on top, which is behind it, and whether the one that
 * left is gone. Only the top card is reachable; the rest are in the document but hidden and inert, which is
 * what "the top card" means to a screen reader as much as to the eye.
 *
 * Nothing here waits on a clock. A sent card flies for the page's duration and the pile moves on when the
 * flight ends, so every check waits for the top card to change rather than for a span of time to pass.
 */
const DECK = demo("deck");
const ENDLESS = demo("endless");

const stack = (scope: string) => `${scope} [aria-roledescription="card stack"]`;
const cards = (scope: string) => `${stack(scope)} [aria-roledescription="card"]`;
const topCard = (scope: string) => `${cards(scope)}:not([aria-hidden="true"])`;

const field = (key: string) => `${prop(key)} input`;

const DRAG_STEPS = 10;

const labelOf = (page: Page, selector: string) =>
    page.evaluate((value) => document.querySelector(value)?.getAttribute("aria-label") ?? null, selector);

const topLabel = (page: Page, scope: string) => labelOf(page, topCard(scope));

const secondLabel = (page: Page, scope: string) =>
    page.evaluate((value) => document.querySelectorAll(value)[1]?.getAttribute("aria-label") ?? null, cards(scope));

/**
 * Sends are refused while a card is still in flight, so a step that sends has to see the pile settle before
 * the next one starts. The top card changing is that moment: the stack advances the pile in the same beat
 * as it clears the flight.
 */
const untilTopChanges = async (page: Page, scope: string, act: () => Promise<void>) => {
    const before = await topLabel(page, scope);

    await act();
    await expect.poll(() => topLabel(page, scope), "the pile moves on").not.toBe(before);
};

/**
 * The swipe is measured against the stack's own box, so a drag is written as fractions of it: a pair of
 * points from the middle outward, far enough past the commit ratio that the release sends the card.
 */
const swipe = async (page: Page, scope: string, to: { x: number; y: number }) => {
    const box = (await page.locator(stack(scope)).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to.x, box.y + box.height * to.y, { steps: DRAG_STEPS });
    await page.mouse.up();
};

const SWIPES = {
    left: { x: 0.1, y: 0.5 },
    right: { x: 0.9, y: 0.5 },
    up: { x: 0.5, y: 0.1 },
    down: { x: 0.5, y: 0.9 },
};

/**
 * Whether the stack claimed an arrow key is only observable as `defaultPrevented`, which is also the thing
 * that decides whether the page scrolls. A listener on the window runs after the stack's own, delegated to
 * the document, so it reads the verdict rather than racing it.
 */
const recordKeyVerdicts = (page: Page) =>
    page.evaluate(() => {
        const verdicts: Array<{ key: string; isClaimed: boolean }> = [];

        (window as unknown as { keyVerdicts: typeof verdicts }).keyVerdicts = verdicts;
        window.addEventListener("keydown", (e) => verdicts.push({ key: e.key, isClaimed: e.defaultPrevented }));
    });

const keyVerdict = (page: Page, key: string) =>
    page.evaluate(
        (name) =>
            (window as unknown as { keyVerdicts: Array<{ key: string; isClaimed: boolean }> }).keyVerdicts
                .filter((verdict) => verdict.key === name)
                .at(-1)?.isClaimed,
        key,
    );

const loadedCount = async (page: Page) => Number(/(\d+) cards loaded/.exec(await readout(page, "endless"))?.[1]);

test.beforeEach(async ({ page }) => {
    await page.goto("/card-stack");
    await expect(page.locator(stack(DECK))).toBeVisible();
    await page.mouse.move(0, 0);
});

test("the stack and its cards say what they are, and only the top card is in reach", async ({ page }) => {
    await expect(page.locator(stack(DECK))).toHaveAttribute("role", "group");
    await expect(page.locator(stack(DECK))).toHaveAttribute("aria-label", "Deck of cards");
    await expect(page.locator(stack(DECK)), "the stack takes focus, which is what the arrow keys need").toHaveAttribute(
        "tabindex",
        "0",
    );

    await expect(page.locator(topCard(DECK)), "exactly one card is on top").toHaveCount(1);
    await expect(page.locator(topCard(DECK))).toHaveAttribute("role", "group");
    await expect(page.locator(topCard(DECK))).not.toHaveAttribute("inert");

    const behind = page.locator(`${cards(DECK)}[aria-hidden="true"]`);

    expect(await behind.count(), "the rest of the pile is there, behind it").toBeGreaterThan(0);
    await expect(behind.first(), "and out of reach rather than merely out of sight").toHaveAttribute("inert", "");
});

test("a send button sends the top card that way, and the card behind it comes up", async ({ page }) => {
    for (const direction of ["left", "right", "up", "down"] as const) {
        const sent = await topLabel(page, DECK);
        const next = await secondLabel(page, DECK);

        await untilTopChanges(page, DECK, () => page.locator(`#send-${direction}`).click());

        expect(await topLabel(page, DECK), "the card that was behind is now on top").toBe(next);
        await expect(
            page.locator(`${cards(DECK)}[aria-label="${sent}"]`),
            "and the card that left is gone from the pile",
        ).toHaveCount(0);
        expect(await readout(page, "deck"), "the page is told which way it went").toMatch(
            new RegExp(`\\b${direction}$`),
        );
    }
});

test("each arrow key sends the top card its way, and the stack claims the key it used", async ({ page }) => {
    await recordKeyVerdicts(page);
    await page.locator(stack(DECK)).focus();

    for (const [key, direction] of [
        ["ArrowLeft", "left"],
        ["ArrowRight", "right"],
        ["ArrowUp", "up"],
        ["ArrowDown", "down"],
    ] as const) {
        const next = await secondLabel(page, DECK);

        await untilTopChanges(page, DECK, () => page.keyboard.press(key));

        expect(await topLabel(page, DECK)).toBe(next);
        expect(await readout(page, "deck")).toMatch(new RegExp(`\\b${direction}$`));
        expect(await keyVerdict(page, key), `${key} does not also scroll the page`).toBe(true);
    }
});

test("a swipe sends the top card the way the pointer went", async ({ page }) => {
    for (const direction of ["left", "right", "up", "down"] as const) {
        const next = await secondLabel(page, DECK);

        await untilTopChanges(page, DECK, () => swipe(page, DECK, SWIPES[direction]));

        expect(await topLabel(page, DECK)).toBe(next);
        expect(await readout(page, "deck")).toMatch(new RegExp(`\\b${direction}$`));
    }
});

test("a swipe let go short of the commit ratio puts the card back where it was", async ({ page }) => {
    const before = await topLabel(page, DECK);
    const restingBox = await page.locator(topCard(DECK)).boundingBox();

    await swipe(page, DECK, { x: 0.45, y: 0.5 });
    await waitUntilStill(page.locator(topCard(DECK)));

    expect(await topLabel(page, DECK), "the same card is still on top").toBe(before);
    expect(await page.locator(topCard(DECK)).boundingBox(), "and it is back in its place").toEqual(restingBox);
});

test("recall brings the last card back, and is off while nothing has left", async ({ page }) => {
    await expect(page.locator("#recall"), "nothing has left yet, so there is nothing to recall").toHaveAttribute(
        "aria-disabled",
        "true",
    );

    const first = await topLabel(page, DECK);

    await untilTopChanges(page, DECK, () => page.locator("#send-right").click());

    const second = await topLabel(page, DECK);

    await untilTopChanges(page, DECK, () => page.locator("#send-up").click());
    await expect(page.locator("#recall")).not.toHaveAttribute("aria-disabled", "true");

    await untilTopChanges(page, DECK, () => page.locator("#recall").click());
    await waitUntilStill(page.locator(topCard(DECK)));
    expect(await topLabel(page, DECK), "the card that left last is the one that returns").toBe(second);

    await untilTopChanges(page, DECK, () => page.locator("#recall").click());
    expect(await topLabel(page, DECK), "and recalling again walks back through the pile").toBe(first);

    await expect(page.locator("#recall"), "back at the start, recall is off again").toHaveAttribute(
        "aria-disabled",
        "true",
    );
});

test("sending every card empties the pile, turns the sends off, and dealing puts it all back", async ({ page }) => {
    await page.locator(field("transitionDurationMs")).fill("0");
    await page.locator(field("transitionDurationMs")).blur();

    const first = await topLabel(page, DECK);

    while ((await page.locator(cards(DECK)).count()) > 0) {
        await untilTopChanges(page, DECK, () => page.locator("#send-left").click());
    }

    for (const direction of ["left", "right", "up", "down"]) {
        await expect(page.locator(`#send-${direction}`), "with nothing to send, the sends are off").toHaveAttribute(
            "aria-disabled",
            "true",
        );
    }

    await expect(page.locator("#recall"), "while the last card can still be brought back").not.toHaveAttribute(
        "aria-disabled",
        "true",
    );

    await page.locator("#deal").click();

    expect(await topLabel(page, DECK), "dealing starts the pile over from its first card").toBe(first);
    await expect(page.locator("#deal"), "and the deal button goes once there is a pile again").toHaveCount(0);
    await expect(page.locator("#send-left")).not.toHaveAttribute("aria-disabled", "true");
});

test("a stack that allows only left and right refuses up and down by every route it has", async ({ page }) => {
    await recordKeyVerdicts(page);

    const before = await topLabel(page, ENDLESS);

    await page.locator(stack(ENDLESS)).focus();

    for (const key of ["ArrowUp", "ArrowDown"]) {
        await page.keyboard.press(key);

        expect(await keyVerdict(page, key), `${key} is left to the page, so it scrolls as usual`).toBe(false);
    }

    await swipe(page, ENDLESS, SWIPES.up);
    await swipe(page, ENDLESS, SWIPES.down);

    await expect(
        page.locator(`${ENDLESS} #endless-send-up, ${ENDLESS} #endless-send-down`),
        "no button offers it",
    ).toHaveCount(0);

    await page.locator(stack(ENDLESS)).focus();
    await untilTopChanges(page, ENDLESS, () => page.keyboard.press("ArrowLeft"));

    expect(await keyVerdict(page, "ArrowLeft"), "while an allowed key is claimed").toBe(true);
    expect(
        await readout(page, "endless"),
        "and the first card to leave is the one that was on top all along, by the allowed way",
    ).toMatch(new RegExp(`^${before} went left\\b`));

    await untilTopChanges(page, ENDLESS, () => swipe(page, ENDLESS, SWIPES.right));
    expect(await readout(page, "endless"), "an allowed swipe still sends").toMatch(/ went right\b/);
});

test("the endless deck loads more as the pile runs low, so it never empties", async ({ page }) => {
    await page.locator(field("transitionDurationMs")).fill("0");
    await page.locator(field("transitionDurationMs")).blur();

    await untilTopChanges(page, ENDLESS, () => page.locator("#endless-send-left").click());

    const loadedAtStart = await loadedCount(page);
    const sendsPastFirstBatch = loadedAtStart + 2;

    for (let sent = 1; sent < sendsPastFirstBatch; sent++) {
        await untilTopChanges(page, ENDLESS, () =>
            page.locator(`#endless-send-${sent % 2 ? "right" : "left"}`).click(),
        );
    }

    expect(await loadedCount(page), "more cards arrived before the first batch ran out").toBeGreaterThan(loadedAtStart);
    await expect(page.locator(topCard(ENDLESS)), "and there is still a card on top").toHaveCount(1);
    await expect(page.locator("#endless-send-left")).not.toHaveAttribute("aria-disabled", "true");
});

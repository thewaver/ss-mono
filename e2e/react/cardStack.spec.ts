import { type Page, expect, test } from "@playwright/test";

import { waitUntilStill } from "../helpers";

/**
 * The React `CardStack`, over the React swipe hooks and the pile it shares with the Solid one. The cases follow
 * `e2e/cardStack.spec.ts`: what the stack and its cards say they are, sending by the story's buttons, by each arrow
 * key and by a swipe, a swipe let go short springing back, recall walking back through the pile, emptying and dealing
 * again, a stack that allows only one axis refusing the other by every route, and a deck that loads more as it runs
 * low. Two more are React's own: the controller's getters reach the consumer through `subscribe`, which is what the
 * story's buttons follow, and a pile handed `topIndexState` moves on when its owner sets it.
 *
 * Nothing here waits on a clock: a check that sends waits for the top card to change.
 */
const STORY = "Exotics/CardStack";

const DECK = '[data-testid="deck"]';
const ENDLESS = '[data-testid="endless"]';

const stack = (scope: string) => `${scope} [aria-roledescription="card stack"]`;
const cards = (scope: string) => `${stack(scope)} [aria-roledescription="card"]`;
const topCard = (scope: string) => `${cards(scope)}:not([aria-hidden="true"])`;

const DRAG_STEPS = 10;

const readout = (page: Page, scope: string) =>
    page
        .locator(`${scope} output`)
        .textContent()
        .then((text) => text ?? "");

const labelOf = (page: Page, selector: string) =>
    page.evaluate((value) => document.querySelector(value)?.getAttribute("aria-label") ?? null, selector);

const topLabel = (page: Page, scope: string) => labelOf(page, topCard(scope));

const secondLabel = (page: Page, scope: string) =>
    page.evaluate((value) => document.querySelectorAll(value)[1]?.getAttribute("aria-label") ?? null, cards(scope));

const untilTopChanges = async (page: Page, scope: string, act: () => Promise<void>) => {
    const before = await topLabel(page, scope);

    await act();
    await expect.poll(() => topLabel(page, scope), "the pile moves on").not.toBe(before);
};

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

/** Whether the stack claimed a key is only observable as `defaultPrevented`, read after the stack's own listener. */
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

const setDuration = async (page: Page, scope: string, value: string) => {
    await page.locator(`${scope} [data-field="transitionDurationMs"] input`).fill(value);
};

const loadedCount = async (page: Page) => Number(/(\d+) cards loaded/.exec(await readout(page, ENDLESS))?.[1]);

test.describe("the deck", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Deck`);
        await expect(page.locator(stack(DECK))).toBeVisible();
        await page.mouse.move(0, 0);
    });

    test("the stack and its cards say what they are, and only the top card is in reach", async ({ page }) => {
        await expect(page.locator(stack(DECK))).toHaveAttribute("role", "group");
        await expect(page.locator(stack(DECK))).toHaveAttribute("aria-label", "Deck of cards");
        await expect(page.locator(stack(DECK)), "the stack takes focus for the arrow keys").toHaveAttribute(
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
                "the card that left is gone",
            ).toHaveCount(0);
            expect(await readout(page, DECK), "the page is told which way it went").toMatch(
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
            expect(await readout(page, DECK)).toMatch(new RegExp(`\\b${direction}$`));
            expect(await keyVerdict(page, key), `${key} does not also scroll the page`).toBe(true);
        }
    });

    test("a swipe sends the top card the way the pointer went", async ({ page }) => {
        for (const direction of ["left", "right", "up", "down"] as const) {
            const next = await secondLabel(page, DECK);

            await untilTopChanges(page, DECK, () => swipe(page, DECK, SWIPES[direction]));

            expect(await topLabel(page, DECK)).toBe(next);
            expect(await readout(page, DECK)).toMatch(new RegExp(`\\b${direction}$`));
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
        await expect(page.locator("#recall"), "nothing has left yet").toHaveAttribute("aria-disabled", "true");

        const first = await topLabel(page, DECK);

        await untilTopChanges(page, DECK, () => page.locator("#send-right").click());

        const second = await topLabel(page, DECK);

        await untilTopChanges(page, DECK, () => page.locator("#send-up").click());
        await expect(page.locator("#recall"), "the controller's getter reached the button").not.toHaveAttribute(
            "aria-disabled",
            "true",
        );

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
        await setDuration(page, DECK, "0");

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

        await expect(page.locator("#recall"), "while the last card can still come back").not.toHaveAttribute(
            "aria-disabled",
            "true",
        );

        await page.locator("#deal").click();

        await expect.poll(() => topLabel(page, DECK), "dealing starts over from the first card").toBe(first);
        await expect(page.locator("#deal"), "and the deal button goes once there is a pile again").toHaveCount(0);
        await expect(page.locator("#send-left")).not.toHaveAttribute("aria-disabled", "true");
    });
});

test.describe("the endless deck", () => {
    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Endless`);
        await expect(page.locator(stack(ENDLESS))).toBeVisible();
        await page.mouse.move(0, 0);
    });

    test("a stack that allows only left and right refuses up and down by every route it has", async ({ page }) => {
        await recordKeyVerdicts(page);

        const before = await topLabel(page, ENDLESS);

        await page.locator(stack(ENDLESS)).focus();

        for (const key of ["ArrowUp", "ArrowDown"]) {
            await page.keyboard.press(key);

            expect(await keyVerdict(page, key), `${key} is left to the page`).toBe(false);
        }

        await swipe(page, ENDLESS, SWIPES.up);
        await swipe(page, ENDLESS, SWIPES.down);

        await expect(
            page.locator(`${ENDLESS} #endless-send-up, ${ENDLESS} #endless-send-down`),
            "no button",
        ).toHaveCount(0);
        expect(await topLabel(page, ENDLESS), "and the card on top never left").toBe(before);

        await page.locator(stack(ENDLESS)).focus();
        await untilTopChanges(page, ENDLESS, () => page.keyboard.press("ArrowLeft"));

        expect(await keyVerdict(page, "ArrowLeft"), "while an allowed key is claimed").toBe(true);
        expect(await readout(page, ENDLESS), "the first card to leave was the one on top all along").toMatch(
            new RegExp(`^${before} went left\\b`),
        );

        await untilTopChanges(page, ENDLESS, () => swipe(page, ENDLESS, SWIPES.right));
        expect(await readout(page, ENDLESS), "an allowed swipe still sends").toMatch(/ went right\b/);
    });

    test("the endless deck loads more as the pile runs low, so it never empties", async ({ page }) => {
        await setDuration(page, ENDLESS, "0");

        await untilTopChanges(page, ENDLESS, () => page.locator("#endless-send-left").click());

        const loadedAtStart = await loadedCount(page);
        const sendsPastFirstBatch = loadedAtStart + 2;

        for (let sent = 1; sent < sendsPastFirstBatch; sent++) {
            await untilTopChanges(page, ENDLESS, () =>
                page.locator(`#endless-send-${sent % 2 ? "right" : "left"}`).click(),
            );
        }

        expect(await loadedCount(page), "more cards arrived before the first batch ran out").toBeGreaterThan(
            loadedAtStart,
        );
        await expect(page.locator(topCard(ENDLESS)), "and there is still a card on top").toHaveCount(1);
    });
});

test("a pile handed its top index moves on when its owner sets it", async ({ page, mount }) => {
    await mount(`${STORY}/Controlled`);

    const scope = '[data-testid="controlled"]';

    expect(await topLabel(page, scope)).toBe("Ace");

    await page.locator("#skip").click();

    await expect.poll(() => topLabel(page, scope), "two cards were moved past").toBe("Queen");

    await page.locator(stack(scope)).focus();
    await untilTopChanges(page, scope, () => page.keyboard.press("ArrowLeft"));

    await expect(page.locator(`${scope} output`), "and a send writes back to the owner").toHaveText("top index 3");
});

test("a disabled stack sends nothing, by key or by swipe", async ({ page, mount }) => {
    await mount(`${STORY}/Disabled`);

    const scope = '[data-testid="disabled"]';

    await expect(page.locator(stack(scope))).toHaveAttribute("aria-disabled", "true");

    await page.locator(stack(scope)).focus();
    await page.keyboard.press("ArrowLeft");
    await swipe(page, scope, SWIPES.right);
    await waitUntilStill(page.locator(topCard(scope)));

    expect(await topLabel(page, scope), "the top card is still the first").toBe("Ace");
});

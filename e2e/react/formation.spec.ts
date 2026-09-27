import { type Page, expect, test } from "@playwright/test";

import { computedStyle } from "../helpers";

/**
 * The React `Formation`, over the React `PlacementBox` and `PlacementItem`. The cases follow `e2e/formation.spec.ts`,
 * which covers the Solid one, so the two frameworks are held to the same behavior: every position is written in `cqw`
 * and resolved by the browser against the formation, the arrangement is right on the first paint, the stacking order
 * is the consumer's, an item keeps its element while others come and go, and a glide runs only when one is asked for.
 *
 * The Playground's knobs are story props where a fresh mount answers the question, and story buttons where the Solid
 * spec changes one mounted formation: taking the first item out, and switching to a ring.
 */
const STORY = "Exotics/Formation/Default";
const FORMATION = '[data-testid="default"]';
const ROOT = `${FORMATION} div[style*="cqw"]`;
const ITEM = `${FORMATION} div[style*="left"]`;

const boxOf = (page: Page, index: number) =>
    page.evaluate(
        (args) => {
            const element = document.querySelectorAll(args.selector)[args.index] as HTMLElement;
            const formation = element.closest("div")!.parentElement as HTMLElement;

            return {
                left: element.offsetLeft,
                top: element.offsetTop,
                width: element.offsetWidth,
                hostWidth: formation.offsetWidth,
                hostHeight: formation.offsetHeight,
            };
        },
        { selector: ITEM, index },
    );

type Mount = (story: string, props?: Record<string, unknown>) => Promise<unknown>;

const mountFormation = async (mount: Mount, page: Page, props?: Record<string, unknown>) => {
    await mount(STORY, props);
    await expect(page.locator(ITEM).first()).toBeVisible();
};

const runningAnimations = (page: Page) =>
    page.evaluate(
        (selector) =>
            [...document.querySelectorAll(selector)].reduce(
                (count, element) => count + element.getAnimations().length,
                0,
            ),
        ITEM,
    );

test("the formation is a query container, which is what the written units resolve against", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const container = await page.evaluate(
        (selector) => getComputedStyle((document.querySelector(selector) as HTMLElement).parentElement!).containerType,
        ROOT,
    );

    expect(container, "without this the units would silently fall back to the viewport").toBe("inline-size");
});

test("a position written as a fraction of the width lands at that fraction of the width", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const written = await computedStyle(page.locator(ITEM).first(), "left");
    const box = await boxOf(page, 0);

    expect(written.endsWith("px"), "the browser resolved the unit rather than the component").toBe(true);

    const ratio = parseFloat(written) / box.hostWidth;
    const places = [box, await boxOf(page, 1), await boxOf(page, 2)];
    const leftEdge = Math.min(...places.map((place) => place.left - place.width / 2));
    const rightEdge = Math.max(...places.map((place) => place.left + place.width / 2));

    expect(ratio, "and it lands inside the formation rather than somewhere the viewport put it").toBeGreaterThan(0);
    expect(ratio, "and it lands inside the formation rather than somewhere the viewport put it").toBeLessThan(1);
    expect(
        (leftEdge + rightEdge) / 2 / box.hostWidth,
        "a cliff is centered in the formation however far its places lean",
    ).toBeCloseTo(0.5, 2);
});

test("the height comes from the width, so the arrangement keeps its shape", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const box = await boxOf(page, 0);

    expect(box.hostHeight, "a formation with items in it reserves room for them").toBeGreaterThan(0);
    expect(box.hostHeight / box.hostWidth, "the height is a multiple of the width").toBeGreaterThan(0.5);
});

test("an item's own size is a fraction of the width too", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const box = await boxOf(page, 0);

    expect(box.width / box.hostWidth, "half the width for a cliff place").toBeCloseTo(0.5, 2);
});

test("the arrangement changes with the item count, on the first paint", async ({ page, mount }) => {
    await mountFormation(mount, page, { itemCount: 3 });
    await expect(page.locator(ITEM)).toHaveCount(3);

    const before = await boxOf(page, 0);

    await mountFormation(mount, page, { itemCount: 9 });
    await expect(page.locator(ITEM)).toHaveCount(9);

    const after = await boxOf(page, 0);

    expect(after.hostHeight, "three more whorls need three more whorls' worth of room").toBeGreaterThan(
        before.hostHeight,
    );
    expect(after.left, "and the first item has not moved sideways").toBe(before.left);
});

test("the stacking order is the consumer's, and reversing it moves nothing", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const forward = await page
        .locator(ITEM)
        .first()
        .evaluate((element) => element.style.zIndex);
    const forwardBox = await boxOf(page, 0);

    await mountFormation(mount, page, { isStackedInReverse: true });

    const reverse = await page
        .locator(ITEM)
        .first()
        .evaluate((element) => element.style.zIndex);
    const reverseBox = await boxOf(page, 0);

    expect(forward, "the first item is at the bottom of the pile by default").toBe("1");
    expect(Number(reverse), "and on top of it when reversed").toBeGreaterThan(Number(forward));
    expect({ left: reverseBox.left, top: reverseBox.top }).toEqual({ left: forwardBox.left, top: forwardBox.top });
});

test("the arrangement sits the same distance from every edge of the box it asked for", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const edges = await page.evaluate((selector) => {
        const items = [...document.querySelectorAll(selector)] as HTMLElement[];
        const formation = items[0].parentElement as HTMLElement;

        return {
            top: Math.min(...items.map((item) => item.offsetTop - item.offsetHeight * 0.5)),
            bottom: formation.offsetHeight - Math.max(...items.map((item) => item.offsetTop + item.offsetHeight * 0.5)),
            left: Math.min(...items.map((item) => item.offsetLeft - item.offsetWidth * 0.5)),
            right: formation.offsetWidth - Math.max(...items.map((item) => item.offsetLeft + item.offsetWidth * 0.5)),
        };
    }, ITEM);

    expect(Math.abs(edges.top - edges.bottom), "the gap above matches the gap below").toBeLessThanOrEqual(1);
    expect(Math.abs(edges.left - edges.right), "and the same across").toBeLessThanOrEqual(1);
});

/**
 * Each item element is stamped with the name it shows, the first item is taken out, and every stamped element must
 * still show its own name, as the Solid spec checks. Only a removal from the front tells keying by identity from keying
 * by position.
 */
test("taking an item out leaves the other items' elements where they were", async ({ page, mount }) => {
    await mountFormation(mount, page);

    const before = await page.locator(ITEM).count();
    const readName = (text: string) => text.trim().replace(/^\d+\s*/, "");

    await page.evaluate(
        ([selector, pattern]) => {
            for (const element of document.querySelectorAll(selector)) {
                (element as HTMLElement).dataset.stamp = (element as HTMLElement).innerText
                    .trim()
                    .replace(new RegExp(pattern), "");
            }
        },
        [ITEM, "^\\d+\\s*"] as const,
    );

    await page.getByTestId("skip").click();

    await expect
        .poll(() => page.locator(`${ITEM}:not([data-stamp])`).count(), {
            message: "one item came in at the end to take the place of the one that went",
        })
        .toBe(1);
    await expect(page.locator(ITEM)).toHaveCount(before);

    const survivors = (
        await page.evaluate(
            (selector) =>
                [...document.querySelectorAll(selector)].map((element) => ({
                    stamp: (element as HTMLElement).dataset.stamp,
                    text: (element as HTMLElement).innerText,
                })),
            ITEM,
        )
    )
        .filter((survivor) => survivor.stamp !== undefined)
        .map((survivor) => ({ stamp: survivor.stamp, name: readName(survivor.text) }));

    expect(survivors, "every item that stayed kept its own element").toHaveLength(before - 1);
    expect(
        survivors.filter((survivor) => survivor.stamp !== survivor.name),
        "and none was handed another item's contents",
    ).toEqual([]);
});

test("with a glide set, changing the arrangement moves the items there rather than jumping", async ({
    page,
    mount,
}) => {
    await mountFormation(mount, page, { transitionDurationMs: 1000 });
    await page.getByTestId("ring").click();

    await expect
        .poll(() => runningAnimations(page), { message: "the items are gliding to the new arrangement" })
        .toBeGreaterThan(0);
});

test("with the glide at zero, changing the arrangement moves the items at once", async ({ page, mount }) => {
    await mountFormation(mount, page, { transitionDurationMs: 0 });

    const written = () =>
        page
            .locator(ITEM)
            .first()
            .evaluate((element) => `${element.style.left} ${element.style.top}`);
    const before = await written();

    await page.getByTestId("ring").click();

    await expect.poll(written, { message: "the arrangement did change" }).not.toBe(before);

    expect(await runningAnimations(page), "and nothing is in flight on the way there").toBe(0);
});

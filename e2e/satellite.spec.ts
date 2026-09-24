import { expect, test } from "@playwright/test";

import { computedStyle, example, prop, waitUntilStill } from "./helpers";

/**
 * The thing worth pinning here is the growth, not the arithmetic — the unit tests already cover every
 * placement against hand-computed numbers. What only a browser can answer is whether the wrapper's box
 * really ends up big enough for both elements, which is the whole reason the component exists.
 *
 * The wrapper is found by its inline padding, so no generated class name is depended on. Two qualifiers earn
 * their keep: it is matched on `padding` rather than `padding-left`, because the browser collapses the four
 * sides the component writes into the shorthand; and it must contain an absolutely placed child, because the
 * measure box around the demo is padded as well.
 */
const BADGE = example("default");

const wrapper = (scope: string) => `${scope} div[style*="padding"]:has(> div[style*="left"])`;
const satellite = (scope: string) => `${scope} div[style*="left:"]`;

const numberField = (key: string) => `${prop(key)} input`;
const checkField = (key: string) => `${prop(key)} input`;
const selectField = (key: string) => `${prop(key)} [role="combobox"]`;

const option = '[role="listbox"] [role="option"]';

/**
 * An example's knobs live in a panel its card opens from a settings button, so a knob can only be reached once
 * that panel is open. Each knob is looked up through the example that owns it, and the panel is opened if it is
 * not already — opening another card's panel closes this one, which no test here needs to survive.
 */
const KNOB_OWNERS: Record<string, string> = {
    hPlacement: "default",
    vPlacement: "default",
    offsetX: "default",
    offsetY: "default",
    hasSatellite: "default",
    badgeSize: "default",
    isBehindSubject: "default",
    badgeCorner: "badge",
    badgeCount: "badge",
    badgeOverhang: "badge",
};

const knob = async (page: import("@playwright/test").Page, key: string, toSelector: (key: string) => string) => {
    const trigger = page.locator(`#${KNOB_OWNERS[key]}Knobs`);

    if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();

    return page.locator(toSelector(key));
};

const pick = async (page: import("@playwright/test").Page, key: string, name: string) => {
    await (await knob(page, key, selectField)).click();
    await page.locator(option, { hasText: name }).click();
};

const paddings = async (page: import("@playwright/test").Page, scope: string) => ({
    left: await computedStyle(page.locator(wrapper(scope)), "padding-left"),
    top: await computedStyle(page.locator(wrapper(scope)), "padding-top"),
    right: await computedStyle(page.locator(wrapper(scope)), "padding-right"),
    bottom: await computedStyle(page.locator(wrapper(scope)), "padding-bottom"),
});

test.beforeEach(async ({ page }) => {
    await page.goto("/satellite");
    await expect(page.locator(wrapper(BADGE))).toBeVisible();
});

test("the wrapper grows on exactly the sides the satellite hangs over", async ({ page }) => {
    const badgeSize = await (await knob(page, "badgeSize", numberField)).inputValue();

    await expect
        .poll(() => paddings(page, BADGE), {
            message: "the starting placement is out past the top right corner, so it grows up and to the right",
        })
        .toEqual({ left: "0px", top: `${badgeSize}px`, right: `${badgeSize}px`, bottom: "0px" });
});

test("moving the placement moves the growth with it", async ({ page }) => {
    await pick(page, "hPlacement", "left-out");
    await pick(page, "vPlacement", "bottom-out");

    const badgeSize = await (await knob(page, "badgeSize", numberField)).inputValue();

    await expect
        .poll(() => paddings(page, BADGE), { message: "the same overhang, now down and to the left" })
        .toEqual({ left: `${badgeSize}px`, top: "0px", right: "0px", bottom: `${badgeSize}px` });
});

test("a satellite placed inside a corner costs no room at all", async ({ page }) => {
    await pick(page, "hPlacement", "right-in");
    await pick(page, "vPlacement", "top-in");

    await expect
        .poll(() => paddings(page, BADGE), {
            message: "inside the subject's own box, so the pair is exactly the size of the subject",
        })
        .toEqual({ left: "0px", top: "0px", right: "0px", bottom: "0px" });
});

test("the whole pair stays inside the parent it was given", async ({ page }) => {
    const host = await page.locator(wrapper(BADGE)).evaluate((element) => {
        const box = element.getBoundingClientRect();

        return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    });

    const badge = await page
        .locator(satellite(BADGE))
        .first()
        .evaluate((element) => {
            const box = element.getBoundingClientRect();

            return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
        });

    expect(badge.top, "the badge hangs above the subject and still sits inside the dashed box").toBeGreaterThanOrEqual(
        host.top - 1,
    );
    expect(badge.right).toBeLessThanOrEqual(host.right + 1);
});

/**
 * "Behind" is a relationship between two elements, so it is asked as one: the satellite's stacking order
 * against the subject's, before and after. No particular number is pinned, and neither is how the style
 * attribute happens to be spelled.
 */
test("the satellite can be sent behind the subject without moving", async ({ page }) => {
    const subject = page.locator(`${wrapper(BADGE)} > div:not([style*="left"])`);
    const badge = page.locator(satellite(BADGE));
    const stacking = async () => ({
        subject: Number(await computedStyle(subject, "z-index")),
        satellite: Number(await computedStyle(badge, "z-index")),
    });

    const before = await paddings(page, BADGE);
    const inFront = await stacking();

    expect(inFront.satellite, "a satellite starts out in front of its subject").toBeGreaterThan(inFront.subject);

    await (await knob(page, "isBehindSubject", checkField)).check();

    await expect
        .poll(
            async () => {
                const behind = await stacking();

                return behind.satellite < behind.subject;
            },
            { message: "and ticking the box puts it behind" },
        )
        .toBe(true);

    expect(await paddings(page, BADGE), "and the box it needs is unchanged by the stacking order").toEqual(before);
});

/**
 * The branch nothing else reaches: a `Satellite` handed no `renderSatellite` is a passthrough, and renders the
 * subject on its own with none of the wrapper around it. So the assertion is the absence of the padded box the
 * other tests match on — not merely a box whose four paddings have gone to zero, which is what an inside-corner
 * placement gives and which the test above already covers.
 *
 * The subject has to be found by its text, because with the wrapper gone there is no inline style left to match
 * on, and the measure box around the demo is padded whether or not there is a satellite.
 */
test("a satellite that was never handed one renders the subject and nothing else", async ({ page }) => {
    await (await knob(page, "hasSatellite", checkField)).uncheck();

    await expect
        .poll(() => page.locator(wrapper(BADGE)).count(), {
            message: "no satellite means no wrapper at all, rather than a wrapper that has collapsed",
        })
        .toBe(0);

    await expect(page.locator(satellite(BADGE))).toHaveCount(0);
    await expect(page.locator(BADGE).getByText("Subject", { exact: true })).toBeVisible();
});

const SEVERAL = example("several");
const COUNT_BADGE = example("badge");

type Box = { left: number; top: number; right: number; bottom: number };

const boxOf = (locator: import("@playwright/test").Locator) =>
    locator.evaluate((element): Box => {
        const box = element.getBoundingClientRect();

        return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    });

const subjectOf = (scope: string) => `${wrapper(scope)} > div:not([style*="left"])`;
const satellitesOf = (scope: string) => `${wrapper(scope)} > div[style*="left"]`;

/**
 * Several satellites share one padding, and each side's is the furthest any of them reaches there. Read off the
 * screen, that is one relationship: the wrapper's box is exactly the smallest box holding the subject and every
 * satellite. Too little padding on a side and a satellite pokes out of it; too much and the wrapper runs past
 * everything on that side. Neither needs a number from the page to say.
 */
test("several satellites share one padding that reaches exactly as far as the furthest of them", async ({ page }) => {
    await expect(page.locator(satellitesOf(SEVERAL))).toHaveCount(3);

    const union = async () => {
        const boxes = [
            await boxOf(page.locator(subjectOf(SEVERAL))),
            ...(await Promise.all((await page.locator(satellitesOf(SEVERAL)).all()).map(boxOf))),
        ];

        return {
            left: Math.min(...boxes.map((box) => box.left)),
            top: Math.min(...boxes.map((box) => box.top)),
            right: Math.max(...boxes.map((box) => box.right)),
            bottom: Math.max(...boxes.map((box) => box.bottom)),
        };
    };

    await expect
        .poll(
            async () => {
                const host = await boxOf(page.locator(wrapper(SEVERAL)));
                const reach = await union();

                return (["left", "top", "right", "bottom"] as const).every(
                    (side) => Math.abs(host[side] - reach[side]) <= 1,
                );
            },
            { message: "every side of the wrapper is where the furthest thing on that side ends" },
        )
        .toBe(true);

    const subject = await boxOf(page.locator(subjectOf(SEVERAL)));
    const host = await boxOf(page.locator(wrapper(SEVERAL)));

    expect(
        (["left", "top", "right", "bottom"] as const).every((side) => Math.abs(host[side] - subject[side]) > 1),
        "and the example reaches past the subject on all four sides, so each side's padding came from a satellite",
    ).toBe(true);
});

/**
 * "Behind" is asked of the page the way a person would find it: at a point that lies inside both the subject and
 * a satellite, which one is on top. A satellite in front answers with itself, the one tucked behind answers with
 * the subject, and both happen in the same wrapper at the same time — which is the case one satellite could not
 * show.
 */
test("a satellite set behind stacks under the subject while the others stay in front", async ({ page }) => {
    await expect(page.locator(satellitesOf(SEVERAL))).toHaveCount(3);

    const topmostAtOverlaps = () =>
        page.evaluate(
            (selectors) => {
                const subject = document.querySelector(selectors.subject)!;
                const subjectBox = subject.getBoundingClientRect();

                return [...document.querySelectorAll(selectors.satellites)].flatMap((satellite) => {
                    const box = satellite.getBoundingClientRect();
                    const left = Math.max(box.left, subjectBox.left);
                    const right = Math.min(box.right, subjectBox.right);
                    const top = Math.max(box.top, subjectBox.top);
                    const bottom = Math.min(box.bottom, subjectBox.bottom);

                    if (right - left < 2 || bottom - top < 2) return [];

                    const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);

                    return [
                        {
                            isBehind:
                                Number(getComputedStyle(satellite).zIndex) < Number(getComputedStyle(subject).zIndex),
                            onTop: satellite.contains(hit) ? "satellite" : subject.contains(hit) ? "subject" : "other",
                        },
                    ];
                });
            },
            { subject: subjectOf(SEVERAL), satellites: satellitesOf(SEVERAL) },
        );

    await page.locator(wrapper(SEVERAL)).scrollIntoViewIfNeeded();

    const overlaps = await topmostAtOverlaps();

    expect(
        overlaps.some((overlap) => overlap.isBehind),
        "one satellite overlapping the subject is set behind",
    ).toBe(true);
    expect(
        overlaps.some((overlap) => !overlap.isBehind),
        "and one overlapping it is in front",
    ).toBe(true);

    for (const overlap of overlaps) {
        expect(
            overlap.onTop,
            overlap.isBehind ? "where the tucked one overlaps, the subject is on top" : "where a front one does, it is",
        ).toBe(overlap.isBehind ? "subject" : "satellite");
    }
});

/**
 * A count badge is pinned inside a corner and pushed back out, so a longer number widens it toward the middle
 * and its outer edges stay put. Both halves are read against the subject: the outer horizontal edge and the
 * outer vertical edge sit the same distance from the subject's corner at every count, while the inner edge
 * moves toward the middle. The padding is asked too, because an overhang that never changes is a box that never
 * changes.
 */
for (const corner of ["top-right", "top-left", "bottom-right", "bottom-left"]) {
    test(`a growing count widens the badge toward the middle with its outer edge pinned, at ${corner}`, async ({
        page,
    }) => {
        await pick(page, "badgeCorner", corner);

        const isRight = corner.endsWith("right");
        const isBottom = corner.startsWith("bottom");

        const measure = async () => {
            const subject = await boxOf(page.locator(subjectOf(COUNT_BADGE)));
            const badge = await boxOf(page.locator(satellitesOf(COUNT_BADGE)));

            return {
                width: badge.right - badge.left,
                outerAcross: isRight ? badge.right - subject.right : badge.left - subject.left,
                outerDown: isBottom ? badge.bottom - subject.bottom : badge.top - subject.top,
                innerAcross: isRight ? subject.right - badge.left : badge.right - subject.left,
            };
        };

        await waitUntilStill(page.locator(satellitesOf(COUNT_BADGE)));

        const short = await measure();
        const shortPadding = await paddings(page, COUNT_BADGE);

        await (await knob(page, "badgeCount", numberField)).fill("99999");
        await (await knob(page, "badgeCount", numberField)).blur();

        await expect
            .poll(async () => (await measure()).width, { message: "more digits make the badge wider" })
            .toBeGreaterThan(short.width);
        await waitUntilStill(page.locator(satellitesOf(COUNT_BADGE)));

        const long = await measure();

        expect(long.outerAcross, "the outer edge across stays where it was against the subject").toBeCloseTo(
            short.outerAcross,
            0,
        );
        expect(long.outerDown, "and so does the outer edge up or down").toBeCloseTo(short.outerDown, 0);
        expect(long.innerAcross, "so the width went toward the middle of the subject").toBeGreaterThan(
            short.innerAcross,
        );
        expect(await paddings(page, COUNT_BADGE), "and the room the pair takes is unchanged").toEqual(shortPadding);
    });
}

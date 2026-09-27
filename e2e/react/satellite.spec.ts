import { type Locator, type Page, expect, test } from "@playwright/test";

import { computedStyle, waitUntilStill } from "../helpers";

/**
 * The React `Satellite`. The cases follow `e2e/satellite.spec.ts`, which covers the Solid one, so the two frameworks
 * are held to the same behavior: the wrapper grows by exactly what the satellites overhang, on exactly the sides they
 * hang over, a satellite can sit behind its subject, and no satellites means no wrapper at all.
 *
 * The wrapper is found by its inline padding and its absolutely placed children, as the Solid spec finds it. The
 * placements, sizes and counts the Playground sets from knobs are story props here; the two knobs the Solid spec
 * flips live — sending the satellite behind, lengthening the count — are controls in the story, so those cases still
 * watch one mounted wrapper change.
 */
const DEFAULT = "Exotics/Satellite/Default";
const SEVERAL = '[data-testid="several"]';
const BADGE = '[data-testid="default"]';
const COUNT_BADGE = '[data-testid="badge"]';
const BADGE_SIZE = 28;

const wrapper = (scope: string) => `${scope} div[style*="padding"]:has(> div[style*="left"])`;
const satellite = (scope: string) => `${scope} div[style*="left:"]`;
const subjectOf = (scope: string) => `${wrapper(scope)} > div:not([style*="left"])`;
const satellitesOf = (scope: string) => `${wrapper(scope)} > div[style*="left"]`;

type Box = { left: number; top: number; right: number; bottom: number };

const boxOf = (locator: Locator) =>
    locator.evaluate((element): Box => {
        const box = element.getBoundingClientRect();

        return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
    });

const paddings = async (page: Page, scope: string) => ({
    left: await computedStyle(page.locator(wrapper(scope)), "padding-left"),
    top: await computedStyle(page.locator(wrapper(scope)), "padding-top"),
    right: await computedStyle(page.locator(wrapper(scope)), "padding-right"),
    bottom: await computedStyle(page.locator(wrapper(scope)), "padding-bottom"),
});

test("the wrapper grows on exactly the sides the satellite hangs over", async ({ page, mount }) => {
    await mount(DEFAULT);

    await expect
        .poll(() => paddings(page, BADGE), {
            message: "the starting placement is out past the top right corner, so it grows up and to the right",
        })
        .toEqual({ left: "0px", top: `${BADGE_SIZE}px`, right: `${BADGE_SIZE}px`, bottom: "0px" });
});

test("moving the placement moves the growth with it", async ({ page, mount }) => {
    await mount(DEFAULT, { hPlacement: "left-out", vPlacement: "bottom-out" });

    await expect
        .poll(() => paddings(page, BADGE), { message: "the same overhang, now down and to the left" })
        .toEqual({ left: `${BADGE_SIZE}px`, top: "0px", right: "0px", bottom: `${BADGE_SIZE}px` });
});

test("a satellite placed inside a corner costs no room at all", async ({ page, mount }) => {
    await mount(DEFAULT, { hPlacement: "right-in", vPlacement: "top-in" });

    await expect
        .poll(() => paddings(page, BADGE), {
            message: "inside the subject's own box, so the pair is exactly the size of the subject",
        })
        .toEqual({ left: "0px", top: "0px", right: "0px", bottom: "0px" });
});

test("the whole pair stays inside the box the wrapper takes", async ({ page, mount }) => {
    await mount(DEFAULT);
    await expect
        .poll(() => paddings(page, BADGE))
        .not.toEqual({ left: "0px", top: "0px", right: "0px", bottom: "0px" });

    const host = await boxOf(page.locator(wrapper(BADGE)));
    const badge = await boxOf(page.locator(satellite(BADGE)).first());

    expect(badge.top, "the badge hangs above the subject and still sits inside the wrapper").toBeGreaterThanOrEqual(
        host.top - 1,
    );
    expect(badge.right).toBeLessThanOrEqual(host.right + 1);
});

test("the satellite can be sent behind the subject without moving", async ({ page, mount }) => {
    await mount(DEFAULT);

    const subject = page.locator(subjectOf(BADGE));
    const badge = page.locator(satellite(BADGE));
    const stacking = async () => ({
        subject: Number(await computedStyle(subject, "z-index")),
        satellite: Number(await computedStyle(badge, "z-index")),
    });

    await expect
        .poll(() => paddings(page, BADGE))
        .not.toEqual({ left: "0px", top: "0px", right: "0px", bottom: "0px" });

    const before = await paddings(page, BADGE);
    const inFront = await stacking();

    expect(inFront.satellite, "a satellite starts out in front of its subject").toBeGreaterThan(inFront.subject);

    await page.getByTestId("behind").check();

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

test("a satellite that was never handed one renders the subject and nothing else", async ({ page, mount }) => {
    await mount(DEFAULT, { hasSatellite: false });

    await expect(page.locator(BADGE).getByText("Subject", { exact: true })).toBeVisible();
    expect(await page.locator(wrapper(BADGE)).count(), "no wrapper at all, rather than one that collapsed").toBe(0);
    await expect(page.locator(satellite(BADGE))).toHaveCount(0);
});

test("several satellites share one padding that reaches exactly as far as the furthest of them", async ({
    page,
    mount,
}) => {
    await mount("Exotics/Satellite/Several");
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
        "and the story reaches past the subject on all four sides, so each side's padding came from a satellite",
    ).toBe(true);
});

test("a satellite set behind stacks under the subject while the others stay in front", async ({ page, mount }) => {
    await mount("Exotics/Satellite/Several");
    await expect(page.locator(satellitesOf(SEVERAL))).toHaveCount(3);
    await waitUntilStill(page.locator(wrapper(SEVERAL)));

    const overlaps = await page.evaluate(
        (selectors) => {
            const subject = document.querySelector(selectors.subject)!;
            const subjectBox = subject.getBoundingClientRect();

            return [...document.querySelectorAll(selectors.satellites)].flatMap((element) => {
                const box = element.getBoundingClientRect();
                const left = Math.max(box.left, subjectBox.left);
                const right = Math.min(box.right, subjectBox.right);
                const top = Math.max(box.top, subjectBox.top);
                const bottom = Math.min(box.bottom, subjectBox.bottom);

                if (right - left < 2 || bottom - top < 2) return [];

                const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);

                return [
                    {
                        isBehind: Number(getComputedStyle(element).zIndex) < Number(getComputedStyle(subject).zIndex),
                        onTop: element.contains(hit) ? "satellite" : subject.contains(hit) ? "subject" : "other",
                    },
                ];
            });
        },
        { subject: subjectOf(SEVERAL), satellites: satellitesOf(SEVERAL) },
    );

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

for (const corner of ["top-right", "top-left", "bottom-right", "bottom-left"]) {
    test(`a growing count widens the badge toward the middle with its outer edge pinned, at ${corner}`, async ({
        page,
        mount,
    }) => {
        await mount("Exotics/Satellite/CountBadge", { corner });

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

        await expect(page.locator(satellitesOf(COUNT_BADGE))).toHaveCount(1);
        await waitUntilStill(page.locator(satellitesOf(COUNT_BADGE)));

        const short = await measure();
        const shortPadding = await paddings(page, COUNT_BADGE);

        await page.getByTestId("grow").click();

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

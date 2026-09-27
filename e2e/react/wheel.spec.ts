import { type Page, expect, test } from "@playwright/test";

/**
 * The React `DrumWheel` and `OverheadWheel`, over the React `Wheel`, `Barrel` and `RotatorReactUtils.useRotator`. The
 * cases follow `e2e/wheel.spec.ts` and the two wheel cases of `e2e/noAnimationFrames.spec.ts`, which cover the Solid
 * ones, so the two frameworks are held to the same behavior.
 *
 * The spin is a fixed sequence — the drum story pretends to fetch a prize for 400ms, then the wheel turns for the
 * spin duration, then settles back over the settle duration — so the spec waits on what the page shows rather than on
 * a frame count. Neither wheel renders a button: each story builds its own and drives it through the controller the
 * wheel hands over at mount, reading `getIsSpinnable` through the controller's `subscribe`. That is why the button's
 * disabled state is checked here at all — it is the React controller's only way of telling the page it can spin
 * again.
 *
 * What the Solid spec checks of the Playground rather than of the wheel — the reduced-motion case, where it is the
 * page that withholds the idle delay, and a panel knob reaching every example — has no counterpart here.
 */
const DRUM = "Exotics/DrumWheel/Default";
const OVERHEAD = "Exotics/OverheadWheel/Default";

const WHEEL = '[aria-roledescription="wheel"]';
const WEDGE = '[aria-roledescription="wedge"]';
const SPIN = "#spin";
const OVERHEAD_SPIN = "#overheadSpin";
const ANNOUNCER = '[role="log"][aria-live="polite"]';

const DURATION_MS = 500;
const IDLE_DELAY_MS = 1000;
const FRAME_SETTLE_MS = 300;
const OVERFLOW_TOLERANCE_PX = 1.5;
const TURN_SAMPLE_COUNT = 16;
const TURN_SAMPLE_GAP_MS = 150;
const FETCH_MS = 400;
const LONG_REST_MS = 6000;
const SHORT_REST_MS = 500;
const MEDIUM_REST_MS = 1500;
const OFF_CENTER_POINT = { x: 20, y: 20 };
const FAR_POINT = { x: 1500, y: 1100 };
const PICK_SAMPLE_COUNT = 14;
const PICK_SAMPLE_GAP_MS = 120;
const FEW_TURNS = 1;
const MANY_TURNS = 6;
const WHOLE_TURN_DEG = 360;
const ROUNDING_TURNS = 2;
const SPIN_TOTAL_MS = FETCH_MS + DURATION_MS * 2 + 600;
const NO_FRAMES_SPIN_TOTAL_MS = 6000;

type Mount = (story: string, props?: Record<string, unknown>) => Promise<unknown>;

const mountDrum = (mount: Mount, props?: Record<string, unknown>) =>
    mount(DRUM, {
        spinDurationMs: DURATION_MS,
        settleDurationMs: DURATION_MS,
        idleDelayMs: IDLE_DELAY_MS,
        restDurationMs: LONG_REST_MS,
        ...props,
    });

const transformOf = (page: Page) =>
    page
        .locator(WEDGE)
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

/**
 * How far round the wheel has been, in degrees, read off the first wedge. Every variant writes the angle as the first
 * number in the wedge's transform, and the angle only ever increases, so the difference across a spin is the distance
 * traveled rather than a position modulo a turn.
 */
const turnedAngle = async (page: Page) => Math.abs(Number(/-?[\d.]+/.exec(await transformOf(page))![0]));

/** The front faces the story's painter has marked as picked, by index. A back is never at the marker. */
const pickedCards = (page: Page) =>
    page
        .locator('[data-card="front"]')
        .evaluateAll((cards) => cards.flatMap((card, index) => (card.hasAttribute("data-picked") ? [index] : [])));

test.beforeEach(async ({ page }) => {
    await page.mouse.move(0, 0);
});

test("the wheel and every wedge say what they are, beyond what their roles convey", async ({ page, mount }) => {
    await mountDrum(mount);

    await expect(page.locator(WHEEL)).toHaveAttribute("role", "group");
    await expect(page.locator(WHEEL)).toHaveAttribute("aria-label", "Prize drum");

    await expect(
        page.locator(WEDGE).first(),
        "a wedge is named by what is on it, not only by its position",
    ).toHaveAttribute("aria-label", "Free spin, 1 of 8");
});

test("the wheel renders no button of its own", async ({ page, mount }) => {
    await mountDrum(mount);

    await expect(page.locator(`${WHEEL} button`)).toHaveCount(0);
});

test("spinning lands on a wedge and says which one", async ({ page, mount }) => {
    await mountDrum(mount);

    await page.locator(SPIN).click();
    await page.mouse.move(0, 0);

    await expect.poll(() => turnedAngle(page), { timeout: SPIN_TOTAL_MS * 2 }).toBeGreaterThan(0);

    await expect(
        page.locator(ANNOUNCER),
        "the announcement names the wedge under the marker, not only its position",
    ).toContainText(/.+, \d+ of 8/);
});

test("a spin cannot be asked for twice, because the second request has nowhere to go", async ({ page, mount }) => {
    await mountDrum(mount);

    await page.locator(SPIN).click();

    await expect(
        page.locator(SPIN),
        "the controller tells the page's control, which says so rather than quietly ignoring the press",
    ).toHaveAttribute("aria-disabled", "true");

    await expect
        .poll(() => page.locator(SPIN).getAttribute("aria-disabled"), { timeout: SPIN_TOTAL_MS * 2 })
        .toBe(null);
});

test("the wheel turns by itself while it waits to be spun", async ({ page, mount }) => {
    await mountDrum(mount);

    const before = await transformOf(page);

    await expect.poll(() => transformOf(page), { timeout: IDLE_DELAY_MS * 3 }).not.toBe(before);
});

test("a spin buys the prize a rest, so the wheel stays on it long enough to be read", async ({ page, mount }) => {
    await mountDrum(mount);

    await page.locator(SPIN).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(SPIN_TOTAL_MS);

    const settled = await transformOf(page);

    await page.waitForTimeout(IDLE_DELAY_MS * 2);

    expect(
        await transformOf(page),
        "two idle steps' worth into a six-second rest, it has not moved off the prize",
    ).toBe(settled);
});

test("and the rest is only a rest, so the wheel picks up again once it has run out", async ({ page, mount }) => {
    await mountDrum(mount, { restDurationMs: SHORT_REST_MS });

    await page.locator(SPIN).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(SPIN_TOTAL_MS);

    const settled = await transformOf(page);

    await expect
        .poll(() => transformOf(page), {
            message: "the rest ends and the idle turn resumes without anyone asking",
            timeout: SHORT_REST_MS + IDLE_DELAY_MS * 4,
        })
        .not.toBe(settled);
});

test("it keeps turning under the pointer, because stopping for one is the consumer's to build", async ({
    page,
    mount,
}) => {
    await mountDrum(mount);

    await page.locator(WHEEL).hover({ position: OFF_CENTER_POINT });

    const hovered = await transformOf(page);

    await expect
        .poll(() => transformOf(page), {
            message: "the wheel has no hold of its own",
            timeout: IDLE_DELAY_MS * 3,
        })
        .not.toBe(hovered);
});

/**
 * A wheel turning by itself has not picked anything; a wheel that has stopped is sitting on a wedge and saying so.
 * This pins the whole sequence — nothing while idling, the prize once settled, and nothing again once the rest runs
 * out and the wheel picks up.
 */
test("an idling drum has picked nothing, picks out the face it lands on, and lets go after the rest", async ({
    page,
    mount,
}) => {
    await mountDrum(mount, { restDurationMs: MEDIUM_REST_MS });

    expect(await pickedCards(page), "the turn is not a selection").toEqual([]);

    await page.locator(SPIN).click();
    await page.mouse.move(0, 0);

    await expect
        .poll(() => pickedCards(page), {
            message: "the drum comes to rest on one face and says which",
            timeout: SPIN_TOTAL_MS * 2,
        })
        .toHaveLength(1);

    await expect
        .poll(() => pickedCards(page), {
            message: "and lets go of it when the rest runs out and it starts turning again",
            timeout: MEDIUM_REST_MS + IDLE_DELAY_MS * 4,
        })
        .toEqual([]);
});

/**
 * The announcement is collected as the samples are taken rather than read at the end, because a live region is swept
 * a second after it is written, and the sampling runs longer than the spin does.
 */
test(
    "and the pick moves with the wheel while it spins, rather than appearing at the end",
    { tag: "@solo" },
    async ({ page, mount }) => {
        await mountDrum(mount);

        await page.locator(SPIN).click();
        await page.mouse.move(0, 0);

        const seen = new Set<number>();
        const announced = new Set<string>();

        for (let sample = 0; sample < PICK_SAMPLE_COUNT; sample++) {
            (await pickedCards(page)).forEach((index) => seen.add(index));

            const said = ((await page.locator(ANNOUNCER).textContent()) ?? "").trim();

            if (said) announced.add(said);

            await page.waitForTimeout(PICK_SAMPLE_GAP_MS);
        }

        expect(seen.size, "several wedges pass the marker and each is picked out in turn").toBeGreaterThan(1);

        const settled = await pickedCards(page);

        expect(settled, "and the last one is the prize").toHaveLength(1);
        expect(
            [...announced].some((said) => said.includes(`, ${settled[0] + 1} of 8`)),
            `the wheel said which wedge it came to rest on, and it said ${[...announced].join(" / ")}`,
        ).toBe(true);
    },
);

/**
 * A spin of `n` turns covers at least `n` turns and always less than `n + 2`, which is tight enough that one turn and
 * six cannot be confused without the spec having to know which wedge won. Driven on both axes, since the angle is the
 * rotator's and the axis only decides how the barrel draws it.
 */
test("the turn count decides how far a spin goes, on either axis", async ({ page, mount }) => {
    for (const axis of ["row", "column"]) {
        for (const turns of [FEW_TURNS, MANY_TURNS]) {
            await mountDrum(mount, { axis, turns, idleDelayMs: undefined });

            const before = await turnedAngle(page);

            await page.locator(SPIN).click();
            await page.waitForTimeout(SPIN_TOTAL_MS);

            const traveled = (await turnedAngle(page)) - before;

            expect(traveled, `the ${axis} drum went round at least ${turns} times`).toBeGreaterThanOrEqual(
                turns * WHOLE_TURN_DEG,
            );
            expect(traveled, `the ${axis} drum did not go round ${turns + ROUNDING_TURNS} times`).toBeLessThan(
                (turns + ROUNDING_TURNS) * WHOLE_TURN_DEG,
            );
        }
    }
});

test("a disabled wheel neither spins nor turns", async ({ page, mount }) => {
    await mountDrum(mount, { isDisabled: true });

    await expect(page.locator(SPIN)).toHaveAttribute("aria-disabled", "true");

    const before = await transformOf(page);

    await page.waitForTimeout(IDLE_DELAY_MS * 2);

    expect(await transformOf(page)).toBe(before);
});

test("a drum hides the faces that have turned away, rather than only obscuring them", async ({ page, mount }) => {
    await mountDrum(mount);

    await expect(page.locator(WEDGE), "a front and a back for each of the eight prizes").toHaveCount(16);

    const reachable = page.locator(`${WEDGE}:not([inert])`);

    await expect(reachable, "only the one at the marker is reachable").toHaveCount(1);
    await expect(reachable).toHaveAttribute("aria-label", "Free spin, 1 of 8");
});

test("a two-faced drum is two fronts back to back, with no reverse to print", async ({ page, mount }) => {
    await mountDrum(mount, { wedgeCount: 2 });

    await expect(page.locator(WEDGE), "one face per prize and nothing behind it").toHaveCount(2);

    await expect(page.locator(WEDGE).first()).toContainText("Free spin");
    await expect(page.locator(WEDGE).last()).toContainText("Ten coins");
});

test("the two axes turn the faces about different lines, which is the whole of what separates them", async ({
    page,
    mount,
}) => {
    await mountDrum(mount, { axis: "row" });

    expect(await transformOf(page), "faces traveling left and right turn about the upright axis").toContain("rotateY");

    await mountDrum(mount, { axis: "column" });

    expect(await transformOf(page), "faces traveling up and over turn about the level one").toContain("rotateX");
});

/**
 * Comparing the box the drum reserves against the boxes the faces actually occupy is the only check on the drum's
 * geometry that has ever caught anything. The allowance is the Solid spec's, and for the same reason.
 */
const worstOverflow = (page: Page) =>
    page.evaluate((selector) => {
        const wheel = document.querySelector(selector) as HTMLElement;
        const faces = [...wheel.querySelectorAll('[aria-roledescription="wedge"]')] as HTMLElement[];
        const reserved = (wheel.firstElementChild as HTMLElement).getBoundingClientRect();
        const boxes = faces
            .map((face) => face.getBoundingClientRect())
            .filter((box) => box.width > 2 && box.height > 2);

        return Math.max(
            reserved.left - Math.min(...boxes.map((box) => box.left)),
            Math.max(...boxes.map((box) => box.right)) - reserved.right,
            reserved.top - Math.min(...boxes.map((box) => box.top)),
            Math.max(...boxes.map((box) => box.bottom)) - reserved.bottom,
        );
    }, WHEEL);

test(
    "a drum paints inside the room it reserves, at every count it can be given",
    { tag: "@solo" },
    async ({ page, mount }) => {
        for (const axis of ["row", "column"]) {
            for (const wedgeCount of [2, 3, 6, 9, 12]) {
                await mountDrum(mount, { axis, wedgeCount, idleDelayMs: undefined });
                await page.waitForTimeout(FRAME_SETTLE_MS);

                expect(await worstOverflow(page), `the ${axis} drum at ${wedgeCount} wedges`).toBeLessThanOrEqual(
                    OVERFLOW_TOLERANCE_PX,
                );
            }
        }
    },
);

test("and keeps inside it all the way round, not only where it comes to rest", async ({ page, mount }) => {
    for (const axis of ["row", "column"]) {
        await mountDrum(mount, { axis });
        await page.waitForTimeout(IDLE_DELAY_MS);

        for (let sample = 0; sample < TURN_SAMPLE_COUNT * 0.5; sample++) {
            expect(await worstOverflow(page), `the ${axis} drum while turning`).toBeLessThanOrEqual(
                OVERFLOW_TOLERANCE_PX,
            );

            await page.waitForTimeout(TURN_SAMPLE_GAP_MS);
        }
    }
});

test("an overhead wheel turns each wedge about the middle, and picks out the one it lands on", async ({
    page,
    mount,
}) => {
    await mount(OVERHEAD, { spinDurationMs: DURATION_MS, settleDurationMs: DURATION_MS });

    await expect(page.locator(WEDGE)).toHaveCount(8);
    expect(await transformOf(page), "a wedge is a turn, not a face on a barrel").toMatch(/^rotate\(/);

    await page.locator(OVERHEAD_SPIN).click();

    await expect(page.locator('[data-readout="phase"]')).toHaveText("spinning");
    await expect(page.locator('[data-readout="phase"]'), "and it comes to rest").toHaveText("still", {
        timeout: SPIN_TOTAL_MS * 2,
    });

    await expect(page.locator(`${WEDGE} [data-picked]`), "on the wedge the story asked for").toHaveText("A hat");
});

test("an overhead wheel's wedges answer to the pointer, and only while it is near", async ({ page, mount }) => {
    await mount(OVERHEAD);
    await page.mouse.move(FAR_POINT.x, FAR_POINT.y);

    const litCount = () =>
        page
            .locator(WEDGE)
            .evaluateAll((wedges) => wedges.filter((wedge) => (wedge as HTMLElement).style.filter !== "").length);

    await expect.poll(litCount, { message: "far from the wheel, the effect is at rest" }).toBe(0);

    await page.locator(WHEEL).hover();

    await expect.poll(litCount, { message: "over it, the effect reaches the wedges" }).toBeGreaterThan(0);

    await page.mouse.move(FAR_POINT.x, FAR_POINT.y);

    await expect.poll(litCount, { message: "and lets go once the pointer is far away" }).toBe(0);
});

/**
 * With `requestAnimationFrame` replaced by one that never calls back, the spin still owes the visitor an answer and
 * arrives by the timer armed beside the frame, while the idle turn is decoration and simply stops.
 */
const starveFrames = `
    window.requestAnimationFrame = () => 0;
    window.cancelAnimationFrame = () => {};
`;

test("a spin still lands on its prize when no frame ever arrives", async ({ page, mount }) => {
    await page.addInitScript(starveFrames);
    await mount(OVERHEAD, { spinDurationMs: DURATION_MS, settleDurationMs: DURATION_MS });

    await page.locator(OVERHEAD_SPIN).click();

    await expect(page.locator(ANNOUNCER)).toContainText(/.+, \d+ of 8/, { timeout: NO_FRAMES_SPIN_TOTAL_MS });
    await expect
        .poll(() => page.locator(OVERHEAD_SPIN).getAttribute("aria-disabled"), { timeout: NO_FRAMES_SPIN_TOTAL_MS })
        .toBe(null);
});

test("but the idle turn simply stops, because it owes nobody an answer", async ({ page, mount }) => {
    await page.addInitScript(starveFrames);
    await mount(OVERHEAD, { idleDelayMs: IDLE_DELAY_MS });

    const before = await transformOf(page);

    await page.waitForTimeout(IDLE_DELAY_MS * 2);

    expect(await transformOf(page), "two idle steps' worth later, nothing has moved").toBe(before);
});

import { type Page, expect, test } from "@playwright/test";

/**
 * The React `TrackCarousel` and `DrumCarousel`, over the React `Carousel`, `InteractionWrapper` and `Barrel`. The cases
 * follow `e2e/carousel.spec.ts`, which covers the Solid ones, so the two frameworks are held to the same behavior.
 *
 * The Playground page puts four carousels side by side; here each case mounts the one it needs. A rotating carousel
 * is the track story given a delay, and everything timed is measured against that delay with a margin, so the
 * assertions are about whether the slide moved at all rather than about landing on a particular frame.
 */
const TRACK = "Essentials/TrackCarousel/Default";
const DRUM = "Essentials/DrumCarousel/Default";

const REGION = '[aria-roledescription="carousel"]';
const SLIDE = '[aria-roledescription="slide"]';
const VIEWPORT = `${REGION} > div:first-child`;
const control = (name: string) => `button[aria-label="${name}"]`;

const DELAY_MS = 500;
const MIN_COLUMN_HEIGHT = 150;
const SETTLE_MS = 900;
const DRAG_STEPS = 10;

const currentSlide = (page: Page) => page.locator(`${SLIDE}:not([aria-hidden="true"])`).getAttribute("aria-label");

test.beforeEach(async ({ page }) => {
    await page.mouse.move(0, 0);
});

test("the region and every slide say what they are, beyond what their roles alone convey", async ({ page, mount }) => {
    await mount(TRACK);

    await expect(page.locator(REGION)).toHaveAttribute("role", "region");
    await expect(page.locator(REGION)).toHaveAttribute("aria-label", "Sampler");

    await expect(page.locator(SLIDE)).toHaveCount(4);
    await expect(page.locator(SLIDE).first()).toHaveAttribute("role", "group");
    await expect(page.locator(SLIDE).first()).toHaveAttribute("aria-label", "1 of 4");

    expect(await currentSlide(page), "exactly one slide is the current one").toBe("1 of 4");
});

test("the slides that are off screen are out of reach rather than merely out of sight", async ({ page, mount }) => {
    await mount(TRACK);

    const offScreen = page.locator(`${SLIDE}[aria-hidden="true"]`);

    await expect(offScreen, "three of the four are away").toHaveCount(3);
    await expect(offScreen.first()).toHaveAttribute("inert", "");
    await expect(page.locator(SLIDE).first(), "and the one on screen is neither hidden nor inert").not.toHaveAttribute(
        "inert",
    );
});

test("stepping wraps at both ends, which is the whole of what separates this from the scroller", async ({
    page,
    mount,
}) => {
    await mount(TRACK);

    await page.locator(control("Previous slide")).click();
    expect(await currentSlide(page), "back from the first slide lands on the last").toBe("4 of 4");

    await page.locator(control("Next slide")).click();
    expect(await currentSlide(page), "and forward from the last comes round again").toBe("1 of 4");

    await expect(
        page.locator(control("Previous slide")),
        "so neither step is ever the one with nowhere to go",
    ).not.toHaveAttribute("aria-disabled");
});

test("a pick jumps straight to its slide and says which one it is", async ({ page, mount }) => {
    await mount(TRACK);

    await expect(page.locator(control("1 of 4")), "the current pick is marked as such").toHaveAttribute(
        "aria-current",
        "true",
    );

    await page.locator(control("3 of 4")).click();

    expect(await currentSlide(page)).toBe("3 of 4");
    await expect(page.locator(control("3 of 4"))).toHaveAttribute("aria-current", "true");
    await expect(page.locator(control("1 of 4"))).not.toHaveAttribute("aria-current");
});

test("with looping off, the step at each end is disabled and refuses", async ({ page, mount }) => {
    await mount(TRACK, { isLooping: false });

    await expect(page.locator(control("Previous slide"))).toHaveAttribute("aria-disabled", "true");

    await page.locator(control("Previous slide")).click({ force: true });

    expect(await currentSlide(page), "the first slide has nowhere to go back to").toBe("1 of 4");
});

test("with looping off, rotation stops for good on the last slide and says so", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS, isLooping: false });

    await expect.poll(() => currentSlide(page), { timeout: DELAY_MS * 4 + SETTLE_MS * 2 }).toBe("4 of 4");

    await expect(page.locator('[data-readout="playing"]'), "playback is switched off").toHaveText("false");
    await expect(page.locator(control("Start automatic slide show"))).toHaveCount(1);
});

test("a carousel with no delay set never moves itself", async ({ page, mount }) => {
    await mount(TRACK);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page)).toBe("1 of 4");
});

test("the rotating one advances on its own", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS });

    await expect.poll(() => currentSlide(page), { timeout: SETTLE_MS * 3 }).not.toBe("1 of 4");
});

test("it holds under the pointer, which is the requirement rather than a courtesy", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS });

    await page.locator(REGION).hover();

    const held = await currentSlide(page);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page), "nothing moves while the pointer is over it").toBe(held);

    await page.mouse.move(0, 0);

    await expect
        .poll(() => currentSlide(page), {
            message: "and it picks up again once the pointer leaves",
            timeout: SETTLE_MS * 3,
        })
        .not.toBe(held);
});

test("it holds while anything inside it has focus, so a keyboard user is not chased", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS });

    await page.locator(control("Next slide")).focus();

    const held = await currentSlide(page);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page)).toBe(held);

    await page.getByTestId("outside").focus();

    await expect
        .poll(() => currentSlide(page), {
            message: "focus landing outside it releases the hold",
            timeout: SETTLE_MS * 3,
        })
        .not.toBe(held);
});

test("the stop control halts it outright and renames itself for the way back", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS });

    await page.locator(control("Stop automatic slide show")).click();
    await page.getByTestId("outside").focus();
    await page.mouse.move(0, 0);

    const stopped = await currentSlide(page);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page), "stopped means stopped, pointer or no pointer").toBe(stopped);

    await expect(page.locator('[data-readout="playing"]'), "the stop is written to the playback state").toHaveText(
        "false",
    );
    await expect(
        page.locator(control("Start automatic slide show")),
        "and the button now offers the other direction",
    ).toHaveCount(1);
});

test("a disabled carousel neither moves itself nor lets anything step it", async ({ page, mount }) => {
    await mount(TRACK, { autoplayDelayMs: DELAY_MS, isDisabled: true });

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page), "a disabled carousel does not move itself").toBe("1 of 4");

    await page.locator(control("Next slide")).click({ force: true });

    await expect(page.locator('[data-readout="index"]'), "and nothing steps it").toHaveText("0");
});

/**
 * The swipe is measured against the viewport's own size, so a drag is written as a pair of fractions of it and run in
 * enough steps to clear the slop the gesture waits for before it takes the pointer over.
 */
const swipeAcross = async (page: Page, from: number, to: number) => {
    const box = (await page.locator(VIEWPORT).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: DRAG_STEPS });
    await page.mouse.up();
};

const swipeDown = async (page: Page, from: number, to: number) => {
    const box = (await page.locator(VIEWPORT).boundingBox())!;
    const x = box.x + box.width * 0.5;

    await page.mouse.move(x, box.y + box.height * from);
    await page.mouse.down();
    await page.mouse.move(x, box.y + box.height * to, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test("a swipe across the slides steps the way the finger went", async ({ page, mount }) => {
    await mount(TRACK);

    await swipeAcross(page, 0.8, 0.3);

    expect(await currentSlide(page), "pushing the slides leftwards brings the next one in").toBe("2 of 4");

    await swipeAcross(page, 0.2, 0.7);

    expect(await currentSlide(page), "and pushing them back the other way returns to the first").toBe("1 of 4");
});

test("a swipe let go before it has traveled far enough puts the slide back", async ({ page, mount }) => {
    await mount(TRACK);

    await swipeAcross(page, 0.8, 0.7);

    expect(await currentSlide(page), "a tenth of the width is a nudge, not a step").toBe("1 of 4");
});

test("a carousel with no controls refuses the swipe, because nothing else could move it", async ({ page, mount }) => {
    await mount(TRACK, { hasControls: false });

    await expect(page.locator(VIEWPORT), "the axis is never claimed, so the browser keeps the whole gesture").toHaveCSS(
        "touch-action",
        "auto",
    );

    await swipeAcross(page, 0.8, 0.2);

    expect(await currentSlide(page), "and the swipe moves nothing").toBe("1 of 4");
});

test("a column carousel claims the other axis and steps the way the finger went", async ({ page, mount }) => {
    await mount(TRACK, { orientation: "vertical" });

    await expect(page.locator(VIEWPORT), "the browser keeps the axis this carousel does not travel on").toHaveCSS(
        "touch-action",
        "pan-x",
    );

    await swipeDown(page, 0.8, 0.3);

    expect(await currentSlide(page), "pushing the slides upwards brings the next one in").toBe("2 of 4");

    await swipeDown(page, 0.2, 0.7);

    expect(await currentSlide(page), "and pushing them back down returns to the first").toBe("1 of 4");
});

/**
 * A column carousel has no height of its own, so it takes the one the surrounding box was given. A viewport that
 * collapsed to nothing is the failure this watches for, and it is measured in layout space rather than from a
 * client rect.
 */
test("a column carousel takes its height from the box around it and gives all of it to one slide", async ({
    page,
    mount,
}) => {
    await mount(TRACK, { orientation: "vertical" });

    const viewportHeight = await page.locator(VIEWPORT).evaluate((element) => element.clientHeight);
    const slideHeight = await page
        .locator(`${SLIDE}:not([aria-hidden="true"])`)
        .evaluate((element) => (element as HTMLElement).offsetHeight);

    expect(viewportHeight, "the window the slides move through is as tall as the box made it").toBeGreaterThan(
        MIN_COLUMN_HEIGHT,
    );
    expect(slideHeight, "and the slide on screen fills it exactly, so only one is ever in view").toBe(viewportHeight);
});

/**
 * The drum is the same carousel with its slides on the faces of a barrel, so what is checked here is the part that
 * genuinely differs: a step turns the barrel rather than sliding a track, and the faces that have turned away are as
 * far out of reach as the slides that have scrolled off the side.
 */
const faceTransform = (page: Page) =>
    page
        .locator(SLIDE)
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

test("a drum steps by turning, and its slides ride the faces round", async ({ page, mount }) => {
    await mount(DRUM);

    const before = await faceTransform(page);

    expect(before, "a face carries its angle and its distance from the axis in one transform").toContain("translateZ(");

    await page.locator(control("Next slide")).click();

    expect(await currentSlide(page), "the step lands on the next slide, exactly as on the track").toBe("2 of 4");
    expect(await faceTransform(page), "and the faces turned to bring it to the front").not.toBe(before);
});

test("a drum going over the end keeps turning the same way rather than unwinding", async ({ page, mount }) => {
    await mount(DRUM);

    const angleOf = async () => Number(/-?[\d.]+/.exec(await faceTransform(page))![0]);
    const start = await angleOf();

    await page.locator(control("Previous slide")).click();

    expect(await currentSlide(page)).toBe("4 of 4");
    expect(Math.abs((await angleOf()) - start), "one face's worth of turn, not three").toBe(90);
});

test("a swipe turns the drum the way the finger went", async ({ page, mount }) => {
    await mount(DRUM);

    await swipeAcross(page, 0.8, 0.3);

    expect(await currentSlide(page), "pushing the faces leftwards turns the next one round").toBe("2 of 4");
});

test("the faces of a drum that have turned away are out of reach, not merely out of sight", async ({ page, mount }) => {
    await mount(DRUM);

    await expect(page.locator(`${SLIDE}[aria-hidden="true"]`).first()).toHaveAttribute("inert", "");
    await expect(
        page.locator(`${SLIDE}:not([aria-hidden="true"])`),
        "exactly one face is the current one, backs and far faces included",
    ).toHaveCount(1);
});

test("a drum on the other axis turns end over end, and takes its swipe the same way", async ({ page, mount }) => {
    await mount(DRUM);

    expect(await faceTransform(page), "on the upright axis by default").toContain("rotateY(");

    await mount(DRUM, { axis: "column" });

    expect(await faceTransform(page), "and end over end once it is laid on its side").toContain("rotateX(");

    await expect(page.locator(VIEWPORT), "the browser keeps the axis the barrel no longer travels on").toHaveCSS(
        "touch-action",
        "pan-x",
    );

    await swipeDown(page, 0.8, 0.3);

    expect(await currentSlide(page), "pushing the faces upwards brings the next one round").toBe("2 of 4");
});

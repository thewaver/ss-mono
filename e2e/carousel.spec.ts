import { expect, test } from "@playwright/test";

import { demo, prop, readout } from "./helpers";

/**
 * The rotation delay is a panel knob, so the spec turns it down to its floor rather than waiting out the
 * page's own default. Everything timed here is then measured against `DELAY_MS` with a margin, and the
 * assertions are about whether the slide moved at all rather than about landing on a particular frame.
 *
 * Several carousels sit on the page and only one of them rotates by its own delay, which is what makes the
 * holds testable: a hold that leaked would show up as the others behaving differently from the one under the
 * pointer.
 *
 * Every carousel on the page is drawn by the placement the panel's knob names. The behaviors asked about here —
 * labels, wrapping, holds, picks, swipes — belong to the carousel whatever the placement, so they are asked once,
 * under the page's starting placement; the placement-specific questions switch the knob.
 */
const MANUAL = demo("manual");
const ROTATING = demo("rotating");
const NO_CONTROLS = demo("noControls");
const SCROLLED = demo("scrolled");
const RING = demo("ring");

const region = (scope: string) => `${scope} [aria-roledescription="carousel"]`;
const slide = (scope: string) => `${scope} [aria-roledescription="slide"]`;
const control = (scope: string, name: string) => `${scope} button[aria-label="${name}"]`;
const viewport = (scope: string) => `${region(scope)} > div:first-child`;

const field = (key: string) => `${prop(key)} input`;

const DELAY_MS = 500;
const SETTLE_MS = 900;
const DRAG_STEPS = 10;

const currentSlide = (page: import("@playwright/test").Page, scope: string) =>
    page.locator(`${slide(scope)}:not([aria-hidden="true"])`).getAttribute("aria-label");

test.beforeEach(async ({ page }) => {
    await page.goto("/carousel");
    await expect(page.locator(region(MANUAL))).toBeVisible();
    await page.locator(field("delayMs")).fill(String(DELAY_MS));
    await page.locator(field("delayMs")).blur();
    await page.mouse.move(0, 0);
});

const pickOption = async (page: import("@playwright/test").Page, key: string, name: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: name }).click();
};

test("the region and every slide say what they are, beyond what their roles alone convey", async ({ page }) => {
    await expect(page.locator(region(MANUAL))).toHaveAttribute("role", "region");
    await expect(page.locator(region(MANUAL))).toHaveAttribute("aria-label", "Sampler");

    await expect(page.locator(slide(MANUAL))).toHaveCount(4);
    await expect(page.locator(slide(MANUAL)).first()).toHaveAttribute("role", "group");
    await expect(page.locator(slide(MANUAL)).first()).toHaveAttribute("aria-label", "1 of 4");

    expect(await currentSlide(page, MANUAL), "exactly one slide is the current one").toBe("1 of 4");
});

test("the slides that are off screen are out of reach rather than merely out of sight", async ({ page }) => {
    const offScreen = page.locator(`${slide(MANUAL)}[aria-hidden="true"]`);

    await expect(offScreen, "three of the four are away, however much of them the placement still shows").toHaveCount(
        3,
    );
    await expect(offScreen.first()).toHaveAttribute("inert", "");
    await expect(
        page.locator(slide(MANUAL)).first(),
        "and the one on screen is neither hidden nor inert",
    ).not.toHaveAttribute("inert");
});

test("stepping wraps at both ends, which is the whole of what separates this from the scroller", async ({ page }) => {
    await page.locator(control(MANUAL, "Previous slide")).click();
    expect(await currentSlide(page, MANUAL), "back from the first slide lands on the last").toBe("4 of 4");

    await page.locator(control(MANUAL, "Next slide")).click();
    expect(await currentSlide(page, MANUAL), "and forward from the last comes round again").toBe("1 of 4");

    await expect(
        page.locator(control(MANUAL, "Previous slide")),
        "so neither step is ever the one with nowhere to go",
    ).not.toHaveAttribute("aria-disabled");
});

test("a pick jumps straight to its slide and says which one it is", async ({ page }) => {
    await expect(page.locator(control(MANUAL, "1 of 4")), "the current pick is marked as such").toHaveAttribute(
        "aria-current",
        "true",
    );

    await page.locator(control(MANUAL, "3 of 4")).click();

    expect(await currentSlide(page, MANUAL)).toBe("3 of 4");
    await expect(page.locator(control(MANUAL, "3 of 4"))).toHaveAttribute("aria-current", "true");
    await expect(page.locator(control(MANUAL, "1 of 4"))).not.toHaveAttribute("aria-current");
});

test("the rotating one advances on its own while the manual one stays put", async ({ page }) => {
    const before = await currentSlide(page, ROTATING);

    await expect.poll(() => currentSlide(page, ROTATING), { timeout: SETTLE_MS * 3 }).not.toBe(before);

    expect(await currentSlide(page, MANUAL), "and a carousel with no delay set never moves itself").toBe("1 of 4");
});

test("it holds under the pointer, which is the requirement rather than a courtesy", async ({ page }) => {
    await page.locator(region(ROTATING)).hover();

    const held = await currentSlide(page, ROTATING);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page, ROTATING), "nothing moves while the pointer is over it").toBe(held);

    await page.mouse.move(0, 0);

    await expect
        .poll(() => currentSlide(page, ROTATING), {
            message: "and it picks up again once the pointer leaves",
            timeout: SETTLE_MS * 3,
        })
        .not.toBe(held);
});

test("it holds while anything inside it has focus, so a keyboard user is not chased", async ({ page }) => {
    await page.locator(control(ROTATING, "Next slide")).focus();

    const held = await currentSlide(page, ROTATING);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page, ROTATING)).toBe(held);

    await page.locator(control(MANUAL, "Next slide")).focus();

    await expect
        .poll(() => currentSlide(page, ROTATING), {
            message: "focus landing outside it releases the hold",
            timeout: SETTLE_MS * 3,
        })
        .not.toBe(held);
});

test("the stop control halts it outright and renames itself for the way back", async ({ page }) => {
    await page.mouse.move(0, 0);
    await page.locator(control(ROTATING, "Stop automatic slide show")).click();
    await page.locator(control(MANUAL, "Next slide")).focus();
    await page.mouse.move(0, 0);

    const stopped = await currentSlide(page, ROTATING);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page, ROTATING), "stopped means stopped, pointer or no pointer").toBe(stopped);

    await expect(
        page.locator(control(ROTATING, "Start automatic slide show")),
        "and the button now offers the other direction",
    ).toHaveCount(1);
});

test("the disabled knob stops the rotation as well as the controls", async ({ page }) => {
    await page.locator(field("isDisabled")).click();

    const stopped = await currentSlide(page, ROTATING);

    await page.waitForTimeout(SETTLE_MS * 2);

    expect(await currentSlide(page, ROTATING), "a disabled carousel does not move itself either").toBe(stopped);

    await page.locator(control(MANUAL, "Next slide")).click({ force: true });
    expect(await readout(page, "manual"), "and nothing steps it").toContain("slide 1 of");
});

/**
 * The swipe is measured against the viewport's own width, so a drag is written as a pair of fractions of it
 * and run in enough steps to clear the slop the gesture waits for before it takes the pointer over.
 */
const swipeAcross = async (page: import("@playwright/test").Page, scope: string, from: number, to: number) => {
    const box = (await page.locator(viewport(scope)).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test("a swipe across the slides steps the way the finger went", async ({ page }) => {
    await swipeAcross(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the slides leftwards brings the next one in").toBe("2 of 4");

    await swipeAcross(page, MANUAL, 0.2, 0.7);

    expect(await currentSlide(page, MANUAL), "and pushing them back the other way returns to the first").toBe("1 of 4");
});

test("a swipe let go before it has traveled far enough puts the slide back", async ({ page }) => {
    await swipeAcross(page, MANUAL, 0.8, 0.7);

    expect(await currentSlide(page, MANUAL), "a tenth of the width is a nudge, not a step").toBe("1 of 4");
});

test("a carousel with no controls refuses the swipe, because nothing else could move it", async ({ page }) => {
    await expect(
        page.locator(viewport(NO_CONTROLS)),
        "the axis is never claimed, so the browser keeps the whole gesture",
    ).toHaveCSS("touch-action", "auto");

    await swipeAcross(page, NO_CONTROLS, 0.8, 0.2);

    expect(await currentSlide(page, NO_CONTROLS), "and the swipe moves nothing").toBe("1 of 4");
});

/**
 * A column carousel is the same component with `dir` set — a knob on the stepped demo rather than a demo of
 * its own — so the drag that steps it runs down the viewport rather than across it, and is written as a pair of fractions of the height for the same reason the
 * horizontal one uses fractions of the width: a fraction means the same thing whatever the window is doing.
 */
const swipeDown = async (page: import("@playwright/test").Page, scope: string, from: number, to: number) => {
    const box = (await page.locator(viewport(scope)).boundingBox())!;
    const x = box.x + box.width * 0.5;

    await page.mouse.move(x, box.y + box.height * from);
    await page.mouse.down();
    await page.mouse.move(x, box.y + box.height * to, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test("a column carousel claims the other axis and steps the way the finger went", async ({ page }) => {
    await pickOption(page, "orientation", "Up and down");

    await expect(
        page.locator(viewport(MANUAL)),
        "the browser keeps the axis this carousel does not travel on",
    ).toHaveCSS("touch-action", "pan-x");

    await swipeDown(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the slides upwards brings the next one in").toBe("2 of 4");

    await swipeDown(page, MANUAL, 0.2, 0.7);

    expect(await currentSlide(page, MANUAL), "and pushing them back down returns to the first").toBe("1 of 4");
});

/**
 * Every slide fills the carousel's box before its placement moves it, which is what lets a placement count its
 * lengths in shares of the box. A box that collapsed to nothing is the failure this watches for, and it is
 * measured in layout space rather than from a client rect.
 */
test("the slide showing fills the carousel's box exactly, across or up and down", async ({ page }) => {
    for (const orientation of ["Across", "Up and down"]) {
        await pickOption(page, "orientation", orientation);

        const box = await page.locator(viewport(MANUAL)).evaluate((element) => ({
            width: element.clientWidth,
            height: element.clientHeight,
        }));
        const shown = await page.locator(`${slide(MANUAL)}:not([aria-hidden="true"])`).evaluate((element) => ({
            width: (element as HTMLElement).offsetWidth,
            height: (element as HTMLElement).offsetHeight,
        }));

        expect(box.height, "the box has a size of its own").toBeGreaterThan(0);
        expect(shown, "and the slide on screen fills it").toEqual(box);
    }
});

/**
 * A slide drawn beside the one showing can be pressed to bring it up. It is inert, so the press lands on the
 * carousel's box, and the carousel works out from where it landed which slide was aimed at. Cover flow, the
 * page's starting placement, draws the next slide turned and overlapping on the right of the one showing.
 */
test("pressing a slide drawn beside the one showing brings it up", async ({ page }) => {
    const box = (await page.locator(viewport(MANUAL)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.92, box.y + box.height * 0.5);

    await expect.poll(() => currentSlide(page, MANUAL), { message: "the slide on the right came up" }).toBe("2 of 4");
});

test("a press on the slide showing does not move the carousel", async ({ page }) => {
    const box = (await page.locator(viewport(MANUAL)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

    expect(await currentSlide(page, MANUAL)).toBe("1 of 4");
});

/**
 * The scrolled example writes the carousel's progress from how far a runway has traveled through a scrolling box,
 * so the slides move with the scroll, and the slide counted as showing follows whichever is nearest.
 */
test("a progress driven by a scroll moves the slides, and the slide showing follows the nearest one", async ({
    page,
}) => {
    expect(await currentSlide(page, SCROLLED)).toBe("1 of 4");

    await page.locator("#carouselScrollBox").evaluate((element) => {
        element.scrollTop = element.scrollHeight;
    });

    await expect
        .poll(() => currentSlide(page, SCROLLED), { message: "scrolled to the end, the last slide is showing" })
        .toBe("4 of 4");
});

/**
 * The ring turns on its own, with its progress written on a clock, so WCAG 2.2.2 asks for a way to stop it. The
 * example's own button is that way, and once pressed the turn holds still.
 */
test("the turning ring stops when its stop control is pressed, and stays stopped", async ({ page }) => {
    const ringTransform = () =>
        page
            .locator(slide(RING))
            .first()
            .evaluate((element) => (element as HTMLElement).style.transform);

    const turning = page.locator("#ringTurn");

    if ((await turning.textContent())?.includes("Turn")) await turning.click();

    await expect.poll(ringTransform, { message: "it is turning" }).not.toBe(await ringTransform());

    await turning.click();

    const stopped = await ringTransform();

    await page.waitForTimeout(SETTLE_MS);

    expect(await ringTransform(), "nothing turns once it is stopped").toBe(stopped);
});

/**
 * The drum is the same carousel under another placement, so everything asked above about labels, wrapping,
 * holds and picks holds here for the same reasons and is not asked twice. What is checked here is the part that
 * genuinely differs: a step turns the slides round a ring rather than sliding them, and the faces that have
 * turned away are as far out of reach as the slides that have gone off the side.
 */
const faceTransform = (page: import("@playwright/test").Page, scope: string) =>
    page
        .locator(slide(scope))
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

const openDrum = async (page: import("@playwright/test").Page) => {
    await pickOption(page, "placement", "Drum");
    await page.mouse.move(0, 0);
};

test("a drum steps by turning, and its slides ride the faces round", async ({ page }) => {
    await openDrum(page);
    const before = await faceTransform(page, MANUAL);

    expect(before, "a face carries its place round the ring and its turn in one transform").toContain("translate3d(");

    await page.locator(control(MANUAL, "Next slide")).click();

    expect(await currentSlide(page, MANUAL), "the step lands on the next slide, exactly as on the track").toBe(
        "2 of 4",
    );
    await expect
        .poll(() => faceTransform(page, MANUAL), { message: "and the faces turned to bring it to the front" })
        .not.toBe(before);
});

test("a swipe turns the drum the way the finger went", async ({ page }) => {
    await openDrum(page);
    await swipeAcross(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the faces leftwards turns the next one round").toBe("2 of 4");
});

test("the faces of a drum that have turned away are out of reach, not merely out of sight", async ({ page }) => {
    await openDrum(page);
    const away = page.locator(`${slide(MANUAL)}[aria-hidden="true"]`);

    await expect(away.first()).toHaveAttribute("inert", "");
    await expect(
        page.locator(`${slide(MANUAL)}:not([aria-hidden="true"])`),
        "exactly one face is the current one, backs and far faces included",
    ).toHaveCount(1);
});

/**
 * The drum turns about one of two axes, and the swipe follows whichever it is — across for a ring on the
 * upright axis, up and down for one lying on its side. Orientation is one knob for the whole page; this reads
 * the face's own transform, where the choice shows.
 */

test("a drum on the other axis turns end over end, and takes its swipe the same way", async ({ page }) => {
    await openDrum(page);
    expect(await faceTransform(page, MANUAL), "on the upright axis by default").toContain("rotateY(");

    await pickOption(page, "orientation", "Up and down");

    expect(await faceTransform(page, MANUAL), "and end over end once it is laid on its side").toContain("rotateX(");

    await expect(
        page.locator(viewport(MANUAL)),
        "the browser keeps the axis the barrel no longer travels on",
    ).toHaveCSS("touch-action", "pan-x");

    await swipeDown(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the faces upwards brings the next one round").toBe("2 of 4");
});

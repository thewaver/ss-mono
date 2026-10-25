import { type Page, expect, test } from "@playwright/test";

import { docsDemo, docsExample, docsSettled, prop, waitUntilStill } from "./helpers";

/**
 * The carousel's page is its Docs view, one example per feature. The basic one is a plain strip with the Previous,
 * Next and pick buttons every example shares; the looks one is the same with a placement picker; the looping one
 * moves on its own after a delay, with a button that stops it; the others are driven by a scroll, in pairs, and
 * windowed. Only the looping one rotates, which is what makes its holds testable: a hold that leaked would show up as
 * the others behaving differently from the one under the pointer.
 *
 * Every slide is named by its place among the slides, so the spec reads the slide count off those names rather than
 * knowing it.
 */
const DOCS = "/src/App/Pages/Carousels/CarouselPage/Docs";

const MANUAL = docsDemo(DOCS, "Basic");
const MANUAL_EXAMPLE = docsExample(DOCS, "Basic");
const LOOKS = docsDemo(DOCS, "Looks");
const LOOKS_EXAMPLE = docsExample(DOCS, "Looks");
const ROTATING = docsDemo(DOCS, "Looping");
const SCROLLED = docsDemo(DOCS, "Scrolled");
const WINDOWED = docsDemo(DOCS, "Windowed");
const PAIRS = docsDemo(DOCS, "Pairs");

const region = (scope: string) => `${scope} [aria-roledescription="carousel"]`;
const slide = (scope: string) => `${scope} [aria-roledescription="slide"]`;
const control = (scope: string, name: string) => `${scope} button[aria-label="${name}"]`;
const viewport = (scope: string) => `${region(scope)} > div:first-child`;

const DELAY_MS = 500;
const SETTLE_MS = 900;
const DRAG_STEPS = 10;

const currentSlide = (page: Page, scope: string) =>
    page.locator(`${slide(scope)}:not([aria-hidden="true"])`).getAttribute("aria-label");

const slideLabels = (page: Page, scope: string) =>
    page.locator(slide(scope)).evaluateAll((slides) => slides.map((element) => element.getAttribute("aria-label")));

const slideCountOf = async (page: Page, scope: string) => new Set(await slideLabels(page, scope)).size;

const position = (index: number, count: number) => `${index} of ${count}`;

/**
 * The looping example's delay is a knob, so the spec turns it down to its floor rather than waiting out the page's
 * own starting delay, typing it the way a person would. Everything timed is then measured against `DELAY_MS` with a
 * margin, and the assertions are about whether the slide moved at all rather than about landing on a frame.
 */
const shortenDelay = async (page: Page) => {
    await page.locator(`${prop("autoplayDelayMs")} input`).click();
    await page.keyboard.press("ControlOrMeta+a");
    await page.keyboard.type(String(DELAY_MS));
    await page.keyboard.press("Tab");
    await page.mouse.move(0, 0);
};

const pickOption = async (page: Page, scope: string, key: string, name: string) => {
    const picker = page.locator(`${scope} ${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

test.beforeEach(async ({ page }) => {
    await page.goto("/carousel/docs");
    await expect(page.locator(region(MANUAL))).toBeVisible();
    await docsSettled(page);
    await page.mouse.move(0, 0);
});

/**
 * A looping carousel with too few slides for its placement draws the list more than once, so the slides on the page
 * are counted by the labels they carry rather than by the elements: every copy names the slide it repeats.
 */
test("the region and every slide say what they are, beyond what their roles alone convey", async ({ page }) => {
    await expect(page.locator(region(MANUAL))).toHaveAttribute("role", "region");
    await expect(page.locator(region(MANUAL)), "the region is named").toHaveAttribute("aria-label", /.+/);

    const count = await slideCountOf(page, MANUAL);

    expect(
        [...new Set(await slideLabels(page, MANUAL))].toSorted(),
        "the slides drawn name every slide by its place, and nothing else",
    ).toEqual(Array.from({ length: count }, (_, index) => position(index + 1, count)).toSorted());
    await expect(page.locator(slide(MANUAL)).first()).toHaveAttribute("role", "group");
    await expect(page.locator(slide(MANUAL)).first()).toHaveAttribute("aria-label", position(1, count));

    expect(await currentSlide(page, MANUAL), "exactly one slide is the current one").toBe(position(1, count));
});

test("the slides that are off screen are out of reach rather than merely out of sight", async ({ page }) => {
    const offScreen = page.locator(`${slide(MANUAL)}[aria-hidden="true"]`);
    const drawn = await page.locator(slide(MANUAL)).count();

    await expect(
        offScreen,
        "every slide drawn but the current one is away, however much of it still shows",
    ).toHaveCount(drawn - 1);
    await expect(offScreen.first()).toHaveAttribute("inert", "");
    await expect(
        page.locator(`${slide(MANUAL)}:not([aria-hidden="true"])`),
        "and the one on screen is neither hidden nor inert",
    ).not.toHaveAttribute("inert");
});

test("stepping wraps at both ends, which is the whole of what separates this from the scroller", async ({ page }) => {
    const count = await slideCountOf(page, MANUAL);

    await page.locator(control(MANUAL, "Previous slide")).click();
    expect(await currentSlide(page, MANUAL), "back from the first slide lands on the last").toBe(
        position(count, count),
    );

    await page.locator(control(MANUAL, "Next slide")).click();
    expect(await currentSlide(page, MANUAL), "and forward from the last comes round again").toBe(position(1, count));

    await expect(
        page.locator(control(MANUAL, "Previous slide")),
        "so neither step is ever the one with nowhere to go",
    ).not.toHaveAttribute("aria-disabled");
});

test("a pick jumps straight to its slide and says which one it is", async ({ page }) => {
    const count = await slideCountOf(page, MANUAL);
    const first = position(1, count);
    const third = position(3, count);

    await expect(page.locator(control(MANUAL, first)), "the current pick is marked as such").toHaveAttribute(
        "aria-current",
        "true",
    );

    await page.locator(control(MANUAL, third)).click();

    expect(await currentSlide(page, MANUAL)).toBe(third);
    await expect(page.locator(control(MANUAL, third))).toHaveAttribute("aria-current", "true");
    await expect(page.locator(control(MANUAL, first))).not.toHaveAttribute("aria-current");
});

test.describe("moving on its own", () => {
    test.beforeEach(async ({ page }) => {
        await shortenDelay(page);
    });

    test("the rotating one advances on its own while the manual one stays put", async ({ page }) => {
        const before = await currentSlide(page, ROTATING);
        const manual = await currentSlide(page, MANUAL);

        await expect.poll(() => currentSlide(page, ROTATING), { timeout: SETTLE_MS * 3 }).not.toBe(before);

        expect(await currentSlide(page, MANUAL), "and a carousel with no delay set never moves itself").toBe(manual);
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

    /**
     * The carousel draws no buttons, so the ones beside it are the page's, outside its box where it cannot see them.
     * The page hands the carousel a hold while the pointer or focus is on them, which it lets go of once focus leaves.
     */
    test("it holds while focus is on the buttons drawn for it, so a keyboard user is not chased", async ({ page }) => {
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
});

/**
 * The swipe is measured against the viewport's own width, so a drag is written as a pair of fractions of it
 * and run in enough steps to clear the slop the gesture waits for before it takes the pointer over.
 */
const swipeAcross = async (page: Page, scope: string, from: number, to: number) => {
    await page.locator(viewport(scope)).scrollIntoViewIfNeeded();

    const box = (await page.locator(viewport(scope)).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test("the disabled knob stops the controls and the swipe", async ({ page }) => {
    await page.locator(`${prop("isDisabled")} input`).click();

    const stopped = await currentSlide(page, MANUAL);

    await page.locator(control(MANUAL, "Next slide")).click({ force: true });
    expect(await currentSlide(page, MANUAL), "nothing steps a disabled carousel").toBe(stopped);

    await swipeAcross(page, MANUAL, 0.8, 0.2);
    expect(await currentSlide(page, MANUAL), "not even a swipe").toBe(stopped);
});

test("a swipe across the slides steps the way the finger went", async ({ page }) => {
    const count = await slideCountOf(page, MANUAL);

    await swipeAcross(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the slides leftwards brings the next one in").toBe(
        position(2, count),
    );

    await swipeAcross(page, MANUAL, 0.2, 0.7);

    expect(await currentSlide(page, MANUAL), "and pushing them back the other way returns to the first").toBe(
        position(1, count),
    );
});

test("a swipe let go before it has traveled far enough puts the slide back", async ({ page }) => {
    const before = await currentSlide(page, MANUAL);

    await swipeAcross(page, MANUAL, 0.8, 0.7);

    expect(await currentSlide(page, MANUAL), "a tenth of the width is a nudge, not a step").toBe(before);
});

/**
 * The carousel draws no controls of its own, so whether it takes a swipe cannot hang on whether controls were drawn.
 * It hangs on whether the page drives `progress`: a carousel moved by a scroll position leaves the gesture to the
 * browser, so the page's own scrolling is never taken from it.
 */
test("a carousel driven by a scroll refuses the swipe", async ({ page }) => {
    await expect(
        page.locator(viewport(SCROLLED)),
        "the axis is never claimed, so the browser keeps the whole gesture",
    ).toHaveCSS("touch-action", "auto");
});

/**
 * A column carousel is the same component with `orientation` set — a knob on the basic example rather than an
 * example of its own — so the drag that steps it runs down the viewport rather than across it, and is written as a
 * pair of fractions of the height for the same reason the horizontal one uses fractions of the width: a fraction
 * means the same thing whatever the window is doing.
 */
const swipeDown = async (page: Page, scope: string, from: number, to: number) => {
    await page.locator(viewport(scope)).scrollIntoViewIfNeeded();

    const box = (await page.locator(viewport(scope)).boundingBox())!;
    const x = box.x + box.width * 0.5;

    await page.mouse.move(x, box.y + box.height * from);
    await page.mouse.down();
    await page.mouse.move(x, box.y + box.height * to, { steps: DRAG_STEPS });
    await page.mouse.up();
};

test("a column carousel claims the other axis and steps the way the finger went", async ({ page }) => {
    const count = await slideCountOf(page, MANUAL);

    await pickOption(page, MANUAL_EXAMPLE, "orientation", "vertical");

    await expect(
        page.locator(viewport(MANUAL)),
        "the browser keeps the axis this carousel does not travel on",
    ).toHaveCSS("touch-action", "pan-x");

    await swipeDown(page, MANUAL, 0.8, 0.3);

    expect(await currentSlide(page, MANUAL), "pushing the slides upwards brings the next one in").toBe(
        position(2, count),
    );

    await swipeDown(page, MANUAL, 0.2, 0.7);

    expect(await currentSlide(page, MANUAL), "and pushing them back down returns to the first").toBe(
        position(1, count),
    );
});

/**
 * Every slide fills the carousel's box before its placement moves it, which is what lets a placement count its
 * lengths in shares of the box. A box that collapsed to nothing is the failure this watches for, and it is
 * measured in layout space rather than from a client rect.
 */
test("the slide showing fills the carousel's box exactly, across or up and down", async ({ page }) => {
    for (const orientation of ["horizontal", "vertical"]) {
        await pickOption(page, MANUAL_EXAMPLE, "orientation", orientation);

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
 * carousel's box, and the carousel works out from where it landed which slide was aimed at. Cover flow, the looks
 * example's starting placement, draws the next slide turned and overlapping on the right of the one showing.
 */
test("pressing a slide drawn beside the one showing brings it up", async ({ page }) => {
    const count = await slideCountOf(page, LOOKS);

    await page.locator(viewport(LOOKS)).scrollIntoViewIfNeeded();

    const box = (await page.locator(viewport(LOOKS)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.92, box.y + box.height * 0.5);

    await expect
        .poll(() => currentSlide(page, LOOKS), { message: "the slide on the right came up" })
        .toBe(position(2, count));
});

test("a press on the slide showing does not move the carousel", async ({ page }) => {
    const before = await currentSlide(page, LOOKS);

    await page.locator(viewport(LOOKS)).scrollIntoViewIfNeeded();

    const box = (await page.locator(viewport(LOOKS)).boundingBox())!;

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);

    expect(await currentSlide(page, LOOKS)).toBe(before);
});

/**
 * The scrolled example writes the carousel's progress from how far a runway has traveled through a scrolling box,
 * so the slides move with the scroll, and the slide counted as showing follows whichever is nearest. The scrolling
 * box is the only element in the example that scrolls.
 */
test("a progress driven by a scroll moves the slides, and the slide showing follows the nearest one", async ({
    page,
}) => {
    const count = await slideCountOf(page, SCROLLED);

    expect(await currentSlide(page, SCROLLED)).toBe(position(1, count));

    await page.locator(SCROLLED).evaluate((demo) => {
        const box = [...demo.querySelectorAll("*")].find((element) => element.scrollHeight > element.clientHeight + 1)!;

        box.scrollTop = box.scrollHeight;
    });

    await expect
        .poll(() => currentSlide(page, SCROLLED), { message: "scrolled to the end, the last slide is showing" })
        .toBe(position(count, count));
});

/**
 * The drum is the same carousel under another placement, so everything asked above about labels, wrapping,
 * holds and picks holds here for the same reasons and is not asked twice. What is checked here is the part that
 * genuinely differs: a step turns the slides round a ring rather than sliding them, and the faces that have
 * turned away are as far out of reach as the slides that have gone off the side.
 */
const faceTransform = (page: Page, scope: string) =>
    page
        .locator(slide(scope))
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

const openDrum = async (page: Page) => {
    await pickOption(page, LOOKS_EXAMPLE, "placement", "drum");
    await page.mouse.move(0, 0);
};

test("a drum steps by turning, and its slides ride the faces round", async ({ page }) => {
    await openDrum(page);
    const count = await slideCountOf(page, LOOKS);
    const before = await faceTransform(page, LOOKS);

    expect(before, "a face carries its place round the ring and its turn in one transform").toContain("translate3d(");

    await page.locator(control(LOOKS, "Next slide")).click();

    expect(await currentSlide(page, LOOKS), "the step lands on the next slide, exactly as on the track").toBe(
        position(2, count),
    );
    await expect
        .poll(() => faceTransform(page, LOOKS), { message: "and the faces turned to bring it to the front" })
        .not.toBe(before);
});

test("a swipe turns the drum the way the finger went", async ({ page }) => {
    await openDrum(page);
    const count = await slideCountOf(page, LOOKS);

    await swipeAcross(page, LOOKS, 0.8, 0.3);

    expect(await currentSlide(page, LOOKS), "pushing the faces leftwards turns the next one round").toBe(
        position(2, count),
    );
});

test("the faces of a drum that have turned away are out of reach, not merely out of sight", async ({ page }) => {
    await openDrum(page);
    const away = page.locator(`${slide(LOOKS)}[aria-hidden="true"]`);

    await expect(away.first()).toHaveAttribute("inert", "");
    await expect(
        page.locator(`${slide(LOOKS)}:not([aria-hidden="true"])`),
        "exactly one face is the current one, backs and far faces included",
    ).toHaveCount(1);
});

/**
 * The drum turns about one of two axes, and the swipe follows whichever it is — across for a ring on the
 * upright axis, up and down for one lying on its side. Orientation is a knob of the looks example; this reads
 * the face's own transform, where the choice shows.
 */
test("a drum on the other axis turns end over end, and takes its swipe the same way", async ({ page }) => {
    await openDrum(page);
    const count = await slideCountOf(page, LOOKS);

    expect(await faceTransform(page, LOOKS), "on the upright axis by default").toContain("rotateY(");

    await pickOption(page, LOOKS_EXAMPLE, "orientation", "vertical");

    expect(await faceTransform(page, LOOKS), "and end over end once it is laid on its side").toContain("rotateX(");

    await expect(page.locator(viewport(LOOKS)), "the browser keeps the axis the barrel no longer travels on").toHaveCSS(
        "touch-action",
        "pan-x",
    );

    await swipeDown(page, LOOKS, 0.8, 0.3);

    expect(await currentSlide(page, LOOKS), "pushing the faces upwards brings the next one round").toBe(
        position(2, count),
    );
});

/**
 * The windowed example holds a hundred slides and counts, in the line under it, the slides its painter has been
 * asked to build — the first number in that line. The spec does not name the handful a placement draws — that is the
 * placement's `reach` and changes with it — only that it is fewer than the whole list, that it is exactly what is in
 * the document, and that stepping does not grow it. The whole list's length is read off the slides' names.
 */
const countsOf = async (page: Page) => {
    const text = (await page.locator(`${WINDOWED} [data-readout]`).textContent()) ?? "";
    const label = (await currentSlide(page, WINDOWED)) ?? "";

    return {
        total: Number(/of (\d+)/.exec(label)?.[1]),
        built: Number(/\d+/.exec(text)?.[0]),
    };
};

test(
    "a windowed carousel builds only the slides its placement draws, and keeps it so as it moves",
    { tag: "@solo" },
    async ({ page }) => {
        const before = await countsOf(page);

        expect(before.built, "a handful are built").toBeGreaterThan(0);
        expect(before.built, "rather than the whole list").toBeLessThan(before.total);
        await expect(page.locator(slide(WINDOWED)), "and the count is what is in the document").toHaveCount(
            before.built,
        );

        for (let step = 0; step < 3; step++) {
            await page.locator(control(WINDOWED, "Next slide")).click();
        }

        await page.waitForTimeout(SETTLE_MS);

        expect((await countsOf(page)).built, "stepping on builds the newcomers and drops the ones left behind").toBe(
            before.built,
        );
        await expect(page.locator(slide(WINDOWED))).toHaveCount(before.built);
        expect(await currentSlide(page, WINDOWED), "and the carousel really did move").toBe(position(4, before.total));
    },
);

/**
 * The pairs example hands the carousel a grouping of two slides to a stop, so a dot, a step and the slide counted
 * as current are all about a pair. The example's slide count is even, so every pair is whole; how many pairs
 * there are is read off the slides' own labels rather than written down.
 */
const ANNOUNCER = 'body > [role="log"][aria-live="polite"]';

const currentSlides = (page: Page, scope: string) =>
    page
        .locator(`${slide(scope)}:not([aria-hidden="true"])`)
        .evaluateAll((slides) => slides.map((element) => element.getAttribute("aria-label")));

const picksOf = (scope: string) => `${scope} button[aria-label]:not([aria-label$=" slide"])`;

test("the dots of a paired carousel count pairs, not slides", async ({ page }) => {
    const slideCount = await slideCountOf(page, PAIRS);

    expect(slideCount % 2, "the example starts with an even number of slides").toBe(0);
    await expect(page.locator(picksOf(PAIRS)), "one dot for every two slides").toHaveCount(slideCount * 0.5);
    await expect(page.locator(picksOf(PAIRS)).first(), "and each dot is named as one of the pairs").toHaveAttribute(
        "aria-label",
        position(1, slideCount * 0.5),
    );
});

test("a step moves a whole pair, and both slides of the pair showing are current", async ({ page }) => {
    const slideCount = await slideCountOf(page, PAIRS);

    expect(await currentSlides(page, PAIRS), "the first pair is the two slides at the front").toEqual([
        position(1, slideCount),
        position(2, slideCount),
    ]);
    await expect(
        page.locator(`${slide(PAIRS)}[aria-label="${position(3, slideCount)}"]`).first(),
        "while the next pair's slides are out of reach",
    ).toHaveAttribute("inert", "");

    await page.locator(control(PAIRS, "Next slide")).click();

    expect(await currentSlides(page, PAIRS), "one step lands on the next pair, both its slides").toEqual([
        position(3, slideCount),
        position(4, slideCount),
    ]);
    await expect(page.locator(`${slide(PAIRS)}:not([aria-hidden="true"])`).first()).not.toHaveAttribute("inert");
    await expect(page.locator(`${slide(PAIRS)}:not([aria-hidden="true"])`).last()).not.toHaveAttribute("inert");
    await expect(page.locator(picksOf(PAIRS)).nth(1), "and the second dot is the current one").toHaveAttribute(
        "aria-current",
        "true",
    );
});

/**
 * What a step announces is the group it landed on, named by the page's `computeGroupLabel` from the first and last
 * slide it holds, through the live region on the body that belongs to no component.
 */
test("a step announces the pair it landed on", async ({ page }) => {
    const slideCount = await slideCountOf(page, PAIRS);

    await page.locator(control(PAIRS, "Next slide")).click();
    await expect(page.locator(ANNOUNCER), "the pair is named by its two slides").toContainText(`3–4 of ${slideCount}`);

    await page.locator(control(PAIRS, "Previous slide")).click();
    await expect(page.locator(ANNOUNCER), "and stepping back names the first pair").toContainText(
        `1–2 of ${slideCount}`,
    );
});

/**
 * A resting pair is laid out as one unit, the two slides side by side in the room of one. The painted card inside
 * each slide is measured, not the slide's own box, and the two current cards must share a middle across the axis and
 * meet along it, read from their boxes and not from any number written down. The pairs example uses the plain strip;
 * no example pairs a turning placement.
 */
const cardBoxes = (page: Page, scope: string) =>
    page
        .locator(`${slide(scope)}:not([aria-hidden="true"]) > div:not([aria-hidden="true"]) > div`)
        .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().toJSON() as DOMRect));

test("a pair rests side by side along the axis, in the room of one slide", async ({ page }) => {
    await page.locator(viewport(PAIRS)).scrollIntoViewIfNeeded();
    await waitUntilStill(page.locator(`${slide(PAIRS)}:not([aria-hidden="true"])`).first());

    expect(await currentSlides(page, PAIRS), "both slides of the pair are current").toHaveLength(2);

    const [first, second] = await cardBoxes(page, PAIRS);
    const tolerance = Math.min(first.width, second.width) * 0.05;

    expect(second.left, "the second card comes after the first").toBeGreaterThan(first.left);
    expect(
        Math.abs(second.left - first.right),
        "the two cards meet edge to edge rather than overlapping or parting",
    ).toBeLessThan(tolerance);
    expect(
        Math.abs(second.top + second.height * 0.5 - (first.top + first.height * 0.5)),
        "they share a middle across the axis",
    ).toBeLessThan(tolerance);
});

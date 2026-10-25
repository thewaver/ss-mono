import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, docsDemo, docsSettled, scrollTop, waitUntilStill } from "./helpers";

const GUIDE_DOCS = "/src/App/Pages/Spotlights/SpotlightGuidePage/Docs";
const HINT_DOCS = "/src/App/Pages/Spotlights/SpotlightHintPage/Docs";
const PROMPT_DOCS = "/src/App/Pages/Spotlights/SpotlightPromptPage/Docs";

const HINT = docsDemo(HINT_DOCS, "Basic");
const PROMPT = docsDemo(PROMPT_DOCS, "Basic");
const GUIDE = docsDemo(GUIDE_DOCS, "Basic");
const TOUR = docsDemo(GUIDE_DOCS, "Tour");

const SETTLE_MS = 300;

/**
 * The overlay is portaled and every part of it is styled through a hashed class, so these key on what the
 * geometry produces rather than on names: one transparent layer carries an inline `clip-path` with the
 * highlighted rect cut out of it, which is what keeps the pointer off everything but the hole, and the
 * corner polygons are what the consumer's `renderHighlight` draws. The even-odd fill rule is what makes the
 * inner ring a hole rather than a second filled box, so it is the part of the value worth keying on — a bare
 * `clip-path` would also catch the announcer's visually-hidden region, which clips itself to nothing.
 */
const BLOCKER = 'div[style*="polygon(evenodd"]';
const CORNERS = "svg polygon";
const POPUP = '[role="dialog"]';
const TOOLTIP = '[role="tooltip"]';
const ANNOUNCER = '[role="log"][aria-live="polite"]';

/** Every layer the spotlight paints sits here, so a tooltip that is to stay readable has to beat it. */
const SPOTLIGHT_Z_INDEX = 10;

const isFocusInsidePopup = (page: Page) =>
    page.evaluate(() => {
        const popup = document.querySelector('[role="dialog"]');

        return !!popup && !!document.activeElement && popup.contains(document.activeElement);
    });

const isActive = (locator: Locator) => locator.evaluate((element) => document.activeElement === element);

const readoutOf = async (page: Page, demo: string) =>
    ((await page.locator(`${demo} [data-readout]`).textContent()) ?? "").trim();

/**
 * The hint's own triggers sit inside a container running a looping CSS slide, so they never stop moving and
 * Playwright's stability check can never pass — a pointer click there waits out the full timeout. Focus and
 * Enter need no geometry, and a keyboard user reaching a moving button is the same journey.
 */
const pressByKeyboard = async (page: Page, selector: string) => {
    await page.locator(selector).focus();
    await page.keyboard.press("Enter");
};

/**
 * The hint's triggers loop forever, which is also what stops a pointer action from ever settling. Pausing the
 * looping animations and leaving every other one alone gives the pointer something to land on without
 * freezing the fades the spotlight and the tooltip run to show themselves.
 */
const stopSliding = (page: Page) =>
    page.evaluate(() => {
        for (const animation of document.getAnimations()) {
            if (animation.effect?.getTiming().iterations === Infinity) animation.pause();
        }
    });

/** Each preset has a Docs page of its own, so each test opens the one it is about. */
const open = async (page: Page, route: string, scope: string) => {
    await page.goto(route);
    await expect(page.locator(scope)).toBeVisible();
    await docsSettled(page);
};

const openHint = (page: Page) => open(page, "/spotlight-hint/docs", HINT);
const openPrompt = (page: Page) => open(page, "/spotlight-prompt/docs", PROMPT);
const openGuide = (page: Page) => open(page, "/spotlight-guide/docs", GUIDE);

test("nothing is portaled before anything is highlighted", async ({ page }) => {
    await openHint(page);
    await expect(page.locator(BLOCKER), "nothing is holding the pointer off the page").toHaveCount(0);
    await expect(page.locator(CORNERS), "and no highlight decoration").toHaveCount(0);
});

test("opening lays one clipped layer over the page with the element cut out of it", async ({ page }) => {
    await openHint(page);
    await pressByKeyboard(page, "#hintAcross");

    await expect(page.locator(BLOCKER), "one layer rather than a ring of boxes").toHaveCount(1);
    await expect(page.locator(CORNERS), "and the consumer's four corner marks").toHaveCount(4);
});

/**
 * A spotlight's whole promise is that the highlighted element stays readable, and a tooltip describing that
 * element is part of what has to be read. The tooltip works out its own height by walking up from its anchor
 * and going one above the tallest thing it passes — and the overlay is not on that walk, because it is a
 * sibling in the portal rather than an ancestor of the button. So the height has to be published rather than
 * discovered, which is what the elevation registry does. The second half of this is the half that matters: it
 * is the spotlight granting the lift, not tooltips outranking overlays everywhere.
 *
 * The lift is asserted without hovering a second time, because the tooltip is already open when the spotlight
 * arrives — that is the ordering a visitor produces by hovering the button and then pressing it, and the one
 * that needs the registry to be reactive rather than merely read once on show.
 */
test("a tooltip on the highlighted element rises above the overlay, and only there", async ({ page }) => {
    await openHint(page);
    const readTooltipZIndex = () =>
        page.locator(TOOLTIP).evaluate((element) => Number.parseInt(getComputedStyle(element).zIndex, 10));

    await stopSliding(page);
    await page.locator("#hintAcross").hover();
    await expect(page.locator(TOOLTIP)).toBeVisible();

    expect(await readTooltipZIndex(), "on the plain page it sits just above its own button").toBeLessThan(
        SPOTLIGHT_Z_INDEX,
    );

    await pressByKeyboard(page, "#hintAcross");
    await expect(page.locator(BLOCKER)).toHaveCount(1);
    await expect(page.locator(TOOLTIP), "the tooltip is still the one opened before the spotlight").toBeVisible();

    expect(
        await readTooltipZIndex(),
        "and it has risen over the overlay rather than blurring with the page",
    ).toBeGreaterThan(SPOTLIGHT_Z_INDEX);
});

/**
 * A hint yields to anything. It is the one mode that treats a keypress as "you have moved on" rather than as
 * something to swallow — but a bare modifier is not moving on, and a screen reader's virtual cursor would
 * otherwise kill the hint before it was read.
 */
test("a hint is dismissed by a real key and survives a bare modifier", async ({ page }) => {
    await openHint(page);
    await pressByKeyboard(page, "#hintAcross");
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page.keyboard.down("Shift");
    await page.keyboard.up("Shift");
    await page.waitForTimeout(SETTLE_MS);
    await expect(page.locator(BLOCKER), "holding Shift is not moving on").toHaveCount(1);

    await page.keyboard.press("a");
    await expect(page.locator(BLOCKER), "but a key that means something is").toHaveCount(0);
});

test("a prompt refuses every other control until the highlighted one is used", async ({ page }) => {
    await openPrompt(page);
    const atRest = await readoutOf(page, PROMPT);

    await page.locator("#promptInsist").click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page
        .locator("#promptInsist")
        .click({ force: true, timeout: 2000 })
        .catch(() => undefined);
    expect(await readoutOf(page, PROMPT), "the trigger behind the overlay is unreachable").toBe(atRest);

    await page.keyboard.press("Tab");
    expect(await activeMatches(page, "#promptBuy"), "and focus is pulled back to the one live control").toBe(true);

    await page.locator("#promptBuy").click();
    expect(await readoutOf(page, PROMPT), "using it is the way out").not.toBe(atRest);
    await expect(page.locator(BLOCKER)).toHaveCount(0);
});

/**
 * WCAG 2.1.2 is Level A and permits trapping focus only while a standard exit remains, so the mode whose
 * whole promise is that you cannot do anything else still has to answer Escape. This is that guarantee.
 */
test("a prompt still answers Escape, which is what keeps it out of a keyboard trap", async ({ page }) => {
    await openPrompt(page);
    const atRest = await readoutOf(page, PROMPT);

    await page.locator("#promptInsist").click();
    await expect(page.locator(BLOCKER)).toHaveCount(1);

    await page.keyboard.press("Escape");

    await expect(page.locator(BLOCKER), "the spotlight is gone").toHaveCount(0);
    expect(await readoutOf(page, PROMPT), "without the highlighted control ever being used").toBe(atRest);
});

/**
 * A guide seals by walking from its own portal up to the body and marking every sibling inert, so what it
 * seals is not inside the demo — it is the whole page around it, and there is nothing narrower to point at.
 * What can be narrowed is the question: a bare count of `[inert]` over the document answers "did the guide
 * seal the page" and "is anything else on this page inert for its own reasons" at the same time, and the
 * second reading is live, because collapsed disclosures on the page are inert. Both assertions therefore
 * compare against what was already inert before the tour started, which leaves one question each: the guide
 * sealed more than it found, and afterwards it left exactly what it found.
 */
const inertCount = (page: Page) => page.locator("[inert]").count();

test("a guide seals the page and puts focus in its own popup", async ({ page }) => {
    await openGuide(page);
    const alreadyInert = await inertCount(page);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.locator(POPUP), "the popup names itself as a modal dialog").toHaveAttribute("aria-modal", "true");
    expect(await isFocusInsidePopup(page), "and focus lands inside it").toBe(true);

    expect(
        await inertCount(page),
        "everything beside the portal is inert, so the page is out of reach entirely",
    ).toBeGreaterThan(alreadyInert);
});

test("a guide steps between elements and hands the page back when it finishes", async ({ page }) => {
    await openGuide(page);
    const alreadyInert = await inertCount(page);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();

    const firstStep = await page.locator(POPUP).textContent();

    await page.locator("#guideNext").click();

    await expect(page.locator(POPUP), "Next moves the popup to the next element's text").not.toHaveText(
        firstStep ?? "",
    );
    expect(
        await isActive(page.locator("#guideNext")),
        "and focus stays where the reader put it — a step change must not throw them onto Skip all",
    ).toBe(true);

    await page.locator("#guideNext").click();

    await expect(page.locator(POPUP), "finishing closes it").toHaveCount(0);
    await expect(page.locator("[inert]"), "and the page is handed back").toHaveCount(alreadyInert);
});

/**
 * How the tour ended is the page's own statement in its readout, so the test asks that finishing and skipping
 * report different things, each different from what it said while the tour ran.
 */
test("a guide reports how it ended, and finishing is not skipping", async ({ page }) => {
    await openGuide(page);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();

    const running = await readoutOf(page, GUIDE);

    await page.locator("#guideNext").click();
    await page.locator("#guideNext").click();
    await expect(page.locator(POPUP)).toHaveCount(0);

    const finished = await readoutOf(page, GUIDE);

    expect(finished, "finishing is reported").not.toBe(running);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.locator("#guideSkip").click();
    await expect(page.locator(POPUP)).toHaveCount(0);

    const skipped = await readoutOf(page, GUIDE);

    expect(skipped, "abandoning it is reported").not.toBe(running);
    expect(skipped, "and differently from finishing").not.toBe(finished);
});

/**
 * A step change replaces the popup's content while focus deliberately stays put, so a screen reader is told
 * nothing at all — the one case where holding focus still costs something. The words are the consumer's, as
 * they are for a toast: the library owns neither the step count nor the title. Announced only on a change,
 * because the popup takes focus when the tour opens and the first step is read there already.
 */
test("a step change is announced, and opening the tour is not announced twice", async ({ page }) => {
    await openGuide(page);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();

    await expect(
        page.locator(ANNOUNCER),
        "the popup took focus, so the reader is already on the first step",
    ).not.toContainText("Step 1 of");

    await page.locator("#guideNext").click();

    await expect(page.locator(ANNOUNCER), "and the step that replaces it under held focus is spoken").toContainText(
        "Step 2 of",
    );
});

/**
 * Every mode scrolls to what it highlights, because none of them chooses what is on screen when it opens —
 * the element is wherever the page put it. A tour is where that bites first and where it is easiest to
 * drive: the guide example holds its steps in a strip only one step tall, so the second one is out of sight
 * until something scrolls to it, which is the situation a long page produces naturally.
 *
 * The reading at the first step is captured rather than asserted to be zero. The strip is padded and a step
 * is taller than the band left inside it, so aligning the step's top alone moves the strip by the padding — a
 * fact about how the example is painted, which is not what this test is for. What it is for is the travel
 * between the two, so the second reading is compared against the first.
 */
test("a guide scrolls a step that is out of sight into view", async ({ page }) => {
    await openGuide(page);
    const strip = page.locator(`${GUIDE} [data-scroll-box]`);

    await page.locator("#guideStart").click();
    await expect(page.locator(POPUP)).toBeVisible();
    await page.waitForTimeout(SETTLE_MS);

    const atFirstStep = await scrollTop(strip);

    await page.locator("#guideNext").click();
    await page.waitForTimeout(SETTLE_MS);

    expect(await scrollTop(strip), "the second is reached rather than highlighted off-screen").toBeGreaterThan(
        atFirstStep,
    );
});

/**
 * The shop tour is a guide with a step the reader performs rather than reads. A guide seals the whole page, so it
 * cannot also let the reader press the button it is pointing at; on the waiting step a prompt opens over the guide
 * and lights the one control. Spotlights stack the way modals do: the guide stays open beneath the prompt, fades
 * out and stops acting while covered, and comes back when the prompt closes. Using the control brings the guide
 * back on the next step; Escape on the prompt brings it back on the same one.
 *
 * Every control carries an id the page gave it: start, add and checkout on the page, skip, back and forward in the
 * popup. The step and the tour's status are read from the example's readout, `Step: N of M, status`, which is the
 * page's own statement of where the tour is; a status is compared with another status, never with words.
 */
test.describe("a tour with a step the reader does", () => {
    const WAITING_STEP = 2;

    const addButton = (page: Page) => page.locator("#tourAdd");
    const checkoutButton = (page: Page) => page.locator("#tourCheckout");
    const startButton = (page: Page) => page.locator("#tourStart");
    const skipAction = (page: Page) => page.locator("#tourSkip");
    const backAction = (page: Page) => page.locator("#tourBack");
    const forwardAction = (page: Page) => page.locator("#tourForward");

    const readTour = async (page: Page) => {
        const match = /(\d+) of (\d+), (.+)$/.exec(await readoutOf(page, TOUR));

        return { step: Number(match?.[1]), count: Number(match?.[2]), status: match?.[3] ?? "" };
    };

    const stepReadout = async (page: Page) => (await readTour(page)).step;
    const statusReadout = async (page: Page) => (await readTour(page)).status;

    const blockerClip = (page: Page) =>
        page.locator(BLOCKER).evaluate((element) => (element as HTMLElement).style.clipPath);

    const start = async (page: Page) => {
        await startButton(page).click();
        await expect(page.locator(POPUP)).toBeVisible();
    };

    const reachWaitingStep = async (page: Page) => {
        await start(page);

        for (let step = 1; step < WAITING_STEP; step++) await forwardAction(page).click();

        await expect.poll(() => stepReadout(page)).toBe(WAITING_STEP);
    };

    const handOver = async (page: Page) => {
        await reachWaitingStep(page);
        await forwardAction(page).click();
        await expect(page.locator(POPUP)).toHaveCount(0);
    };

    test.beforeEach(async ({ page }) => {
        await openGuide(page);
        await expect(page.locator(TOUR)).toBeVisible();
    });

    test("opens as a named modal on its first step, with Back unavailable", async ({ page }) => {
        const alreadyInert = await inertCount(page);

        await start(page);
        await waitUntilStill(page.locator(POPUP));

        expect(await stepReadout(page), "it starts at the beginning").toBe(1);
        await expect(page.locator(POPUP)).toHaveAttribute("aria-modal", "true");
        expect(await page.locator(POPUP).getAttribute("aria-label"), "and names itself").toBeTruthy();
        await expect.poll(() => isFocusInsidePopup(page), { message: "focus lands inside it" }).toBe(true);
        expect(await inertCount(page), "and the page around it is sealed").toBeGreaterThan(alreadyInert);

        await expect(backAction(page), "there is nowhere to go back to").toHaveAttribute("aria-disabled", "true");

        await backAction(page).click({ force: true });
        expect(await stepReadout(page), "so pressing it anyway does nothing").toBe(1);
    });

    test("forward and back step through the tour, and the highlight follows", async ({ page }) => {
        await start(page);
        await waitUntilStill(page.locator(POPUP));

        const atFirstStep = await blockerClip(page);

        await forwardAction(page).click();
        expect(await stepReadout(page)).toBe(2);
        await expect(backAction(page), "Back comes to life after the first step").not.toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await expect
            .poll(() => blockerClip(page), { message: "the hole in the overlay moves to the next element" })
            .not.toBe(atFirstStep);

        await backAction(page).click();
        expect(await stepReadout(page), "Back returns a step").toBe(1);
        await expect(page.locator(POPUP), "without closing the tour").toBeVisible();
    });

    /**
     * The guide is not closed to make room for the prompt: it stays open beneath it, so the tour's status does not
     * move, and the one overlay on screen is the prompt's, around the button.
     */
    test("the tour opens its prompt over the guide, which stays open beneath it", async ({ page }) => {
        await reachWaitingStep(page);
        const running = await statusReadout(page);

        await forwardAction(page).click();

        await expect(page.locator(POPUP), "the guide's popup fades out under the prompt").toHaveCount(0);
        await expect(
            page.locator(BLOCKER),
            "one clipped layer is left, the prompt's, not one per spotlight",
        ).toHaveCount(1);
        expect(await stepReadout(page), "the tour has not moved on by itself").toBe(WAITING_STEP);
        expect(await statusReadout(page), "and the guide was never closed, so the tour is still running").toBe(running);
    });

    /**
     * Only the spotlight on top acts. The covered guide neither seals the page nor holds focus in its popup — had it
     * kept acting, the button the prompt lights could not be pressed, and the two would pull focus back and forth.
     * The prompt does act: it pulls focus to its control and keeps the others out of reach.
     */
    test("spotlights stack, and only the top one acts", async ({ page }) => {
        const alreadyInert = await inertCount(page);

        await handOver(page);

        await expect(page.locator("[inert]"), "the covered guide has let go of the page").toHaveCount(alreadyInert);

        await page.keyboard.press("Tab");
        expect(await isActive(addButton(page)), "the prompt on top pulls focus to the one control it lights").toBe(
            true,
        );
        expect(await isFocusInsidePopup(page), "and nothing pulls it back into the guide").toBe(false);

        await checkoutButton(page)
            .click({ force: true, timeout: 2000 })
            .catch(() => undefined);
        expect(await isActive(checkoutButton(page)), "the other controls stay out of reach").toBe(false);

        await addButton(page).click();

        await expect(page.locator(POPUP), "once the prompt has gone, the guide is on top and comes back").toBeVisible();
        expect(await stepReadout(page), "on the step after the one the reader did").toBe(WAITING_STEP + 1);
        await expect.poll(() => isFocusInsidePopup(page), { message: "acting again, with focus inside it" }).toBe(true);
        expect(await inertCount(page), "and sealing the page again").toBeGreaterThan(alreadyInert);
        await expect(page.locator(BLOCKER), "with only the guide's overlay left").toHaveCount(1);
    });

    test("one Escape closes only the top layer", async ({ page }) => {
        await handOver(page);
        const running = await statusReadout(page);

        await page.keyboard.press("Escape");

        await expect(page.locator(POPUP), "the first Escape closes the prompt, and the guide comes back").toBeVisible();
        expect(await stepReadout(page), "on the same step, since the reader did not do it").toBe(WAITING_STEP);
        expect(await statusReadout(page), "with the tour still running").toBe(running);
        await expect(page.locator(BLOCKER), "one overlay, the guide's").toHaveCount(1);

        await page.keyboard.press("Escape");

        await expect(page.locator(POPUP), "the second Escape closes the guide").toHaveCount(0);
        await expect(page.locator(BLOCKER), "with no overlay left behind").toHaveCount(0);
        expect(await statusReadout(page), "and the tour says it stopped").not.toBe(running);
    });

    /**
     * WCAG 2.4.3. A guide covered by the prompt loses focus and gets it back on its return, by which time focus sits
     * wherever the prompt left it — the button the reader pressed. Closing the guide afterwards must still return
     * focus to what opened the tour, not to that button.
     */
    test("a spotlight returns focus to what first opened it", async ({ page }) => {
        await handOver(page);
        await addButton(page).click();
        await expect(page.locator(POPUP)).toBeVisible();
        await expect.poll(() => isFocusInsidePopup(page)).toBe(true);

        await page.keyboard.press("Escape");
        await expect(page.locator(POPUP)).toHaveCount(0);

        await expect(startButton(page), "focus goes back to the button that started the tour").toBeFocused();
        expect(await isActive(addButton(page)), "not to the one pressed while the guide was covered").toBe(false);
    });

    test("the last step finishes the tour and hands the page back", async ({ page }) => {
        const alreadyInert = await inertCount(page);

        await handOver(page);
        await addButton(page).click();
        await expect(page.locator(POPUP)).toBeVisible();

        const { count } = await readTour(page);

        while ((await stepReadout(page)) < count) await forwardAction(page).click();

        const running = await statusReadout(page);

        await forwardAction(page).click();

        await expect(page.locator(POPUP), "finishing closes it").toHaveCount(0);
        await expect(page.locator(BLOCKER), "with no overlay left behind").toHaveCount(0);
        expect(await statusReadout(page), "the tour says it ended").not.toBe(running);
        await expect(page.locator("[inert]"), "and the page is handed back").toHaveCount(alreadyInert);
    });

    test("skipping ends it from any step and says so", async ({ page }) => {
        await start(page);
        await forwardAction(page).click();
        expect(await stepReadout(page)).toBe(2);

        const running = await statusReadout(page);

        await skipAction(page).click();

        await expect(page.locator(POPUP)).toHaveCount(0);
        await expect(page.locator(BLOCKER)).toHaveCount(0);
        expect(await statusReadout(page)).not.toBe(running);
    });

    /**
     * The step is kept for the session, so a reader who reloads part-way is offered the tour where they left
     * it rather than from the start. Ending it — finished or skipped — clears the memory, which the second
     * reload checks against what a fresh page said.
     */
    test("a reload part-way offers to resume at the same step, and ending it forgets", async ({ page }) => {
        const fresh = await statusReadout(page);

        await handOver(page);
        await addButton(page).click();
        await expect.poll(() => stepReadout(page)).toBe(WAITING_STEP + 1);

        await page.reload();
        await expect(page.locator(TOUR)).toBeVisible();

        expect(await statusReadout(page), "the page knows a tour was left part-way").not.toBe(fresh);
        await expect(page.locator(POPUP), "without opening it unasked").toHaveCount(0);

        await start(page);
        expect(await stepReadout(page), "starting again resumes where it was left").toBe(WAITING_STEP + 1);

        await skipAction(page).click();
        await expect(page.locator(POPUP)).toHaveCount(0);

        await page.reload();
        await expect(page.locator(TOUR)).toBeVisible();

        expect(await statusReadout(page), "once ended, there is nothing to resume").toBe(fresh);

        await start(page);
        expect(await stepReadout(page), "and it starts from the beginning").toBe(1);
    });
});

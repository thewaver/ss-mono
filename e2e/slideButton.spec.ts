import { type Locator, type Page, expect, test } from "@playwright/test";

import { activeMatches, prop, tabIndex } from "./helpers";

/**
 * The control has no examples of its own: its page is the Docs view, whose first live example takes the knobs for the
 * gesture (mode, completion ratio, disabled, error) and whose second takes the two for direction (orientation and the
 * direction of the box around it). Each example finds itself by the key of a knob it holds, and shows how many times
 * it has been confirmed in its own caption, in brackets at the end.
 */
const BASIC = `[data-docs-example]:has(${prop("mode")}) [data-demo]`;
const DIRECTIONS = `[data-docs-example]:has(${prop("orientation")}) [data-demo]`;

const HOLD_DURATION_MS = 1000;
const HOLD_SLACK_MS = 250;

const track = (scope: string) => `${scope} button`;

const thumb = (scope: string) => `${scope} button > div > div:last-of-type`;

const activations = async (page: Page, scope: string) =>
    Number(/\((\d+)\)$/.exec(((await page.locator(track(scope)).textContent()) ?? "").trim())?.[1]);

const chooseOption = async (page: Page, key: string, name: string) => {
    await page.locator(`${prop(key)} [role="combobox"]`).click();
    await page.locator('[role="listbox"] [role="option"]', { hasText: name }).click();
};

/**
 * The gesture this control exists for: press on the thumb, carry it along the track, release. `from` and
 * `to` are fractions of the track's own width, so a press away from the thumb is spelled by passing a
 * `from` the thumb does not cover — which is the case the hit test is there to refuse.
 */
const slide = async (page: Page, locator: Locator, from: number, to: number) => {
    await locator.scrollIntoViewIfNeeded();

    const box = (await locator.boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: 10 });
    await page.mouse.up();
};

/**
 * Where the thumb sits, as a fraction of the track it travels along. Both boxes come out of the same
 * `boundingBox` call, so the `Viewport` scale this page is drawn under divides out of the fraction and no
 * number here has to be written in layout pixels — which is the trap the Playwright config warns about.
 * The thumb carries no test hook of its own because it is the Playground's paint rather than the
 * library's, so it is measured the way a person sees it rather than read off an attribute.
 */
const thumbSpan = async (page: Page, scope: string) => {
    const trackBox = (await page.locator(track(scope)).first().boundingBox())!;
    const thumbBox = (await page.locator(thumb(scope)).boundingBox())!;

    return {
        start: (thumbBox.x - trackBox.x) / trackBox.width,
        center: (thumbBox.x + thumbBox.width * 0.5 - trackBox.x) / trackBox.width,
    };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/slide-button/docs");
    await expect(page.locator(track(BASIC))).toBeVisible();
});

test("a slide that reaches the end activates once, and the thumb returns to rest", async ({ page }) => {
    const element = page.locator(track(BASIC));

    expect(await activations(page, BASIC), "nothing has happened yet").toBe(0);

    await slide(page, element, (await thumbSpan(page, BASIC)).center, 1);

    expect(await activations(page, BASIC), "one gesture is one activation").toBe(1);

    await expect
        .poll(async () => (await thumbSpan(page, BASIC)).start, {
            message: "and the control is back at rest, because a press ends when the pointer is released",
        })
        .toBeLessThan(0.01);
});

test("a slide that stops short of the end activates nothing", async ({ page }) => {
    const element = page.locator(track(BASIC));

    await slide(page, element, (await thumbSpan(page, BASIC)).center, 0.6);

    expect(await activations(page, BASIC), "letting go before the end is how the gesture is canceled").toBe(0);
});

/**
 * The whole point of the control is that it cannot be triggered by a stray press, so a drag that begins on
 * the empty track must not pick the thumb up. Without the hit test a press at 0.6 would put the thumb under
 * the pointer and a short drag from there would reach the end.
 *
 * **It is driven under `mode="slide"`, and that is what makes it answerable.** Under the default a press anywhere
 * also starts a hold, and a hold walks the thumb along on its own clock whether or not anything was grabbed — so a
 * thumb found past the halfway mark meant either "the hit test let a grab through" or "the press lasted long enough
 * for the hold to get there", and a loaded machine produced the second while the assertion named the first. A held
 * pointer does nothing under `"slide"`, so the only thing that can move the thumb there is a grab, and the reading
 * has one meaning.
 */
test("a press on the track away from the thumb is not a grab", async ({ page }) => {
    await chooseOption(page, "mode", "slide");

    const box = (await page.locator(track(BASIC)).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * 0.6, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width, y, { steps: 10 });

    expect(
        (await thumbSpan(page, BASIC)).start,
        "a grab would have carried the thumb to the end with the pointer",
    ).toBe(0);

    await page.mouse.up();

    expect(await activations(page, BASIC), "so a shortcut from halfway along the track buys nothing").toBe(0);
});

/**
 * The two modes that close one pointer route each. Between them they say what `mode` is for: a consumer who
 * fears a stray drag across the control takes `"hold"`, and one who fears a stray press takes `"slide"`.
 *
 * **Each of these ends by holding Enter, and that is the point rather than a formality.** `mode` governs the
 * pointer alone, so whichever gesture it closes, the keyboard route is untouched and the button stays
 * operable without a pointer at all — WCAG 2.1.1, which no setting here is allowed to cost. Asserting it
 * under both modes is what stops that quietly ceasing to be true.
 *
 * Under `"hold"` a press is a hold, so a drag that took longer than the hold duration on a loaded machine would
 * confirm the action and read as the drag having been let through — which is why this one runs alone.
 */
test("a hold-only button ignores the drag, and still answers the keyboard", { tag: "@solo" }, async ({ page }) => {
    await chooseOption(page, "mode", "hold");

    await slide(page, page.locator(track(BASIC)).first(), 0.1, 1);

    expect(await activations(page, BASIC), "carrying the thumb the whole way does nothing").toBe(0);

    await page.locator(track(BASIC)).first().focus();
    await page.keyboard.down("Enter");
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.keyboard.up("Enter");

    expect(await activations(page, BASIC), "but holding it down does").toBe(1);
});

/**
 * The two conditions a slide has to meet, asserted one each. The press must start on the thumb, which the test
 * above checks by pressing away from it, and it must then actually travel — a press that lands on the thumb and
 * stays there is not a slide, and under `mode="slide"` there is no hold for it to fall back to either. Together
 * they are what "hold the thumb and drag it" means, and neither on its own is enough.
 */
test("a press that lands on the thumb and never moves is not a slide", async ({ page }) => {
    await chooseOption(page, "mode", "slide");

    const box = (await page.locator(track(BASIC)).boundingBox())!;
    const start = (await thumbSpan(page, BASIC)).center;

    await page.mouse.move(box.x + box.width * start, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);

    expect((await thumbSpan(page, BASIC)).start, "the thumb stays where it was, because nothing has carried it").toBe(
        0,
    );

    await page.mouse.up();

    expect(await activations(page, BASIC), "and letting go confirms nothing").toBe(0);
});

test("a slide-only button ignores a held press, and still answers the keyboard", async ({ page }) => {
    await chooseOption(page, "mode", "slide");

    const box = (await page.locator(track(BASIC)).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.mouse.up();

    expect(await activations(page, BASIC), "a press held well past the hold duration is still only a press").toBe(0);

    await page.locator(track(BASIC)).first().focus();
    await page.keyboard.down("Enter");
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.keyboard.up("Enter");

    expect(await activations(page, BASIC), "while the same hold from the keyboard confirms").toBe(1);
});

/**
 * A plain disabled button is not an example of its own: it is the live example with its Disabled knob turned on.
 */
test("a disabled slide button refuses the drag, and the focus with it", async ({ page }) => {
    const element = page.locator(track(BASIC));

    await page.locator(`${prop("isDisabled")} input`).click();

    await expect(element, "disabled is aria-disabled here and never the attribute").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(`${BASIC} button[disabled]`)).toHaveCount(0);

    await slide(page, element, (await thumbSpan(page, BASIC)).center, 1);

    expect(await activations(page, BASIC), "the drag is not attached at all, so nothing moves").toBe(0);
    expect(await activeMatches(page, track(BASIC)), "and the mousedown refusal keeps focus off it").toBe(false);
    expect(await tabIndex(element), "a disabled control is out of the tab order").toBe(-1);
});

/**
 * WCAG 2.2's 2.5.7 wants a route that is neither a drag nor a keypress, and the published one is a long
 * press — so a press held anywhere on the control runs the same confirmation the drag does. Held over the
 * empty track here, which is also the case that must not be a grab.
 */
test("a press held on the track confirms without any dragging at all", async ({ page }) => {
    const box = (await page.locator(track(BASIC)).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.mouse.up();

    expect(await activations(page, BASIC), "holding still is the whole gesture").toBe(1);
});

test("a press let go before the hold completes confirms nothing", async ({ page }) => {
    const box = (await page.locator(track(BASIC)).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5);
    await page.mouse.down();
    await page.waitForTimeout(HOLD_DURATION_MS * 0.5);
    await page.mouse.up();

    expect(await activations(page, BASIC), "letting go early is how a hold is abandoned").toBe(0);
});

/**
 * The keyboard cannot reproduce a drag, so it gets the hold instead of a plain press — a tap of `Enter`
 * must do nothing at all, which is the half a held press cannot show on its own.
 */
test("the keyboard route is a held Enter, and a tap of it does nothing", async ({ page }) => {
    const element = page.locator(track(BASIC));

    await element.focus();
    await page.keyboard.press("Enter");

    expect(await activations(page, BASIC), "a tap is not a hold").toBe(0);

    await page.keyboard.down("Enter");
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.keyboard.up("Enter");

    expect(await activations(page, BASIC), "holding it is").toBe(1);

    await page.keyboard.down(" ");
    await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
    await page.keyboard.up(" ");

    expect(await activations(page, BASIC), "and Space is the same key as far as this is concerned").toBe(2);
});

test("focus leaving the control abandons a hold it was in the middle of", async ({ page }) => {
    const element = page.locator(track(BASIC));

    await element.focus();
    await page.keyboard.down("Enter");
    await page.waitForTimeout(HOLD_DURATION_MS * 0.5);
    await element.evaluate((node) => (node as HTMLElement).blur());
    await page.keyboard.up("Enter");
    await page.waitForTimeout(HOLD_DURATION_MS);

    expect(
        await activations(page, BASIC),
        "the keyup would otherwise never arrive and the hold would run on unattended",
    ).toBe(0);
});

/**
 * The completion ratio is how far along the thumb has to be when it is let go. The knob is set, its own value read
 * back, and two slides are made either side of it — one stopping well short, one going well past — so no ratio is
 * written down here. Progress is the thumb's travel over the distance it can travel, which is the track less the
 * thumb, so a pointer target is worked out from the thumb's share of the track.
 */
test("the thumb completes once let go past the completion ratio, and not short of it", async ({ page }) => {
    const MARGIN = 0.15;
    const knob = page.locator(`${prop("completionRatio")} input`);

    await knob.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("0.5");
    await page.keyboard.press("Enter");

    const ratio = Number(await knob.inputValue());
    const { start, center } = await thumbSpan(page, BASIC);
    const thumbShare = (center - start) * 2;
    const pointerAt = (progress: number) => thumbShare * 0.5 + progress * (1 - thumbShare);

    await slide(page, page.locator(track(BASIC)), center, pointerAt(ratio - MARGIN));

    expect(await activations(page, BASIC), "let go short of the ratio, the slide springs back").toBe(0);

    await expect.poll(async () => (await thumbSpan(page, BASIC)).start).toBeLessThan(0.01);
    await slide(page, page.locator(track(BASIC)), center, pointerAt(ratio + MARGIN));

    expect(await activations(page, BASIC), "let go past it, it completes without reaching the end").toBe(1);
});

/**
 * The thumb and the track as screen boxes, for the two directions whose thumb does not rest at the left. Both come out
 * of one `boundingBox` call each, so the `Viewport` scale is the same on both and every comparison below is between
 * two numbers in one space.
 */
const restingBoxes = async (page: Page, scope: string) => {
    await page.locator(track(scope)).scrollIntoViewIfNeeded();

    return {
        track: (await page.locator(track(scope)).boundingBox())!,
        thumb: (await page.locator(thumb(scope)).boundingBox())!,
    };
};

/**
 * A slide written in screen points rather than fractions of the width, because the two directions here travel up the
 * track and leftward along it — the press starts on the thumb's middle wherever it rests, and ends at a point named
 * on the track's own edges.
 */
const slideBetween = async (page: Page, from: { x: number; y: number }, to: { x: number; y: number }) => {
    await page.mouse.move(from.x, from.y);
    await page.mouse.down();
    await page.mouse.move(to.x, to.y, { steps: 10 });
    await page.mouse.up();
};

const middleOf = (box: { x: number; y: number; width: number; height: number }) => ({
    x: box.x + box.width * 0.5,
    y: box.y + box.height * 0.5,
});

/**
 * A vertical button rests its thumb at the bottom and slides it up, as a lock screen does. The thumb's resting place
 * is read against the track's own edges — its bottom edge on the track's, its top edge well below the track's — and
 * the wrong way is asserted as well as the right one: a gesture still measuring from the top would take the downward
 * drag as the one that completes.
 */
test("a vertical button rests at the bottom and completes by sliding up, never down", async ({ page }) => {
    await chooseOption(page, "orientation", "vertical");

    const { track: trackBox, thumb: thumbBox } = await restingBoxes(page, DIRECTIONS);
    const start = middleOf(thumbBox);

    expect(thumbBox.y + thumbBox.height, "the thumb sits on the track's bottom edge").toBeCloseTo(
        trackBox.y + trackBox.height,
        0,
    );
    expect(thumbBox.y, "and nowhere near its top").toBeGreaterThan(trackBox.y + trackBox.height * 0.5);

    await slideBetween(page, start, { x: start.x, y: trackBox.y + trackBox.height + thumbBox.height });

    expect(await activations(page, DIRECTIONS), "pulling the thumb downward does nothing").toBe(0);

    await slideBetween(page, start, { x: start.x, y: trackBox.y });

    expect(await activations(page, DIRECTIONS), "and carrying it to the top is the slide").toBe(1);

    await expect
        .poll(async () => (await page.locator(thumb(DIRECTIONS)).boundingBox())!.y, {
            message: "after which it drops back to the bottom",
        })
        .toBeCloseTo(thumbBox.y, 0);
});

/**
 * Inside a right-to-left box a horizontal button turns round: the thumb rests at the right and slides leftward. The
 * rightward drag is asserted too, because a gesture still running left to right would never see a press at the right
 * as a press on the thumb, and a painter still drawing from the left would put the thumb where the gesture is not.
 */
test("a right-to-left button rests at the right and completes by sliding leftward", async ({ page }) => {
    await chooseOption(page, "direction", "rtl");

    const { track: trackBox, thumb: thumbBox } = await restingBoxes(page, DIRECTIONS);
    const start = middleOf(thumbBox);

    expect(thumbBox.x + thumbBox.width, "the thumb sits on the track's right edge").toBeCloseTo(
        trackBox.x + trackBox.width,
        0,
    );
    expect(thumbBox.x, "and nowhere near its left").toBeGreaterThan(trackBox.x + trackBox.width * 0.5);

    await slideBetween(page, start, { x: trackBox.x + trackBox.width + thumbBox.width, y: start.y });

    expect(await activations(page, DIRECTIONS), "pushing the thumb rightward does nothing").toBe(0);

    await slideBetween(page, start, { x: trackBox.x, y: start.y });

    expect(await activations(page, DIRECTIONS), "and carrying it to the left end is the slide").toBe(1);

    await expect
        .poll(async () => (await page.locator(thumb(DIRECTIONS)).boundingBox())!.x, {
            message: "after which it returns to the right",
        })
        .toBeCloseTo(thumbBox.x, 0);
});

/**
 * The keyboard route is a held Enter whatever the axis or the direction, since `role="button"` has no orientation to
 * state and there is no arrow walk along the track to turn round. Both turned buttons are held in turn.
 */
test("a held Enter confirms a vertical button and a right-to-left one alike", async ({ page }) => {
    let expected = 0;

    for (const [key, name] of [
        ["orientation", "vertical"],
        ["direction", "rtl"],
    ]) {
        await chooseOption(page, key, name);

        await page.locator(track(DIRECTIONS)).focus();
        await page.keyboard.down("Enter");
        await page.waitForTimeout(HOLD_DURATION_MS + HOLD_SLACK_MS);
        await page.keyboard.up("Enter");

        expected += 1;

        expect(await activations(page, DIRECTIONS), `holding Enter once the ${name} knob is set confirms it`).toBe(
            expected,
        );
    }
});

/**
 * The button describes its own gesture: what the page passes as `ariaDescription` is read after the name, through
 * `aria-describedby` to text the button renders itself, so no form field has to be wrapped round it. The words are
 * the consumer's, so what is asserted is that there is a description, not what it says.
 */
test("the button carries the description it was given, with no form field around it", async ({ page }) => {
    await expect(page.locator(track(BASIC))).toHaveAccessibleDescription(/\S/);
});

/**
 * The description matters enough that the page says so in a note before the first example. It is a note, not an
 * alert: nothing has gone wrong, so it is not announced the moment the page opens.
 */
test("the page asks for a description in a note, before any example", async ({ page }) => {
    const note = page.locator("[data-docs-alert]");

    await expect(note).toHaveAttribute("role", "note");
    expect(
        await note.evaluate(
            (element) =>
                (element.compareDocumentPosition(document.querySelector("[data-docs-example]")!) &
                    Node.DOCUMENT_POSITION_FOLLOWING) !==
                0,
        ),
        "and it comes before the first example",
    ).toBe(true);
});

/**
 * Held at the end is a state the person set with the gesture, so it is announced through `aria-pressed` as a toggle
 * button's is — and only on a button the page actually holds, since one that holds nothing must not claim to be
 * unpressed. The held example is the one with a Reset button beside it.
 */
const HELD = `[data-docs-example]:has(button[aria-label="Reset"]) [data-demo]`;

test("a button that holds no state claims none", async ({ page }) => {
    await expect(page.locator(track(BASIC))).not.toHaveAttribute("aria-pressed");
});

test("a button held at its end is announced as pressed, and released when the page lets go", async ({ page }) => {
    const element = page.locator(track(HELD)).first();

    await expect(element, "before anything happens it is not held").toHaveAttribute("aria-pressed", "false");

    await slide(page, element, (await thumbSpan(page, HELD)).center, 1);

    await expect(element, "once confirmed the page holds it, and it says so").toHaveAttribute("aria-pressed", "true");
    await expect
        .poll(async () => (await thumbSpan(page, HELD)).start, { message: "and the thumb stays at the end" })
        .toBeGreaterThan(0.5);

    await page.locator(HELD).getByRole("button", { name: "Reset" }).click();

    await expect(element, "letting go of it is announced too").toHaveAttribute("aria-pressed", "false");
    await expect
        .poll(async () => (await thumbSpan(page, HELD)).start, { message: "and the thumb drops back to the start" })
        .toBeLessThan(0.01);
});

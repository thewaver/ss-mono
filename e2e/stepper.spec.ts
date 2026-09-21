import { expect, test } from "@playwright/test";

import { attributesOf, demo, offsetLeft, offsetTop, prop, readout, tabIndex, tagName } from "./helpers";

const LINEAR = demo("linear");
const FAILED = demo("failed");
const STACKED = demo("stacked");
const BARE = demo("bare");

const step = (scope: string) => `${scope} ol > li`;
const TOOLTIP = '[role="tooltip"]';

test.beforeEach(async ({ page }) => {
    await page.goto("/stepper");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * `aria-current` is an enumerated attribute and `step` is one of its defined tokens, so "which step you are
 * on" is not a state the consumer invents — it has a spelling, and the library owns it. Exactly one step
 * carries it, which is what stops a strip from claiming two positions at once.
 */
test("a stepper is a named list with exactly one current step", async ({ page }) => {
    await expect(page.locator(`${LINEAR} ol`), "the strip is an ordered list that names itself").toHaveAttribute(
        "aria-label",
        "Checkout",
    );
    await expect(page.locator(step(LINEAR)), "one entry per step").toHaveCount(4);

    const current = page.locator(`${LINEAR} [aria-current]`);

    await expect(current, "exactly one step is the current one").toHaveCount(1);
    await expect(current, "and it uses the token meant for a process rather than a page").toHaveAttribute(
        "aria-current",
        "step",
    );
});

/**
 * The state vocabulary is the consumer's — the library never inspects it — so no ARIA attribute can carry
 * it. The only route by which "failed" or "skipped" reaches a screen reader is text, which is why the name
 * is composed by a map the consumer supplies rather than taken from the painted label. A step whose paint
 * says everything and whose name says nothing is the failure this asserts against.
 */
test("each step's name carries its state as words", async ({ page }) => {
    const names = await attributesOf(page, `${FAILED} ol > li [aria-label]`, "aria-label");

    expect(names[0], "an invented state reaches the name rather than living only in the paint").toContain("skipped");
    expect(names[1], "as does the failure").toContain("needs attention");
    expect(names[2], "and the current step says so in words too").toContain("current step");
    expect(names[3], "while one nobody has reached yet is named as such").toContain("not started");
    expect(names[0], "and the position is in there as well, since a list alone does not announce it").toContain(
        "Step 1 of 4",
    );
});

/**
 * Every step is a button and navigability is `aria-disabled`, which is the same shape disabling already
 * takes here. Swapping the element instead was tried and could not work: the consumer's state string
 * arrives as `aria-label`, and ARIA 1.2 prohibits naming an element whose role is `generic` — "Authors MUST
 * NOT use the aria-label or aria-labelledby attributes to name the element" — so a `<span>` threw the state
 * away. A step carrying a tooltip is reachable besides, and a focusable element with no role announces as
 * nothing (4.1.2 Name, Role, Value).
 */
test("every step is a button, and navigability is stated rather than built into the element", async ({ page }) => {
    const first = page.locator(`${LINEAR} ol > li:nth-of-type(1) [aria-label]`);
    const ahead = page.locator(`${LINEAR} ol > li:nth-of-type(4) [aria-label]`);

    expect(await tagName(first), "a completed step can be returned to").toBe("BUTTON");
    expect(await tagName(ahead), "and a step ahead of you is the same element, so it keeps its name").toBe("BUTTON");

    await expect(first, "the one you can reach says nothing about being disabled").not.toHaveAttribute("aria-disabled");
    await expect(ahead, "the one you cannot says so").toHaveAttribute("aria-disabled", "true");

    await page.locator(`${prop("isFreeNavigation")} input`).check();

    await expect(ahead, "and opening navigation up takes the refusal off it").not.toHaveAttribute("aria-disabled");
});

test("pressing a navigable step reports it, and an unreachable one reports nothing", async ({ page }) => {
    await page.locator(`${LINEAR} ol > li:nth-of-type(1) [aria-label]`).click();
    expect(await readout(page, "linear"), "a step you can return to moves the current one").toContain(
        "current: details",
    );

    await page.locator(`${LINEAR} ol > li:nth-of-type(4) [aria-label]`).click({ force: true });
    expect(await readout(page, "linear"), "and a step ahead of you does nothing when pressed").toContain(
        "current: details",
    );
});

/**
 * The case the whole tooltip discussion was about: a failed step is not a navigation target, so it would
 * ordinarily be skipped by the tab order — but it is the one step with something to say. It therefore stays
 * reachable specifically so its explanation can be read, which is the pairing `InteractionWrapper` warns
 * about when only half of it is present.
 */
test("a locked step stays reachable so its explanation can be read", async ({ page }) => {
    const locked = page.locator(`${FAILED} ol > li:nth-of-type(4) [aria-label]`);

    await expect(locked, "it is not a navigation target").toHaveAttribute("aria-disabled", "true");
    expect(await tagName(locked), "and it is a button like every other step, so focus lands on something named").toBe(
        "BUTTON",
    );
    expect(await tabIndex(locked), "but it stays in the tab order, because it has something to say").toBe(0);

    await locked.hover();

    await expect(page.locator(TOOLTIP), "and revealing it explains why the step is shut").toContainText(
        "Review opens once payment succeeds",
    );
    expect(
        await attributesOf(page, `${FAILED} ol > li:nth-of-type(4) [aria-label]`, "aria-describedby"),
        "the tooltip is wired as the step's description, so it is announced rather than merely drawn",
    ).not.toEqual([null]);
});

test("a failed step is still a control, because you go back and fix it", async ({ page }) => {
    const failed = page.locator(`${FAILED} ol > li:nth-of-type(2) [aria-label]`);

    expect(await tagName(failed), "a failure is a place to return to rather than a wall").toBe("BUTTON");

    await failed.hover();
    await expect(page.locator(TOOLTIP), "and it explains itself too").toContainText("card was declined");
});

/**
 * `aria-orientation` is not among the attributes the `list` role supports, so an `<ol>` carrying it is
 * dropped by assistive technology and flagged by a validator — the same position `Carousel` reached for
 * `role="region"`. So `dir` decides the layout and nothing else, and the layout is what is asked about
 * here: a column strip stacks its steps where a row strip lays them side by side. The two strips are
 * compared against each other in layout space rather than against a number, so the gap, the step size
 * and the window all stop mattering.
 */
test("a stacked stepper stacks its steps, and the connector is optional", async ({ page }) => {
    const stacked = page.locator(step(STACKED));
    const linear = page.locator(step(LINEAR));

    expect(await offsetTop(stacked.nth(1)), "a column strip puts the step after the first below it").toBeGreaterThan(
        await offsetTop(stacked.nth(0)),
    );
    expect(await offsetLeft(linear.nth(1)), "and a row strip puts it beside").toBeGreaterThan(
        await offsetLeft(linear.nth(0)),
    );

    await expect(
        page.locator(`${STACKED} ol`),
        "while nothing in the markup names the axis, the list role having nowhere to keep it",
    ).not.toHaveAttribute("aria-orientation");

    await expect(
        page.locator(`${LINEAR} ol [aria-hidden="true"]`).filter({ hasText: "" }),
        "a connector sits between each pair rather than after the last",
    ).not.toHaveCount(0);
    await expect(
        page.locator(`${BARE} ol > li > span[aria-hidden="true"]`),
        "and a strip with no connector slot renders none",
    ).toHaveCount(0);
});

test("no step carries a native disabled attribute", async ({ page }) => {
    await expect(
        page.locator(`${LINEAR} button[disabled]`),
        "reachability is aria-disabled, per the house rule",
    ).toHaveCount(0);
    expect(
        await attributesOf(page, `${FAILED} ol > li:nth-of-type(4) [aria-label]`, "aria-disabled"),
        "the locked step says so without leaving the tab order",
    ).toEqual(["true"]);
});

/**
 * The list flips its axis over `dir`, but each `<li>` holds a step and the connector that follows it, and
 * the entry used to stay a row whatever the list did. So a column strip drew its connector beside the
 * step rather than under it — a vertical hairline floating to the right of the label instead of a track
 * running down the page. The entry now takes the list's direction, which is the only thing that made the
 * two disagree.
 */
test("a stacked strip runs its connector under the step, not beside it", async ({ page }) => {
    const geometry = await page.locator(`${STACKED} ol > li:nth-of-type(1)`).evaluate((element) => {
        const [step, connector] = Array.from(element.children) as HTMLElement[];

        return {
            stepBottom: step.offsetTop + step.offsetHeight,
            connectorTop: connector.offsetTop,
            connectorLeft: connector.offsetLeft,
            stepLeft: step.offsetLeft,
        };
    });

    expect(geometry.connectorTop, "the track begins where the step it follows ends").toBeGreaterThanOrEqual(
        geometry.stepBottom,
    );
    expect(geometry.connectorLeft, "and stays on the step's own column rather than to one side").toBe(
        geometry.stepLeft,
    );
});

/**
 * Four steps with words for names are wider than a narrow column, and the strip had no answer for that:
 * it could neither shrink nor wrap, so it grew past its container in both directions and spilled out of
 * the card. A row strip now wraps, which needs nothing from the painter and truncates no label.
 *
 * The box that holds it is the card's content box: an example's demo wrapper is `display: contents` and so
 * has no box of its own to measure against.
 */
test("a row strip stays inside the box it is given", async ({ page }) => {
    const fit = await page.locator(`${LINEAR} ol`).evaluate((element) => {
        const card = element.closest("[data-example]") as HTMLElement;
        const padding = getComputedStyle(card);

        return {
            list: (element as HTMLElement).offsetWidth,
            content: element.scrollWidth,
            parent: card.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight),
            left: Math.min(...Array.from(element.children).map((child) => (child as HTMLElement).offsetLeft)),
        };
    });

    expect(fit.list, "the strip is no wider than what holds it").toBeLessThanOrEqual(fit.parent);
    expect(fit.content, "and nothing inside it reaches past that either").toBeLessThanOrEqual(fit.list);
    expect(fit.left, "so no step is pushed off the near edge").toBeGreaterThanOrEqual(0);
});

/**
 * A laid-out strip keeps its `ol` and one `li` per step, so the list still counts and `aria-current` still
 * says where you are — what changes is that the `li` becomes a layer over the whole box and the step sits
 * in a placement inside it. The connector is the part that could not simply be re-positioned: a bar
 * between two flex siblings has nothing to reach for, so a placed run is handed both placements and draws
 * the path itself.
 */
const ARC = demo("arc");

const placedBox = (scope: string) => `${scope} [role="presentation"][style*="left"]`;

const readOffsets = (style: string) => {
    const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);

    return { left: at("left"), top: at("top") };
};

test("a placed strip is still an ordered list, one entry per step", async ({ page }) => {
    await expect(page.locator(`${ARC} ol`)).toHaveAttribute("aria-label", "Checkout, on an arc");
    await expect(page.locator(step(ARC)), "one li per step, so the list still counts").toHaveCount(
        await page.locator(step(LINEAR)).count(),
    );
    await expect(page.locator(`${ARC} [aria-current="step"]`), "and one of them is where you are").toHaveCount(1);
    await expect(page.locator(placedBox(ARC)), "each step sitting in a box of its own").toHaveCount(
        await page.locator(step(ARC)).count(),
    );
});

/**
 * The path is written in the same fractions of the container's width the boxes are, so the two can be
 * compared directly: the run out of step N has to begin where step N was put. `cqw` is a percentage and
 * the path is a fraction, which is the only conversion here.
 */
test("a connector begins where the step it leaves was placed", async ({ page }) => {
    const boxes = await page
        .locator(placedBox(ARC))
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("style") ?? ""));
    const runs = await page
        .locator(`${ARC} ol svg path`)
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("d") ?? ""));
    const PERCENT = 100;

    expect(runs.length, "a run between each pair of steps, so one fewer than the steps").toBe(boxes.length - 1);

    for (let index = 0; index < runs.length; index++) {
        const start = /^M\s+([-\d.]+)\s+([-\d.]+)/.exec(runs[index])!;
        const box = readOffsets(boxes[index]);

        expect(Number(start[1]), `run ${index} starts at its step's own offset across`).toBeCloseTo(
            box.left / PERCENT,
            3,
        );
        expect(Number(start[2]), "and at its offset down").toBeCloseTo(box.top / PERCENT, 3);
    }

    expect(runs[0], "and it curves, rather than cutting straight across the arc").toContain(" A ");
});

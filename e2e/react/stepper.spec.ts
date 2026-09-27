import { expect, test } from "@playwright/test";

import { attributesOf, offsetLeft, offsetTop, tabIndex, tagName } from "../helpers";

/**
 * The React `Stepper`. The cases follow `e2e/stepper.spec.ts`, which covers the Solid one, so the two frameworks are
 * held to the same markup, the same names and the same refusals. The story renders five strips over the same four
 * checkout steps, keyed by `data-testid`, and takes the Playground's free-navigation knob as a prop.
 */
const STORY = "Essentials/Stepper/Default";

const scope = (key: string) => `[data-testid="${key}"]`;
const step = (key: string) => `${scope(key)} ol > li`;
const readout = (key: string) => `${scope(key)} [data-readout="current"]`;
const TOOLTIP = '[role="tooltip"]';

test("a stepper is a named list with exactly one current step", async ({ page, mount }) => {
    await mount(STORY);

    await expect(
        page.locator(`${scope("linear")} ol`),
        "the strip is an ordered list that names itself",
    ).toHaveAttribute("aria-label", "Checkout");
    await expect(page.locator(step("linear")), "one entry per step").toHaveCount(4);

    const current = page.locator(`${scope("linear")} [aria-current]`);

    await expect(current, "exactly one step is the current one").toHaveCount(1);
    await expect(current, "and it uses the token meant for a process rather than a page").toHaveAttribute(
        "aria-current",
        "step",
    );
});

test("each step's name carries its state as words", async ({ page, mount }) => {
    await mount(STORY);

    const names = await attributesOf(page, `${scope("failed")} ol > li [aria-label]`, "aria-label");

    expect(names[0], "an invented state reaches the name rather than living only in the paint").toContain("skipped");
    expect(names[1], "as does the failure").toContain("needs attention");
    expect(names[2], "and the current step says so in words too").toContain("current step");
    expect(names[3], "while one nobody has reached yet is named as such").toContain("not started");
    expect(names[0], "and the position is in there as well").toContain("Step 1 of 4");
});

test("every step is a button, and navigability is stated rather than built into the element", async ({
    page,
    mount,
}) => {
    const component = await mount(STORY);

    const first = page.locator(`${scope("linear")} ol > li:nth-of-type(1) [aria-label]`);
    const ahead = page.locator(`${scope("linear")} ol > li:nth-of-type(4) [aria-label]`);

    expect(await tagName(first), "a completed step can be returned to").toBe("BUTTON");
    expect(await tagName(ahead), "and a step ahead of you is the same element, so it keeps its name").toBe("BUTTON");

    await expect(first, "the one you can reach says nothing about being disabled").not.toHaveAttribute("aria-disabled");
    await expect(ahead, "the one you cannot says so").toHaveAttribute("aria-disabled", "true");

    await component.update({ isFreeNavigation: true });

    await expect(ahead, "and opening navigation up takes the refusal off it").not.toHaveAttribute("aria-disabled");
});

test("pressing a navigable step reports it, and an unreachable one reports nothing", async ({ page, mount }) => {
    await mount(STORY);

    await page.locator(`${scope("linear")} ol > li:nth-of-type(1) [aria-label]`).click();
    await expect(page.locator(readout("linear")), "a step you can return to moves the current one").toHaveText(
        "current: details",
    );

    await page.locator(`${scope("linear")} ol > li:nth-of-type(4) [aria-label]`).click({ force: true });
    await expect(page.locator(readout("linear")), "and a step ahead of you does nothing when pressed").toHaveText(
        "current: details",
    );
});

test("a locked step stays reachable so its explanation can be read", async ({ page, mount }) => {
    await mount(STORY);

    const locked = page.locator(`${scope("failed")} ol > li:nth-of-type(4) [aria-label]`);

    await expect(locked, "it is not a navigation target").toHaveAttribute("aria-disabled", "true");
    expect(await tagName(locked), "and it is a button like every other step").toBe("BUTTON");
    expect(await tabIndex(locked), "but it stays in the tab order, because it has something to say").toBe(0);

    await locked.hover();

    await expect(page.locator(TOOLTIP), "and revealing it explains why the step is shut").toContainText(
        "Review opens once payment succeeds",
    );
    expect(
        await attributesOf(page, `${scope("failed")} ol > li:nth-of-type(4) [aria-label]`, "aria-describedby"),
        "the tooltip is wired as the step's description, so it is announced rather than merely drawn",
    ).not.toEqual([null]);
});

test("a failed step is still a control, because you go back and fix it", async ({ page, mount }) => {
    await mount(STORY);

    const failed = page.locator(`${scope("failed")} ol > li:nth-of-type(2) [aria-label]`);

    expect(await tagName(failed), "a failure is a place to return to rather than a wall").toBe("BUTTON");

    await failed.hover();
    await expect(page.locator(TOOLTIP), "and it explains itself too").toContainText("card was declined");
});

test("a stacked stepper stacks its steps, and the connector is optional", async ({ page, mount }) => {
    await mount(STORY);

    const stacked = page.locator(step("stacked"));
    const linear = page.locator(step("linear"));

    expect(await offsetTop(stacked.nth(1)), "a column strip puts the step after the first below it").toBeGreaterThan(
        await offsetTop(stacked.nth(0)),
    );
    expect(await offsetLeft(linear.nth(1)), "and a row strip puts it beside").toBeGreaterThan(
        await offsetLeft(linear.nth(0)),
    );

    await expect(page.locator(`${scope("stacked")} ol`), "nothing in the markup names the axis").not.toHaveAttribute(
        "aria-orientation",
    );

    await expect(
        page.locator(`${scope("linear")} ol [aria-hidden="true"]`).filter({ hasText: "" }),
        "a connector sits between each pair rather than after the last",
    ).not.toHaveCount(0);
    await expect(
        page.locator(`${scope("bare")} ol > li > span[aria-hidden="true"]`),
        "and a strip with no connector slot renders none",
    ).toHaveCount(0);
});

test("no step carries a native disabled attribute", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(`${scope("linear")} button[disabled]`)).toHaveCount(0);
    expect(
        await attributesOf(page, `${scope("failed")} ol > li:nth-of-type(4) [aria-label]`, "aria-disabled"),
        "the locked step says so without leaving the tab order",
    ).toEqual(["true"]);
});

test("a stacked strip runs its connector under the step, not beside it", async ({ page, mount }) => {
    await mount(STORY);

    const geometry = await page.locator(`${scope("stacked")} ol > li:nth-of-type(1)`).evaluate((element) => {
        const [stepElement, connector] = Array.from(element.children) as HTMLElement[];

        return {
            stepBottom: stepElement.offsetTop + stepElement.offsetHeight,
            connectorTop: connector.offsetTop,
            connectorLeft: connector.offsetLeft,
            stepLeft: stepElement.offsetLeft,
        };
    });

    expect(geometry.connectorTop, "the track begins where the step it follows ends").toBeGreaterThanOrEqual(
        geometry.stepBottom,
    );
    expect(geometry.connectorLeft, "and stays on the step's own column rather than to one side").toBe(
        geometry.stepLeft,
    );
});

test("a row strip stays inside the box it is given", async ({ page, mount }) => {
    await mount(STORY);

    const fit = await page.locator(`${scope("linear")} ol`).evaluate((element) => {
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
 * A laid-out strip keeps its `ol` and one `li` per step, and the connector is handed both placements so it can draw
 * the path itself. The path is written in the same fractions of the container's width the boxes are, so the run out
 * of step N has to begin where step N was put.
 */
const placedBox = (key: string) => `${scope(key)} [role="presentation"][style*="left"]`;

const readOffsets = (style: string) => {
    const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);

    return { left: at("left"), top: at("top") };
};

test("a placed strip is still an ordered list, one entry per step", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(`${scope("arc")} ol`)).toHaveAttribute("aria-label", "Checkout, on an arc");
    await expect(page.locator(step("arc")), "one li per step, so the list still counts").toHaveCount(
        await page.locator(step("linear")).count(),
    );
    await expect(page.locator(`${scope("arc")} [aria-current="step"]`), "and one of them is where you are").toHaveCount(
        1,
    );
    await expect(page.locator(placedBox("arc")), "each step sitting in a box of its own").toHaveCount(
        await page.locator(step("arc")).count(),
    );
});

test("a connector begins where the step it leaves was placed", async ({ page, mount }) => {
    await mount(STORY);

    const boxes = await page
        .locator(placedBox("arc"))
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("style") ?? ""));
    const runs = await page
        .locator(`${scope("arc")} ol svg path`)
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

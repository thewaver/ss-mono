import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `Reveal`. The cases follow `e2e/reveal.spec.ts`, which covers the Solid one: the hole is read off the mask
 * the component hands the cover — the second layer's position plus half its size is its center, as a share of the
 * reveal's own size — and no hole is a cover with no mask. The keyboard route is the reason for most of it: focus
 * reached by Tab opens the hole at the center, the arrows move it by the step size and hold it inside, leaving closes
 * it, and a click does not throw it to the center while the pointer is elsewhere.
 */
const STORY = "Exotics/Reveal/Default";
const GROUP = '[role="group"]';
const CLOSE = 0.02;

type Hole = { x: number; y: number };

const holeOf = (component: Locator): Promise<Hole | undefined> =>
    component.getByTestId("cover").evaluate((element) => {
        const cover = element as HTMLElement;
        const group = cover.closest('[role="group"]') as HTMLElement;
        const positions = cover.style.getPropertyValue("mask-position").split(",");
        const sizes = cover.style.getPropertyValue("mask-size").split(",");

        if (positions.length < 2 || sizes.length < 2) return undefined;

        const [left, top] = positions[1].trim().split(/\s+/).map(parseFloat);
        const [width, height] = sizes[1].trim().split(/\s+/).map(parseFloat);

        return { x: (left + width / 2) / group.offsetWidth, y: (top + height / 2) / group.offsetHeight };
    });

const isNear = async (component: Locator, x: number, y: number) => {
    const hole = await holeOf(component);

    return hole !== undefined && Math.abs(hole.x - x) < CLOSE && Math.abs(hole.y - y) < CLOSE;
};

const stepRatio = async (component: Locator) => {
    const step = Number(await component.locator("[data-step]").getAttribute("data-step"));
    const size = await component.locator(GROUP).evaluate((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
    }));

    return { x: step / size.width, y: step / size.height };
};

const isFocused = (component: Locator) =>
    component.locator(GROUP).evaluate((element) => document.activeElement === element);

const tabInto = async (page: Page, component: Locator) => {
    await component.getByTestId("before").focus();
    await page.keyboard.press("Tab");
    expect(await isFocused(component), "Tab from the control before it lands on the reveal").toBe(true);
};

const pointAt = async (component: Locator, ratioX: number, ratioY: number) => {
    const box = (await component.locator(GROUP).boundingBox())!;

    return { x: box.x + box.width * ratioX, y: box.y + box.height * ratioY };
};

test("the reveal is one named Tab stop, with nothing inside it to stop at", async ({ page, mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(GROUP)).toHaveAccessibleName(/\S/);

    const innerStops = await component
        .locator(GROUP)
        .evaluate(
            (element) =>
                [...element.querySelectorAll("*")].filter((inner) => (inner as HTMLElement).tabIndex >= 0).length,
        );

    expect(innerStops, "the content and the cover are paint, not controls").toBe(0);

    await tabInto(page, component);
    await page.keyboard.press("Tab");

    await expect(component.getByTestId("after"), "one press takes focus straight out again").toBeFocused();
});

test("reaching it with the keyboard opens the hole at the center, and leaving closes it", async ({ page, mount }) => {
    const component = await mount(STORY);

    expect(await holeOf(component), "at rest the cover is whole").toBeUndefined();

    await tabInto(page, component);

    const opened = await holeOf(component);

    expect(opened, "keyboard focus cut a hole").toBeDefined();
    expect(opened!.x).toBeCloseTo(0.5, 2);
    expect(opened!.y).toBeCloseTo(0.5, 2);
    await expect(component.getByTestId("cover"), "and the cover is told it is revealing").toHaveAttribute(
        "data-revealing",
        "true",
    );

    await page.keyboard.press("Tab");

    expect(await holeOf(component), "focus moved on, and the cover is whole again").toBeUndefined();
});

test("the arrow keys move the hole by the step size, and hold it inside the box", async ({ page, mount }) => {
    const component = await mount(STORY);
    const step = await stepRatio(component);

    await tabInto(page, component);
    await page.keyboard.press("ArrowRight");

    let hole = (await holeOf(component))!;

    expect(hole.x, "Right moves it one step right").toBeCloseTo(0.5 + step.x, 2);
    expect(hole.y).toBeCloseTo(0.5, 2);

    await page.keyboard.press("ArrowDown");
    hole = (await holeOf(component))!;

    expect(hole.y, "Down moves it one step down").toBeCloseTo(0.5 + step.y, 2);

    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    hole = (await holeOf(component))!;

    expect(hole, "Up and Left undo them").toEqual({ x: expect.closeTo(0.5, 2), y: expect.closeTo(0.5, 2) });

    for (let presses = 0; presses < Math.ceil(1 / step.x); presses++) await page.keyboard.press("ArrowLeft");

    hole = (await holeOf(component))!;

    expect(hole.x, "however often Left is pressed, the hole stops at the edge").toBeCloseTo(0, 2);
});

test("an arrow with a modifier held is left to the browser", async ({ page, mount }) => {
    const component = await mount(STORY);

    await tabInto(page, component);

    const before = await holeOf(component);

    await page.keyboard.press("Alt+ArrowRight");

    expect(await holeOf(component), "Alt with an arrow does not move the hole").toEqual(before);
});

test("a click does not throw the hole to the center, since the pointer is somewhere else", async ({ page, mount }) => {
    const component = await mount(STORY);
    const target = await pointAt(component, 0.2, 0.3);

    await page.mouse.click(target.x, target.y);

    expect(await isFocused(component), "the click did focus it").toBe(true);

    await expect
        .poll(() => isNear(component, 0.2, 0.3), {
            message: "the hole is where the pointer is, and stays there rather than jumping to the center",
        })
        .toBe(true);
});

test("the pointer and the keyboard hand the hole back and forth", async ({ page, mount }) => {
    const component = await mount(STORY);

    await tabInto(page, component);

    const target = await pointAt(component, 0.25, 0.25);

    await page.mouse.move(target.x, target.y, { steps: 4 });

    await expect
        .poll(() => isNear(component, 0.25, 0.25), { message: "moving the pointer over it takes the hole back" })
        .toBe(true);

    const step = await stepRatio(component);

    await page.keyboard.press("ArrowRight");

    await expect
        .poll(() => isNear(component, 0.25 + step.x, 0.25), {
            message: "and an arrow picks it up from where the pointer left it, not from the center",
        })
        .toBe(true);
});

test("turned off, it is out of the tab order and cuts no hole", async ({ page, mount }) => {
    const component = await mount(STORY, { isDisabled: true });

    await expect(component.locator(GROUP)).toHaveAttribute("aria-disabled", "true");
    await expect(component.locator(GROUP)).not.toHaveAttribute("tabindex");

    const target = await pointAt(component, 0.5, 0.5);

    await page.mouse.move(target.x, target.y);
    await page.waitForTimeout(100);

    expect(await holeOf(component)).toBeUndefined();
});

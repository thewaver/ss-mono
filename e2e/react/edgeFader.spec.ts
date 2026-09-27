import { type Locator, expect, test } from "@playwright/test";

import { inlineStyle } from "../helpers";

/**
 * The React `EdgeFader`. No Solid spec covers `EdgeFader`, so these cases pin what its `decisions.md` entry records:
 * the fade is a mask on the box, fixed by default and following the scroll when asked, a box that scrolls with
 * nothing focusable inside becomes a tab stop, and a label names the box only while it scrolls.
 */
const STORY = "Essentials/EdgeFader/Default";
const ROOT = '[data-testid="frame"] > div';

const maskImage = (locator: Locator) => inlineStyle(locator, "mask-image");

/**
 * The fade on each axis, read back out of the mask the browser has normalized: how far in it reaches from the start
 * side and from the end side, in pixels. The browser rewrites colors and drops the default direction, so the layers
 * are found by their `transparent` ends rather than matched as written.
 */
const fades = async (locator: Locator) => {
    const image = await maskImage(locator);
    const layers = image.match(/linear-gradient\((?:[^()]|\([^()]*\)|\((?:[^()]|\([^()]*\))*\))*\)/g) ?? [];
    const result: { x?: [number, number]; y?: [number, number] } = {};

    for (const layer of layers) {
        if (!layer.includes("transparent")) continue;

        const start = Number(/\) (\d+)px/.exec(layer)?.[1]);
        const end = Number(/calc\(100% [-+] (\d+)px\)/.exec(layer)?.[1]);

        result[layer.includes("to right") ? "x" : "y"] = [start, end];
    }

    return result;
};

const scrollTo = (locator: Locator, top: number) =>
    locator.evaluate((element, value) => {
        element.scrollTop = value;
    }, top);

test("a fixed fade reaches in by its size on every chosen side, scrolling or not", async ({ mount }) => {
    const component = await mount(STORY);
    const root = component.locator(ROOT);

    await expect
        .poll(() => fades(root), { message: "both axes are faded by the full size" })
        .toEqual({
            x: [40, 40],
            y: [40, 40],
        });
});

test("a scroll-aware fade is gone at the end it has reached and shows at the end still to come", async ({ mount }) => {
    const component = await mount(STORY, { edges: ["top", "bottom"], isScrollAware: true });
    const root = component.locator(ROOT);

    await expect
        .poll(() => fades(root), { message: "at the top, the top has no fade and the bottom has all of it" })
        .toEqual({ y: [0, 40] });

    await scrollTo(root, 10_000);

    await expect
        .poll(() => fades(root), { message: "at the bottom, it is the other way round" })
        .toEqual({ y: [40, 0] });
});

test("a scroll-aware box whose contents fit shows no fade anywhere", async ({ mount }) => {
    const component = await mount(STORY, { isScrollAware: true, isShort: true });
    const root = component.locator(ROOT);

    await expect.poll(() => fades(root)).toEqual({ x: [0, 0], y: [0, 0] });
});

test("no chosen side means no mask at all", async ({ mount }) => {
    const component = await mount(STORY, { edges: [] });

    expect(await maskImage(component.locator(ROOT))).toBe("none");
});

test("a box that scrolls with nothing focusable inside is a tab stop, and one with a control is not", async ({
    mount,
}) => {
    const plain = await mount(STORY);

    await expect(plain.locator(ROOT), "scrolling and empty of controls").toHaveAttribute("tabindex", "0");

    const withButton = await mount(STORY, { hasButton: true });

    await expect(withButton.locator(ROOT), "tabbing to the button already scrolls the box").not.toHaveAttribute(
        "tabindex",
    );

    const short = await mount(STORY, { isShort: true });

    await expect(short.locator(ROOT), "nothing to scroll, nothing to reach").not.toHaveAttribute("tabindex");
});

test("a label names the box as a region only while it scrolls", async ({ mount }) => {
    const scrolling = await mount(STORY, { ariaLabel: "Notes" });

    await expect(scrolling.getByRole("region", { name: "Notes" })).toHaveCount(1);

    const short = await mount(STORY, { ariaLabel: "Notes", isShort: true });

    await expect(short.locator(ROOT)).not.toHaveAttribute("role");
    await expect(short.locator(ROOT)).not.toHaveAttribute("aria-label");

    const unnamed = await mount(STORY);

    await expect(unnamed.locator(ROOT), "and an unnamed scrolling box takes no role").not.toHaveAttribute("role");
});

test("the fade drops while the box has keyboard focus, so its outline is not masked", async ({ page, mount }) => {
    const component = await mount(STORY);
    const root = component.locator(ROOT);

    await expect(root).toHaveAttribute("tabindex", "0");
    await page.keyboard.press("Tab");
    await expect(root).toBeFocused();

    expect(await root.evaluate((element) => getComputedStyle(element).maskImage)).toBe("none");
});

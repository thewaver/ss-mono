import { expect, test } from "@playwright/test";

import { inlineStyle } from "../helpers";

/**
 * The React `Surface`. The cases follow `e2e/surface.spec.ts`, which covers the Solid one on the Playground: a
 * surface picks one of two render paths from its defs, and which one it picked is the only thing about it that is
 * observable without looking at the pixels.
 */
const CARD = '[data-testid="card"]';
const CARD_ROOT = `${CARD} div[style*="border-radius"]`;
const AVATAR = '[data-testid="avatar"]';
const SQUIRCLE = '[data-testid="squircle"]';

test("plain colors take the div path", async ({ mount }) => {
    const component = await mount("Composites/Surface/Card");

    await expect(
        component.locator(`${CARD} svg`),
        "a surface whose fill and stroke are plain colors takes the div path and draws no SVG",
    ).toHaveCount(0);
    expect(
        await inlineStyle(component.locator(CARD_ROOT).first(), "border-radius"),
        "its radii arrive as inline values on the div rather than through a generated stylesheet",
    ).toBe("20px");
    expect(
        (await component.locator(CARD_ROOT).first().getAttribute("style"))?.includes("--"),
        "and so does its fill, as a custom property the consumer's color is assigned into",
    ).toBe(true);
    await expect(component.locator(`${CARD} img`), "and it still renders the consumer's children").toHaveCount(1);
});

test("the div path draws a border only where there is a color and a width to draw it with", async ({ mount }) => {
    const bordered = await mount("Composites/Surface/Card");
    const border = bordered.locator(`${CARD_ROOT} > div`);

    await expect(border, "a colored stroke with width is a border layer over the children").toHaveCount(1);
    expect(await inlineStyle(border, "border-top-width"), "carrying the widths as inline values").toBe("2px");

    const borderless = await mount("Composites/Surface/Borderless");

    await expect(borderless.locator(`${CARD_ROOT} > div`), "and with no width there is no border layer").toHaveCount(0);
});

test("a gradient stroke takes the SVG path and clips its children", async ({ mount }) => {
    const component = await mount("Composites/Surface/Avatar");

    expect(
        await component.locator(`${AVATAR} svg`).count(),
        "a surface with a gradient stroke takes the SVG path instead",
    ).toBeGreaterThan(0);
    await expect(
        component.locator(`${AVATAR} svg linearGradient`),
        "and the gradient the consumer asked for is actually in the defs",
    ).toHaveCount(1);
    await expect
        .poll(() => inlineStyle(component.locator(`${AVATAR} div[style*="clip-path"]`).first(), "clip-path"), {
            message: "children on the SVG path are clipped to the shape rather than overflowing its corners",
        })
        .toMatch(/^path\("M /);
    await expect(component.locator(`${AVATAR} img`), "and they render too").toHaveCount(1);
});

test("a corner that is not a plain round takes the SVG path even with flat colors", async ({ mount }) => {
    const component = await mount("Composites/Surface/Squircle");

    await expect(component.locator(`${SQUIRCLE} svg`), "a squircle corner cannot be drawn by a div").toHaveCount(1);
    await expect(component.locator(`${SQUIRCLE} svg path`)).toHaveAttribute("fill", "#223344");
});

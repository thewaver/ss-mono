import { expect, test } from "@playwright/test";

import { computedStyle, inlineStyle } from "../helpers";

/**
 * The React `GlassSurface`, and through it the React filter builders `GlassReactUtils` hands to `Shape`. There is no
 * Solid spec for it to follow, so these cases state what the glass is made of: a blurred backdrop and a rippled one,
 * both over-drawn and clipped back to the outline; a tint with a sheen lit from wherever the pointer is; and the
 * content, clipped to the same outline. Each part that a setting turns off is left out rather than drawn empty.
 */
const STORY = "Composites/GlassSurface/Default";
const GLASS = '[data-testid="glass"]';
const SHAPE_ROOT = `${GLASS} > div > div`;
const LAYERS = `${SHAPE_ROOT} > div`;

const backdropLayers = (page: import("@playwright/test").Page) =>
    page.locator(LAYERS).evaluateAll((layers) =>
        layers.map((layer) => ({
            backdropFilter: getComputedStyle(layer).backdropFilter,
            clipPath: (layer as HTMLElement).style.clipPath,
            text: layer.textContent,
        })),
    );

test("the backdrop is blurred and rippled behind the content, and all three are clipped to the outline", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect.poll(async () => (await backdropLayers(page)).length, { message: "blur, ripple and content" }).toBe(3);

    const [blur, ripple, content] = await backdropLayers(page);

    expect(blur.backdropFilter, "the first layer blurs what is behind it").toMatch(/^blur\(/);
    expect(ripple.backdropFilter, "the second bends it through a filter of its own").toMatch(/^url\("?#/);
    expect(content.text, "and the last is the consumer's content").toBe("Behind the glass");

    for (const layer of [blur, ripple, content]) {
        expect(layer.clipPath, "each one is cut to a path rather than to the box").toMatch(/^path\("M /);
    }
    expect(blur.clipPath, "the backdrop is over-drawn, so its outline is not the content's").not.toBe(content.clipPath);
});

test("the ripple layer's filter is defined in the glass itself, and is a displacement by noise", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    const rippleFilter = await inlineStyle(page.locator(LAYERS).nth(1), "backdrop-filter");
    const filterId = /#([^")]+)/.exec(rippleFilter)?.[1];

    expect(filterId, "the ripple layer names a filter").toBeTruthy();

    const filter = page.locator(`${GLASS} svg[aria-hidden="true"] filter`);

    await expect(filter, "which the hidden defs of the same glass define").toHaveAttribute("id", filterId!);
    await expect(filter.locator("feTurbulence")).toHaveCount(1);
    await expect(filter.locator("feDisplacementMap")).toHaveCount(1);
});

test("a setting that turns a part off leaves that part out", async ({ page, mount }) => {
    await mount(STORY, { glassDefs: { backdrop: { blurRadius: 0 }, ripple: { scale: 0 } } });

    await expect(page.locator(LAYERS), "with no blur and no ripple, only the content is left").toHaveCount(1);
    await expect(page.locator(`${GLASS} svg[aria-hidden="true"] filter`), "and no ripple filter is built").toHaveCount(
        0,
    );
});

test("the sheen is lit from the pointer, and moves when it does", async ({ page, mount }) => {
    await mount(STORY);

    const light = page.locator(`${SHAPE_ROOT} > svg >> nth=0 >> fePointLight`);

    await expect(light, "the tint carries a specular sheen from a point light").toHaveCount(1);
    await expect(page.locator(`${SHAPE_ROOT} > svg >> nth=0 >> path`)).toHaveAttribute("filter", /^url\(#.+\)$/);

    const box = (await page.locator(SHAPE_ROOT).boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.5);
    await expect.poll(() => light.getAttribute("x")).not.toBe(null);

    const before = Number(await light.getAttribute("x"));

    await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.5);

    await expect
        .poll(async () => Number(await light.getAttribute("x")), { message: "the light follows the pointer across" })
        .toBeGreaterThan(before);
});

test("with no sheen the tint is painted alone, and no filter is pointed at", async ({ page, mount }) => {
    await mount(STORY, { glassDefs: { sheen: { specularConstant: 0 } } });

    const tint = page.locator(`${SHAPE_ROOT} > svg >> nth=0 >> path`);

    await expect(tint, "the tint is still painted").toHaveAttribute("fill", /.+/);
    await expect(tint, "but points at no filter that would build nothing").not.toHaveAttribute("filter");
    await expect(page.locator(`${SHAPE_ROOT} > svg >> nth=0 >> filter`)).toHaveCount(0);
});

test("a gradient tint and a stroked edge are each painted in a layer of their own", async ({ page, mount }) => {
    await mount("Composites/GlassSurface/Edged");

    const layers = page.locator(`${SHAPE_ROOT} > svg`);

    await expect(layers, "the fill layer, the hidden ripple defs and the edge layer").toHaveCount(3);
    await expect(
        layers.first().locator("defs linearGradient"),
        "the gradient tint is defined with the fill",
    ).toHaveCount(1);
    await expect(layers.first().locator("path")).toHaveAttribute("fill", /^url\(#.+\)$/);
    await expect(layers.last().locator("path"), "and the edge is painted as a ring").toHaveAttribute(
        "fill-rule",
        "evenodd",
    );
    expect(await computedStyle(layers.last(), "pointer-events"), "which never takes the pointer").toBe("none");
});

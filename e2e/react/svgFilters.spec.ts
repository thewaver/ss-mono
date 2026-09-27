import { expect, test } from "@playwright/test";

/**
 * The React `SVGFilterDefsFactory`. Which effects are kept and how they are put together is
 * `SVGFilterDefsUtils.createRegistry`'s, and its unit tests cover the arithmetic; what is left to check here is that
 * the React markup carries it — each primitive reading what the assembly says it reads, the region written onto the
 * filter, and the attributes React spells in camel case arriving under their SVG names.
 */
const STORY = "Generators/SVGFilters/Default";
const filter = (id: string) => `[data-filter="${id}"] filter`;

test("a chain feeds each primitive the one before it, inside a region grown around the element", async ({ mount }) => {
    const component = await mount(STORY);
    const chain = component.locator(filter("chain"));

    await expect(chain).toHaveAttribute("id", "chain");
    await expect(chain).toHaveAttribute("filterUnits", "userSpaceOnUse");
    await expect(chain, "the blur's reach is reserved on every side").toHaveAttribute("x", "-6px");
    await expect(chain).toHaveAttribute("width", "112px");
    await expect(chain.locator("feGaussianBlur")).toHaveAttribute("in", "SourceGraphic");
    await expect(chain.locator("feColorMatrix"), "the hue turn reads the blur").toHaveAttribute(
        "in",
        (await chain.locator("feGaussianBlur").getAttribute("result"))!,
    );
    await expect(chain.locator("feMerge"), "and nothing is merged back").toHaveCount(0);
});

test("isolating reads the original every time and merges each result over it", async ({ mount }) => {
    const component = await mount(STORY);
    const isolate = component.locator(filter("isolate"));

    await expect(isolate.locator("feDropShadow")).toHaveAttribute("in", "SourceGraphic");
    await expect(isolate.locator("feDropShadow"), "the shadow's color arrives under its SVG name").toHaveAttribute(
        "flood-color",
        "#FF0000",
    );
    await expect(isolate.locator("feColorMatrix")).toHaveAttribute("in", "SourceGraphic");
    await expect(isolate.locator("feMergeNode"), "the original and both results").toHaveCount(3);
    await expect(isolate.locator("feMergeNode").first()).toHaveAttribute("in", "SourceGraphic");
    await expect(isolate, "with no size given, a reach doubles the region").toHaveAttribute("width", "200%");
});

test("a filter whose every effect would change nothing is not built at all", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(filter("identity"))).toHaveCount(0);
    await expect(component.locator('[data-filter="identity"] [data-readout="built"]')).toHaveText("false");
});

test("lighting is lit by its source over a noise surface, in the color space it names", async ({ mount }) => {
    const component = await mount(STORY);
    const lighting = component.locator(filter("lighting"));

    await expect(lighting.locator("feTurbulence"), "the surface's frequency is written per axis").toHaveAttribute(
        "baseFrequency",
        "0.02 0.04",
    );
    await expect(lighting.locator("feDiffuseLighting feDistantLight")).toHaveAttribute("azimuth", "45");
    await expect(lighting.locator("feDiffuseLighting")).toHaveAttribute("lighting-color", /.+/);
    await expect(lighting.locator("feDiffuseLighting")).toHaveAttribute("color-interpolation-filters", /.+/);
    await expect(lighting, "and a region is left to the browser when nothing reaches past the box").not.toHaveAttribute(
        "width",
    );
});

test("an edge-faded displacement reads its map through the mask rather than straight from the noise", async ({
    mount,
}) => {
    const component = await mount(STORY);
    const turbulence = component.locator(filter("turbulence"));
    const map = turbulence.locator("feComposite").last();

    await expect(turbulence.locator("feMorphology"), "the shape's edge is eroded to make the mask").toHaveCount(1);
    await expect(turbulence.locator("feFlood")).toHaveAttribute("flood-color", /.+/);
    await expect(turbulence.locator("feDisplacementMap")).toHaveAttribute("in2", (await map.getAttribute("result"))!);
});

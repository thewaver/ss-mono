import { type Page, expect, test } from "@playwright/test";

/**
 * The React pattern samples, each painting a `Shape`'s fill. There is no Solid spec to follow: these are the Solid
 * samples ported one for one, so what is worth holding them to is that each one's wiring arrives whole — the painted
 * path points at a definition that exists, a tiling's pattern carries its cells, and a whirl's gradient is cut by a
 * clip path that is there too.
 *
 * The case that is React's own is the last one. A tiling rolls a random animation for every cell, and in Solid the
 * defs are built once; in React they are built again on every render of whatever hosts the shape, so a roll that
 * happened during render would restart every cell's animation each time anything above it changed. The story's
 * button re-renders the lot, and the cells' markup has to come back exactly as it was.
 */
const STORY = "Samples/Patterns/All";
const TILINGS = [
    "circle_g_2",
    "circle_hd_2",
    "circle_hs_2",
    "hexagon_ft_2",
    "hexagon_pt_2",
    "lozenge_d_2",
    "triangle_s_2",
    "triangle_t_2",
];
const WHIRLS = ["whirl_2", "whirl_curved_2"];
const RERENDER = '[data-action="rerender"]';

/**
 * What the sample's painted fill points at. It is looked up by id rather than by selector, since the ids come from
 * `useId` and are not guaranteed to be valid CSS.
 */
const paintOf = (page: Page, name: string) =>
    page.evaluate((sample) => {
        const root = document.querySelector(`[data-sample="${sample}"]`)!;
        const path = [...root.querySelectorAll("svg > path")].find((each) =>
            each.getAttribute("fill")?.startsWith("url(#"),
        );
        const resolve = (value: string | null | undefined) => {
            const id = value?.match(/^url\(#(.+)\)$/)?.[1];

            return id ? document.getElementById(id) : null;
        };
        const fill = resolve(path?.getAttribute("fill"));
        const clip = resolve(path?.getAttribute("clip-path"));

        return {
            fillTag: fill?.tagName,
            fillMarkup: fill?.outerHTML,
            cellIds: [...(fill?.querySelectorAll(":scope > g > [id]") ?? [])].map((cell) => cell.id),
            cellTracks: [...(fill?.querySelectorAll(":scope > g animate") ?? [])].map(
                (animate) => animate.getAttribute("values") ?? "",
            ),
            stopCount: fill?.querySelectorAll("stop").length ?? 0,
            clipTag: clip?.tagName,
            clipPathCount: clip?.querySelectorAll("path").length ?? 0,
        };
    }, name);

test("every tiling fills from a pattern that exists and carries its cells", async ({ mount, page }) => {
    await mount(STORY);

    for (const name of TILINGS) {
        const paint = await paintOf(page, name);

        expect(paint.fillTag, `${name}'s fill points at a pattern`).toBe("pattern");
        expect(paint.cellIds.length, `${name}'s pattern has cells to tile`).toBeGreaterThan(0);
        expect(paint.cellTracks.length, `and each of ${name}'s cells is animated`).toBe(paint.cellIds.length);
        expect(
            new Set(paint.cellTracks).size,
            `${name}'s cells are rolled apart rather than sharing one animation`,
        ).toBeGreaterThan(1);
    }
});

test("every whirl fills from a gradient cut by a clip path that exists", async ({ mount, page }) => {
    await mount(STORY);

    for (const name of WHIRLS) {
        const paint = await paintOf(page, name);

        expect(paint.fillTag, `${name}'s fill points at a radial gradient`).toBe("radialGradient");
        expect(paint.stopCount, `${name}'s gradient has stops to draw with`).toBeGreaterThan(0);
        expect(paint.clipTag, `${name}'s fill is cut by a clip path`).toBe("clipPath");
        expect(paint.clipPathCount, "which has wedges in it").toBeGreaterThan(0);
    }
});

test("re-rendering the host leaves every pattern's cells as they were rolled", async ({ mount, page }) => {
    const component = await mount(STORY);
    const names = [...TILINGS, ...WHIRLS];
    const before = await Promise.all(names.map((name) => paintOf(page, name)));

    await component.locator(RERENDER).click();
    await expect(component.locator(RERENDER), "the story has rendered again").toHaveText("rerender 1");
    await component.locator(RERENDER).click();
    await expect(component.locator(RERENDER)).toHaveText("rerender 2");

    for (const [index, name] of names.entries()) {
        const after = await paintOf(page, name);

        expect(after.fillMarkup, `${name}'s definition is still there`).toBeTruthy();
        expect(after.fillMarkup, `${name}'s markup is untouched, so no animation was restarted`).toBe(
            before[index].fillMarkup,
        );
    }
});

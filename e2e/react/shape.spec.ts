import { expect, test } from "@playwright/test";

/**
 * The React `Shape`, with its paint built by the React SVG defs builders. The cases follow `e2e/shape.spec.ts`, which
 * covers the Solid one on the Playground, so the two frameworks are held to the same behavior. `Shape` sizes itself
 * from a `ResizeObserver` rather than from props, so beyond the geometry the thing worth asserting is that the two
 * SVG layers track the box they were measured from.
 */
const STORY = "Exotics/Shape/Default";
const SHAPE = '[data-testid="shape"]';
const LAYERS = `${SHAPE} svg`;
const FILL_PATH = `${SHAPE} svg >> nth=0 >> path`;

test("it draws a fill layer and a stroke layer over the same box", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(LAYERS), "a fill layer and a stroke layer, in that order").toHaveCount(2);

    const box = await component
        .locator(LAYERS)
        .first()
        .evaluate((svg) => {
            const root = svg.parentElement!;

            return { width: root.offsetWidth, height: root.offsetHeight };
        });

    expect(box.width, "the root has been measured").toBeGreaterThan(0);

    for (const index of [0, 1]) {
        const layer = component.locator(LAYERS).nth(index);

        await expect(
            layer,
            "the layer is sized from the root's own layout box rather than from a prop",
        ).toHaveAttribute("width", `${box.width}`);
        await expect(layer, "and its viewBox matches, so nothing is scaled twice").toHaveAttribute(
            "viewBox",
            `0 0 ${box.width} ${box.height}`,
        );
    }
});

test("the consumer's paint lands in the defs of the layer that uses it", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(
        component.locator(`${LAYERS} >> nth=1 >> defs linearGradient`),
        "the stroke gradient is defined inside the stroke layer",
    ).toHaveCount(1);
    await expect(
        component.locator(`${LAYERS} >> nth=1 >> path`),
        "and the stroke is painted as paths rather than as a stroked outline",
    ).toHaveAttribute("fill", /^url\(#.+\)$/);
    await expect(component.locator(`${LAYERS} >> nth=1 >> path`)).toHaveAttribute("fill-rule", "evenodd");
    await expect(
        component.locator(`${LAYERS} >> nth=0 >> defs pattern g`),
        "the fill pattern is defined inside the fill layer, one group per cell",
    ).toHaveCount(4);
});

test("it draws a closed path, and the children are clipped to it", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(FILL_PATH)).toHaveAttribute("d", /^M /);

    const d = await component.locator(FILL_PATH).getAttribute("d");

    expect(d?.trimEnd().endsWith("Z"), "a path that does not close leaves a gap the fill would leak through").toBe(
        true,
    );
    await expect(component.getByTestId("content"), "the children are handed the same outline").toHaveAttribute(
        "style",
        /clip-path: path\("M /,
    );
});

test("changing the shape kind redraws the path", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(FILL_PATH)).toHaveAttribute("d", /^M /);

    const before = await component.locator(FILL_PATH).getAttribute("d");

    await component.locator('[data-action="shape"]').click();

    await expect(component.locator(FILL_PATH), "a different shape kind recomputes the points").not.toHaveAttribute(
        "d",
        before!,
    );
});

test("changing a joint radius redraws the path", async ({ mount }) => {
    const component = await mount(STORY);

    await expect(component.locator(FILL_PATH)).toHaveAttribute("d", /^M /);

    const before = await component.locator(FILL_PATH).getAttribute("d");

    await component.locator('[data-action="radius"]').click();

    await expect(component.locator(FILL_PATH), "the corner radii reach the path builder").not.toHaveAttribute(
        "d",
        before!,
    );
});

/**
 * SMIL cannot be rewound in place, so an animation restarts by being built again. In React the elements survive a
 * render, so what rebuilds them is the key `useAnimateDefs` hands out, which changes with the animation it describes
 * and with nothing else.
 */
test("an animated def is rebuilt when its animation changes, and only then", async ({ page, mount }) => {
    const component = await mount(STORY);

    const hold = () =>
        page.evaluate(() => {
            (window as unknown as { probe?: Element | null }).probe = document.querySelector("animate");

            return document.querySelectorAll("animate").length;
        });

    const compare = () =>
        page.evaluate(() => {
            const previous = (window as unknown as { probe?: Element | null }).probe;

            return { isSame: previous === document.querySelector("animate"), isConnected: previous?.isConnected };
        });

    expect(await hold(), "the stroke animates").toBeGreaterThan(0);

    await component.locator('[data-action="rerender"]').click();
    await expect(component.locator('[data-action="rerender"]')).toHaveText("rerender 1");
    expect((await compare()).isSame, "a render describing the same animation keeps the running elements").toBe(true);

    await component.locator('[data-action="duration"]').click();

    await expect
        .poll(async () => (await compare()).isSame, { message: "a new duration builds new animate elements" })
        .toBe(false);
    expect((await compare()).isConnected, "and drops the ones that were running").toBe(false);

    await hold();
    await component.locator('[data-iteration="repeat1_1"]').click();

    await expect
        .poll(async () => (await compare()).isSame, { message: "and so does a new iteration pattern" })
        .toBe(false);
});

test("switching iteration pattern mid-run leaves the animation running", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.locator('[data-iteration="repeat3_3"]').click();
    await page.waitForTimeout(1000);
    await component.locator('[data-iteration="repeat1_1"]').click();

    const distinct = await page.evaluate(async () => {
        const seen = new Set<string>();

        for (let i = 0; i < 30; i++) {
            seen.add(
                [...document.querySelectorAll("linearGradient")]
                    .map((node) => (node as SVGLinearGradientElement).x1.animVal.value.toFixed(3))
                    .join(","),
            );

            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        return seen.size;
    });

    expect(distinct, "the gradient moved through its sweep rather than sitting on one value").toBeGreaterThan(3);
});

test("a pattern that runs out ends the animation, and a following pattern repeats it", async ({ page, mount }) => {
    const component = await mount(STORY);

    await component.locator('[data-iteration="repeat1_1"]').click();

    await expect
        .poll(() => page.locator("animate").first().getAttribute("repeatCount"), {
            message: "the running pattern's count is what the element repeats",
        })
        .toBe("1");

    await page.waitForTimeout(2500);

    const distinct = await page.evaluate(async () => {
        const seen = new Set<string>();

        for (let i = 0; i < 20; i++) {
            seen.add(
                (document.querySelector("linearGradient") as SVGLinearGradientElement).x1.animVal.value.toFixed(3),
            );

            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        return seen.size;
    });

    expect(distinct, "after its first pass and the wait, the next pattern starts it again").toBeGreaterThan(3);
});

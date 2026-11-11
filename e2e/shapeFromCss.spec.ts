import { type Locator, type Page, expect, test } from "@playwright/test";

import { demo, example } from "./helpers";

const FROM_CSS = example("fromCss");
const FIELD = `${demo("fromCss")} textarea`;

/**
 * The From CSS example paints one box twice: the left by the browser from the CSS in the field, the right by a `Shape`
 * from what `computeDefsFromStyle` made of that box's computed style. The two are compared with each other, never
 * with a stored picture, so restyling a sample changes nothing here and only a conversion that stops agreeing with the
 * browser fails. The captions differ by design and are hidden first.
 *
 * Each sample stands for one thing the converter does. A sample is compared with an allowance, a guess rather than a
 * measurement: the Playground scales the page to the window, so anti-aliased edges and the seams between border colors
 * land a pixel apart, and a shadow or an outset reaching across the gap shows at the edge of the other box's crop. A
 * missing layer or a wrong region is far beyond it; a slightly wrong curve may not be. `scoop` corners and border-image
 * `space` are left out on purpose — see `decisions.md`, "`SVGStyleDefsUtils`".
 */
const SAMPLES: Record<string, string> = {
    gradients:
        "background: radial-gradient(circle at 30% 40%, #fa0, #05c 60%), linear-gradient(120deg, #e8590c, transparent)",
    borderAndCorners:
        "background: #eee; border-style: solid; border-color: #333; border-width: 4px 14px 8px 20px; border-radius: 60px / 30px",
    sideColors: "background: #eee; border: 10px solid; border-color: #f00 #0a0 #00f #fa0; border-radius: 30px",
    shadows:
        "background: #3b5bdb; border-radius: 20px; box-shadow: inset 0 6px 12px 2px rgba(0, 0, 0, 0.5), 0 8px 0 -2px #f00",
    tiledBackground:
        "background: #222 linear-gradient(#f00, #00f) 20% 30px / 50px auto space round, #222 linear-gradient(90deg, #ff0, #0f0) right 10px bottom 5px / 40px 30% no-repeat",
    clippedBackground:
        "padding: 20px; border: 6px solid rgba(255, 255, 255, 0.4); border-radius: 30px; background: linear-gradient(90deg, #f00, #00f) content-box",
    borderImage:
        "background: #222; border: 10px solid; border-image: linear-gradient(90deg, #ffd43b, #12b886, #228be6) 30% 10 fill / 2 20px auto / 5px 1 round",
    cornerShape: "background: #3b5bdb; border-radius: 50px; corner-shape: squircle bevel superellipse(3) notch",
};

const MAX_DIFFERING_SHARE = 0.02;
const DIFFERENCE_THRESHOLD = 60;
const CROP_MARGIN = { x: 9, y: 24 };

const enterCss = async (page: Page, css: string) => {
    await page.locator(FIELD).click();
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");
    await page.keyboard.type(css);
};

const readBoxes = (page: Page) =>
    page.locator(demo("fromCss")).evaluate((root) => {
        const shape = root.querySelector("svg")!.parentElement!;
        const source = shape.previousElementSibling!;
        const read = (element: Element) => {
            const rect = element.getBoundingClientRect();

            return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        };

        return { source: read(source), shape: read(shape) };
    });

const crop = (box: { x: number; y: number; width: number; height: number }) => ({
    x: box.x - CROP_MARGIN.x,
    y: box.y - CROP_MARGIN.y,
    width: box.width + CROP_MARGIN.x * 2,
    height: box.height + CROP_MARGIN.y * 2,
});

const readDifferingShare = async (page: Page) => {
    const boxes = await readBoxes(page);
    const left = (await page.screenshot({ clip: crop(boxes.source) })).toString("base64");
    const right = (await page.screenshot({ clip: crop(boxes.shape) })).toString("base64");

    return page.evaluate(
        async ({ left, right, threshold }) => {
            const decode = async (data: string) => {
                const image = new Image();

                image.src = `data:image/png;base64,${data}`;
                await image.decode();

                const canvas = new OffscreenCanvas(image.width, image.height);
                const context = canvas.getContext("2d")!;

                context.drawImage(image, 0, 0);

                return context.getImageData(0, 0, image.width, image.height).data;
            };
            const first = await decode(left);
            const second = await decode(right);
            let differing = 0;

            for (let index = 0; index < first.length; index += 4) {
                const difference = Math.max(
                    Math.abs(first[index] - second[index]),
                    Math.abs(first[index + 1] - second[index + 1]),
                    Math.abs(first[index + 2] - second[index + 2]),
                );

                if (difference > threshold) differing++;
            }

            return differing / (first.length / 4);
        },
        { left, right, threshold: DIFFERENCE_THRESHOLD },
    );
};

const invalidReadout = (page: Page, declaration: string): Locator =>
    page.locator(`${demo("fromCss")} [data-readout]`, { hasText: declaration });

test.beforeEach(async ({ page }) => {
    await page.goto("/shape");
    await page.locator(FIELD).scrollIntoViewIfNeeded();
    await page.addStyleTag({ content: `${FROM_CSS} [data-demo] * { color: transparent !important; }` });
});

test("the starting CSS paints the same in both boxes", async ({ page }) => {
    await expect
        .poll(() => readDifferingShare(page), { message: "the shape agrees with the browser on the page's own sample" })
        .toBeLessThan(MAX_DIFFERING_SHARE);
});

for (const [name, css] of Object.entries(SAMPLES)) {
    test(`the ${name} sample paints the same in both boxes`, async ({ page }) => {
        await enterCss(page, css);

        await expect
            .poll(() => readDifferingShare(page), { message: `the shape agrees with the browser on "${css}"` })
            .toBeLessThan(MAX_DIFFERING_SHARE);
    });
}

test("invalid CSS marks the field and names each declaration the browser refuses", async ({ page }) => {
    await enterCss(page, "color: notacolor; background: #f00; colour: red");

    await expect(page.locator(FIELD), "the field is in error while any declaration is refused").toHaveAttribute(
        "aria-invalid",
        "true",
    );
    await expect(invalidReadout(page, "color: notacolor"), "the refused value is named").toBeVisible();
    await expect(invalidReadout(page, "colour: red"), "and so is the misspelled property").toBeVisible();
    await expect(invalidReadout(page, "background: #f00"), "but not the declaration that is fine").toHaveCount(0);

    await enterCss(page, "background: #f00");

    await expect(page.locator(FIELD), "and it clears once everything is accepted").not.toHaveAttribute(
        "aria-invalid",
        "true",
    );
});

test("CSS the converter cannot reproduce is named in the console", async ({ page }) => {
    const warnings: string[] = [];

    page.on("console", (message) => {
        if (message.type() === "warning") warnings.push(message.text());
    });

    await enterCss(page, "background: conic-gradient(#f00, #00f)");

    await expect
        .poll(() => warnings.some((text) => text.includes("conic-gradient")), {
            message: "the skipped background is reported with its value",
        })
        .toBe(true);
});

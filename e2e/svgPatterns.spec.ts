import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

/**
 * The cut layouts — `triangle_ltr`, `triangle_rtl`, `square_quarters` and `lozenge_quarters` — give every triangle of a cell a
 * cell index of its own, several to one box. What a viewer would notice going wrong is a box drawn whole, two
 * pieces of one box drawn as the same triangle, or the pieces of one box lighting as one under the pointer, so
 * those are what is asserted. Which shapes they are, and their colors, are the samples' own business.
 */

const CUT_TIMED = ["triangle_ltr_2", "triangle_rtl_2", "triangle_sq_2", "triangle_lq_2"];
const CUT_TRACKED = ["triangle_ltr_fade_2", "triangle_rtl_fade_2", "triangle_sq_fade_2", "triangle_lq_fade_2"];

const pickPattern = async (page: Page, key: string) => {
    await page.locator(`${prop("configKey")} [role="combobox"]`).click();
    await page.getByRole("option", { name: key, exact: true }).click();
};

type CellReading = { transform: string; href: string; corners: number; level: number };

const readCells = (page: Page) =>
    page
        .locator(`${demo("default")} pattern`)
        .filter({ has: page.locator("use") })
        .first()
        .evaluate((pattern): CellReading[] =>
            Array.from(pattern.querySelectorAll("use")).map((use) => {
                const href = use.getAttribute("href") ?? use.getAttribute("xlink:href") ?? "";
                const target = document.getElementById(href.replace(/^#/, ""));
                const corners = (target?.getAttribute("d") ?? "").match(/[ML]/g)?.length ?? 0;

                return {
                    transform: use.closest("g")?.getAttribute("transform") ?? "",
                    href,
                    corners,
                    level: Number(use.getAttribute("fill-opacity") ?? Number.NaN),
                };
            }),
        );

const groupByBox = (cells: CellReading[]) => {
    const boxes = new Map<string, CellReading[]>();

    for (const cell of cells) boxes.set(cell.transform, [...(boxes.get(cell.transform) ?? []), cell]);

    return [...boxes.values()];
};

test("a timed cut pattern draws every cell as a triangle, and no two pieces of one box as the same one", async ({
    page,
}) => {
    await page.goto("/timed-patterns");

    for (const key of CUT_TIMED) {
        await pickPattern(page, key);

        const cells = await readCells(page);

        expect(cells.length, `${key} draws cells`).toBeGreaterThan(0);
        expect(
            cells.every((cell) => cell.corners === 3),
            `${key} points every cell at a triangle the pattern defines`,
        ).toBe(true);

        for (const box of groupByBox(cells)) {
            expect(box.length, `${key} cuts each box into more than one piece`).toBeGreaterThan(1);
            expect(new Set(box.map((cell) => cell.href)).size, `${key} draws each piece of a box differently`).toBe(
                box.length,
            );
        }
    }
});

/**
 * Each piece is measured from its own middle, so with the pointer over the pattern the halves of one box sit at
 * different distances and light to different levels. Measured from the box's middle, as a whole cell is, they
 * would always match — which is the fault this guards against.
 */
test("a tracked cut pattern lights the pieces of one box apart", async ({ page }) => {
    await page.goto("/tracked-patterns");

    for (const key of CUT_TRACKED) {
        await pickPattern(page, key);

        const area = (await page.locator(demo("default")).boundingBox())!;

        await page.mouse.move(area.x + area.width * 0.3, area.y + area.height * 0.3);
        await page.mouse.move(area.x + area.width * 0.5, area.y + area.height * 0.5, { steps: 8 });

        await expect
            .poll(
                async () =>
                    groupByBox(await readCells(page)).some(
                        (box) => new Set(box.map((cell) => cell.level.toFixed(3))).size > 1,
                    ),
                { message: `${key} has a box whose pieces answer the pointer at different levels` },
            )
            .toBe(true);
    }
});

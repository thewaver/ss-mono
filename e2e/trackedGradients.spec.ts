import { expect, test } from "@playwright/test";

import { demo, readPaintAreas } from "./helpers";

/**
 * The Tracked page's Shared example is Continuity's four boxes made to read as one: each box reads the pointer
 * against the whole group and lays its paint across the whole group, shifted back by its own place in it. A hand is
 * the sample that shows whether that holds, because it paints with a gradient **and** cuts with a clip path, and the
 * two used to disagree — the gradient followed the group while the clip followed each box.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/tracked-gradients");
});

test("a hand in the Shared example lays its gradient and its clip across the whole group", async ({ page }) => {
    await page.getByRole("combobox", { name: "Gradient", exact: true }).click();
    await page
        .getByRole("option", { name: /^hand_1/ })
        .first()
        .click();
    await expect(page.getByRole("listbox")).toHaveCount(0);

    const shared = page.locator(demo("shared"));
    const box = (await shared.boundingBox())!;

    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.3);

    await expect
        .poll(async () => new Set((await readPaintAreas(shared)).map((area) => area.kind)), "a gradient and a clip")
        .toEqual(new Set(["linearGradient", "clipPath"]));

    for (const area of await readPaintAreas(shared)) {
        expect(area.units, area.kind).toBe("userSpaceOnUse");
        area.actual.forEach((value, index) => expect(value, area.kind).toBeCloseTo(area.expected[index], 0));
    }
});

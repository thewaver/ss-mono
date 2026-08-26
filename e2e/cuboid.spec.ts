import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { demo, prop, readout } from "./helpers";

/**
 * The box is driven by two counts of quarter turns rather than by naming a face, so every check here presses
 * the page's own buttons and then asks which face came to the front. That is also what the last test is
 * really about: the room a turning box needs is not the room it occupies at rest, and the drum's history —
 * two shipped formulas for that room, both wrong and both self-consistent — is the reason a box that turns
 * gets this check rather than a unit test over the arithmetic.
 */
const CUBOID = demo("default");

const box = `${CUBOID} [aria-roledescription="box"]`;
const faces = `${CUBOID} [aria-roledescription="face"]`;
const facing = `${faces}:not([aria-hidden="true"])`;

const TURN_MS = 700;
const SLOW_TURN_MS = 3000;
const SAMPLE_COUNT = 10;
const SAMPLE_GAP_MS = 150;
const OVERFLOW_TOLERANCE_PX = 1;
const FACE_COUNT = 6;

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(`${prop(key)} input`).fill(value);
    await page.locator(`${prop(key)} input`).blur();
};

const turn = async (page: Page, id: string) => {
    await page.locator(`#${id}`).click();
    await page.waitForTimeout(TURN_MS);
};

const facingName = (page: Page) => page.locator(facing).getAttribute("aria-label");

const worstOverflow = (page: Page, selector: string) =>
    page.evaluate((cuboidSelector) => {
        const cuboid = document.querySelector(cuboidSelector) as HTMLElement;
        const reserved = cuboid.getBoundingClientRect();
        const boxes = [...cuboid.querySelectorAll('[aria-roledescription="face"]')]
            .map((face) => face.getBoundingClientRect())
            .filter((rect) => rect.width > 2 && rect.height > 2);

        return Math.max(
            reserved.left - Math.min(...boxes.map((rect) => rect.left)),
            Math.max(...boxes.map((rect) => rect.right)) - reserved.right,
            reserved.top - Math.min(...boxes.map((rect) => rect.top)),
            Math.max(...boxes.map((rect) => rect.bottom)) - reserved.bottom,
        );
    }, selector);

test.beforeEach(async ({ page }) => {
    await page.goto("/cuboid");
    await expect(page.locator(box)).toBeVisible();
});

test("the box and every face say what they are, beyond what their roles convey", async ({ page }) => {
    await expect(page.locator(box)).toHaveAttribute("role", "group");
    await expect(page.locator(box)).toHaveAttribute("aria-label", "Six faces");

    await expect(page.locator(faces), "six faces, whatever the extents are").toHaveCount(FACE_COUNT);
    expect(await facingName(page), "and one of them is the one you are looking at").toBe("Front");
});

test("the five faces turned away are out of reach, not merely out of sight", async ({ page }) => {
    await expect(page.locator(`${faces}[aria-hidden="true"]`)).toHaveCount(FACE_COUNT - 1);
    await expect(page.locator(`${faces}[aria-hidden="true"]`).first()).toHaveAttribute("inert", "");
    await expect(page.locator(facing)).not.toHaveAttribute("inert");
});

test("turning across walks the four upright faces and comes round rather than stopping", async ({ page }) => {
    for (const expected of ["Right", "Back", "Left", "Front"]) {
        await turn(page, "yawRight");

        expect(await facingName(page)).toBe(expected);
    }

    await turn(page, "yawLeft");

    expect(await facingName(page), "and it turns back the way it came").toBe("Left");
});

test("turning up brings the lid, and going on over it leaves the far side upside down", async ({ page }) => {
    await turn(page, "pitchUp");

    expect(await facingName(page)).toBe("Top");
    expect(await readout(page, "default"), "the page is told the same thing").toContain("top");

    await turn(page, "pitchUp");

    expect(await facingName(page), "over the top is the back of the box, inverted, as a real box would be").toBe(
        "Back",
    );

    await turn(page, "pitchDown");

    expect(await facingName(page)).toBe("Top");
});

test("the box paints inside the room it reserves, at rest and all the way round", async ({ page }) => {
    for (const [width, height, depth] of [
        ["200", "260", "120"],
        ["400", "40", "400"],
        ["40", "400", "40"],
    ]) {
        await setField(page, "width", width!);
        await setField(page, "height", height!);
        await setField(page, "depth", depth!);

        expect(await worstOverflow(page, box), `at rest, ${width} by ${height} by ${depth}`).toBeLessThanOrEqual(
            OVERFLOW_TOLERANCE_PX,
        );
    }

    await setField(page, "transitionDurationMs", String(SLOW_TURN_MS));
    await page.locator("#yawRight").click();

    for (let sample = 0; sample < SAMPLE_COUNT; sample++) {
        expect(await worstOverflow(page, box), "while turning").toBeLessThanOrEqual(OVERFLOW_TOLERANCE_PX);

        await page.waitForTimeout(SAMPLE_GAP_MS);
    }
});

import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { demo, prop, readout, revealProp, waitUntilStill } from "./helpers";

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

/**
 * The third box keeps its own orientation instead of reading the counts as a pose, so which face comes up is
 * asked of the box through the page's readout and the face that is in reach, never worked out from the
 * counts. It turns by a keyframe animation on its body rather than by a transition, so a settle is waited
 * out by the animation list emptying and the face standing still — not by a span of time.
 *
 * "Reads upright" is a relationship between two things the page draws on every face: a title above a line
 * of body text. On screen, a face the right way up has its title above its body; turned on its side the two
 * sit beside each other, and upside down the body is on top. That is checked in painted positions, so it
 * holds whatever the face looks like and whatever size the box is.
 */
const UPRIGHT = demo("upright");

const uprightBox = `${UPRIGHT} [aria-roledescription="box"]`;
const uprightBody = `${uprightBox} > div > div`;
const uprightFacing = `${UPRIGHT} [aria-roledescription="face"]:not([aria-hidden="true"])`;

const DRAG_STEPS = 12;

const settleUpright = async (page: Page) => {
    await expect
        .poll(() => page.locator(uprightBody).evaluate((element) => element.getAnimations().length), {
            message: "the box finishes turning",
        })
        .toBe(0);
    await waitUntilStill(page.locator(uprightFacing));
};

const uprightFacingName = (page: Page) => page.locator(uprightFacing).getAttribute("aria-label");

const uprightReadoutFace = async (page: Page) => (await readout(page, "upright")).split(" ")[0];

const readsUpright = (page: Page) =>
    page.locator(uprightFacing).evaluate((face) => {
        const [title, body] = [...face.firstElementChild!.children].map((part) => {
            const rect = part.getBoundingClientRect();

            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
        const down = body!.y - title!.y;

        return down > Math.abs(body!.x - title!.x);
    });

const pressUpright = async (page: Page, id: string) => {
    await page.locator(`#${id}`).click();
    await settleUpright(page);
};

test("naming a face brings that face round, the right way up", async ({ page }) => {
    for (const face of ["Top", "Left", "Bottom", "Back", "Right", "Front"]) {
        await pressUpright(page, `turnTo${face}`);

        expect(await uprightFacingName(page), `asking for the ${face} brings it to the front`).toBe(face);
        expect(await uprightReadoutFace(page), "and the page is told the same").toBe(face.toLowerCase());
        expect(await readsUpright(page), `and the ${face} reads the right way up`).toBe(true);
    }
});

test("the turn buttons tip the box about the screen's own axes, and every face lands upright", async ({ page }) => {
    await pressUpright(page, "uprightPitchUp");

    expect(await uprightFacingName(page)).toBe("Top");
    expect(await readsUpright(page)).toBe(true);

    await pressUpright(page, "uprightYawRight");

    expect(await uprightFacingName(page), "from the lid, across brings a side").toBe("Right");
    expect(await readsUpright(page), "spun to read the right way up").toBe(true);

    await pressUpright(page, "uprightYawLeft");

    expect(
        await uprightFacingName(page),
        "and back again lands on the front, not the lid, because the face was righted in between",
    ).toBe("Front");
    expect(await readsUpright(page)).toBe(true);

    for (const expected of ["Top", "Back", "Top"]) {
        await pressUpright(page, "uprightPitchUp");

        expect(
            await uprightFacingName(page),
            "going on up swaps the lid and the side behind it, since a righted side always has the lid above it",
        ).toBe(expected);
        expect(await readsUpright(page), `and the ${expected} still reads upright, never inverted`).toBe(true);
    }
});

test("with upright off, the same presses leave the far side upside down", async ({ page }) => {
    await revealProp(page, "isUpright");
    await page.locator(`${prop("isUpright")} input`).uncheck();
    await settleUpright(page);

    await pressUpright(page, "uprightPitchUp");
    await pressUpright(page, "uprightPitchUp");

    expect(await uprightFacingName(page)).toBe("Back");
    expect(await readsUpright(page), "which is what the upright check tells apart").toBe(false);

    await revealProp(page, "isUpright");
    await page.locator(`${prop("isUpright")} input`).check();
    await settleUpright(page);

    expect(await readsUpright(page), "and turning upright back on rights the face in view").toBe(true);
});

/**
 * A drag is measured against the box's own width, so it is written as fractions of it: one box width is one
 * quarter turn, and a release rounds to the nearest whole turn.
 */
const dragAcross = async (page: Page, from: number, to: number, onHeld?: () => Promise<void>) => {
    const box = (await page.locator(`${uprightBox} > div`).boundingBox())!;
    const y = box.y + box.height * 0.5;

    await page.mouse.move(box.x + box.width * from, y);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to, y, { steps: DRAG_STEPS });
    await onHeld?.();
    await page.mouse.up();
};

test("dragging turns the box while held, and letting go settles it on a face", async ({ page }) => {
    const restingTransform = await page.locator(uprightBody).evaluate((element) => getComputedStyle(element).transform);

    await dragAcross(page, 0.9, 0.1, async () => {
        expect(
            await page.locator(uprightBody).evaluate((element) => getComputedStyle(element).transform),
            "the box follows the pointer while it is held",
        ).not.toBe(restingTransform);
    });
    await settleUpright(page);

    expect(await uprightFacingName(page), "pulling the front away to the left brings the right side round").toBe(
        "Right",
    );
    expect(await uprightReadoutFace(page)).toBe("right");
    expect(await readout(page, "upright"), "and the drag is recorded as a press across").toContain("across 1");
    expect(await readsUpright(page)).toBe(true);
});

test("a drag let go short of half a turn springs back to the face it started on", async ({ page }) => {
    await dragAcross(page, 0.6, 0.4);
    await settleUpright(page);

    expect(await uprightFacingName(page)).toBe("Front");
    expect(await readout(page, "upright"), "and nothing is recorded").toContain("across 0, up 0");
});

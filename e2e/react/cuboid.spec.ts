import { type Locator, type Page, expect, test } from "@playwright/test";

/**
 * The React `Cuboid`. The cases follow `e2e/cuboid.spec.ts`, which covers the Solid one: the box turned by two counts
 * of quarter turns, the room it reserves while it turns, and the upright mode, where it keeps its own orientation,
 * turns to a face by name through the controller it hands over, and can be dragged. The story owns every button, the
 * size fields and the upright switch, and its readout reads the face through the controller's `subscribe`.
 *
 * "Reads upright" is the Solid spec's relationship between the two lines every face draws: the title above the body,
 * in painted positions, whatever the face looks like.
 */
const STORY = "Exotics/Cuboid/Default";

const BOX = '[aria-roledescription="box"]';
const FACES = '[aria-roledescription="face"]';
const FACING = `${FACES}:not([aria-hidden="true"])`;
const BODY = `${BOX} > div > div`;
const READOUT = '[data-readout="cuboid"]';

const TURN_MS = 700;
const SLOW_TURN_MS = 3000;
const SAMPLE_COUNT = 10;
const SAMPLE_GAP_MS = 150;
const OVERFLOW_TOLERANCE_PX = 1;
const FACE_COUNT = 6;
const DRAG_STEPS = 12;

const facingName = (page: Page) => page.locator(FACING).getAttribute("aria-label");

const readoutFace = async (page: Page) => ((await page.locator(READOUT).textContent()) ?? "").split(" ")[0];

const setField = async (page: Page, id: string, value: string) => {
    await page.locator(`#${id}`).fill(value);
    await page.locator(`#${id}`).blur();
};

const turn = async (page: Page, id: string) => {
    await page.locator(`#${id}`).click();
    await page.waitForTimeout(TURN_MS);
};

const waitUntilStill = (locator: Locator) =>
    locator.evaluate(
        (element) =>
            new Promise<void>((resolve) => {
                let previous = "";
                let stillFor = 0;
                let frames = 0;

                const step = () => {
                    const rect = element.getBoundingClientRect();
                    const current = `${rect.x},${rect.y},${rect.width},${rect.height}`;

                    stillFor = current === previous ? stillFor + 1 : 0;
                    previous = current;
                    frames++;

                    if (frames >= 6 && stillFor >= 2) return resolve();

                    requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            }),
    );

const settle = async (page: Page) => {
    await expect
        .poll(() => page.locator(BODY).evaluate((element) => element.getAnimations().length), {
            message: "the box finishes turning",
        })
        .toBe(0);
    await waitUntilStill(page.locator(FACING));
};

const press = async (page: Page, id: string) => {
    await page.locator(`#${id}`).click();
    await settle(page);
};

const readsUpright = (page: Page) =>
    page.locator(FACING).evaluate((face) => {
        const [title, body] = [...face.firstElementChild!.children].map((part) => {
            const rect = part.getBoundingClientRect();

            return { x: rect.left + rect.width * 0.5, y: rect.top + rect.height * 0.5 };
        });

        return body!.y - title!.y > Math.abs(body!.x - title!.x);
    });

const worstOverflow = (page: Page) =>
    page.evaluate((selector) => {
        const cuboid = document.querySelector(selector) as HTMLElement;
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
    }, BOX);

test.describe("counted as a pose", () => {
    test.beforeEach(async ({ mount }) => {
        await mount(STORY);
    });

    test("the box and every face say what they are, beyond what their roles convey", async ({ page }) => {
        await expect(page.locator(BOX)).toHaveAttribute("role", "group");
        await expect(page.locator(BOX)).toHaveAttribute("aria-label", "Six faces");
        await expect(page.locator(FACES)).toHaveCount(FACE_COUNT);
        expect(await facingName(page)).toBe("Front");
    });

    test("the five faces turned away are out of reach, not merely out of sight", async ({ page }) => {
        await expect(page.locator(`${FACES}[aria-hidden="true"]`)).toHaveCount(FACE_COUNT - 1);
        await expect(page.locator(`${FACES}[aria-hidden="true"]`).first()).toHaveAttribute("inert", "");
        await expect(page.locator(FACING)).not.toHaveAttribute("inert");
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
        await expect(page.locator(READOUT), "the controller tells the page the same thing").toContainText("top");

        await turn(page, "pitchUp");

        expect(await facingName(page), "over the top is the back of the box").toBe("Back");

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

            expect(await worstOverflow(page), `at rest, ${width} by ${height} by ${depth}`).toBeLessThanOrEqual(
                OVERFLOW_TOLERANCE_PX,
            );
        }

        await setField(page, "transitionDurationMs", String(SLOW_TURN_MS));
        await page.locator("#yawRight").click();

        for (let sample = 0; sample < SAMPLE_COUNT; sample++) {
            expect(await worstOverflow(page), "while turning").toBeLessThanOrEqual(OVERFLOW_TOLERANCE_PX);

            await page.waitForTimeout(SAMPLE_GAP_MS);
        }
    });
});

test.describe("upright", () => {
    test.beforeEach(async ({ mount }) => {
        await mount(STORY, { isUpright: true, isDraggable: true });
    });

    test("naming a face brings that face round, the right way up", async ({ page }) => {
        for (const face of ["Top", "Left", "Bottom", "Back", "Right", "Front"]) {
            await press(page, `turnTo${face}`);

            expect(await facingName(page), `asking for the ${face} brings it to the front`).toBe(face);
            await expect
                .poll(() => readoutFace(page), { message: "and the page is told the same" })
                .toBe(face.toLowerCase());
            expect(await readsUpright(page), `and the ${face} reads the right way up`).toBe(true);
        }
    });

    test("the turn buttons tip the box about the screen's own axes, and every face lands upright", async ({ page }) => {
        await press(page, "pitchUp");

        expect(await facingName(page)).toBe("Top");
        expect(await readsUpright(page)).toBe(true);

        await press(page, "yawRight");

        expect(await facingName(page), "from the lid, across brings a side").toBe("Right");
        expect(await readsUpright(page)).toBe(true);

        await press(page, "yawLeft");

        expect(await facingName(page), "and back again lands on the front, because the face was righted").toBe("Front");
        expect(await readsUpright(page)).toBe(true);

        for (const expected of ["Top", "Back", "Top"]) {
            await press(page, "pitchUp");

            expect(await facingName(page)).toBe(expected);
            expect(await readsUpright(page), `and the ${expected} still reads upright`).toBe(true);
        }
    });

    test("with upright off, the same presses leave the far side upside down", async ({ page }) => {
        await page.locator("#isUpright").uncheck();
        await settle(page);

        await press(page, "pitchUp");
        await press(page, "pitchUp");

        expect(await facingName(page)).toBe("Back");
        expect(await readsUpright(page), "which is what the upright check tells apart").toBe(false);

        await page.locator("#isUpright").check();
        await settle(page);

        expect(await readsUpright(page), "and turning upright back on rights the face in view").toBe(true);
    });

    const dragAcross = async (page: Page, from: number, to: number, onHeld?: () => Promise<void>) => {
        const box = (await page.locator(`${BOX} > div`).boundingBox())!;
        const y = box.y + box.height * 0.5;

        await page.mouse.move(box.x + box.width * from, y);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * to, y, { steps: DRAG_STEPS });
        await onHeld?.();
        await page.mouse.up();
    };

    test("dragging turns the box while held, and letting go settles it on a face", async ({ page }) => {
        const transformOf = () => page.locator(BODY).evaluate((element) => getComputedStyle(element).transform);
        const resting = await transformOf();

        await dragAcross(page, 0.9, 0.1, async () => {
            expect(await transformOf(), "the box follows the pointer while it is held").not.toBe(resting);
        });
        await settle(page);

        expect(await facingName(page), "pulling the front away to the left brings the right side round").toBe("Right");
        await expect(page.locator(READOUT), "and the drag is recorded as a press across").toContainText("across 1");
        expect(await readoutFace(page)).toBe("right");
        expect(await readsUpright(page)).toBe(true);
    });

    test("a drag let go short of half a turn springs back to the face it started on", async ({ page }) => {
        await dragAcross(page, 0.6, 0.4);
        await settle(page);

        expect(await facingName(page)).toBe("Front");
        await expect(page.locator(READOUT), "and nothing is recorded").toContainText("across 0, up 0");
    });
});

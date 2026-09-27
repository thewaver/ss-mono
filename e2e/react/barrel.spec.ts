import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Barrel`: flat faces turned into the sides of a prism. The cases follow the parts of
 * `e2e/carousel.spec.ts`, `e2e/flipCard.spec.ts` and `e2e/odometer.spec.ts` that are about the barrel itself rather
 * than the control built on it — how each face is announced and hidden, which axis it turns about, when backs are
 * drawn, and the room it reserves — driven from a story that turns one face per press of "Next".
 */
const STORY = "Primitives/Barrel/Default";
const FACE = '[aria-roledescription="slide"]';
const SHOWN = `${FACE}:not([aria-hidden="true"])`;

const faceTransform = (page: Page, selector: string) =>
    page
        .locator(selector)
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

test("every face is a group announced by what the consumer calls it, and only the current one is reachable", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect(page.locator(FACE)).toHaveCount(8);
    await expect(page.locator(`${FACE}[role="group"]`)).toHaveCount(8);

    await expect(page.locator(SHOWN), "one face is in the accessibility tree").toHaveCount(1);
    await expect(page.locator(SHOWN)).toHaveAttribute("aria-label", "1 of 4");
    await expect(page.locator(SHOWN), "and it is neither hidden nor inert").not.toHaveAttribute("inert");

    const away = page.locator(`${FACE}[aria-hidden="true"]`);

    await expect(away.first(), "a face turned away is out of the tab order as well").toHaveAttribute("inert", "");
});

test("turning the barrel brings the next face round", async ({ page, mount }) => {
    await mount(STORY);

    const before = await faceTransform(page, `${FACE}[aria-label="1 of 4"]`);

    await page.getByTestId("next").click();

    await expect(page.locator(SHOWN)).toHaveAttribute("aria-label", "2 of 4");
    expect(await faceTransform(page, `${FACE}[aria-label="1 of 4"]`), "and the face that was current moved").not.toBe(
        before,
    );
});

test("a row barrel turns about the upright axis and a column barrel end over end", async ({ page, mount }) => {
    await mount(STORY);

    expect(await faceTransform(page, FACE), "on the upright axis by default").toContain("rotateY(");

    await mount(STORY, { axis: "column" });

    expect(await faceTransform(page, FACE), "and about the horizontal one once laid on its side").toContain("rotateX(");
});

test("a barrel of three faces or more draws backs, and the painter is told which side it draws", async ({
    page,
    mount,
}) => {
    await mount(STORY, { faceCount: 3 });

    await expect(page.locator(FACE)).toHaveCount(6);
    await expect(page.locator('[data-face="back"]')).toHaveCount(3);

    await mount(STORY, { faceCount: 2 });

    await expect(page.locator(FACE), "two faces already back to back need none").toHaveCount(2);
    await expect(page.locator('[data-face="back"]')).toHaveCount(0);

    await mount(STORY, { faceCount: 4, hasBacks: false });

    await expect(page.locator(FACE), "and the consumer can say otherwise").toHaveCount(4);
});

test("the barrel reserves more than one face along the way it turns, and one face across it", async ({
    page,
    mount,
}) => {
    const measure = () =>
        page.getByTestId("host").evaluate((host) => {
            const root = host.firstElementChild as HTMLElement;
            const face = root.querySelector('[aria-roledescription="slide"]') as HTMLElement;

            return {
                width: root.offsetWidth,
                height: root.offsetHeight,
                faceWidth: face.offsetWidth,
                faceHeight: face.offsetHeight,
            };
        });

    await mount(STORY);

    const row = await measure();

    expect(row.width, "room for the barrel's girth, perspective included").toBeGreaterThan(row.faceWidth);
    expect(row.height).toBe(row.faceHeight);

    await mount(STORY, { axis: "column" });

    const column = await measure();

    expect(column.height).toBeGreaterThan(column.faceHeight);
    expect(column.width).toBe(column.faceWidth);
});

test("a turn's duration and delay are written onto the faces only when given", async ({ page, mount }) => {
    const timing = () =>
        page
            .locator(FACE)
            .first()
            .evaluate((element) => ({
                duration: (element as HTMLElement).style.transitionDuration,
                delay: (element as HTMLElement).style.transitionDelay,
            }));

    await mount(STORY);

    expect(await timing()).toEqual({ duration: "", delay: "" });

    await mount(STORY, { transitionDurationMs: 400, transitionDelayMs: 50 });

    expect(await timing()).toEqual({ duration: "400ms", delay: "50ms" });
});

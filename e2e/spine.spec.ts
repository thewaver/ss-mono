import { expect, test } from "@playwright/test";

import { docsDemo, docsExample, docsSettled, prop } from "./helpers";

/**
 * `Spine` is a primitive, so its own page is docs only: a spine with nothing turning it has no use on its own, and
 * what turns one is the component built on it. Its geometry is checked here through the carousel's paddle wheel,
 * which is built from it — every slide is the carousel's whole box swung round a spine through the middle, spaced
 * evenly round a turn.
 *
 * The carousel Docs view's looks example has a placement picker and four slides, so the paddles stand a quarter turn
 * apart: the current one lies flat on the box, the next points straight at the viewer, the one after lies flat on the
 * other side, and the last points straight away. Each paddle paints only the half away from the spine, and what is measured is that painted half —
 * the face's first child — since the slide itself is always the whole box. It is read through the element's own
 * rect rather than Playwright's box, which reports nothing for an element seen exactly edge-on.
 */
const CAROUSEL_DOCS = "/src/App/Pages/Carousels/CarouselPage/Docs";
const LOOKS = docsDemo(CAROUSEL_DOCS, "Looks");
const LOOKS_EXAMPLE = docsExample(CAROUSEL_DOCS, "Looks");

const slide = `${LOOKS} [aria-roledescription="slide"]`;
const currentSlide = `${slide}:not([aria-hidden="true"])`;
const viewport = `${LOOKS} [aria-roledescription="carousel"] > div:first-child`;
const paintedWidth = (page: import("@playwright/test").Page, index: number) =>
    page
        .locator(slide)
        .nth(index)
        .locator(":scope > div:first-child > :first-child")
        .evaluate((element) => element.getBoundingClientRect().width);

const slideTransform = (page: import("@playwright/test").Page) =>
    page
        .locator(slide)
        .first()
        .evaluate((element) => (element as HTMLElement).style.transform);

const pickOption = async (page: import("@playwright/test").Page, key: string, name: string) => {
    const picker = page.locator(`${LOOKS_EXAMPLE} ${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

/** Every slide is named by its place among the slides, so a paddle's name is read off the first one's. */
const slideName = async (page: import("@playwright/test").Page, index: number) => {
    const count = /of (\d+)/.exec((await page.locator(slide).first().getAttribute("aria-label")) ?? "")?.[1];

    return `${index} of ${count}`;
};

test.beforeEach(async ({ page }) => {
    await page.goto("/carousel/docs");
    await expect(page.locator(viewport)).toBeVisible();
    await docsSettled(page);
    await pickOption(page, "placement", "paddle_wheel");
    await page.mouse.move(0, 0);
});

test("the spine's own page lists its two angle rules among its exports", async ({ page }) => {
    await page.goto("/spine/api");

    await expect(page.locator('[data-api-table="SpineUtils"] [data-api-row="radial"]')).toBeVisible();
    await expect(page.locator('[data-api-table="SpineUtils"] [data-api-row="leaves"]')).toBeVisible();
});

test("only the current paddle is in the accessibility tree, and the rest are out of reach", async ({ page }) => {
    await expect(page.locator(currentSlide), "exactly one paddle is the current one").toHaveCount(1);
    await expect(page.locator(currentSlide)).toHaveAttribute("aria-label", await slideName(page, 1));
    await expect(page.locator(`${slide}[aria-hidden="true"]`).first(), "the others are inert as well").toHaveAttribute(
        "inert",
        "",
    );
});

test("a paddle at rest lies exactly on the carousel's box", async ({ page }) => {
    const box = (await page.locator(viewport).boundingBox())!;
    const resting = (await page.locator(slide).first().boundingBox())!;

    expect(Math.abs(resting.x - box.x), "its left edge on the box's").toBeLessThan(1);
    expect(Math.abs(resting.width - box.width), "and as wide as the box").toBeLessThan(1);
});

test("the paddle lying flat is drawn wide, and the one pointing at the viewer is a sliver", async ({ page }) => {
    const flat = await paintedWidth(page, 0);
    const edgeOn = await paintedWidth(page, 1);

    expect(edgeOn, "seen edge-on, a paddle is far narrower than one facing the viewer").toBeLessThan(flat);
});

test("a step turns every paddle round the spine and moves the current one", async ({ page }) => {
    const before = await slideTransform(page);

    expect(before, "a paddle turns about the upright spine on a carousel running across").toContain("rotateY(");

    await page.locator(`${LOOKS} button[aria-label="Next slide"]`).click();

    await expect(page.locator(currentSlide), "the step lands on the next paddle").toHaveAttribute(
        "aria-label",
        await slideName(page, 2),
    );
    await expect
        .poll(() => slideTransform(page), { message: "and the paddles swung round to bring it flat" })
        .not.toBe(before);
    await expect(page.locator(currentSlide), "still exactly one paddle is reachable").toHaveCount(1);
});

test("on a carousel running up and down the paddles turn about a level spine", async ({ page }) => {
    await pickOption(page, "orientation", "vertical");

    expect(await slideTransform(page), "end over end, as a split-flap's flaps turn").toContain("rotateX(");
});

import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

const MENU = '[role="menu"]';
const WEDGE = '[aria-roledescription="wedge"]';

const numberField = (key: string) => `${prop(key)} input`;

const setField = async (page: Page, key: string, value: string) => {
    await page.locator(numberField(key)).fill(value);
    await page.locator(numberField(key)).blur();
};

/**
 * A layout carries no pixels, so the popup's size is the one the consumer chose and does not move when a
 * layout knob does. What does move is the shape drawn inside it, so the menu is asked for its first wedge
 * alongside its width: the width answers "is the box still the consumer's", and the item's own box answers
 * "did the knob reach this control at all". Neither is compared with a number — what is being asked is whether one
 * knob reached two controls, not what it was tuned to.
 */
const openedMenu = async (page: Page) => {
    await page.locator(`${demo("menu")} [aria-haspopup="menu"]`).click();
    await expect(page.locator(MENU)).toHaveCount(1);
    await expect(page.locator(MENU)).toBeFocused();

    const width = await page.locator(MENU).evaluate((menu) => (menu as HTMLElement).offsetWidth);
    const itemBox = await page
        .locator(`${MENU} [role="menuitem"]`)
        .first()
        .evaluate((item) => {
            const element = item as HTMLElement;

            return `${element.offsetLeft}x${element.offsetTop}x${element.offsetWidth}`;
        });

    await page.keyboard.press("Escape");
    await expect(page.locator(MENU)).toHaveCount(0);

    return { width, itemBox };
};

const firstWedgePath = (page: Page) =>
    page
        .locator(`${demo("wheel")} ${WEDGE} path`)
        .first()
        .getAttribute("d");

test.beforeEach(async ({ page }) => {
    await page.goto("/placement");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

test("one layout drives two controls that share nothing else", async ({ page }) => {
    await expect(page.locator(`${demo("menu")} [aria-haspopup="menu"]`), "a menu with a trigger").toHaveCount(1);
    await expect(page.locator(`${demo("wheel")} ${WEDGE}`), "and a wheel with a wedge per prize").toHaveCount(6);

    const narrowMenu = await openedMenu(page);
    const narrowWedge = await firstWedgePath(page);

    await setField(page, "bandWidth", "150");

    const wideMenu = await openedMenu(page);

    expect(wideMenu.itemBox, "widening the band moves the menu's own items").not.toBe(narrowMenu.itemBox);
    expect(wideMenu.width, "while the popup keeps the size its consumer gave it").toBe(narrowMenu.width);
    expect(await firstWedgePath(page), "and redraws the wheel's wedge, from the same knob").not.toBe(narrowWedge);
});

/**
 * An annulus needs two arcs — one out along the far edge and one back along the near one — while a wedge
 * with no hole closes on the centre and needs only the outer arc. Counting them asks whether the hole is
 * really gone from the drawn shape, which no colour or size can answer.
 */
const arcCount = (path: string | null) => (path ?? "").split(" A ").length - 1;

test("emptying the hole turns the band into a pie, in the shape rather than only in the numbers", async ({ page }) => {
    expect(arcCount(await firstWedgePath(page)), "a band is drawn out and back").toBe(2);

    await setField(page, "holeRadius", "0");

    expect(arcCount(await firstWedgePath(page)), "and a wedge with no hole closes on the centre instead").toBe(1);
});

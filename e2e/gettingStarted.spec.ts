import { expect, test } from "@playwright/test";

/**
 * Installing moved from About to a page of its own. What is checked is where the command lives, not what it says
 * word for word: the Getting started page carries an `npm install` of this framework's package, and About carries
 * none, so a reworded paragraph around either changes nothing here.
 */
const ABOUT = '[data-view="about"]';
const GETTING_STARTED = '[data-view="getting-started"]';
const INSTALL = /npm install @thewaver\/ss-components-/;

test("the install command is on Getting started, reached from the menu, and no longer on About", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(ABOUT)).toBeVisible();
    await expect(page.locator(ABOUT), "About no longer carries the install command").not.toContainText(INSTALL);

    await page.locator('nav a[href$="/getting-started"]').click();

    await expect(page.locator(GETTING_STARTED), "the menu link leads to the page").toBeVisible();
    await expect(page.locator(GETTING_STARTED), "which carries the install command").toContainText(INSTALL);
});

import { type Page, expect, test } from "@playwright/test";

/**
 * The Appearance page draws one row per Skin, each a radio whose samples are painted in that row's Skin whatever the page
 * around it wears, and picking a row applies its Skin to the whole Playground. The samples are a picture, not
 * controls. A row is found by the id the page gives it from its Skin's registry key, and what a Skin paints is never
 * written down: rows are compared with each other, and the page with the row it was switched to. Nor is the Skin the
 * Playground starts on: each test reads which row the page wears and picks the others from there.
 */
const SKINS = '[data-view="appearance"]';
const SAMPLES = `${SKINS} [aria-hidden="true"]`;
const ROW_ID_PREFIX = "skin-row-";

/** The Skin rows' radio group, apart from the Theme rows' group above it. */
const skinGroup = (page: Page) => page.locator(SKINS).getByRole("radiogroup", { name: "Skin", exact: true });

const row = (skin: string) => `#${ROW_ID_PREFIX}${skin}`;

/** The radio that picks a row: the row is what the radio paints, so the two share a parent. */
const rowRadio = (page: Page, skin: string) => page.locator(row(skin)).locator("xpath=..").getByRole("radio");

/** What the first button among a row's samples skins like: whatever a Skin may change about a button. */
const samplePaint = (page: Page, skin: string) =>
    page
        .locator(`${row(skin)} button > *`)
        .first()
        .evaluate((painter) => {
            const style = getComputedStyle(painter);

            return [
                style.fontFamily,
                style.backgroundColor,
                style.backgroundImage,
                style.boxShadow,
                style.color,
                style.borderColor,
            ].join("|");
        });

/** The classes of the element inside a row that carries the row's Skin, two levels in, past the boundary. */
const rowSkinClasses = (page: Page, skin: string) =>
    page.locator(`${row(skin)} > * > *`).evaluate((element) => [...element.classList]);

/** Whether the document root carries every one of those classes, which is what applying a Skin to the page does. */
const pageWears = (page: Page, classes: string[]) =>
    page.evaluate((tokens) => tokens.every((token) => document.documentElement.classList.contains(token)), classes);

/** Every row's Skin, in page order, split into the ones the page wears and the rest. */
const splitRows = async (page: Page) => {
    const skins = await page
        .locator(`${SKINS} [id^="${ROW_ID_PREFIX}"]`)
        .evaluateAll((rows, prefix) => rows.map((element) => element.id.slice(prefix.length)), ROW_ID_PREFIX);

    const worn: string[] = [];
    const others: string[] = [];

    for (const skin of skins) {
        ((await pageWears(page, await rowSkinClasses(page, skin))) ? worn : others).push(skin);
    }

    return { worn, others };
};

test.beforeEach(async ({ page }) => {
    await page.goto("/appearance");
    await expect(page.locator(SKINS).getByRole("radio").first()).toBeVisible();
});

test("a row's samples wear its own Skin, and keep it when the page changes Skin", async ({ page }) => {
    const { worn, others } = await splitRows(page);

    expect(worn, "the page wears exactly one row's Skin").toHaveLength(1);
    const [start] = worn;
    const startClasses = await rowSkinClasses(page, start);
    const startPaint = await samplePaint(page, start);

    let watched: string | undefined;

    for (const skin of others) {
        if ((await samplePaint(page, skin)) !== startPaint) {
            watched = skin;
            break;
        }
    }

    expect(watched, "some other row is drawn unlike the page's own").toBeDefined();

    const watchedPaint = await samplePaint(page, watched!);
    const picked = others.find((skin) => skin !== watched);

    expect(picked, "and a third row is left to pick").toBeDefined();

    await rowRadio(page, picked!).click();

    await expect.poll(() => pageWears(page, startClasses), "the page has left the Skin it started on").toBe(false);
    expect(await samplePaint(page, watched!), "and the watched row is drawn as it was").toBe(watchedPaint);
});

test("clicking a row applies its Skin to the page and checks its radio", async ({ page }) => {
    const {
        others: [skin],
    } = await splitRows(page);
    const radio = rowRadio(page, skin);
    const classes = await rowSkinClasses(page, skin);

    await expect(radio).not.toBeChecked();

    await radio.click();

    await expect(radio, "the row is picked").toBeChecked();
    await expect(skinGroup(page).getByRole("radio", { checked: true }), "and only that row").toHaveCount(1);
    await expect.poll(() => pageWears(page, classes), "the page wears the row's Skin").toBe(true);
});

test("nothing among the samples takes focus, by keyboard or from script", async ({ page }) => {
    const focusables = page.locator(`${SAMPLES} :is(button, input, textarea, [tabindex])`);

    expect(await focusables.count(), "the samples hold controls that would otherwise be focusable").toBeGreaterThan(0);

    await skinGroup(page).getByRole("radio", { checked: true }).focus();
    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => document.activeElement?.closest(selector) !== null, SAMPLES),
        "Tab leaves the group without stopping inside a row",
    ).toBe(false);

    const tookFocus = await focusables.evaluateAll((elements) =>
        elements.some((element) => {
            (element as HTMLElement).focus();

            return document.activeElement === element;
        }),
    );

    expect(tookFocus, "no sample accepts focus when asked for it").toBe(false);
});

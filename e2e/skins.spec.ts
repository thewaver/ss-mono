import { type Locator, type Page, expect, test } from "@playwright/test";

import { docsDemo, docsExample, docsSettled, prop, revealProp } from "./helpers";

/**
 * A Skin decides how the Playground's painters draw, as a Theme decides their colors, and it is picked from the
 * library settings the way a Theme is. Most of what a Skin does is paint, which nothing here checks; these specs
 * hold the few places where a Skin changed what a reader can rely on: that the select names a Skin, that a field's
 * typed text follows the field's own paint, that a switch's box still shows an error, that a list without a
 * floater still shows where the keyboard is, that the framework menu has a floater, and that the code view's tabs
 * stay put while only the code scrolls.
 *
 * Every check is a relationship rather than a color written down, so a second Skin keeps them true.
 */
const TRANSPARENT = "rgba(0, 0, 0, 0)";

const BUTTON_DOCS = "/src/App/Pages/ButtonPage/Docs";
const TEXT_INPUT_DOCS = "/src/App/Pages/TextInputPage/Docs";
const CHECKBOX_DOCS = "/src/App/Pages/CheckboxPage/Docs";
const MENUBAR_DOCS = "/src/App/Pages/MenubarPage/Docs";

const DIALOG = '[role="dialog"]';

/**
 * The wrapper a field's `<input>` shares with its painted box: the nearest ancestor with a direct child that draws a
 * border. The input is laid over the box rather than inside it, so the Skin paints the text on that wrapper and the
 * input inherits it, with nothing set on the input itself.
 */
const fieldWrapper = (input: Locator) =>
    input.evaluate((element) => {
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
            const holdsBox = [...parent.children].some(
                (child) => child !== element && getComputedStyle(child).borderTopStyle !== "none",
            );

            if (holdsBox) {
                const style = getComputedStyle(parent);

                return { color: style.color, fontSize: style.fontSize, caretColor: style.caretColor };
            }
        }

        return null;
    });

/** What a button's painter skins like right now, as one string: whatever a Skin may change when a state flips. */
const buttonPaint = (page: Page, demo: string) =>
    page
        .locator(`${demo} button > *`)
        .first()
        .evaluate((painter) => {
            const style = getComputedStyle(painter);

            return [style.backgroundColor, style.backgroundImage, style.boxShadow, style.color, style.borderColor].join(
                "|",
            );
        });

/** The box of a binary switch: the element in its demo that draws a solid border. */
const switchBoxBorder = (page: Page, demo: string) =>
    page.locator(demo).evaluate((root) => {
        const box = [...root.querySelectorAll("*")].find((element) => {
            const style = getComputedStyle(element);

            return style.borderTopStyle === "solid" && style.borderTopWidth !== "0px";
        });

        return box ? getComputedStyle(box).borderTopColor : null;
    });

/** Whether the item a popup's `aria-activedescendant` points at paints a background of its own anywhere inside. */
const activeItemIsTinted = (menu: Locator) =>
    menu.evaluate((element, transparent) => {
        const item = document.getElementById(element.getAttribute("aria-activedescendant") ?? "");

        if (!item) return false;

        return [item, ...item.querySelectorAll("*")].some(
            (part) => getComputedStyle(part).backgroundColor !== transparent,
        );
    }, TRANSPARENT);

test("the settings' Skin select names a Skin", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#libraryKnobs"), "the settings button is mounted").toBeVisible();
    await revealProp(page, "skin", "library");

    const selected = ((await page.locator(`${prop("skin")} [role="combobox"]`).textContent()) ?? "").trim();

    expect(selected.length, "the select shows the Skin the page is drawn in").toBeGreaterThan(0);
});

test("a field's typed text inherits its color, caret and size from the wrapper around its box", async ({ page }) => {
    await page.goto("/text-input/docs");
    await docsSettled(page);

    const input = page.locator(`${docsDemo(TEXT_INPUT_DOCS, "Basic")} input`).first();
    const wrapper = await fieldWrapper(input);

    expect(wrapper, "the field draws a box beside its input").not.toBeNull();
    expect(await input.evaluate((element) => element.style.color), "nothing sets the text's color inline").toBe("");
    await expect(input, "the text is the wrapper's color").toHaveCSS("color", wrapper!.color);
    await expect(input, "its caret").toHaveCSS("caret-color", wrapper!.caretColor);
    await expect(input, "and its size").toHaveCSS("font-size", wrapper!.fontSize);
});

test("a pressed toggle button is painted differently from an unpressed one", async ({ page }) => {
    await page.goto("/button/docs");
    await docsSettled(page);

    const demo = docsDemo(BUTTON_DOCS, "Basic");
    const before = await buttonPaint(page, demo);

    await page.locator(`${docsExample(BUTTON_DOCS, "Basic")} ${prop("isPressed")} input`).check();

    await expect(page.locator(`${demo} [aria-pressed="true"]`), "the library reports the state").toHaveCount(1);
    await expect.poll(() => buttonPaint(page, demo), "and the painter shows it").not.toBe(before);
});

test("a checkbox's box changes its border while the checkbox reports an error", async ({ page }) => {
    await page.goto("/checkbox/docs");
    await docsSettled(page);

    const demo = docsDemo(CHECKBOX_DOCS, "Basic");
    const before = await switchBoxBorder(page, demo);

    await page.locator(`${docsExample(CHECKBOX_DOCS, "Basic")} ${prop("hasError")} input`).check();

    await expect.poll(() => switchBoxBorder(page, demo), "the error shows on the box").not.toBe(before);
});

test("a menubar's menu, which has no floater, paints the item the keyboard reaches", async ({ page }) => {
    await page.goto("/menubar/docs");
    await docsSettled(page);

    const word = page
        .locator(
            `${docsDemo(MENUBAR_DOCS, "Basic")} [role="menubar"] > div:not([aria-hidden]) [role="menuitem"][aria-haspopup="menu"]:not([aria-label])`,
        )
        .first();

    await word.click();

    const menu = page.locator(`[role="menu"][aria-labelledby="${await word.getAttribute("id")}"]`);

    await expect(menu).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(menu).toBeFocused();
    await page.keyboard.press("ArrowDown");

    await expect.poll(() => activeItemIsTinted(menu), "the reached item is painted").toBe(true);
});

test("the framework menu shows a highlight floater on the item the keyboard reaches", async ({ page }) => {
    await page.goto("/");

    const trigger = page.locator('[aria-haspopup="menu"]').first();

    await trigger.click();

    const menu = page.locator(`[role="menu"][aria-labelledby="${await trigger.getAttribute("id")}"]`);

    await expect(menu).toHaveAttribute("aria-activedescendant", /.+/);
    await expect(menu).toBeFocused();
    await page.keyboard.press("ArrowDown");

    await expect(menu.locator('[data-floater="highlight"]'), "a floater marks the item").toHaveCSS("opacity", "1");
});

test("the code view's tabs stay put while only the code beneath them scrolls", async ({ page }) => {
    await page.goto("/surface");
    await page.locator("#cardSource").click();

    const tab = page.locator(`${DIALOG} [role="tab"]`).first();

    await expect(tab, "the source arrives after the modal, so the tabs are the ready signal").toBeVisible();

    const scroll = () =>
        page.locator(DIALOG).evaluate((dialog) => {
            const scroller = [...dialog.querySelectorAll("*")].find(
                (element) =>
                    getComputedStyle(element).overflowY === "auto" && element.scrollHeight > element.clientHeight,
            );
            const tabs = dialog.querySelector('[role="tablist"]');

            if (!scroller || !tabs) return null;

            const before = tabs.getBoundingClientRect().top;

            scroller.scrollTop = scroller.scrollHeight;

            return {
                scrolled: scroller.scrollTop > 0,
                holdsTabs: scroller.contains(tabs),
                tabsMoved: tabs.getBoundingClientRect().top !== before,
            };
        });

    await expect.poll(scroll, "the code overflows its view").not.toBeNull();

    const result = await scroll();

    expect(result!.scrolled, "the code scrolled").toBe(true);
    expect(result!.holdsTabs, "the scrolling box is not the one holding the tabs").toBe(false);
    expect(result!.tabsMoved, "and the tabs did not move").toBe(false);
});

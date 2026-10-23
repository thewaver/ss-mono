import { type Page, expect, test } from "@playwright/test";

import { activeDescendantText, demo, inputValue, readout } from "./helpers";

const DIALOG = '[role="dialog"]';
const FIELD = `${DIALOG} [role="combobox"]`;
const OPTION = `${DIALOG} [role="listbox"] [role="option"]`;
const TREE_BRANCH = '#library-menu [role="treeitem"][aria-expanded]';

/**
 * Every shortcut the Playground and its palette page register. They are written here as Playwright spells them, not
 * as the palette draws them: `ControlOrMeta` is the library's `"mod"`, Command on a Mac and Control elsewhere, so the
 * same line presses the right key whichever machine runs the suite.
 */
const OPEN_APP_PALETTE = "ControlOrMeta+K";
const GO_TO_ABOUT = "Alt+Shift+H";
const COLLAPSE_ALL = "Alt+Shift+C";
const EXPAND_ALL = "Alt+Shift+E";
const ADD_NOTE = "Alt+Shift+N";
const REMOVE_NOTE = "Alt+Shift+R";
const BARE_LETTER = "g";

/**
 * Opening is two things that land in either order — the dialog mounting and focus reaching its search field — and a
 * key typed between them goes to whatever held focus before. So every case that types into the palette waits on both.
 */
const waitUntilOpen = async (page: Page) => {
    await expect(page.locator(DIALOG), "the palette opens").toBeVisible();
    await expect(page.locator(FIELD), "with focus in its search field").toBeFocused();
};

/** Each palette example's opener carries the id `<example key>OpenPalette`. */
const openFromButton = async (page: Page, key: string) => {
    await page.locator(`#${key}OpenPalette`).click();
    await waitUntilOpen(page);
};

/**
 * Each example says how many times its actions have run, and that number is the only thing a shortcut changes; a
 * count read before a key and again after it is how a spec tells a shortcut that fired from one that stayed quiet.
 */
const readCount = async (page: Page, key: string, label: string) =>
    Number(new RegExp(`${label}: (\\d+)`).exec(await readout(page, key))?.[1]);

/**
 * The action an example last ran, as its readout names it. An option draws its shortcut beside its name, so the
 * option's text holds the action's name rather than equaling it, and that is what a pick is checked by.
 */
const lastRunOf = async (page: Page, key: string) =>
    /last run: (.+?) —/.exec(await readout(page, key))?.[1] ?? "(no readout)";

const notesOf = (page: Page) => readCount(page, "actionShortcuts", "notes");

const greetingsOf = (page: Page) => readCount(page, "bareLetter", "greetings");

test.describe("on its own page", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/command-palette");
        await expect(page.locator("[data-example]").first()).toBeVisible();
    });

    test("a closed palette is not in the tree", async ({ page }) => {
        await expect(page.locator(DIALOG), "nothing is open yet").toHaveCount(0);
    });

    /**
     * Listing an action's shortcut is a promise that the shortcut works, so it works while the palette is on the page,
     * open or not. The notes count is the action's only trace, and the dialog staying absent is what says the palette
     * was never opened along the way.
     */
    test("an action's shortcut runs it while the palette is closed", async ({ page }) => {
        const before = await notesOf(page);

        await page.keyboard.press(ADD_NOTE);
        await expect.poll(() => notesOf(page), "the add action ran").toBe(before + 1);

        await page.keyboard.press(ADD_NOTE);
        await expect.poll(() => notesOf(page), "and runs again on a second press").toBe(before + 2);

        await page.keyboard.press(REMOVE_NOTE);
        await expect.poll(() => notesOf(page), "and another action's shortcut runs that one").toBe(before + 1);

        await expect(page.locator(DIALOG), "all without the palette opening").toHaveCount(0);
    });

    /**
     * A shortcut belongs to the layer it was registered from, so one registered by the page stays quiet while a
     * dialog is on top of it. The add-note shortcut is pressed with a different palette open — the same key that ran
     * the action in the case above — and the Playground's own palette shortcut is pressed there too: neither the
     * action runs nor a second dialog opens.
     */
    test("page shortcuts stay quiet while a modal is open", async ({ page }) => {
        const before = await notesOf(page);

        await openFromButton(page, "default");

        await page.keyboard.press(ADD_NOTE);
        await page.keyboard.press(OPEN_APP_PALETTE);

        await expect(page.locator(DIALOG), "the frame's palette shortcut did not open a second dialog").toHaveCount(1);
        await expect(page.locator(FIELD), "and focus stayed in the open palette").toBeFocused();

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "Escape closes the palette").toHaveCount(0);

        expect(await notesOf(page), "and the add action never ran underneath it").toBe(before);

        await page.keyboard.press(ADD_NOTE);
        await expect
            .poll(() => notesOf(page), "with the dialog gone, the same shortcut runs it again")
            .toBe(before + 1);
    });

    /**
     * WCAG 2.1.4: a shortcut of a single character must not fire while a person is typing. The same letter is pressed
     * twice — once with focus on the page, where it runs the action, and once in a text field, where it is a letter
     * and nothing more.
     */
    test("a bare-letter shortcut stays quiet in a text field", async ({ page }) => {
        const field = page.locator(`${demo("bareLetter")} input`);
        const before = await greetingsOf(page);

        await page.keyboard.press(BARE_LETTER);
        await expect.poll(() => greetingsOf(page), "pressed on the page, the letter runs its action").toBe(before + 1);

        await field.click();
        await page.keyboard.type(BARE_LETTER);

        expect(await inputValue(field), "typed in a field, it is a letter like any other").toBe(BARE_LETTER);
        expect(await greetingsOf(page), "and the action did not run").toBe(before + 1);
    });

    /** The other half of WCAG 2.1.4: a single-character shortcut can be turned off, and then nothing answers it. */
    test("a bare-letter shortcut turned off does nothing", async ({ page }) => {
        const before = await greetingsOf(page);

        await page.locator("#bareLetterToggleShortcut").click();
        await page.locator("main").click({ position: { x: 1, y: 1 } });
        await page.keyboard.press(BARE_LETTER);

        expect(await greetingsOf(page), "the letter runs nothing once its shortcut is off").toBe(before);
    });

    test("picking a result with the pointer runs it and closes the palette", async ({ page }) => {
        await openFromButton(page, "default");

        const option = page.locator(OPTION).first();
        const picked = ((await option.textContent()) ?? "").trim();

        await option.click();

        await expect(page.locator(DIALOG), "picking closes the palette").toHaveCount(0);
        expect(picked, "and the action picked is the one that ran").toContain(await lastRunOf(page, "default"));
    });

    /**
     * The query is the consumer's to filter by, and typing clears the highlight, so the pick is made the way a
     * keyboard user makes it: type, arrow onto the first match, Enter. The action is read off the highlight rather
     * than written down, and it runs exactly once.
     */
    test("picking a result from the keyboard runs it and closes the palette", async ({ page }) => {
        const before = await notesOf(page);

        await openFromButton(page, "actionShortcuts");

        await page.keyboard.type("add");
        await page.keyboard.press("ArrowDown");
        await expect(page.locator(FIELD), "an arrow puts the highlight on a match").toHaveAttribute(
            "aria-activedescendant",
            /.+/,
        );

        const highlighted = await activeDescendantText(page, FIELD);

        await page.keyboard.press("Enter");

        await expect(page.locator(DIALOG), "Enter closes the palette").toHaveCount(0);
        expect(highlighted, "and runs the highlighted action").toContain(await lastRunOf(page, "actionShortcuts"));
        expect(await notesOf(page), "once").toBe(before + 1);
    });
});

/**
 * The Playground frame mounts a palette of its own on every page: `mod+K` opens it, a few view commands carry
 * shortcuts that run without it, and every page in the menu is an entry. Pages are found by their routes, never by
 * the menu's captions.
 */
test.describe("the Playground's own palette", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/tabs");
        await expect(page.locator("[data-example]").first()).toBeVisible();
    });

    test("its shortcut opens it on any page", async ({ page }) => {
        await page.keyboard.press(OPEN_APP_PALETTE);
        await waitUntilOpen(page);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG)).toHaveCount(0);

        await page.goto("/");
        await expect(page.locator("main")).toBeVisible();

        await page.keyboard.press(OPEN_APP_PALETTE);
        await waitUntilOpen(page);
    });

    test("an action's shortcut goes to the About page", async ({ page }) => {
        await page.keyboard.press(GO_TO_ABOUT);

        await expect.poll(() => new URL(page.url()).pathname, "the About page is the root route").toBe("/");
        await expect(page.locator(DIALOG), "without the palette opening").toHaveCount(0);
    });

    /**
     * The menu's folders are read by their expanded state, which every folder carries and no page does, so the
     * check is that none is left the other way — never how many folders the menu has.
     */
    test("an action's shortcut collapses every menu folder, and another expands them all", async ({ page }) => {
        const branches = page.locator(TREE_BRANCH);
        const open = page.locator(`${TREE_BRANCH}[aria-expanded="true"]`);
        const closed = page.locator(`${TREE_BRANCH}[aria-expanded="false"]`);

        await expect(open.first(), "the folders leading to the current page start open").toBeAttached();

        await page.keyboard.press(COLLAPSE_ALL);
        await expect(open, "collapsing leaves no folder open").toHaveCount(0);
        await expect(branches.first(), "while the top-level folders are still there").toBeAttached();

        await page.keyboard.press(EXPAND_ALL);
        await expect(closed, "expanding leaves no folder closed").toHaveCount(0);
        await expect(open.first(), "and the folders are there, open").toBeAttached();
    });

    test("picking a page's entry goes to that page and closes the palette", async ({ page }) => {
        await page.keyboard.press(OPEN_APP_PALETTE);
        await waitUntilOpen(page);

        await page.keyboard.type("Scroller");
        await page
            .locator(DIALOG)
            .getByRole("option", { name: /Scroller$/ })
            .click();

        await expect(page.locator(DIALOG), "picking closes the palette").toHaveCount(0);
        await expect.poll(() => new URL(page.url()).pathname, "and lands on the picked page").toMatch(/^\/scroller/);
    });
});

/**
 * The register warns about a shortcut made of a single character, which WCAG 2.1.4 asks to be possible to turn off
 * or remap, and about one shortcut registered twice on one layer, where only the later fires. Each warning begins
 * with "Shortcut", the library's own word, which is how they are told from anything else in the console. A warning
 * prints once per page load, so each case listens before it loads the page.
 */
test.describe("the register's warnings", () => {
    const listenForShortcutWarnings = (page: Page) => {
        const warnings: string[] = [];

        page.on("console", (message) => {
            if (message.type() === "warning" && message.text().startsWith("Shortcut ")) warnings.push(message.text());
        });

        return warnings;
    };

    test("the palette page warns about its bare letter and nothing else", async ({ page }) => {
        const warnings = listenForShortcutWarnings(page);

        await page.goto("/command-palette");
        await expect(page.locator("[data-example]").first()).toBeVisible();
        await expect
            .poll(() => warnings.length, "the bare-letter example's shortcut is warned about")
            .toBeGreaterThan(0);

        expect(warnings, "and it is the only warning, so no shortcut on the page is registered twice").toHaveLength(1);
        expect(warnings[0], "naming the shortcut it is about").toContain(`"${BARE_LETTER}"`);
    });

    test("the Playground's own palette registers nothing a warning is owed for", async ({ page }) => {
        const warnings = listenForShortcutWarnings(page);

        await page.goto("/tabs");
        await expect(page.locator("[data-example]").first()).toBeVisible();
        await page.keyboard.press(OPEN_APP_PALETTE);
        await waitUntilOpen(page);

        expect(warnings, "every one of its shortcuts is registered once, and none is a bare character").toEqual([]);
    });
});

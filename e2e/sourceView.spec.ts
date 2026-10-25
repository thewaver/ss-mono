import { expect, test } from "@playwright/test";

const DIALOG = '[role="dialog"]';
const TAB = `${DIALOG} [role="tab"]`;
const SECTION_HEADER = `${DIALOG} h3 button`;
const CODE = `${DIALOG} .shiki`;

/**
 * The source view is the one part of the Playground that reads its own repository at runtime: it fetches
 * the example's file, follows the imports it can resolve inside `src/Playground`, and turns each of them
 * into a tab. Nothing about that is checkable from the module graph, because the resolution happens from
 * the raw text — so the only honest check is to open the modal and look at what came back.
 */
const openSource = async (page: import("@playwright/test").Page, key: string) => {
    await page.locator(`#${key}Source`).click();
    await expect(page.locator(DIALOG)).toBeVisible();
    await expect(
        page.locator(TAB).first(),
        "the source arrives after the modal, so the tabs are the ready signal",
    ).toBeVisible();
};

const tabNames = (page: import("@playwright/test").Page) => page.locator(TAB).allTextContents();

test("a tab appears for the example and for every Playground file it imports", async ({ page }) => {
    await page.goto("/surface");
    await openSource(page, "card");

    const names = await tabNames(page);

    expect(names[0], "the example's own file is the first tab").toBe("Card");
    expect(
        names,
        "its own stylesheet is not one, because that file is a section of the example's folder",
    ).not.toContain("Card.css");
    expect(names, "and neither is the theme, even though this example imports it by name").not.toContain("Theme");
    await expect(page.locator(CODE).first(), "the first section is open with the file highlighted").toBeVisible();
});

test("a file reached only through a displayed sibling is not followed", async ({ page }) => {
    await page.goto("/surface");
    await openSource(page, "avatar");

    const names = await tabNames(page);

    expect(names[0], "the example's own file is still the first tab").toBe("Avatar");
    expect(names, "the stylesheet it imports is a section of its own folder rather than a tab").not.toContain(
        "Avatar.css",
    );
    expect(names, "and the defs registry it draws from ships in the library now, so it is opaque").not.toContain(
        "SVGDefs",
    );
});

test("the sections of a tab are the imported file plus its style and type siblings @solid @react", async ({ page }) => {
    await page.goto("/surface");
    await openSource(page, "card");

    const sections = await page.locator(SECTION_HEADER).allTextContents();

    expect(
        sections.map((text) => text.replace("▶", "").trim()),
        "the folder is listed as sections",
    ).toEqual(["Card.tsx", "Card.css.ts"]);
});

test("the sections of a tab are the imported file plus its style and type siblings @svelte", async ({ page }) => {
    await page.goto("/surface");
    await openSource(page, "card");

    const sections = await page.locator(SECTION_HEADER).allTextContents();

    expect(
        sections.map((text) => text.replace("▶", "").trim()),
        "the folder is listed as sections",
    ).toEqual(["Card.svelte", "Card.css.ts"]);
});

test("the sections of a tab are the imported file plus its style and type siblings @vue", async ({ page }) => {
    await page.goto("/surface");
    await openSource(page, "card");

    const sections = await page.locator(SECTION_HEADER).allTextContents();

    expect(
        sections.map((text) => text.replace("▶", "").trim()),
        "the folder is listed as sections",
    ).toEqual(["Card.vue", "Card.css.ts"]);
});

test("a sample gets no tab, and neither does the registry it lives in", async ({ page }) => {
    await page.goto("/shape");
    await openSource(page, "default");

    const names = await tabNames(page);

    expect(names[0], "the example is still first").toBe("Default");
    expect(names, "the page's own types and stylesheet resolve as one more folder").toContain("ShapePage");
    expect(names, "the registry the example imports arrives by package name and stays opaque").not.toContain("SVGDefs");
    expect(
        names.filter((name) => name.includes("/")),
        "and nothing is resolved from a props-panel key any more, which is what the qualified names were",
    ).toEqual([]);
});

/**
 * Which of the page's own files the example pulls in is the example's business and changes as it is reworked, so the
 * folder tab is checked against the example's own source rather than against a list written down here: every
 * `ShapePage.*` module the example imports is a section, and nothing else is.
 */
test("switching tabs replaces the sections and closing the modal needs no source button", async ({ page }) => {
    await page.goto("/shape");
    await openSource(page, "default");

    const exampleSource = (await page.locator(CODE).first().textContent()) ?? "";
    const imported = [
        ...new Set([...exampleSource.matchAll(/ShapePage\.(\w+)["']/g)].map((match) => `ShapePage.${match[1]}.ts`)),
    ];

    expect(imported.length, "the example imports something of its page's own").toBeGreaterThan(0);

    await page.locator(TAB, { hasText: "ShapePage" }).first().click();

    const sections = (await page.locator(SECTION_HEADER).allTextContents()).map((text) => text.replace("▶", "").trim());

    expect(sections.toSorted(), "the page's own folder is listed now, exactly the files the example imports").toEqual(
        imported.toSorted(),
    );

    await page.keyboard.press("Escape");
    await expect(page.locator(DIALOG), "and Escape still closes the modal").toHaveCount(0);
});

/**
 * Every card's source button draws the same mark, so a name that only said "source code" would read out identically
 * for every example on the page, and a screen reader listing the buttons could not tell them apart. Each one is named
 * for its own example instead. The title is read off the card — the text of the element the button sits beside — and
 * the trailing punctuation the caption ends on is dropped, so what is asserted is that the two agree, not what either
 * says.
 */
test("every source button is named for the example it belongs to", async ({ page }) => {
    await page.goto("/surface");
    await expect(page.locator("[data-example]").first()).toBeVisible();

    const buttons = page.locator('[data-example] [id$="Source"]');
    const count = await buttons.count();

    expect(count, "the page has source buttons to check").toBeGreaterThan(1);

    for (let index = 0; index < count; index++) {
        const button = buttons.nth(index);
        const title = await button.evaluate((element) => {
            const card = element.closest("[data-example]");

            for (let node = element.parentElement; node && node !== card; node = node.parentElement) {
                const text = [...node.childNodes]
                    .filter((child) => child.nodeType === Node.TEXT_NODE)
                    .map((child) => child.textContent ?? "")
                    .join("")
                    .trim();

                if (text) return text.replace(/[^\p{L}\p{N}]+$/u, "");
            }

            return "";
        });

        expect(title, "the card the button sits in has a title").not.toBe("");
        await expect(button, "the button's name carries that title").toHaveAccessibleName(
            new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        );
    }
});

/**
 * The tab strip scrolls when its tabs overrun it, and the pair of step buttons beside it is built on the strip's
 * controller and shown only while there is somewhere to scroll — a pair that could do nothing is left out rather than
 * drawn dead. Each step button names the box it scrolls through `aria-controls`, which is how it is told from the tabs
 * and the section headers, whose `aria-controls` name panels. Whether a given example's tabs overrun depends on how
 * many files it imports, so every source button on the page is opened and the pair is checked against the strip's own
 * overflow each time, never against a written-down answer.
 */
test("the tab strip's step buttons are there exactly while the strip has somewhere to scroll", async ({ page }) => {
    await page.goto("/shape");
    await expect(page.locator("[data-example]").first()).toBeVisible();

    const keys = await page
        .locator('[data-example] [id$="Source"]')
        .evaluateAll((buttons) => buttons.map((button) => button.id.replace(/Source$/, "")));

    expect(keys.length, "the page has source buttons to open").toBeGreaterThan(0);

    for (const key of keys) {
        await openSource(page, key);

        const strip = await page.locator(DIALOG).evaluate((dialog) => {
            const tablist = dialog.querySelector('[role="tablist"]')!;
            let box = tablist.parentElement;

            while (box && box !== dialog && getComputedStyle(box).overflowX === "visible") box = box.parentElement;

            const steppers = [...dialog.querySelectorAll("button[aria-controls]")].filter((button) =>
                document.getElementById(button.getAttribute("aria-controls") ?? "")?.contains(tablist),
            );

            return {
                overflows: box !== null && box.scrollWidth > box.clientWidth,
                stepperCount: steppers.length,
            };
        });

        expect(strip.stepperCount, `in ${key}'s source, a pair while the strip scrolls and none while it fits`).toBe(
            strip.overflows ? 2 : 0,
        );

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG)).toHaveCount(0);
    }
});

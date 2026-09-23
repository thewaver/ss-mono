import { type Page, expect, test } from "@playwright/test";

import { demo, prop } from "./helpers";

const LEGEND = demo("defaultTags");
const DIFF = demo("customTags");
const FIELD = `${demo("customInput")} textarea`;
const PREVIEW = "#customInputPreview";

const TAG_NAMES = ["bold", "italic", "strikethrough", "underlined", "an item"];

/**
 * `RichTextUtils.parseContent` is unit-tested, so the tree the parser builds is already pinned by name.
 * What nothing reached until this file is the other half: that a run ends up carrying the class it was
 * mapped to. A run that parsed correctly and then arrived with no class on it looks, from the parser's
 * side, exactly like one that worked.
 *
 * **What the component promises is the mapping, not the paint, and only the mapping is asserted here.**
 * Nothing reads a computed style. A spec that pins a weight, a decoration or a color cannot tell a
 * restyle from a break — both arrive as the same red — so it reports one every time somebody changes their
 * mind about how a thing looks. The mapping has no such ambiguity: a run either came back carrying the
 * class it was mapped to or it did not, and that stays answerable however the class is drawn.
 */
const paintedRuns = (page: Page, selector: string) =>
    page.evaluate((value) => {
        return [...document.querySelectorAll(`${value} span`)].map((element) => ({
            text: (element.textContent ?? "").trim(),
            className: element.className,
            isNested: element.parentElement?.tagName === "SPAN",
        }));
    }, selector);

test.beforeEach(async ({ page }) => {
    await page.goto("/rich-text");
    await expect(page.locator("[data-example]").first()).toBeVisible();
});

/**
 * The legend writes each default tag out as the characters you would type, then paints the same word beside
 * it. Both cells contain the word, and the painted one is the cell where a class landed — which is what
 * separates them without anyone having to say what the class draws. The five words are the page's fixture
 * rather than its prose: they are the data the legend is built from, in the way an option named "Denmark"
 * is data.
 */
test("each of the five default tags comes back carrying a class of its own", async ({ page }) => {
    const runs = await paintedRuns(page, LEGEND);
    const painted = TAG_NAMES.map((name) => runs.find((run) => run.text === name && run.className !== ""));

    expect(painted.filter(Boolean), "every tag in the legend reached a class").toHaveLength(TAG_NAMES.length);
    expect(
        new Set(painted.map((run) => run!.className)).size,
        "and no two share one, so the map is a lookup per tag rather than one class for anything recognized",
    ).toBe(TAG_NAMES.length);
});

/**
 * The custom-tags example is the only thing on the page that reaches `computeClassNames`, and an inline diff
 * is what it paints: two tags the library has never heard of, `[add]` and `[sub]`, each given a class by the
 * page. What makes it worth asserting rather than eyeballing is that a map which silently failed to arrive
 * would still render every word in the right order — the sentence would simply come out flat.
 */
test("a tag the consumer named is painted with the class the consumer gave it", async ({ page }) => {
    const runs = await paintedRuns(page, DIFF);

    const deleted = runs.find((run) => run.text === "the library's");
    const inserted = runs.find((run) => run.text === "the consumer's");

    expect(deleted, "the deleted run is its own element").toBeDefined();
    expect(inserted, "and so is the inserted one").toBeDefined();

    expect(deleted!.className, "the deletion came back with a class on it").not.toBe("");
    expect(inserted!.className, "and so did the insertion").not.toBe("");
    expect(
        inserted!.className,
        "and they are not the same class, so [add] and [sub] were looked up separately rather than both falling through",
    ).not.toBe(deleted!.className);
});

/**
 * The page hands back the default map plus its own two entries. Spreading is the consumer's decision rather
 * than the component's, so what would break quietly is a page returning only its own two — the diff would
 * still paint, and every default tag on that example would stop.
 */
test("naming two tags of your own does not take the default ones away", async ({ page }) => {
    const legendRuns = await paintedRuns(page, LEGEND);
    const diffRuns = await paintedRuns(page, DIFF);

    const legendBold = legendRuns.find((run) => run.text === "bold" && run.className !== "");
    const bolded = diffRuns.find((run) => run.isNested && run.text === "two tags of its own");
    const wrapping = diffRuns.find((run) => !run.isNested && run.text === "two tags of its own");

    expect(bolded, "the [b] inside the [add] run is its own element").toBeDefined();
    expect(
        bolded!.className,
        "carrying the very class the legend's [b] carries, which is the default entry surviving the page's spread",
    ).toBe(legendBold!.className);

    expect(wrapping, "wrapped by the [add] run").toBeDefined();
    expect(wrapping!.className, "which kept a class of its own rather than being replaced by the default").not.toBe(
        bolded!.className,
    );
});

/**
 * The map belongs to the one call site that supplied it. `[add]` is a tag anywhere on the page — the parser
 * has no vocabulary and never did — but only the diff example has a class for it, so anywhere else it is a
 * tag with nothing to paint it, and prints its own brackets.
 */
test("a class map reaches the example that supplied it and nothing else", async ({ page }) => {
    await page.locator(FIELD).fill("An [add]inserted[/add] word.");

    await expect(
        page.locator(PREVIEW),
        "the free-typing example was given no class for [add], so the brackets stay on screen",
    ).toHaveText("An [add]inserted[/add] word.");
});

test("an unrecognized tag is printed as typed, or dropped, on the consumer's word", async ({ page }) => {
    await expect(page.locator(PREVIEW), "with the switch off the brackets are part of the text").toContainText(
        "[warning]unknown tag[/warning]",
    );

    await page.locator(`${prop("removeOtherTags")} input`).check();

    await expect(page.locator(PREVIEW), "with it on the brackets go").not.toContainText("[warning]");
    await expect(page.locator(PREVIEW), "and the words that were inside them stay").toContainText("unknown tag");
});

/**
 * A tag that is opened and never closed is not a painting question at all — the parser hands it back as the
 * characters it was typed as, so both settings show the same thing. Worth pinning here as well as in the unit
 * test, because what it guards against is a run that quietly swallows the rest of the string.
 */
test("an unclosed tag is text under either setting", async ({ page }) => {
    await expect(page.locator(PREVIEW), "the brackets are printed and the sentence after them survives").toContainText(
        "[b]unclosed one is printed the way it was typed.",
    );

    await page.locator(`${prop("removeOtherTags")} input`).check();

    await expect(
        page.locator(PREVIEW),
        "dropping unrecognized tags cannot reach it, because it is not a tag",
    ).toContainText("[b]unclosed one is printed the way it was typed.");
});

/**
 * The whole point of a bracketed vocabulary is that the string never becomes markup. Angle brackets are
 * ordinary characters to this parser, so they have to survive to the screen as characters — what this guards
 * against is the failure that would turn a component like this into an injection route.
 */
test("markup in the string arrives as text and not as elements", async ({ page }) => {
    await page.locator(FIELD).fill("A <b>tag</b> and an <img src='x'> in the text.");

    await expect(page.locator(PREVIEW), "the angle brackets are printed").toHaveText(
        "A <b>tag</b> and an <img src='x'> in the text.",
    );
    await expect(page.locator(`${PREVIEW} b`), "and nothing was parsed into an element").toHaveCount(0);
    await expect(page.locator(`${PREVIEW} img`), "including one that would have made a request").toHaveCount(0);
});

const GLOSSARY = demo("glossary");
const LINKS = demo("links");
const TERM = `${GLOSSARY} span[tabindex="0"]`;
const TOOLTIP = '[role="tooltip"]';

const describingTip = (page: Page, index: number) =>
    page.evaluate(
        (args) => {
            const term = document.querySelectorAll(args.selector)[args.index];
            const ids = term?.getAttribute("aria-describedby")?.split(/\s+/) ?? [];
            const tooltip = ids
                .map((id) => document.getElementById(id))
                .find((element) => element?.getAttribute("role") === "tooltip");

            return tooltip ? (tooltip.textContent ?? "").trim() : null;
        },
        { selector: TERM, index },
    );

/**
 * A `[term tip="…"]` is drawn by the page's `renderTag` as a focusable word with a `Tooltip` on it. What a
 * person can do with it is reach it — by pointer and by Tab — and have the tip announced, which is the anchor's
 * `aria-describedby` pointing at a live tooltip. The tip's words are the attribute's value, so the check is that
 * the attribute stayed out of the prose and reached the tooltip, not what the tip says.
 *
 * Each term is read through the tooltip it points at rather than through "the tooltip on the page": while one
 * fades out the next is already in, so for a moment there are two.
 */
test("a glossary term is a word you can tab to, and its tip is announced when you do", async ({ page }) => {
    await expect(page.locator(TERM), "both terms in the passage became focusable words").toHaveCount(2);
    await expect(page.locator(GLOSSARY), "and neither tag's attribute leaked into the prose").not.toContainText("tip=");
    await expect(page.locator(TOOLTIP), "nothing is announced before anything is reached").toHaveCount(0);

    await page.locator(TERM).first().focus();

    await expect
        .poll(() => describingTip(page, 0), { message: "the focused term is described by its tip" })
        .toBeTruthy();

    await page.keyboard.press("Tab");

    await expect(page.locator(TERM).nth(1), "Tab moves from one term to the next").toBeFocused();
    await expect
        .poll(() => describingTip(page, 1), { message: "and the next term's tip is announced in its turn" })
        .toBeTruthy();
    await expect(page.locator(TERM).nth(1), "with focus still on that term once its tip is up").toBeFocused();

    const tip = (await describingTip(page, 1))!;

    expect(
        await page.locator(GLOSSARY).evaluate((element, value) => element.textContent!.includes(value), tip),
        "and the tip's text is the attribute, not a copy of the prose",
    ).toBe(false);
});

test("hovering a glossary term shows its tip, and each term carries its own", async ({ page }) => {
    const tips: string[] = [];

    for (let index = 0; index < 2; index++) {
        await page.locator(TERM).nth(index).hover();
        await expect
            .poll(() => describingTip(page, index), { message: `hovering term ${index + 1} shows its tip` })
            .toBeTruthy();

        tips.push((await describingTip(page, index))!);
    }

    expect(tips[0], "the two terms carry different tips, so each attribute went to its own tag").not.toBe(tips[1]);
});

/**
 * `renderTag` hands its children over as a function, so a tag inside a term goes through the same `renderTag`
 * and class map as any other. The `[i]` inside the second term therefore carries the very class the legend's
 * `[i]` carries — which is the default map surviving a tag the page draws itself.
 */
test("a tag nested inside a glossary term is still painted", async ({ page }) => {
    const legendItalic = (await paintedRuns(page, LEGEND)).find((run) => run.text === "italic" && run.className !== "");
    const nested = await page.evaluate((selector) => {
        const inner = document.querySelectorAll(selector)[1]?.querySelector("span");

        return inner ? { className: inner.className, text: (inner.textContent ?? "").trim() } : null;
    }, TERM);

    expect(nested, "the second term holds a run of its own").not.toBeNull();
    expect(nested!.className, "carrying the class the legend's [i] carries").toBe(legendItalic!.className);
    await expect(page.locator(GLOSSARY), "and no bracket of it is left on screen").not.toContainText("[i]");
});

/**
 * The Links example accepts only addresses that start `https://`, `/` (and not `//`) or `#`, and hands every
 * other tag back to the component, which prints it as typed. So each link the page drew carries an address of
 * one of those kinds, the `javascript:` one is no element at all, and its markup is on the screen exactly once.
 */
test("allowed addresses become links, and a javascript: address prints as typed", async ({ page }) => {
    const links = page.locator(`${LINKS} a`);
    const hrefs = await links.evaluateAll((elements) => elements.map((element) => element.getAttribute("href") ?? ""));

    expect(hrefs.length, "the passage's three safe links were drawn").toBe(3);

    for (const href of hrefs) {
        expect(href, "each drawn link carries an address of an accepted kind").toMatch(/^(https:\/\/|\/(?!\/)|#)/);
    }

    await expect(page.locator(`${LINKS} a[href^="javascript"]`), "the unsafe address became no link").toHaveCount(0);
    await expect(page.locator(LINKS), "its markup is printed as it was typed").toContainText(
        '[a href="javascript:alert(1)"]this one[/a]',
    );
    expect(
        ((await page.locator(LINKS).textContent()) ?? "").split("[a ").length - 1,
        "and it is the only bracket left on screen, so every accepted one was consumed",
    ).toBe(1);

    const legendBold = (await paintedRuns(page, LEGEND)).find((run) => run.text === "bold" && run.className !== "");
    const boldInLink = await page.locator(`${LINKS} a span`).first().getAttribute("class");

    expect(boldInLink, "a [b] inside a link is painted with the default class").toBe(legendBold!.className);
});

/**
 * An attribute is markup only where the consumer allowed that name on that tag. The free-typing example allows
 * none, so a bracket carrying one is prose: the opening tag prints as typed, and its closing tag, with nothing
 * left to close, prints too. The same `[b]` without the attribute is painted, which is what shows it was the
 * attribute and not the tag that turned it down.
 */
test("a bracket asking for an attribute it was not allowed prints as text", async ({ page }) => {
    await page.locator(FIELD).fill('A [b title="x"]word[/b] and a [b]word[/b].');

    await expect(page.locator(PREVIEW), "the bracket with an attribute is printed whole").toContainText(
        '[b title="x"]word[/b]',
    );
    await expect(page.locator(`${PREVIEW} span`), "and only the plain [b] became a run").toHaveCount(1);
    expect(await page.locator(`${PREVIEW} span`).getAttribute("class"), "painted like the legend's [b]").toBe(
        (await paintedRuns(page, LEGEND)).find((run) => run.text === "bold" && run.className !== "")!.className,
    );
});

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
 * Nothing reads a computed style. A spec that pins a weight, a decoration or a colour cannot tell a
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
        "and no two share one, so the map is a lookup per tag rather than one class for anything recognised",
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

test("an unrecognised tag is printed as typed, or dropped, on the consumer's word", async ({ page }) => {
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
        "dropping unrecognised tags cannot reach it, because it is not a tag",
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

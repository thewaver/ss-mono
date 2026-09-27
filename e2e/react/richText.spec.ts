import { type Page, expect, test } from "@playwright/test";

/**
 * The React `RichText`. The cases follow `e2e/richText.spec.ts`, which covers the Solid one, against one story that
 * lays out the same five examples as the Playground page: the legend of default tags, the diff that names two tags of
 * its own, a free-typing field with its preview, a glossary drawn through `renderTag` with a `Tooltip` per term, and
 * links drawn through `renderTag` that turn an unsafe address down.
 *
 * As in the Solid spec, what is asserted is the mapping, never the paint: a run either came back carrying the class it
 * was mapped to or it did not, and what the class draws is nobody's business here.
 */
const STORY = "Exotics/RichText/Default";

const LEGEND = '[data-testid="defaultTags"]';
const DIFF = '[data-testid="customTags"]';
const GLOSSARY = '[data-testid="glossary"]';
const LINKS = '[data-testid="links"]';
const FIELD = "textarea";
const PREVIEW = "#customInputPreview";
const REMOVE = '[data-testid="removeOtherTags"]';
const TERM = `${GLOSSARY} span[tabindex="0"]`;
const TOOLTIP = '[role="tooltip"]';

const TAG_NAMES = ["bold", "italic", "strikethrough", "underlined", "an item"];

const paintedRuns = (page: Page, selector: string) =>
    page.evaluate(
        (value) =>
            [...document.querySelectorAll(`${value} span`)].map((element) => ({
                text: (element.textContent ?? "").trim(),
                className: element.className,
                isNested: element.parentElement?.tagName === "SPAN",
            })),
        selector,
    );

const legendClass = async (page: Page, name: string) =>
    (await paintedRuns(page, LEGEND)).find((run) => run.text === name && run.className !== "")!.className;

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

test.beforeEach(async ({ mount }) => {
    await mount(STORY);
});

test("each of the five default tags comes back carrying a class of its own", async ({ page }) => {
    const runs = await paintedRuns(page, LEGEND);
    const painted = TAG_NAMES.map((name) => runs.find((run) => run.text === name && run.className !== ""));

    expect(painted.filter(Boolean), "every tag in the legend reached a class").toHaveLength(TAG_NAMES.length);
    expect(new Set(painted.map((run) => run!.className)).size, "and no two share one").toBe(TAG_NAMES.length);
});

test("a tag the consumer named is painted with the class the consumer gave it", async ({ page }) => {
    const runs = await paintedRuns(page, DIFF);
    const deleted = runs.find((run) => run.text === "the library's");
    const inserted = runs.find((run) => run.text === "the consumer's");

    expect(deleted, "the deleted run is its own element").toBeDefined();
    expect(inserted, "and so is the inserted one").toBeDefined();
    expect(deleted!.className).not.toBe("");
    expect(inserted!.className).not.toBe("");
    expect(inserted!.className, "[add] and [sub] were looked up separately").not.toBe(deleted!.className);
});

test("naming two tags of your own does not take the default ones away", async ({ page }) => {
    const diffRuns = await paintedRuns(page, DIFF);
    const bolded = diffRuns.find((run) => run.isNested && run.text === "two tags of its own");
    const wrapping = diffRuns.find((run) => !run.isNested && run.text === "two tags of its own");

    expect(bolded, "the [b] inside the [add] run is its own element").toBeDefined();
    expect(bolded!.className, "carrying the class the legend's [b] carries").toBe(await legendClass(page, "bold"));
    expect(wrapping, "wrapped by the [add] run").toBeDefined();
    expect(wrapping!.className, "which kept a class of its own").not.toBe(bolded!.className);
});

test("a class map reaches the example that supplied it and nothing else", async ({ page }) => {
    await page.locator(FIELD).fill("An [add]inserted[/add] word.");

    await expect(page.locator(PREVIEW), "the free-typing example was given no class for [add]").toHaveText(
        "An [add]inserted[/add] word.",
    );
});

test("an unrecognized tag is printed as typed, or dropped, on the consumer's word", async ({ page }) => {
    await expect(page.locator(PREVIEW)).toContainText("[warning]unknown tag[/warning]");

    await page.locator(REMOVE).check();

    await expect(page.locator(PREVIEW), "with it on the brackets go").not.toContainText("[warning]");
    await expect(page.locator(PREVIEW), "and the words that were inside them stay").toContainText("unknown tag");
});

test("an unclosed tag is text under either setting", async ({ page }) => {
    await expect(page.locator(PREVIEW)).toContainText("[b]unclosed one is printed the way it was typed.");

    await page.locator(REMOVE).check();

    await expect(page.locator(PREVIEW)).toContainText("[b]unclosed one is printed the way it was typed.");
});

test("markup in the string arrives as text and not as elements", async ({ page }) => {
    await page.locator(FIELD).fill("A <b>tag</b> and an <img src='x'> in the text.");

    await expect(page.locator(PREVIEW)).toHaveText("A <b>tag</b> and an <img src='x'> in the text.");
    await expect(page.locator(`${PREVIEW} b`)).toHaveCount(0);
    await expect(page.locator(`${PREVIEW} img`)).toHaveCount(0);
});

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
    await expect.poll(() => describingTip(page, 1), { message: "and the next term's tip is announced" }).toBeTruthy();

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
        await expect.poll(() => describingTip(page, index), { message: `hovering term ${index + 1}` }).toBeTruthy();

        tips.push((await describingTip(page, index))!);
    }

    expect(tips[0], "each attribute went to its own tag").not.toBe(tips[1]);
});

test("a tag nested inside a glossary term is still painted", async ({ page }) => {
    const nested = await page.evaluate((selector) => {
        const inner = document.querySelectorAll(selector)[1]?.querySelector("span");

        return inner ? { className: inner.className } : null;
    }, TERM);

    expect(nested, "the second term holds a run of its own").not.toBeNull();
    expect(nested!.className, "carrying the class the legend's [i] carries").toBe(await legendClass(page, "italic"));
    await expect(page.locator(GLOSSARY)).not.toContainText("[i]");
});

test("allowed addresses become links, and a javascript: address prints as typed", async ({ page }) => {
    const hrefs = await page
        .locator(`${LINKS} a`)
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("href") ?? ""));

    expect(hrefs.length, "the passage's three safe links were drawn").toBe(3);

    for (const href of hrefs) expect(href).toMatch(/^(https:\/\/|\/(?!\/)|#)/);

    await expect(page.locator(`${LINKS} a[href^="javascript"]`)).toHaveCount(0);
    await expect(page.locator(LINKS)).toContainText('[a href="javascript:alert(1)"]this one[/a]');
    expect(((await page.locator(LINKS).textContent()) ?? "").split("[a ").length - 1).toBe(1);
    expect(await page.locator(`${LINKS} a span`).first().getAttribute("class")).toBe(await legendClass(page, "bold"));
});

test("a bracket asking for an attribute it was not allowed prints as text", async ({ page }) => {
    await page.locator(FIELD).fill('A [b title="x"]word[/b] and a [b]word[/b].');

    await expect(page.locator(PREVIEW)).toContainText('[b title="x"]word[/b]');
    await expect(page.locator(`${PREVIEW} span`), "and only the plain [b] became a run").toHaveCount(1);
    expect(await page.locator(`${PREVIEW} span`).getAttribute("class")).toBe(await legendClass(page, "bold"));
});

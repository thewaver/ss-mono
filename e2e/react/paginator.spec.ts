import { type Page, expect, test } from "@playwright/test";

import { accessibleText, tagName } from "../helpers";

/**
 * The React `Paginator`. The cases follow `e2e/paginator.spec.ts`, which covers the Solid one, so the two frameworks
 * are held to the same arithmetic, the same names and the same refusals. Every paginator in the story reads the same
 * knobs — page count, sibling count, boundary count, disabled — handed in as the story's props, so what separates
 * them is which steps they ask for, whether their pages are links, and whether a layout places them.
 *
 * The painter draws a bare number marked `aria-hidden`, so the accessible name of a page comes from `aria-label`
 * alone, which is what the first case checks.
 */
const STORY = "Essentials/Paginator/Default";

const scope = (key: string) => `[data-testid="${key}"]`;
const nav = (key: string) => `${scope(key)} nav`;
const item = (key: string) => `${scope(key)} nav a, ${scope(key)} nav button`;
const pageItem = (key: string, number: number) => `${scope(key)} nav [aria-label="Page ${number}"]`;
const step = (key: string, name: string) => `${scope(key)} nav [aria-label="${name} page"]`;
const gap = (key: string) => `${scope(key)} nav [aria-hidden="true"] [title]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="page"]`).textContent();

test("the list names itself, and every page carries a name the painted number does not give it", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect(page.locator(nav("steps"))).toHaveAttribute("aria-label", "Results");

    expect(
        await accessibleText(page.locator(pageItem("steps", 1))),
        "the painter's digits are hidden, so the label is the only name",
    ).toBe("");
    await expect(page.locator(pageItem("steps", 1))).toHaveAttribute("aria-current", "page");
    await expect(page.locator(pageItem("steps", 2)), "and only the current one is marked").not.toHaveAttribute(
        "aria-current",
    );
});

test("the gaps stand for named pages rather than for an unspecified some", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(gap("steps")), "one gap on the far side while the current page is the first").toHaveCount(
        1,
    );
    await expect(page.locator(gap("steps"))).toHaveAttribute("title", "Pages 5 to 19");

    await page.locator(pageItem("steps", 4)).click();
    await page.locator(pageItem("steps", 5)).click();

    await expect(page.locator(gap("steps")), "and one either side once the page is clear of both ends").toHaveCount(2);
    await expect(page.locator(gap("steps")).first()).toHaveAttribute("title", "Pages 2 to 3");
});

test("a gap is skipped rather than announced, since a reader cannot act on the pages it hides", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect(page.locator(`${nav("steps")} [aria-hidden="true"]`).first()).toBeVisible();
    await expect(
        page.locator(`${nav("steps")} [aria-hidden="true"][aria-label]`),
        "the gap is not a control and is not named as one",
    ).toHaveCount(0);
});

test("stepping stops at each end rather than wrapping, and says so before it is pressed", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(step("steps", "Previous")), "there is nowhere back from the first page").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(step("steps", "Next"))).not.toHaveAttribute("aria-disabled");

    await page.locator(step("steps", "Previous")).click({ force: true });
    expect(await readout(page, "steps"), "and pressing it does nothing").toBe("page 1 of 20");

    await page.locator(step("steps", "Next")).click();
    expect(await readout(page, "steps")).toBe("page 2 of 20");
});

test("the end jumps are a separate pair, and go quiet alongside their neighbors", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(step("ends", "First"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step("ends", "Last"))).not.toHaveAttribute("aria-disabled");

    await page.locator(step("ends", "Last")).click();
    expect(await readout(page, "ends")).toBe("page 20 of 20");

    await expect(page.locator(step("ends", "Last")), "which is where that pair falls silent").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(page.locator(step("ends", "Next"))).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator(step("ends", "First"))).not.toHaveAttribute("aria-disabled");
});

test("the sibling and boundary knobs widen the window and pin the ends", async ({ page, mount }) => {
    const component = await mount(STORY);

    const before = await page.locator(item("steps")).count();

    await component.update({ siblingCount: 3 });

    await expect
        .poll(() => page.locator(item("steps")).count(), { message: "more siblings means more pages on show" })
        .toBeGreaterThan(before);

    await component.update({ siblingCount: 3, boundaryCount: 3 });

    await expect(
        page.locator(pageItem("steps", 18)),
        "three pinned at the end means page 18 is one of them",
    ).toHaveCount(1);
});

test("an href makes a page an anchor, and a link component replaces the element", async ({ page, mount }) => {
    await mount(STORY);

    expect(await tagName(page.locator(pageItem("links", 2))), "a page with an href is a link").toBe("A");
    expect(await tagName(page.locator(pageItem("steps", 2))), "and one without stays a button").toBe("BUTTON");
    await expect(page.locator(pageItem("links", 2))).toHaveAttribute("href", "#paginator-page-2");

    await expect(
        page.locator(`${nav("linkComponent")} a[data-link-component]`),
        "the consumer's own component renders every page when one is given",
    ).toHaveCount(await page.locator(`${nav("linkComponent")} a`).count());

    await expect(
        page.locator(step("links", "Previous")),
        "a step with nowhere to go offers no address either, so it cannot be followed",
    ).not.toHaveAttribute("href");
});

test("the disabled knob reaches every control in every list", async ({ page, mount }) => {
    await mount(STORY, { isDisabled: true });

    await expect(page.locator(`${nav("steps")} [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item("steps")).count(),
    );
    await expect(page.locator(`${nav("links")} [aria-disabled="true"]`)).toHaveCount(
        await page.locator(item("links")).count(),
    );

    await page.locator(pageItem("steps", 3)).click({ force: true });
    expect(await readout(page, "steps"), "and nothing moves the page").toBe("page 1 of 20");
});

/**
 * The dial reads the same knobs as the straight rows and asks for the same four steps `ends` does, so what separates
 * the two is the layout function and nothing else. A placement is written in shares of the container's width, so the
 * `cqw` offsets on each box are what the geometry is read from.
 */
const placedBox = (key: string) => `${nav(key)} [role="presentation"][style*="left"]`;

const controlNames = (page: Page, key: string) =>
    page.locator(item(key)).evaluateAll((elements) => elements.map((element) => element.ariaLabel));

const placedAngles = async (page: Page, key: string) => {
    const styles = await page
        .locator(placedBox(key))
        .evaluateAll((elements) => elements.map((element) => element.getAttribute("style") ?? ""));

    return styles.map((style) => {
        const at = (property: string) => Number((new RegExp(`${property}:\\s*([-\\d.]+)cqw`).exec(style) ?? [])[1]);
        const center = 50;

        return (Math.atan2(at("top") - center, at("left") - center) * 180) / Math.PI;
    });
};

const toTurnedBy = (angles: number[]) => {
    const full = 360;

    return angles.map((angle) => (((angle - angles[0]) % full) + full) % full);
};

test("a laid-out row is the same controls in the same order, moved rather than rebuilt", async ({ page, mount }) => {
    await mount(STORY);

    expect(await controlNames(page, "dial"), "the dial asks for the same steps as the row with end jumps").toEqual(
        await controlNames(page, "ends"),
    );

    await expect(
        page.locator(placedBox("dial")),
        "and every element of it has a box of its own, gaps included",
    ).toHaveCount((await page.locator(item("dial")).count()) + (await page.locator(gap("dial")).count()));

    await expect(page.locator(placedBox("ends")), "while a row with no layout places nothing").toHaveCount(0);
});

test("the ring walks one way round, so the order a pointer sees is the order the keyboard walks", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    const turnedBy = toTurnedBy(await placedAngles(page, "dial"));

    expect(turnedBy.length, "a wedge for every step, page and gap").toBe(
        (await page.locator(item("dial")).count()) + (await page.locator(gap("dial")).count()),
    );

    for (let index = 1; index < turnedBy.length; index++) {
        expect(turnedBy[index], `wedge ${index} sits further round than the one before it`).toBeGreaterThan(
            turnedBy[index - 1],
        );
    }
});

test("the page moves from a wedge the same as from a cell, and the wedge that is current follows it", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await expect(page.locator(pageItem("dial", 1))).toHaveAttribute("aria-current", "page");

    await page.locator(step("dial", "Last")).click();

    expect(await readout(page, "dial"), "the end jump reaches the last page from a wedge").toBe("page 20 of 20");
    await expect(page.locator(pageItem("dial", 20)), "and the mark moves with it").toHaveAttribute(
        "aria-current",
        "page",
    );
    await expect(page.locator(pageItem("dial", 1))).not.toHaveAttribute("aria-current");
});

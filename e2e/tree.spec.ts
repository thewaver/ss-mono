import { type Page, expect, test } from "@playwright/test";

import { activeMatches, activeText, attributesOf, docsDemo, docsSettled, prop, tabIndex } from "./helpers";

/**
 * No tree example on the Docs page reads out its value or its open branches, so the spec reads them where a screen
 * reader does: `aria-selected` says which row is selected and `aria-expanded` which branches are open.
 *
 * The Basic tree holds no state of its own and starts with everything closed. The tree opened and closed from
 * outside starts with `src` and `Lib` open, so it is the one whose walk crosses levels.
 */
const DOCS = "/src/App/Pages/TreePage/Docs";

const BASIC = docsDemo(DOCS, "Basic");
const CONTROLLED = docsDemo(DOCS, "Controlled");
const DISABLED = docsDemo(DOCS, "Disabled");
const LAZY = docsDemo(DOCS, "OnDemand");

const REMOTE_LOAD_DELAY_MS = 600;
const OUTSIDE_COLLAPSE_DELAY_MS = 500;

const node = (scope: string) => `${scope} [role="treeitem"]`;

const rowNamed = (page: Page, scope: string, name: string) =>
    page
        .locator(node(scope))
        .filter({ has: page.getByText(name, { exact: true }) })
        .first();

const selectedRows = (scope: string) => `${node(scope)}[aria-selected="true"]`;

test.beforeEach(async ({ page }) => {
    await page.goto("/tree/docs");
    await expect(page.locator(node(BASIC)).first()).toBeVisible();
    await docsSettled(page);
});

/**
 * The hierarchy is stated twice on purpose: the `role="group"` boxes nest, so a reader that computes depth
 * from the markup gets it right, and `aria-level` / `aria-posinset` / `aria-setsize` say the same thing
 * outright, so one that does not is told. These assert both halves agree.
 */
test("the tree is named, and every node says where it sits", async ({ page }) => {
    await expect(page.locator(`${BASIC} [role="tree"]`)).toHaveAttribute("aria-label", /.+/);

    const root = page.locator(node(BASIC)).first();

    await expect(root, "the first node is at the top level").toHaveAttribute("aria-level", "1");
    await expect(root, "first of three things in the repository").toHaveAttribute("aria-posinset", "1");
    await expect(root).toHaveAttribute("aria-setsize", "3");
    await expect(root, "and it is a branch that starts closed").toHaveAttribute("aria-expanded", "false");

    const child = page.locator(`${CONTROLLED} [role="group"] [role="treeitem"]`).first();

    await expect(child, "a child is one level in").toHaveAttribute("aria-level", "2");
    await expect(child, "and a leaf carries no expanded state at all").not.toHaveAttribute("aria-expanded", /.*/);
});

test("a collapsed branch's children are not in the document", async ({ page }) => {
    await expect(page.locator(node(BASIC)), "three top-level nodes and nothing under them").toHaveCount(3);
    await expect(page.locator(`${BASIC} [role="group"]`)).toHaveCount(0);

    await page.locator(node(BASIC)).first().click();

    await expect(page.locator(node(BASIC)), "opening src adds its three children").toHaveCount(6);
});

test("clicking a branch opens it and selects it, and clicking it again closes it", async ({ page }) => {
    const branch = page.locator(node(BASIC)).first();

    await branch.click();

    await expect(branch, "the first click opens the branch, since it started closed").toHaveAttribute(
        "aria-expanded",
        "true",
    );
    await expect(branch, "and the same click selects it").toHaveAttribute("aria-selected", "true");
    await expect(page.locator(selectedRows(BASIC)), "and nothing else").toHaveCount(1);

    await branch.click();

    await expect(branch, "a second click closes it").toHaveAttribute("aria-expanded", "false");
    await expect(branch, "and it stays selected").toHaveAttribute("aria-selected", "true");
});

test("only one node is in the tab order, and it is the selected one once there is a selection", async ({ page }) => {
    const tabbable = page.locator(`${BASIC} [role="treeitem"][tabindex="0"]`);

    await expect(tabbable, "a tree is one tab stop, not one per node").toHaveCount(1);
    expect(await tabIndex(page.locator(node(BASIC)).first()), "and the first node is where tabbing lands").toBe(0);

    await page.locator(node(BASIC)).nth(2).click();

    await expect(tabbable).toHaveCount(1);
    expect(await tabIndex(page.locator(node(BASIC)).nth(2)), "the tab stop follows the selection").toBe(0);
});

test("the arrows walk what is visible, and the horizontal pair opens and climbs", async ({ page }) => {
    await page.locator(node(BASIC)).first().focus();

    await page.keyboard.press("ArrowRight");
    await expect(page.locator(node(BASIC)).first(), "the first right opens a closed branch").toHaveAttribute(
        "aria-expanded",
        "true",
    );

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "the first child of the open branch").toContain("index.ts");

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page)).toContain("Lib");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "the first right opens the branch without moving").toContain("Lib");
    await expect(page.locator(node(BASIC)).nth(2)).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("ArrowRight");
    expect(await activeText(page), "the second right moves to the first child").toContain("Tree.tsx");

    await page.keyboard.press("ArrowLeft");
    expect(await activeText(page), "left on a leaf climbs to the parent").toContain("Lib");

    await page.keyboard.press("ArrowLeft");
    expect(await activeText(page), "and left on an open branch closes it rather than climbing").toContain("Lib");
    await expect(page.locator(node(BASIC)).nth(2)).toHaveAttribute("aria-expanded", "false");
});

test("the edge keys reach the ends of the visible list, not of a level", async ({ page }) => {
    await page.locator(node(CONTROLLED)).nth(3).focus();
    expect(await activeText(page), "starting deep inside an open branch").toContain("Tree.tsx");

    await page.keyboard.press("End");
    expect(await activeText(page), "End is the last visible node anywhere in the tree").toContain("README.md");

    await page.keyboard.press("Home");
    expect(await activeText(page)).toContain("src");

    await page.keyboard.press("ArrowUp");
    expect(
        await activeText(page),
        "and the walk stops at the ends rather than wrapping, as the tree pattern says",
    ).toContain("src");
});

test("the asterisk opens every branch at the level focus is on", async ({ page }) => {
    await page.locator(node(BASIC)).first().focus();
    await page.keyboard.press("*");

    await expect(rowNamed(page, BASIC, "src"), "src is the only branch at the top level").toHaveAttribute(
        "aria-expanded",
        "true",
    );

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("*");

    await expect(rowNamed(page, BASIC, "Lib"), "and inside src it opens Lib").toHaveAttribute("aria-expanded", "true");
    await expect(rowNamed(page, BASIC, "Playground"), "and Playground together").toHaveAttribute(
        "aria-expanded",
        "true",
    );
    await expect(rowNamed(page, BASIC, "Input"), "but not a branch a level further in").toHaveAttribute(
        "aria-expanded",
        "false",
    );
});

/**
 * The disabled-nodes example holds `src` and `Lib` open, with `index.ts` and `Lib` disabled. Its knob keeps both
 * reachable, and that swaps in the same nodes rather than a different tree.
 */
test("a disabled node is skipped by the arrows while what is inside it stays reachable", async ({ page }) => {
    await expect(page.locator(`${DISABLED} [role="treeitem"][aria-disabled="true"]`)).toHaveCount(2);

    await page.locator(node(DISABLED)).first().focus();

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "index.ts and Lib are both disabled, so the walk lands inside Lib").toContain(
        "Tree.tsx",
    );

    await rowNamed(page, DISABLED, "Lib").dispatchEvent("click");

    await expect(page.locator(selectedRows(DISABLED)), "clicking the disabled branch selects nothing").toHaveCount(0);
    await expect(rowNamed(page, DISABLED, "Lib"), "and leaves it exactly as open as it already was").toHaveAttribute(
        "aria-expanded",
        "true",
    );
});

test("a reachable disabled node takes focus, explains itself and still refuses to be picked", async ({ page }) => {
    await page.locator(`${prop("isReachable")} input`).click();

    await page.locator(node(DISABLED)).first().focus();

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "the arrows stop on it rather than passing it").toContain("index.ts");

    await page.keyboard.press("Enter");
    await expect(page.locator(selectedRows(DISABLED)), "it does not become the selection").toHaveCount(0);

    await page.keyboard.press("ArrowDown");
    expect(await activeText(page), "and the disabled branch is a stop as well").toContain("Lib");

    await page.keyboard.press("Enter");
    await expect(rowNamed(page, DISABLED, "Lib"), "which nothing closes").toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(selectedRows(DISABLED)), "or selects").toHaveCount(0);

    const indexRow = rowNamed(page, DISABLED, "index.ts");

    await indexRow.hover();
    await expect(indexRow, "hovering it says why, in a tooltip it is described by").toHaveAttribute(
        "aria-describedby",
        /.+/,
    );
    await expect(
        page.locator(`#${(await indexRow.getAttribute("aria-describedby"))!.split(" ")[0]}`),
        "and that tooltip has something to say",
    ).toHaveText(/.+/);
});

/**
 * The one route that can strand focus, and the only one no keystroke or click can produce. `ArrowLeft` and a
 * click both act on the branch, so focus is already sitting on an element that stays mounted; a **consumer**
 * writing the expanded list from their own code goes nowhere near that, and the row holding focus simply
 * unmounts. The button on the page defers the collapse rather than doing it outright, because a button that
 * collapsed on the spot would be holding focus itself and the row would never have been the focused element.
 */
test("a branch collapsed from outside hands focus back rather than dropping it on the body", async ({ page }) => {
    const rows = page.locator(node(CONTROLLED));

    await page.locator("#controlledCollapseLibLater").click();
    await rows.nth(3).focus();

    expect(await activeText(page), "focus starts on a row inside the branch about to close").toContain("Tree.tsx");

    await page.waitForTimeout(OUTSIDE_COLLAPSE_DELAY_MS * 2);

    expect(
        await activeMatches(page, "body"),
        "the row holding focus unmounted, and focus must not be left on the document",
    ).toBe(false);
    expect(await activeText(page), "it lands on the branch that closed, which is where a reader expects it").toContain(
        "Lib",
    );
});

test("the open branches written from outside open and close the tree", async ({ page }) => {
    const branches = page.locator(`${node(CONTROLLED)}[aria-expanded]`);

    await page.locator("#controlledExpandAll").click();
    await expect(
        page.locator(`${node(CONTROLLED)}[aria-expanded="false"]`),
        "expanding from outside leaves no branch closed",
    ).toHaveCount(0);
    expect(await branches.count(), "and there are branches to have opened").toBeGreaterThan(0);

    await page.locator("#controlledCollapseAll").click();
    await expect(
        page.locator(`${node(CONTROLLED)}[aria-expanded="true"]`),
        "collapsing from outside leaves none open",
    ).toHaveCount(0);
    await expect(page.locator(`${CONTROLLED} [role="group"]`), "and no children in the document").toHaveCount(0);
});

/**
 * The published tree pattern lists typeahead as a keyboard requirement rather than an extra, and a deep
 * tree is where arrowing is worst. Focus is real here — a tree row is a tab stop, not an
 * `aria-activedescendant` — so the check is which element holds focus. The tree held from outside starts with
 * `src` open, so a name inside it is on screen.
 *
 * The default text source is the row's accessible text, which matters more here than anywhere else: the
 * painter draws a "▶" marker before the name and marks it `aria-hidden`, so reading raw text would leave
 * every branch starting with an arrow and matching nothing.
 */
test.describe("typeahead", () => {
    test("moves focus to the next visible node starting with what was typed", async ({ page }) => {
        await page.locator(node(CONTROLLED)).first().focus();

        await page.keyboard.press("p");

        expect(await activeText(page), "the marker glyph is hidden, so the name is what matches").toContain(
            "Playground",
        );
    });

    /**
     * Only the rows on screen are walked, which is what a collapsed branch means — so this crosses out of
     * the open `src` subtree to a sibling at the top level rather than reaching a name hidden inside `Lib`.
     * It also shows the second letter narrowing the query: `p` alone lands on Playground.
     */
    test("walks the rows that are shown, crossing out of an open branch", async ({ page }) => {
        await page.locator(node(CONTROLLED)).first().focus();

        await page.keyboard.type("pa", { delay: 30 });

        expect(await activeText(page)).toContain("package.json");
    });

    /**
     * Asterisk opens every branch at the current level, and it is a printable character like any other — so
     * it has to be claimed before the query ever sees it, or the tree loses the shortcut the pattern names.
     */
    test("leaves the expand-siblings key alone", async ({ page }) => {
        const rows = page.locator(node(BASIC));
        const before = await rows.count();

        await rows.first().focus();
        await page.keyboard.press("*");

        expect(await rows.count(), "the branches opened rather than a query starting").toBeGreaterThan(before);
    });
});

/**
 * A windowed tree is flat on purpose. `role="group"` only means anything inside the treeitem that owns it, so
 * a box for a subtree whose parent is outside the window would be detached rather than partial — which is the
 * opposite of the grouped `Select`, where the box is a sibling of nothing and its name lives on `aria-label`.
 * The published tree pattern covers this case directly: when the nodes are not all in the DOM because the
 * reader is scrolling, every node states its level, position and set size. These check that they do.
 */
test.describe("a windowed tree", () => {
    const VIRTUALIZED = docsDemo(DOCS, "Virtualized");
    const tree = `${VIRTUALIZED} [role="tree"]`;
    const item = `${tree} [role="treeitem"]`;

    test("mounts a window rather than every row, and draws no group boxes", async ({ page }) => {
        const items = page.locator(item);

        expect(await items.count(), "far fewer than the rows the open branches hold").toBeLessThan(40);

        await expect(
            page.locator(`${tree} [role="group"]`),
            "nesting is carried by the attributes instead",
        ).toHaveCount(0);
    });

    test("every mounted row states its level, position and set size", async ({ page }) => {
        const stated = await page.locator(item).evaluateAll((items) =>
            items.map((node) => ({
                level: node.getAttribute("aria-level"),
                position: node.getAttribute("aria-posinset"),
                setSize: node.getAttribute("aria-setsize"),
            })),
        );

        expect(stated.length).toBeGreaterThan(0);
        expect(
            stated.every((row) => row.level !== null && row.position !== null && row.setSize !== null),
            "no row leaves the reader to infer its place from the DOM",
        ).toBe(true);
    });

    test("depth survives the flattening, so a child still reads as one level down", async ({ page }) => {
        const levels = await page
            .locator(item)
            .evaluateAll((items) => [...new Set(items.map((node) => node.getAttribute("aria-level")))]);

        expect(levels, "the first window holds an open branch and its children").toContain("2");
    });

    test("scrolling moves the window rather than growing it", async ({ page }) => {
        const items = page.locator(item);
        const before = await items.evaluateAll((nodes) => nodes.map((node) => node.textContent));

        await page.locator(tree).hover();

        for (let step = 0; step < 8; step += 1) await page.mouse.wheel(0, 600);

        await expect
            .poll(
                async () => {
                    const after = await items.evaluateAll((nodes) => nodes.map((node) => node.textContent));

                    return after.some((text) => !before.includes(text));
                },
                { message: "rows further down have taken the window's place" },
            )
            .toBe(true);

        expect(await items.count(), "and the mounted count stays small").toBeLessThan(40);
    });
});

/**
 * A branch is normally a node that has at least one child, which leaves a folder whose contents have not been
 * fetched yet with no way to say what it is: an empty list reads as a leaf, so nothing draws a twisty and
 * nothing opens. `hasMoreChildren` is the node saying "there are children you have not been given". It can
 * only add — a node with real children is a branch whether it carries the flag or not — so there is no state
 * in which the two fields disagree.
 *
 * Nothing new tells the consumer to go and fetch. Opening a branch writes its value into `expanded`,
 * which is the consumer's own signal, so the request is theirs to start and the arrival is theirs to hand
 * back as new nodes. That is `Select`'s arrangement for a list that has not finished arriving, applied a
 * level down.
 */
test("a branch can say it has children before it has them", async ({ page }) => {
    const packages = page.locator(node(LAZY)).filter({ hasText: "packages" }).first();

    await expect(packages, "it is a branch, though its children have not arrived").toHaveAttribute(
        "aria-expanded",
        "false",
    );
    await expect(packages, "and nothing is being awaited yet").not.toHaveAttribute("aria-busy");
    await expect(page.locator(`${LAZY} [role="group"]`), "so it has no group box either").toHaveCount(0);
});

test("opening one reports itself as busy, and paints what the consumer put there", async ({ page }) => {
    const packages = page.locator(node(LAZY)).filter({ hasText: "packages" }).first();

    await packages.click();

    await expect(packages, "the branch is open").toHaveAttribute("aria-expanded", "true");
    await expect(
        packages,
        "and says its contents are on the way, which is the only route a reader has",
    ).toHaveAttribute("aria-busy", "true");
    await expect(
        page.locator(`${LAZY} [role="group"]`),
        "the group box exists so the placeholder sits where the children will",
    ).toHaveText(/.+/);
    await expect(
        page.locator(`${LAZY} [role="group"] [role="treeitem"]`),
        "and what it holds is the placeholder, not a node",
    ).toHaveCount(0);
});

test("and stops being busy once the children turn up", async ({ page }) => {
    const packages = page.locator(node(LAZY)).filter({ hasText: "packages" }).first();

    await packages.click();
    await expect(page.locator(`${LAZY} [role="group"]`)).toHaveText(/.+/);

    const placeholder = ((await page.locator(`${LAZY} [role="group"]`).textContent()) ?? "").trim();

    await expect(page.locator(node(LAZY)).filter({ hasText: "core" }), "the fetch lands").toBeVisible({
        timeout: REMOTE_LOAD_DELAY_MS * 4,
    });

    await expect(packages, "nothing is outstanding any more").not.toHaveAttribute("aria-busy");
    await expect(page.locator(`${LAZY} [role="group"]`).first(), "and the placeholder is gone").not.toContainText(
        placeholder,
    );
});

/**
 * The point of the flag being additive rather than an override: a branch that arrives carrying children of
 * its own, each of which is itself unfetched, needs no special handling. `core` is handed over as a branch
 * with nothing in it, and opening it does exactly what opening `packages` did.
 */
test("a branch that arrives unfetched behaves like the one that delivered it", async ({ page }) => {
    await page.locator(node(LAZY)).filter({ hasText: "packages" }).first().click();

    const core = page.locator(node(LAZY)).filter({ hasText: "core" }).first();

    await expect(core).toBeVisible({ timeout: REMOTE_LOAD_DELAY_MS * 4 });
    await expect(core, "it arrived as a branch with no children").toHaveAttribute("aria-expanded", "false");

    await core.click();

    await expect(core, "and opens the same way").toHaveAttribute("aria-busy", "true");
    await expect(page.locator(node(LAZY)).filter({ hasText: "index.ts" }), "down to the fetch").toBeVisible({
        timeout: REMOTE_LOAD_DELAY_MS * 4,
    });
    await expect(core).not.toHaveAttribute("aria-busy");
});

/**
 * A radial tree is the one place in this pass where a layout needed to know more than how many items it is
 * placing: where a node goes depends on which node it hangs from. `FlatRow` already carried that, so the
 * tree hands the layout the parent of each visible row and the layout works the depths out from the chain.
 *
 * What has to survive is the part a screen reader uses, and none of it is positional: the nesting that
 * carries the groups, the level on each node, and the walk. Windowing is the one thing that cannot survive,
 * a window being a run of rows down a column.
 */
const RADIAL = docsDemo(DOCS, "Radial");

const placedBox = (scope: string) => `${scope} [role="presentation"][style*="left"]`;

test("a radial tree keeps its nesting, its levels and one box per open node", async ({ page }) => {
    const items = page.locator(`${RADIAL} [role="treeitem"]`);

    // The demo key already says which demo this is, so pinning the caption here would only ask whether
    // somebody has renamed it. What is worth checking is that the tree carries a name at all.
    await expect(page.locator(`${RADIAL} [role="tree"]`)).toHaveAttribute("aria-label", /.+/);
    await expect(page.locator(placedBox(RADIAL)), "a box for every node that is open").toHaveCount(await items.count());

    // A group's box collapses to nothing once its nodes are placed out of it, so what matters is that it is
    // still there wrapping them: the nesting is what carries the structure, not the box.
    await expect(
        page.locator(`${RADIAL} [role="group"] [role="treeitem"]`).first(),
        "the groups are still nested inside, and still hold their nodes",
    ).toBeAttached();

    const levels = await attributesOf(page, `${RADIAL} [role="treeitem"]`, "aria-level");

    expect(new Set(levels).size, "and the nodes sit at more than one level").toBeGreaterThan(1);
    expect(levels[0], "the root being the first of them").toBe("1");
});

test("a radial tree draws one connector for every node that hangs from another, hidden from a reader", async ({
    page,
}) => {
    const levels = await attributesOf(page, `${RADIAL} [role="treeitem"]`, "aria-level");
    const roots = levels.filter((level) => level === "1").length;

    await expect(
        page.locator(`${RADIAL} [role="tree"] [aria-hidden="true"]:has(> svg path)`),
        "a connector for each node but the roots",
    ).toHaveCount(levels.length - roots);
});

test("a placed node is reached and chosen the same way as a row", async ({ page }) => {
    const items = page.locator(`${RADIAL} [role="treeitem"]`);

    await items.first().focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(
        page.locator(selectedRows(RADIAL)),
        "the walk still reaches the next node and Enter still takes it",
    ).toHaveCount(1);
    expect(
        await page.locator(selectedRows(RADIAL)).getAttribute("id"),
        "and it is the node the walk reached, not the first",
    ).toBe(await items.nth(1).getAttribute("id"));
});

/**
 * A tree whose nodes change reuses the elements it already drew, so the element that showed one node goes on to
 * show another. The highlight marker finds its node's element through a record kept beside the rows, and that record
 * has to follow the element to whatever it shows now — when it kept the node the element was first drawn for, a
 * filtered list sent the marker to the wrong row, or to none.
 *
 * The Playground's own menu is the tree that filters, so it is the one driven here: narrow it with the search, then
 * hover every row left and check the marker lands on the row the pointer is over.
 */
const MENU = '[role="tree"][aria-label="Library"]';
const MENU_MARKER = `${MENU} > div[style*="transition-duration"]`;

test("after the menu is filtered, the highlight marker lands on the row under the pointer", async ({ page }) => {
    const search = page.getByRole("textbox", { name: "Search components" });

    await search.click();
    await page.keyboard.type("Sel");
    await search.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("Tree");

    const rows = page.locator(`${MENU} [role="treeitem"]`);

    await expect(rows.first()).toBeVisible();

    for (let index = 0; index < (await rows.count()); index++) {
        const row = rows.nth(index);

        await row.hover();

        await expect
            .poll(
                async () => {
                    const rowBox = await row.boundingBox();
                    const markerBox = await page.locator(MENU_MARKER).boundingBox();

                    return markerBox === null || rowBox === null ? undefined : Math.abs(markerBox.y - rowBox.y);
                },
                { message: `the marker sits on row ${index}` },
            )
            .toBeLessThan(1);
    }
});

/**
 * A tree that ticks several. Each row's marker is the arrow that opens it, registered with the tree, so a press on the
 * arrow and a press on the name are two different requests: the arrow only opens and closes, the name ticks. The
 * marker is the Playground's paint, the first decorative part of the row, so it is found by position in the row.
 */
test.describe("a tree that ticks several", () => {
    const CHECKBOXES = docsDemo(DOCS, "Checkboxes");

    const row = (page: Page, name: string) =>
        page
            .locator(node(CHECKBOXES))
            .filter({ has: page.getByText(name, { exact: true }) })
            .first();
    const arrowOf = (page: Page, name: string) => row(page, name).locator('[aria-hidden="true"]').first();
    const nameOf = (page: Page, name: string) => row(page, name).getByText(name, { exact: true });

    test("it says it ticks several, and every row states whether it is ticked", async ({ page }) => {
        await expect(page.locator(`${CHECKBOXES} [role="tree"]`)).toHaveAttribute("aria-multiselectable", "true");

        for (const item of await page.locator(node(CHECKBOXES)).all()) {
            await expect(item).toHaveAttribute("aria-checked", "false");
            await expect(item, "and none says it is selected, since ticking is the selection").not.toHaveAttribute(
                "aria-selected",
                /.*/,
            );
        }
    });

    test("pressing a folder's arrow opens it without ticking it", async ({ page }) => {
        await arrowOf(page, "src").click();

        await expect(row(page, "src"), "the arrow opens the folder").toHaveAttribute("aria-expanded", "true");
        await expect(row(page, "src"), "and ticks nothing").toHaveAttribute("aria-checked", "false");
        await expect(
            page.locator(`${node(CHECKBOXES)}[aria-checked="true"], ${node(CHECKBOXES)}[aria-checked="mixed"]`),
            "anywhere in the tree",
        ).toHaveCount(0);

        await arrowOf(page, "src").click();

        await expect(row(page, "src"), "and a second press closes it again").toHaveAttribute("aria-expanded", "false");
    });

    test("pressing a folder's name ticks it with everything inside, and leaves it as it was", async ({ page }) => {
        await nameOf(page, "src").click();

        await expect(row(page, "src"), "the name ticks the folder").toHaveAttribute("aria-checked", "true");
        await expect(row(page, "src"), "without opening it").toHaveAttribute("aria-expanded", "false");

        await arrowOf(page, "src").click();

        for (const item of await page.locator(`${CHECKBOXES} [role="group"] [role="treeitem"]`).all()) {
            await expect(item, "and everything inside it is ticked with it").toHaveAttribute("aria-checked", "true");
        }
    });

    test("a folder with only some of its contents ticked says it is partly ticked", async ({ page }) => {
        await arrowOf(page, "src").click();
        await nameOf(page, "index.ts").click();

        await expect(row(page, "index.ts")).toHaveAttribute("aria-checked", "true");
        await expect(row(page, "src"), "the folder holding it is neither ticked nor not").toHaveAttribute(
            "aria-checked",
            "mixed",
        );
    });

    test("Space ticks the focused row, Shift with Space ticks the run to it, Control with A ticks everything", async ({
        page,
    }) => {
        const rows = page.locator(node(CHECKBOXES));

        await rows.first().focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Space");

        await expect(rows.nth(1), "Space ticks the focused row").toHaveAttribute("aria-checked", "true");
        await expect(rows.first(), "and only it").toHaveAttribute("aria-checked", "false");

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Shift+Space");

        await expect(rows.nth(2), "Shift with Space ticks from the last row ticked").toHaveAttribute(
            "aria-checked",
            "true",
        );
        await expect(rows.nth(1), "to this one").toHaveAttribute("aria-checked", "true");
        await expect(rows.first(), "and nothing before the run").toHaveAttribute("aria-checked", "false");

        await page.keyboard.press("ControlOrMeta+A");

        for (const item of await rows.all()) {
            await expect(item, "Control with A ticks every row").toHaveAttribute("aria-checked", "true");
        }
    });
});

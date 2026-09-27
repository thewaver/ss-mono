import { type Page, expect, test } from "@playwright/test";

import { activeMatches, activeText, attributesOf, tabIndex, tagName } from "../helpers";

/**
 * The React `Tree`. The cases follow `e2e/tree.spec.ts` and the `Tree` block of `e2e/rightToLeft.spec.ts`, which
 * cover the Solid one, so the two frameworks are held to the same hierarchy attributes, the same walk and the same
 * refusals. The `Default` story lays several trees side by side, each keyed by `data-testid` in place of the
 * Playground's example keys, with a readout of the value and the expanded list the tree writes back.
 */
const STORY = "Essentials/Tree";

const OUTSIDE_COLLAPSE_DELAY_MS = 500;
const REMOTE_LOAD_DELAY_MS = 600;

const scope = (key: string) => `[data-testid="${key}"]`;
const node = (key: string) => `${scope(key)} [role="treeitem"]`;
const readout = (page: Page, key: string) => page.locator(`${scope(key)} [data-readout="tree"]`).textContent();

test.describe("the default trees", () => {
    test.beforeEach(async ({ mount }) => {
        await mount(`${STORY}/Default`);
    });

    test("the tree is named, and every node says where it sits", async ({ page }) => {
        await expect(page.locator(`${scope("default")} [role="tree"]`)).toHaveAttribute("aria-label", "Repository");

        const root = page.locator(node("default")).first();

        await expect(root, "the first node is at the top level").toHaveAttribute("aria-level", "1");
        await expect(root, "first of three things in the repository").toHaveAttribute("aria-posinset", "1");
        await expect(root).toHaveAttribute("aria-setsize", "3");
        await expect(root, "and it is a branch that starts open").toHaveAttribute("aria-expanded", "true");

        const child = page.locator(`${scope("default")} [role="group"] [role="treeitem"]`).first();

        await expect(child, "a child is one level in").toHaveAttribute("aria-level", "2");
        await expect(child, "and a leaf carries no expanded state at all").not.toHaveAttribute("aria-expanded", /.*/);
    });

    test("a collapsed branch's children are not in the document", async ({ page }) => {
        await expect(page.locator(node("collapsed")), "three top-level nodes and nothing under them").toHaveCount(3);
        await expect(page.locator(`${scope("collapsed")} [role="group"]`)).toHaveCount(0);

        await page.locator(node("collapsed")).first().click();

        await expect(page.locator(node("collapsed")), "opening src adds its three children").toHaveCount(6);
    });

    test("clicking a branch opens it and selects it, and clicking it again closes it", async ({ page }) => {
        const branch = page.locator(node("default")).first();

        await branch.click();

        await expect(branch, "the first click closes the branch, since it started open").toHaveAttribute(
            "aria-expanded",
            "false",
        );
        expect(await readout(page, "default"), "and the same click selects it").toContain("value: src");
        expect(await readout(page, "default")).toContain("expanded: []");

        await branch.click();

        await expect(branch).toHaveAttribute("aria-expanded", "true");
        expect(await readout(page, "default")).toContain('expanded: ["src"]');
    });

    test("only one node is in the tab order, and it is the selected one once there is a selection", async ({
        page,
    }) => {
        const tabbable = page.locator(`${scope("default")} [role="treeitem"][tabindex="0"]`);

        await expect(tabbable, "a tree is one tab stop, not one per node").toHaveCount(1);
        expect(await tabIndex(page.locator(node("default")).first()), "and the first node is where tabbing lands").toBe(
            0,
        );

        await page.locator(node("default")).nth(2).click();

        await expect(tabbable).toHaveCount(1);
        expect(await tabIndex(page.locator(node("default")).nth(2)), "the tab stop follows the selection").toBe(0);
    });

    test("a tree nobody holds the state of still marks and keeps its selection", async ({ page }) => {
        await page.locator(node("unheld")).nth(1).click();

        await expect(page.locator(node("unheld")).nth(1), "the node picked is announced as selected").toHaveAttribute(
            "aria-selected",
            "true",
        );
        expect(await tabIndex(page.locator(node("unheld")).nth(1)), "and it is the tree's tab stop").toBe(0);
    });

    test("the arrows walk what is visible, and the horizontal pair opens and climbs", async ({ page }) => {
        await page.locator(node("default")).first().focus();

        await page.keyboard.press("ArrowDown");
        expect(await activeText(page), "the first child of the open branch").toContain("index.ts");

        await page.keyboard.press("ArrowDown");
        expect(await activeText(page)).toContain("Lib");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "the first right opens the branch without moving").toContain("Lib");
        await expect(page.locator(node("default")).nth(2)).toHaveAttribute("aria-expanded", "true");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "the second right moves to the first child").toContain("Tree.tsx");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "left on a leaf climbs to the parent").toContain("Lib");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "and left on an open branch closes it rather than climbing").toContain("Lib");
        await expect(page.locator(node("default")).nth(2)).toHaveAttribute("aria-expanded", "false");
    });

    test("the edge keys reach the ends of the visible list, not of a level", async ({ page }) => {
        await page.locator(node("default")).first().focus();

        await page.keyboard.press("End");
        expect(await activeText(page), "End is the last visible node anywhere in the tree").toContain("README.md");

        await page.keyboard.press("Home");
        expect(await activeText(page)).toContain("src");

        await page.keyboard.press("ArrowUp");
        expect(await activeText(page), "and the walk stops at the ends rather than wrapping").toContain("src");
    });

    test("the asterisk opens every branch at the level focus is on", async ({ page }) => {
        await page.locator(node("collapsed")).first().focus();
        await page.keyboard.press("*");

        expect(await readout(page, "collapsed"), "src is the only branch at the top level").toContain(
            'expanded: ["src"]',
        );

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("*");

        expect(
            await readout(page, "collapsed"),
            "and inside src it opens Lib and Playground together, leaving the leaf alone",
        ).toContain('["src","Lib","Playground"]');
    });

    test("a disabled node is skipped by the arrows while what is inside it stays reachable", async ({ page }) => {
        await expect(page.locator(`${scope("disabled")} [role="treeitem"][aria-disabled="true"]`)).toHaveCount(2);

        await page.locator(node("disabled")).first().focus();

        await page.keyboard.press("ArrowDown");
        expect(await activeText(page), "index.ts and Lib are both disabled, so the walk lands inside Lib").toContain(
            "Tree.tsx",
        );

        await page.locator(node("disabled")).nth(2).dispatchEvent("click");

        expect(await readout(page, "disabled"), "clicking the disabled branch selects nothing").toContain(
            "value: undefined",
        );
        await expect(
            page.locator(node("disabled")).nth(2),
            "and leaves it exactly as open as it already was",
        ).toHaveAttribute("aria-expanded", "true");
    });

    test("a reachable disabled node takes focus, explains itself and still refuses to open", async ({ page }) => {
        await page.locator(node("reachable")).first().focus();

        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        expect(await activeText(page), "the arrows stop on it rather than passing it").toContain("node_modules");

        await page.keyboard.press("ArrowRight");
        await expect(
            page.locator(node("reachable")).nth(2),
            "and neither the arrow nor anything else opens a disabled branch",
        ).toHaveAttribute("aria-expanded", "false");

        await page.keyboard.press("Enter");
        expect(await readout(page, "reachable"), "nor does it become the selection").toContain("value: undefined");

        await page.locator(node("reachable")).nth(2).hover();
        await expect(page.locator('[role="tooltip"]'), "hovering it says why").toContainText("Not indexed");
    });

    test("a branch collapsed from outside hands focus back rather than dropping it on the body", async ({ page }) => {
        const rows = page.locator(node("outside"));

        await page.locator(`${scope("outside")} button`).click();
        await rows.nth(3).focus();

        expect(await activeText(page), "focus starts on a row inside the branch about to close").toContain("Tree.tsx");

        await page.waitForTimeout(OUTSIDE_COLLAPSE_DELAY_MS * 2);

        expect(await activeMatches(page, "body"), "focus must not be left on the document").toBe(false);
        expect(await activeText(page), "it lands on the branch that closed").toContain("Lib");
    });

    test("an href makes a node an anchor that follows itself on Enter, and a link component replaces it", async ({
        page,
    }) => {
        const link = page.locator(node("links")).nth(1);

        expect(await tagName(link), "a node with an href is a link").toBe("A");
        await expect(link).toHaveAttribute("href", "#tree-installing");
        expect(await tagName(page.locator(node("links")).first()), "and one without stays plain").toBe("DIV");

        await link.focus();
        await page.keyboard.press("Enter");

        await expect
            .poll(() => page.evaluate(() => location.hash), { message: "Enter follows the link itself" })
            .toBe("#tree-installing");

        await expect(
            page.locator(`${scope("linkComponent")} [data-link-component]`),
            "the consumer's own component renders every linked node",
        ).toHaveCount(3);
    });

    test.describe("typeahead", () => {
        test("moves focus to the next visible node starting with what was typed", async ({ page }) => {
            await page.locator(node("default")).first().focus();

            await page.keyboard.press("p");

            expect(await activeText(page), "the marker glyph is hidden, so the name is what matches").toContain(
                "Playground",
            );
        });

        test("walks the rows that are shown, crossing out of an open branch", async ({ page }) => {
            await page.locator(node("default")).first().focus();

            await page.keyboard.type("pa", { delay: 30 });

            expect(await activeText(page)).toContain("package.json");
        });

        test("leaves the expand-siblings key alone", async ({ page }) => {
            const rows = page.locator(node("collapsed"));
            const before = await rows.count();

            await rows.first().focus();
            await page.keyboard.press("*");

            await expect
                .poll(() => rows.count(), { message: "the branches opened rather than a query starting" })
                .toBeGreaterThan(before);
        });
    });
});

test.describe("a windowed tree", () => {
    const tree = `${scope("virtualized")} [role="tree"]`;
    const item = `${tree} [role="treeitem"]`;

    test.beforeEach(async ({ page, mount }) => {
        await mount(`${STORY}/Virtualized`);
        await expect(page.locator(item).first()).toBeVisible();
    });

    test("mounts a window rather than every row, and draws no group boxes", async ({ page }) => {
        expect(await page.locator(item).count(), "far fewer than the rows on show").toBeLessThan(40);

        await expect(
            page.locator(`${tree} [role="group"]`),
            "nesting is carried by the attributes instead",
        ).toHaveCount(0);
    });

    test("every mounted row states its level, position and set size", async ({ page }) => {
        const stated = await page.locator(item).evaluateAll((items) =>
            items.map((element) => ({
                level: element.getAttribute("aria-level"),
                position: element.getAttribute("aria-posinset"),
                setSize: element.getAttribute("aria-setsize"),
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
            .evaluateAll((items) => [...new Set(items.map((element) => element.getAttribute("aria-level")))]);

        expect(levels, "the first window holds an open branch and its children").toContain("2");
    });

    test("scrolling moves the window rather than growing it", async ({ page }) => {
        const items = page.locator(item);
        const before = await items.evaluateAll((elements) => elements.map((element) => element.textContent));

        await page.locator(tree).hover();

        for (let step = 0; step < 8; step += 1) await page.mouse.wheel(0, 600);

        await expect
            .poll(
                async () => {
                    const after = await items.evaluateAll((elements) => elements.map((element) => element.textContent));

                    return after.some((text) => !before.includes(text));
                },
                { message: "rows further down have taken the window's place" },
            )
            .toBe(true);

        expect(await items.count(), "and the mounted count stays small").toBeLessThan(40);
    });

    test("End reaches the last row even though it was outside the window", async ({ page }) => {
        await page.locator(item).first().focus();
        await page.keyboard.press("End");

        await expect
            .poll(() => activeText(page), { message: "focus lands on the last row once it is drawn" })
            .toContain("package-200");
    });
});

test.describe("branches that arrive later", () => {
    test.beforeEach(async ({ mount }) => {
        await mount(`${STORY}/LazyBranches`);
    });

    test("a branch can say it has children before it has them", async ({ page }) => {
        const packages = page.locator(node("lazy")).filter({ hasText: "packages" }).first();

        await expect(packages, "it is a branch, though its children have not arrived").toHaveAttribute(
            "aria-expanded",
            "false",
        );
        await expect(packages, "and nothing is being awaited yet").not.toHaveAttribute("aria-busy");
        await expect(page.locator(`${scope("lazy")} [role="group"]`), "so it has no group box either").toHaveCount(0);
    });

    test("opening one reports itself as busy, and paints what the consumer put there", async ({ page }) => {
        const packages = page.locator(node("lazy")).filter({ hasText: "packages" }).first();

        await packages.click();

        await expect(packages, "the branch is open").toHaveAttribute("aria-expanded", "true");
        await expect(packages, "and says its contents are on the way").toHaveAttribute("aria-busy", "true");
        await expect(
            page.locator(`${scope("lazy")} [role="group"]`),
            "the group box exists so the placeholder sits where the children will",
        ).toContainText("Fetching");
    });

    test("and stops being busy once the children turn up", async ({ page }) => {
        const packages = page.locator(node("lazy")).filter({ hasText: "packages" }).first();

        await packages.click();
        await expect(page.locator(node("lazy")).filter({ hasText: "core" }), "the fetch lands").toBeVisible({
            timeout: REMOTE_LOAD_DELAY_MS * 4,
        });

        await expect(packages, "nothing is outstanding any more").not.toHaveAttribute("aria-busy");
        await expect(
            page.locator(`${scope("lazy")} [role="group"]`).first(),
            "and the placeholder is gone",
        ).not.toContainText("Fetching");
    });

    test("a branch that arrives unfetched behaves like the one that delivered it", async ({ page }) => {
        await page.locator(node("lazy")).filter({ hasText: "packages" }).first().click();

        const core = page.locator(node("lazy")).filter({ hasText: "core" }).first();

        await expect(core).toBeVisible({ timeout: REMOTE_LOAD_DELAY_MS * 4 });
        await expect(core, "it arrived as a branch with no children").toHaveAttribute("aria-expanded", "false");

        await core.click();

        await expect(core, "and opens the same way").toHaveAttribute("aria-busy", "true");
        await expect(page.locator(node("lazy")).filter({ hasText: "index.ts" }), "down to the fetch").toBeVisible({
            timeout: REMOTE_LOAD_DELAY_MS * 4,
        });
        await expect(core).not.toHaveAttribute("aria-busy");
    });
});

test.describe("a radial tree", () => {
    const placedBox = `${scope("radial")} [role="presentation"][style*="left"]`;

    test.beforeEach(async ({ mount }) => {
        await mount(`${STORY}/Radial`);
    });

    test("keeps its nesting, its levels and one box per open node", async ({ page }) => {
        const items = page.locator(node("radial"));

        await expect(page.locator(`${scope("radial")} [role="tree"]`)).toHaveAttribute("aria-label", /.+/);
        await expect(page.locator(placedBox), "a box for every node that is open").toHaveCount(await items.count());
        await expect(
            page.locator(`${scope("radial")} [role="group"] [role="treeitem"]`).first(),
            "the groups are still nested inside, and still hold their nodes",
        ).toBeAttached();

        const levels = await attributesOf(page, node("radial"), "aria-level");

        expect(new Set(levels).size, "and the nodes sit at more than one level").toBeGreaterThan(1);
        expect(levels[0], "the root being the first of them").toBe("1");
    });

    test("a placed node is reached and chosen the same way as a row", async ({ page }) => {
        await page.locator(node("radial")).first().focus();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        expect(
            await readout(page, "radial"),
            "the walk still reaches the next node and Enter still takes it",
        ).not.toContain("value: undefined");
    });
});

test.describe("right to left", () => {
    test("the left arrow opens a branch and the right arrow closes it", async ({ page, mount }) => {
        await mount(`${STORY}/RightToLeft`);

        const branch = page.locator(node("rightToLeft")).first();

        await expect(branch, "the demo starts with every branch closed").toHaveAttribute("aria-expanded", "false");

        await branch.focus();

        await page.keyboard.press("ArrowRight");
        await expect(branch, "ArrowRight on a closed branch opens nothing").toHaveAttribute("aria-expanded", "false");

        await page.keyboard.press("ArrowLeft");
        await expect(branch, "ArrowLeft opens it").toHaveAttribute("aria-expanded", "true");
        expect(await activeText(page), "without moving").toContain("src");

        await page.keyboard.press("ArrowLeft");
        expect(await activeText(page), "a second ArrowLeft moves to the first child").toContain("index.ts");

        await page.keyboard.press("ArrowRight");
        expect(await activeText(page), "ArrowRight on a leaf climbs to the parent").toContain("src");

        await page.keyboard.press("ArrowRight");
        await expect(branch, "and on an open branch closes it").toHaveAttribute("aria-expanded", "false");
    });
});

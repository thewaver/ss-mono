import { type Page, expect, test } from "@playwright/test";

import {
    activeDescendantText,
    activeMatches,
    attributesOf,
    inputValue,
    selectedTexts,
    tabIndex,
    tagName,
} from "../helpers";

/**
 * The React `Select` and `MultiSelect`, over `ListboxReactUtils.useCursor`, the React `Popover` and the React
 * `InteractionWrapper`. The cases follow `e2e/select.spec.ts`, which covers the Solid ones: a button field that starts
 * closed, the popup list it points at, a pick keeping focus on the field, the highlight opening onto the selection,
 * the walk and its disabled options, groups and their headings, a several-value list that stays open, a disabled
 * field, a list loaded on demand that stops rather than wraps, a windowed list and a windowed list in groups, the
 * autocomplete field filtering through the consumer, and typeahead. Two cases have no Solid counterpart and cover the
 * clear control and how the popup list is named.
 */
const STORY = "Essentials/Select/Default";
const MULTI = "Essentials/MultiSelect/Default";

const FIELD = '[role="combobox"]';
const LISTBOX = '[role="listbox"]';
const OPTION = '[role="listbox"] [role="option"]';
const GROUP_HEADER = '[role="listbox"] [role="group"] [data-checked-state]';
const CHECKED_STATE = "data-checked-state";

/** Long enough for the typeahead query to have been forgotten, which the library puts at a second. */
const QUERY_TIMEOUT_MS = 1200;
const BATCH_TIMEOUT_MS = 5000;

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

/**
 * Opening is not instant: the list mounts and only then does the field point at a highlighted option. An arrow pressed
 * before that lands nowhere, so every keyboard case waits on the highlight rather than on the list merely existing.
 */
const openedWithHighlight = async (page: Page) => {
    await page.locator(FIELD).click();
    await expect(page.locator(FIELD)).toHaveAttribute("aria-activedescendant", /.+/);
};

test("a non-editable field is a button that starts closed", async ({ page, mount }) => {
    await mount(STORY);

    expect(await tagName(page.locator(FIELD)), "a non-editable field is a real button").toBe("BUTTON");
    await expect(page.locator(FIELD), "and says what it pops up").toHaveAttribute("aria-haspopup", "listbox");
    await expect(page.locator(FIELD), "and starts closed").toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(LISTBOX), "with no listbox in the tree at all").toHaveCount(0);
});

test("opening renders the records and points at the list", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(FIELD).click();

    await expect(page.locator(FIELD), "clicking it opens the list").toHaveAttribute("aria-expanded", "true");
    await expect(page.locator(OPTION), "which renders one option per record").toHaveCount(6);
    expect(await page.locator(FIELD).getAttribute("aria-controls"), "and points at the listbox it controls").toBe(
        await page.locator(LISTBOX).getAttribute("id"),
    );
    await expect(page.locator(FIELD)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(
        await activeDescendantText(page, FIELD),
        "with nothing selected, the highlight starts on the first option",
    ).toBe("Belgium");
});

test("picking an option keeps focus on the field and closes the list", async ({ page, mount }) => {
    await mount(STORY);
    await page.locator(FIELD).click();
    await page.locator(OPTION, { hasText: "Denmark" }).first().click();

    await expect(readout(page, "value"), "clicking an option picks it").toHaveText("value: Denmark");
    expect(
        await activeMatches(page, FIELD),
        "and focus never leaves the field, which is what makes aria-activedescendant honest",
    ).toBe(true);
    await expect(page.locator(LISTBOX), "a single-select list closes on a pick").toHaveCount(0);
});

test("opening onto a selection highlights it rather than the first option", async ({ page, mount }) => {
    await mount(STORY, { initial: "Portugal" });
    await openedWithHighlight(page);

    expect(
        await activeDescendantText(page, FIELD),
        "opening onto a selection highlights it rather than the first option",
    ).toBe("Portugal");
    expect(await selectedTexts(page, OPTION), "and marks exactly it as selected").toEqual(["Portugal"]);
});

test("the walk steps over a disabled option with nothing to explain", async ({ page, mount }) => {
    await mount(STORY, { list: "disabled" });
    await openedWithHighlight(page);
    await page.keyboard.press("ArrowDown");

    expect(await activeDescendantText(page, FIELD)).toBe("Estonia");
});

test("the walk stops on a reachable disabled option and picks nothing there", async ({ page, mount }) => {
    await mount(STORY, { list: "reachable" });
    await openedWithHighlight(page);
    await page.keyboard.press("ArrowDown");

    expect(await activeDescendantText(page, FIELD), "and stops on a disabled option that has a tooltip to reveal").toBe(
        "Denmark",
    );

    await page.keyboard.press("Enter");
    await expect(readout(page, "value"), "Enter on a reachable disabled option picks nothing").toHaveText(
        "value: undefined",
    );
    await expect(page.locator(LISTBOX), "and leaves the list open").toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.locator(LISTBOX), "Escape closes the list").toHaveCount(0);
});

test("a grouped list owns its group roles and the walk crosses them", async ({ page, mount }) => {
    await mount(STORY, { list: "grouped" });
    await openedWithHighlight(page);

    await expect(page.locator(`${LISTBOX} [role="group"]`), "a grouped list owns its group roles").toHaveCount(2);
    expect(
        await attributesOf(page, `${LISTBOX} [role="group"]`, "aria-label"),
        "and names each group from the record",
    ).toEqual(["Nordics", "Benelux"]);

    await page.keyboard.press("ArrowDown");
    expect(await activeDescendantText(page, FIELD), "the walk skips a disabled option inside a group").toBe("Sweden");

    await page.keyboard.press("ArrowDown");
    expect(
        await activeDescendantText(page, FIELD),
        "and then crosses into the next group without knowing groups exist",
    ).toBe("Belgium");
});

test("a multi list stays open, accumulates and toggles back out", async ({ page, mount }) => {
    await mount(MULTI);
    await page.locator(FIELD).click();
    await expect(page.locator(LISTBOX), "a multi list says it is multi").toHaveAttribute(
        "aria-multiselectable",
        "true",
    );

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    await expect(page.locator(LISTBOX), "picking in a multi list keeps it open").toHaveCount(1);
    await expect(readout(page, "values"), "and adds to the selection without dropping what was there").toHaveText(
        "values: [Denmark, Belgium]",
    );
    expect(
        await activeDescendantText(page, FIELD),
        "and the highlight moves to the row just picked, so arrowing carries on from there",
    ).toBe("Belgium");

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    await expect(readout(page, "values"), "picking it again toggles it back out").toHaveText("values: [Denmark]");
});

/**
 * Nordics holds Denmark, a disabled Finland and Sweden, so it can never report `true` from the list alone; Benelux is
 * the group that can go all the way.
 */
test("a group header summarizes its own options as unchecked, mixed or checked", async ({ page, mount }) => {
    await mount(MULTI, { isGrouped: true, initial: [] });
    await openedWithHighlight(page);

    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "with nothing picked, every header reads unchecked",
    ).toEqual(["false", "false"]);

    await page.locator(OPTION, { hasText: "Belgium" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "picking one option in a group takes only that group to mixed",
    ).toEqual(["false", "mixed"]);

    await page.locator(OPTION, { hasText: "Netherlands" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "and picking the rest of it takes that group to checked",
    ).toEqual(["false", "true"]);

    await page.locator(OPTION, { hasText: "Denmark" }).first().click();
    await page.locator(OPTION, { hasText: "Sweden" }).first().click();
    expect(
        await attributesOf(page, GROUP_HEADER, CHECKED_STATE),
        "a group holding an unpickable option stays mixed however much of it is picked",
    ).toEqual(["mixed", "true"]);
});

test("a disabled field opens nothing by pointer or by key", async ({ page, mount }) => {
    await mount(STORY, { isDisabled: true, initial: "Sweden" });

    expect(await tabIndex(page.locator(FIELD)), "a disabled field is out of the tab order").toBe(-1);

    await page.locator(FIELD).click({ force: true });
    await expect(page.locator(LISTBOX), "clicking it does not open the list").toHaveCount(0);
    expect(await activeMatches(page, FIELD), "and does not focus it either").toBe(false);

    await mount(STORY, { isDisabled: true, isReachable: true, initial: "Sweden" });

    expect(await tabIndex(page.locator(FIELD)), "while its reachable twin keeps its tab stop").toBe(0);

    await page.locator(FIELD).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(LISTBOX), "Enter on a reachable disabled field still opens nothing").toHaveCount(0);
});

/**
 * The library marks the end of what it holds with a one-pixel element and asks for more whenever that element is on
 * screen, so an empty list asks for its first batch simply by opening. The waits are on the readout, not on a
 * duration, since the story's loader resolves after a delay.
 */
test("a list that is not all there fetches its first batch by opening", async ({ page, mount }) => {
    await mount("Essentials/Select/OnDemand");

    await expect(readout(page, "fetched"), "nothing is fetched before the list is opened").toContainText("0 of 500");

    await page.locator(FIELD).click();
    await expect(readout(page, "fetched"), "opening asks for the first batch").toContainText("40 of 500", {
        timeout: BATCH_TIMEOUT_MS,
    });
    await expect(page.locator(FIELD)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(
        await activeDescendantText(page, FIELD),
        "and the highlight lands on the first option that arrived",
    ).toContain("Route 1");
});

test("the walk stops at the last option held rather than wrapping round", async ({ page, mount }) => {
    await mount("Essentials/Select/OnDemand");
    await page.locator(FIELD).click();
    await expect(readout(page, "fetched")).toContainText("40 of 500", { timeout: BATCH_TIMEOUT_MS });

    await page.keyboard.press("End");
    expect(await activeDescendantText(page, FIELD), "End reaches the last option handed over").toContain("Route 40");

    await page.keyboard.press("ArrowDown");
    expect(
        await activeDescendantText(page, FIELD),
        "and arrowing past it stays put rather than wrapping to the first, because more exist",
    ).toContain("Route 40");

    await expect(readout(page, "fetched"), "reaching the end asks for more").toContainText("80 of 500", {
        timeout: BATCH_TIMEOUT_MS,
    });
});

/**
 * A marker laid out after the last option is the one thing `End` could never reveal, since an option scrolls itself
 * into view only as far as `block: "nearest"`; the marker overlaps the last option instead.
 */
test("the end marker sits inside the last option rather than past it", async ({ page, mount }) => {
    await mount("Essentials/Select/OnDemand");
    await page.locator(FIELD).click();
    await expect(readout(page, "fetched")).toContainText("40 of 500", { timeout: BATCH_TIMEOUT_MS });

    const boxes = await page.evaluate(() => {
        const options = [...document.querySelectorAll('[role="listbox"] [role="option"]')];
        const slot = options[options.length - 1].parentElement!;
        const marker = slot.nextElementSibling!;

        return { slot: slot.getBoundingClientRect(), marker: marker.getBoundingClientRect() };
    });

    expect(boxes.marker.bottom, "the marker ends where the last option ends").toBeCloseTo(boxes.slot.bottom, 1);
    expect(boxes.marker.top, "and starts above that").toBeLessThan(boxes.slot.bottom);
});

test("a windowed row's slot is exactly the height of the row inside it", async ({ page, mount }) => {
    await mount("Essentials/Select/Virtualized");
    await page.locator(FIELD).click();
    await expect(page.locator(OPTION).first()).toBeVisible();

    const measured = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('[role="listbox"] [role="option"]')].map((option) =>
            option.getBoundingClientRect(),
        );

        return {
            fractional: rows.some((row) => Math.abs(row.height - Math.round(row.height)) > 0.01),
            widest: Math.max(...rows.slice(1).map((row, index) => row.top - rows[index].bottom)),
        };
    });

    expect(measured.fractional, "the options are not whole pixels tall, which is what makes this reachable").toBe(true);
    expect(measured.widest, "and consecutive rows meet rather than leaving a hairline").toBeLessThan(0.05);
});

test("a list given an estimated height mounts a window rather than every option", async ({ page, mount }) => {
    await mount("Essentials/Select/Virtualized");
    await page.locator(FIELD).click();
    await expect(page.locator(OPTION).first()).toBeVisible();

    await expect(readout(page, "count"), "the consumer still holds every option").toHaveText("10,000 options");
    expect(await page.locator(OPTION).count(), "while the document holds only the handful that fit").toBeLessThan(50);

    await page.keyboard.press("End");
    await expect(page.locator(FIELD), "End reaches the last of them even though it was never mounted").toHaveAttribute(
        "aria-activedescendant",
        /.+/,
    );
    await expect
        .poll(() => activeDescendantText(page, FIELD), { message: "and it is the last one" })
        .toContain("Route 10000");

    const geometry = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('[role="listbox"] [role="option"]')].map((option) =>
            option.getBoundingClientRect(),
        );
        const id = document.querySelector("[aria-activedescendant]")?.getAttribute("aria-activedescendant");
        const active = document.getElementById(id ?? "")!.getBoundingClientRect();
        const host = [...document.querySelectorAll('[role="listbox"] *')].find(
            (element) => element.scrollHeight > element.clientHeight + 1,
        )!;
        const hostRect = host.getBoundingClientRect();
        const scale = hostRect.height / (host as HTMLElement).offsetHeight;

        return {
            overlaps: rows.slice(1).filter((row, index) => row.top < rows[index].bottom - 1).length,
            activeTop: active.top,
            activeBottom: active.bottom,
            viewTop: hostRect.top + host.clientTop * scale,
            viewBottom: hostRect.top + (host.clientTop + host.clientHeight) * scale,
        };
    });

    expect(geometry.overlaps, "no row is placed over the one above it").toBe(0);
    expect(geometry.activeTop, "and the highlighted row sits inside the visible box").toBeGreaterThanOrEqual(
        geometry.viewTop - 1,
    );
    expect(geometry.activeBottom).toBeLessThanOrEqual(geometry.viewBottom + 1);
});

/**
 * Typing starts a new search rather than narrowing what already arrived, and the list it replaces may be any length,
 * including the length it was last asked at.
 */
test("an autocomplete loaded on demand searches again rather than filtering what it holds", async ({ page, mount }) => {
    await mount("Essentials/Select/AutocompleteOnDemand");

    await expect(readout(page, "searched"), "the first batch of the empty query arrives on its own").toContainText(
        "40 of 500 matches held",
        { timeout: BATCH_TIMEOUT_MS },
    );

    await page.locator(FIELD).focus();
    await page.keyboard.type("route 12");

    await expect(readout(page, "searched"), "typing runs a fresh search and replaces everything held").toContainText(
        "11 of 11 matches held",
        { timeout: BATCH_TIMEOUT_MS },
    );
    await expect(
        page.locator(OPTION),
        "so the list is the server's answer rather than a subset of the old one",
    ).toHaveCount(11);
});

test("an autocomplete field filters through the consumer's matcher", async ({ page, mount }) => {
    await mount("Essentials/Select/Autocomplete");

    expect(await tagName(page.locator(FIELD)), "a field given query state is an editable input instead").toBe("INPUT");
    await expect(page.locator(FIELD), "and announces as one").toHaveAttribute("aria-autocomplete", "list");

    await page.locator(FIELD).focus();
    await page.keyboard.type("lis");
    await expect(page.locator(OPTION), "typing filters through the consumer's own matcher").toHaveCount(1);
    await expect(page.locator(FIELD)).toHaveAttribute("aria-activedescendant", /.+/);
    expect(
        await activeDescendantText(page, FIELD),
        "and the highlight prefers the first match over any selection",
    ).toBe("Lisbon (LIS)");

    await page.keyboard.press("Enter");
    await expect(page.locator(LISTBOX)).toHaveCount(0);
    await expect(readout(page, "value"), "Enter picks the highlighted match, and closing clears the query").toHaveText(
        'value: LIS | query: ""',
    );
    expect(await inputValue(page.locator(FIELD)), "leaving the field's own text empty").toBe("");
});

test("pressing the clear control empties the value, reports it, and hands focus back to the field", async ({
    page,
    mount,
}) => {
    await mount(STORY, { isClearable: true, initial: "Estonia" });

    const clear = page.getByRole("button", { name: "Clear country" });

    await page.locator(FIELD).focus();
    await page.keyboard.press("Tab");
    await expect(clear, "the clear control is its own tab stop straight after the field").toBeFocused();

    await page.keyboard.press("Enter");

    await expect(readout(page, "value"), "pressing it empties the value").toHaveText("value: undefined");
    await expect(readout(page, "changes"), "and runs the change callback with nothing picked").toHaveText("undefined");
    await expect(page.locator(FIELD), "focus returns to the field").toBeFocused();
    await expect(clear, "and the control is gone while nothing is picked").toHaveCount(0);
});

test("the popup list is named by its Label, or exactly by the consumer's own name", async ({ page, mount }) => {
    await mount("Essentials/Select/Labeled");
    await page.locator(FIELD).click();

    const labelledBy = await page.locator(LISTBOX).getAttribute("aria-labelledby");

    expect(labelledBy, "the list points at a label").toBeTruthy();
    expect(
        await page.evaluate((id) => document.getElementById(id)?.tagName, labelledBy!),
        "which is the Label around the field",
    ).toBe("LABEL");

    await mount("Essentials/Select/Labeled", { listAriaLabel: "Countries" });
    await page.locator(FIELD).click();

    await expect(page.locator(LISTBOX), "a name of the consumer's own is written as it is").toHaveAttribute(
        "aria-label",
        "Countries",
    );
    await expect(page.locator(LISTBOX), "and replaces the reference").not.toHaveAttribute("aria-labelledby");
});

/**
 * Typeahead moves the highlight without changing the list. The library has no text of its own for an option, so by
 * default it reads the accessible text back off the option element, with the painter's `aria-hidden` tick excluded.
 */
test.describe("typeahead", () => {
    test("jumps the highlight to the next option starting with what was typed", async ({ page, mount }) => {
        await mount(STORY);
        await openedWithHighlight(page);

        await page.keyboard.press("e");

        expect(await activeDescendantText(page, FIELD)).toBe("Estonia");
    });

    test("starts a new query once typing stops", async ({ page, mount }) => {
        await mount(STORY);
        await openedWithHighlight(page);

        await page.keyboard.press("e");

        expect(await activeDescendantText(page, FIELD)).toBe("Estonia");

        await page.waitForTimeout(QUERY_TIMEOUT_MS);
        await page.keyboard.press("p");

        expect(await activeDescendantText(page, FIELD), "p on its own rather than ep").toBe("Portugal");
    });

    test("takes a longer query as one word rather than as separate jumps", async ({ page, mount }) => {
        await mount(STORY);
        await openedWithHighlight(page);

        await page.keyboard.type("de", { delay: 30 });

        expect(await activeDescendantText(page, FIELD), "d then e reads as Denmark").toBe("Denmark");
    });

    /** The list starts highlighting 13:00, so the first press has to wrap past the end to find a zero at all. */
    test("cycles through the options sharing a letter when the letter is repeated", async ({ page, mount }) => {
        await mount(STORY, { list: "hours", initial: "13:00" });
        await openedWithHighlight(page);

        await page.keyboard.press("0");
        expect(await activeDescendantText(page, FIELD), "wrapping past 23:00").toBe("00:00");

        await page.keyboard.press("0");
        expect(await activeDescendantText(page, FIELD)).toBe("01:00");

        await page.keyboard.press("0");
        expect(await activeDescendantText(page, FIELD)).toBe("02:00");
    });

    test("leaves the highlight alone when nothing matches", async ({ page, mount }) => {
        await mount(STORY);
        await openedWithHighlight(page);

        const before = await activeDescendantText(page, FIELD);

        await page.keyboard.press("z");

        expect(await activeDescendantText(page, FIELD)).toBe(before);
    });

    test("stays out of the way of an autocomplete field", async ({ page, mount }) => {
        await mount("Essentials/Select/Autocomplete");
        await page.locator(FIELD).focus();
        await page.keyboard.type("lis", { delay: 30 });

        expect(await inputValue(page.locator(FIELD)), "the letters went into the field").toBe("lis");
        await expect(page.locator(OPTION), "and filtered the list rather than walking it").toHaveCount(1);
    });

    test("reaches an option that is not mounted, when the consumer supplies the text", async ({ page, mount }) => {
        await mount("Essentials/Select/Virtualized");
        await openedWithHighlight(page);

        await page.keyboard.type("route 12", { delay: 30 });

        await expect
            .poll(() => activeDescendantText(page, FIELD), { message: "a route far below the window is reachable" })
            .toContain("Route 12");
    });
});

test.describe("a grouped list that is also windowed", () => {
    const labels = (page: Page) =>
        page
            .locator('[role="listbox"] [role="group"]')
            .evaluateAll((groups) => groups.map((group) => group.getAttribute("aria-label")));

    test.beforeEach(async ({ page, mount }) => {
        await mount("Essentials/Select/Virtualized", { isGrouped: true });
        await page.locator(FIELD).click();
        await expect(page.locator(LISTBOX)).toBeVisible();
    });

    test("mounts a handful of options out of ten thousand, and still boxes them by group", async ({ page }) => {
        await expect(page.locator(OPTION).first()).toBeVisible();

        expect(await page.locator(OPTION).count(), "only the window is mounted").toBeLessThan(20);

        await expect(page.locator('[role="listbox"] [role="group"]').first()).toHaveAttribute("aria-label", "Depot 1");
    });

    test("a window sitting inside a group still names it, with the header row nowhere in the window", async ({
        page,
    }) => {
        const list = page.locator(LISTBOX);

        await list.hover();

        for (let step = 0; step < 12; step += 1) await page.mouse.wheel(0, 1200);

        await expect
            .poll(async () => (await labels(page)).includes("Depot 3"), {
                message: "the group the window landed in is named on the box",
            })
            .toBe(true);

        const held = await list
            .locator('[role="group"]')
            .evaluateAll((groups) =>
                groups
                    .filter((group) => group.getAttribute("aria-label") !== "Depot 1")
                    .map((group) => group.querySelectorAll('[role="option"]').length),
            );

        expect(held.length, "a box exists for a group the window only partly holds").toBeGreaterThan(0);
        expect(
            held.every((count) => count > 0),
            "and it holds the options that are on screen",
        ).toBe(true);
    });

    test("picking from a windowed group reports the option, not the group", async ({ page }) => {
        await page.locator(OPTION).first().click();

        await expect(readout(page, "visibility")).toHaveText("closed");
        await expect(readout(page, "value"), "the pick is the option").toHaveText("value: Route 1");
    });
});

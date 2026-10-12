import { type Page, expect, test } from "@playwright/test";

const VIEW_TABS = "[data-view-tabs]";
const DOCS = '[data-view="docs"]';
const TABS_PROPS = '[data-api-table="TabsProps"]';

/**
 * Every component page is two views over one component — what it is and what it takes, then what it looks
 * like working — and which one you are on is in the URL rather than in component state, so a view can be
 * linked to and the back button walks them. Examples is the index rather than a segment of its own: it is
 * what the pages already were, every link and every spec in this suite already points at it, and a tab
 * that changed those URLs would have been a rename of the whole Playground for no gain.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/tabs");
    await expect(page.locator(VIEW_TABS)).toBeVisible();
});

test("the bare component route is the Examples view, and the tab agrees", async ({ page }) => {
    await expect(page.locator("[data-example]").first(), "the examples are what a bare route shows").toBeVisible();
    await expect(
        page.locator(VIEW_TABS).getByRole("tab", { name: "Examples" }),
        "and the tab reads its selection off the URL rather than tracking clicks",
    ).toHaveAttribute("aria-selected", "true");
});

test("each tab carries its view into the URL, and a deep link lands on it", async ({ page }) => {
    await page.locator(VIEW_TABS).getByRole("tab", { name: "Docs" }).click();
    await expect(page).toHaveURL(/\/tabs\/docs$/);
    await expect(page.locator(DOCS), "Docs holds the page's own description").toBeVisible();
    await expect(page.locator(TABS_PROPS), "and the props table under it").toBeVisible();

    await page.locator(VIEW_TABS).getByRole("tab", { name: "Examples" }).click();
    await expect(page).toHaveURL(/\/tabs$/);

    await page.goto("/tabs/docs");
    await expect(page.locator(TABS_PROPS), "and the same address reached cold lands on the same view").toBeVisible();
    await expect(page.locator(VIEW_TABS).getByRole("tab", { name: "Docs" })).toHaveAttribute("aria-selected", "true");
});

/**
 * The table is read off the published type rather than written by hand, so the assertion is that it agrees
 * with the type — a prop the type declares is present, carries the type text the source declares, and its
 * name carries a question mark exactly when the type makes it optional. Nothing here pins how many rows there are: props get added, and a count
 * would go red for that without anything being wrong.
 */
test("the props table is the published type, not a transcription of it @solid", async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator(TABS_PROPS)).toBeVisible();

    const required = page.locator(TABS_PROPS).locator('[data-api-row="renderTab"]');
    await expect(required, "a prop the type declares has a row").toHaveCount(1);
    await expect(required, "carrying what it returns").toContainText("JSX.Element");
    await expect(
        required.locator("td").first(),
        "and marked required by a name with no question mark, since the type does not make it optional",
    ).toHaveText("renderTab");

    const optional = page.locator(TABS_PROPS).locator('[data-api-row="tabGap"]');
    await expect(optional, "an optional prop is marked by its name rather than in the type column").toContainText(
        "tabGap?",
    );
    await expect(optional, "and its type is the value it carries").toContainText("number");
    await expect(optional, "with the accessor wrapper taken off rather than printed").not.toContainText(
        "MaybeAccessor",
    );
});

/**
 * The same table in the React Playground, read off the React package's type. A render callback there returns
 * `ReactNode`, and a prop carries its value as it is, so there is no accessor anywhere in the row.
 */
test("the props table is the published type, not a transcription of it @react", async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator(TABS_PROPS)).toBeVisible();

    const required = page.locator(TABS_PROPS).locator('[data-api-row="renderTab"]');
    await expect(required, "a prop the type declares has a row").toHaveCount(1);
    await expect(required, "carrying what it returns").toContainText("ReactNode");
    await expect(
        required.locator("td").first(),
        "and marked required by a name with no question mark, since the type does not make it optional",
    ).toHaveText("renderTab");

    const optional = page.locator(TABS_PROPS).locator('[data-api-row="tabGap"]');
    await expect(optional, "an optional prop is marked by its name rather than in the type column").toContainText(
        "tabGap?",
    );
    await expect(optional, "and its type is the value it carries").toContainText("number");
    await expect(optional, "with no accessor wrapper, since a React prop is its value").not.toContainText("accessor");
});

/**
 * The same table in the Svelte Playground, read off the Svelte package's type. A render callback there is a
 * snippet, so its type is a `Snippet` of the arguments it is handed, and a prop carries its value as it is.
 */
test("the props table is the published type, not a transcription of it @svelte", async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator(TABS_PROPS)).toBeVisible();

    const required = page.locator(TABS_PROPS).locator('[data-api-row="renderTab"]');
    await expect(required, "a prop the type declares has a row").toHaveCount(1);
    await expect(required, "carrying the snippet it takes").toContainText("Snippet");
    await expect(
        required.locator("td").first(),
        "and marked required by a name with no question mark, since the type does not make it optional",
    ).toHaveText("renderTab");

    const optional = page.locator(TABS_PROPS).locator('[data-api-row="tabGap"]');
    await expect(optional, "an optional prop is marked by its name rather than in the type column").toContainText(
        "tabGap?",
    );
    await expect(optional, "and its type is the value it carries").toContainText("number");
    await expect(optional, "with no accessor wrapper, since a Svelte prop is its value").not.toContainText("accessor");
});

/**
 * The same table in the Vue Playground, read off the Vue package's types. A render callback there is a scoped slot,
 * so it is not a prop at all: it has a row in the slots table drawn straight after the props, returning `VNodeChild`,
 * and a prop carries its value as it is.
 */
test("the props table is the published type, not a transcription of it @vue", async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(page.locator(TABS_PROPS)).toBeVisible();

    const required = page.locator('[data-api-table="TabsSlots"]').locator('[data-api-row="renderTab"]');
    await expect(required, "a slot the type declares has a row").toHaveCount(1);
    await expect(required, "carrying what it returns").toContainText("VNodeChild");
    await expect(
        required.locator("td").first(),
        "and marked required by a name with no question mark, since the type does not make it optional",
    ).toHaveText("renderTab");

    const optional = page.locator(TABS_PROPS).locator('[data-api-row="tabGap"]');
    await expect(optional, "an optional prop is marked by its name rather than in the type column").toContainText(
        "tabGap?",
    );
    await expect(optional, "and its type is the value it carries").toContainText("number");
    await expect(optional, "with no accessor wrapper, since a Vue prop is its value").not.toContainText("accessor");
});

/**
 * The tables are everything the unit exports, not only its props: the other components in its folder, its context,
 * its utility namespaces and its types each get a section. Both halves are asserted against something the source
 * declares rather than against a count, for the same reason as above.
 */
test("a page lists every export of its unit, not only the props of its main component", async ({ page }) => {
    await page.goto("/tabs/docs");
    await expect(
        page.locator('[data-api-table="TabPanelProps"]'),
        "a second component in the same folder has its props drawn on this page",
    ).toBeVisible();
    await expect(
        page.locator('[data-api-group="components"] [data-api-row="TabPanel"]'),
        "and the component itself is listed with its signature",
    ).toContainText("TabPanelProps");

    await page.goto("/anchor/docs");
    await expect(page.locator('[data-api-group="props"]'), "an abstract has no props section").toHaveCount(0);
    await expect(
        page.locator('[data-api-table="AnchorUtils"] [data-api-row="getHPlacementShift"]'),
        "but its namespace is listed member by member",
    ).toContainText("AnchorHPlacement");
});

test("a page whose unit exports nothing says so rather than drawing empty tables", async ({ page }) => {
    await page.goto("/timed-gradients/docs");
    await expect(page.locator(`${DOCS} table`), "no table is drawn").toHaveCount(0);
    await expect(page.locator(DOCS), "and the view says why").toContainText("exports nothing");
});

/**
 * Every Docs page carries a table of contents, drawn by the library's own `TableOfContents`: one link per group and
 * one per table that has a heading. What it promises is a relationship between two lists — the links and the
 * headings — so the check is that they are the same list in the same order, read off the page rather than counted.
 * Breadcrumbs is used because its page has several groups and several headed tables.
 */
test.describe("the table of contents beside a Docs page", () => {
    const TABLE_OF_CONTENTS = `${DOCS} nav`;
    const LINKS = `${TABLE_OF_CONTENTS} a`;
    const HEADINGS = `${DOCS} [data-api-group] h2, ${DOCS} [data-api-group] h3`;
    const MARKED = `${LINKS}[aria-current="location"]`;

    const targetOf = async (page: Page, index: number) =>
        page.locator(`[id="${((await page.locator(LINKS).nth(index).getAttribute("href")) ?? "").replace(/^#/, "")}"]`);

    test.beforeEach(async ({ page }) => {
        await page.goto("/breadcrumbs/docs");
        await expect(page.locator(LINKS).first()).toBeVisible();
    });

    /**
     * The page already holds the left menu's navigation landmark, so the table of contents' is named — two unnamed ones
     * could not be told apart — and the name is asserted to differ from every other landmark's rather than to read
     * any particular way.
     */
    test("is a navigation landmark named apart from the others on the page", async ({ page }) => {
        const names = await page
            .locator('nav, [role="navigation"]')
            .evaluateAll((landmarks) => landmarks.map((landmark) => landmark.getAttribute("aria-label")));
        const own = await page.locator(TABLE_OF_CONTENTS).getAttribute("aria-label");

        expect(own, "the table of contents' landmark carries a name").toBeTruthy();
        expect(
            names.filter((name) => name === own),
            "and no other landmark on the page shares it",
        ).toHaveLength(1);
    });

    test("links to every group and table heading on the page, in reading order", async ({ page }) => {
        const targets = await page
            .locator(LINKS)
            .evaluateAll((links) => links.map((link) => (link.getAttribute("href") ?? "").replace(/^#/, "")));
        const headings = await page.locator(HEADINGS).evaluateAll((elements) => elements.map((element) => element.id));

        expect(targets.length, "the table of contents has links").toBeGreaterThan(1);
        expect(headings, "every heading carries an id a link can point at").not.toContain("");
        expect(targets, "and the links name exactly those headings, in the order the page shows them").toEqual(
            headings,
        );
    });

    /**
     * Focus moving to the heading is the half a keyboard or screen reader user depends on; the mark is what says
     * which link they came from. The last link is pressed first because it is the one a short ending can push out of
     * reach of the line that decides the mark, and a pressed link holds the mark regardless.
     */
    test("pressing a link focuses its heading and marks that link alone", async ({ page }) => {
        const links = page.locator(LINKS);
        const count = await links.count();

        for (const index of [count - 1, 1, 0]) {
            await links.nth(index).click();

            await expect(await targetOf(page, index), "focus lands on the heading the link names").toBeFocused();
            await expect(links.nth(index), "that link is the current one").toHaveAttribute("aria-current", "location");
            await expect(page.locator(MARKED), "and no other is").toHaveCount(1);
        }
    });

    /** A table of contents of one link would only repeat the page's title, so a page that would get fewer has none. */
    test("is left out of a page with too few sections", async ({ page }) => {
        await page.goto("/timed-gradients/docs");
        await expect(page.locator(DOCS), "the docs view is up").toContainText("exports nothing");
        await expect(page.locator(TABLE_OF_CONTENTS), "and carries no table of contents").toHaveCount(0);
    });
});

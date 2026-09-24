import { expect, test } from "@playwright/test";

const VIEW_TABS = "[data-view-tabs]";
const DOCS = '[data-view="docs"]';
const API_VIEW = '[data-view="api"]';
const TABS_PROPS = '[data-api-table="TabsProps"]';

/**
 * Every component page is three views over one component — what it is, what it takes, and what it looks
 * like working — and which one you are on is in the URL rather than in component state, so a view can be
 * linked to and the back button walks them. Samples is the index rather than a segment of its own: it is
 * what the pages already were, every link and every spec in this suite already points at it, and a tab
 * that changed those URLs would have been a rename of the whole Playground for no gain.
 */
test.beforeEach(async ({ page }) => {
    await page.goto("/tabs");
    await expect(page.locator(VIEW_TABS)).toBeVisible();
});

test("the bare component route is the Samples view, and the tab agrees", async ({ page }) => {
    await expect(page.locator("[data-example]").first(), "the examples are what a bare route shows").toBeVisible();
    await expect(
        page.locator(VIEW_TABS).getByRole("tab", { name: "Samples" }),
        "and the tab reads its selection off the URL rather than tracking clicks",
    ).toHaveAttribute("aria-selected", "true");
});

test("each tab carries its view into the URL, and a deep link lands on it", async ({ page }) => {
    await page.locator(VIEW_TABS).getByRole("tab", { name: "Docs" }).click();
    await expect(page).toHaveURL(/\/tabs\/docs$/);
    await expect(page.locator(DOCS), "Docs holds the page's own description").toBeVisible();

    await page.locator(VIEW_TABS).getByRole("tab", { name: "API" }).click();
    await expect(page).toHaveURL(/\/tabs\/api$/);
    await expect(page.locator(TABS_PROPS), "API holds the props table").toBeVisible();

    await page.goto("/tabs/api");
    await expect(page.locator(TABS_PROPS), "and the same address reached cold lands on the same view").toBeVisible();
    await expect(page.locator(VIEW_TABS).getByRole("tab", { name: "API" })).toHaveAttribute("aria-selected", "true");
});

/**
 * The table is read off the published type rather than written by hand, so the assertion is that it agrees
 * with the type — a prop the type declares is present, carries the type text the source declares, and is
 * marked required or not to match. Nothing here pins how many rows there are: props get added, and a count
 * would go red for that without anything being wrong.
 */
test("the props table is the published type, not a transcription of it", async ({ page }) => {
    await page.goto("/tabs/api");
    await expect(page.locator(TABS_PROPS)).toBeVisible();

    const required = page.locator(TABS_PROPS).locator('[data-api-row="renderTab"]');
    await expect(required, "a prop the type declares has a row").toHaveCount(1);
    await expect(required, "carrying what it returns").toContainText("JSX.Element");
    await expect(required, "and marked required, since the type does not make it optional").toContainText("required");

    const optional = page.locator(TABS_PROPS).locator('[data-api-row="tabGap"]');
    await expect(optional, "an optional prop is marked by its name rather than in the type column").toContainText(
        "tabGap?",
    );
    await expect(optional, "and its type is the value it carries").toContainText("number");
    await expect(
        optional,
        "with the accessor wrapper stated once, beside the type rather than inside it",
    ).toContainText("value or accessor");
});

/**
 * The view is everything the unit exports, not only its props: the other components in its folder, its context,
 * its utility namespaces and its types each get a section. Both halves are asserted against something the source
 * declares rather than against a count, for the same reason as above.
 */
test("a page lists every export of its unit, not only the props of its main component", async ({ page }) => {
    await page.goto("/tabs/api");
    await expect(
        page.locator('[data-api-table="TabPanelProps"]'),
        "a second component in the same folder has its props drawn on this page",
    ).toBeVisible();
    await expect(
        page.locator('[data-api-group="components"] [data-api-row="TabPanel"]'),
        "and the component itself is listed with its signature",
    ).toContainText("TabPanelProps");

    await page.goto("/anchor/api");
    await expect(page.locator('[data-api-group="props"]'), "an abstract has no props section").toHaveCount(0);
    await expect(
        page.locator('[data-api-table="AnchorUtils"] [data-api-row="getHPlacementShift"]'),
        "but its namespace is listed member by member",
    ).toContainText("AnchorHPlacement");
});

test("a page whose unit exports nothing says so rather than drawing an empty view", async ({ page }) => {
    await page.goto("/timed-gradients/api");
    await expect(page.locator(`${API_VIEW} table`), "no table is drawn").toHaveCount(0);
    await expect(page.locator(API_VIEW), "and the view says why").toContainText("exports nothing");
});

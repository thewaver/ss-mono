import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Popover`. The Solid one has no spec of its own — its behavior is checked through the controls built on
 * it, `select`, `menu`, `colorInput`, `hoverCard` and the rest — so these cases state that shared contract directly:
 * it is out of the tree until opened, portaled and placed against its anchor, dismissed from outside with the reason
 * named, focused only when asked, keeps focus with the owner of a list or menu when pressed, and gives up a pinned
 * position once its anchor has scrolled away.
 */
const POPOVER = "#popover";
const STORY = "Primitives/Popover/Default";
const PIXEL_SLACK = 1;
const SCROLL_AWAY_PX = 2000;

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

const activeTestId = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("data-testid"));

const open = async (page: Page) => {
    await page.getByTestId("anchor").click();
    await expect(page.locator(POPOVER)).toBeVisible();
};

test("a closed popover is not in the tree, and an open one is portaled out of its owner, named", async ({
    page,
    mount,
}) => {
    const component = await mount(STORY);

    await expect(page.locator(POPOVER), "nothing is mounted while closed").toHaveCount(0);

    await open(page);

    await expect(component.locator(POPOVER), "it is portaled out of the tree that owns it").toHaveCount(0);
    await expect(page.locator(POPOVER)).toHaveAttribute("role", "listbox");
    await expect(page.locator(POPOVER), "with the consumer's ARIA spread onto it").toHaveAttribute(
        "aria-label",
        "Choices",
    );
    await expect(page.locator(POPOVER), "and it is not inert while open").toHaveJSProperty("inert", false);
});

test("it sits against its anchor at the default placement, and takes the anchor's text color", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await open(page);

    await expect(page.getByTestId("content")).toHaveAttribute("data-placement", "left-in bottom-out");

    await expect
        .poll(async () => {
            const anchor = (await page.getByTestId("anchor").boundingBox())!;
            const popover = (await page.locator(POPOVER).boundingBox())!;

            return (
                Math.abs(popover.x - anchor.x) <= PIXEL_SLACK &&
                Math.abs(popover.y - (anchor.y + anchor.height)) <= PIXEL_SLACK
            );
        }, "left edges aligned, just below the anchor")
        .toBe(true);

    const colors = await page.evaluate(() => ({
        anchor: getComputedStyle(document.querySelector('[data-testid="anchor"]')!).color,
        popover: getComputedStyle(document.querySelector("#popover")!).color,
    }));

    expect(colors.popover, "the text color is inherited from the anchor, which the portal would otherwise lose").toBe(
        colors.anchor,
    );
});

test("it is held at least as wide as its anchor only when asked", async ({ page, mount }) => {
    const width = (selector: string) =>
        page.locator(selector).evaluate((element) => (element as HTMLElement).offsetWidth);

    await mount(STORY);
    await open(page);

    expect(await width(POPOVER), "left alone it is as narrow as its content").toBeLessThan(
        await width('[data-testid="anchor"]'),
    );

    await mount(STORY, { hasAnchorMinWidth: true });
    await open(page);

    await expect
        .poll(async () => (await width(POPOVER)) === (await width('[data-testid="anchor"]')), "asked, it matches")
        .toBe(true);
});

test("Escape and a press outside dismiss it with their reasons, and a press on the anchor does not", async ({
    page,
    mount,
}) => {
    await mount(STORY);

    await open(page);
    await page.keyboard.press("Escape");
    await expect(page.locator(POPOVER), "Escape closes it once the fade has run").toHaveCount(0);
    await expect(readout(page, "reason")).toHaveText("escape");

    await open(page);
    await page.getByTestId("outside").click();
    await expect(page.locator(POPOVER)).toHaveCount(0);
    await expect(readout(page, "reason"), "a press elsewhere is named as one").toHaveText("press");

    await open(page);
    await page.getByTestId("anchor").click();
    await expect(page.locator(POPOVER), "the anchor's own toggle closes it").toHaveCount(0);
    await expect(
        readout(page, "reason"),
        "and the dismisser stayed out of it, since the anchor is inside the layer",
    ).toHaveText("press");
});

test("focus leaving it is a dismissal too", async ({ page, mount }) => {
    await mount(STORY, { hasAutoFocus: true });
    await open(page);
    await expect(page.locator(POPOVER)).toBeFocused();

    await page.getByTestId("outside").focus();

    await expect(page.locator(POPOVER)).toHaveCount(0);
    await expect(readout(page, "reason")).toHaveText("focus");
});

test("focus moves in only when asked", async ({ page, mount }) => {
    await mount(STORY);
    await open(page);

    await expect(page.getByTestId("anchor"), "a popup that only suggests leaves focus where it was").toBeFocused();

    await mount(STORY, { hasAutoFocus: true });
    await open(page);

    await expect(page.locator(POPOVER), "asked, the popup itself takes focus once it is placed").toBeFocused();
});

test("a key pressed inside it reaches the consumer", async ({ page, mount }) => {
    await mount(STORY, { hasAutoFocus: true });
    await open(page);
    await expect(page.locator(POPOVER)).toBeFocused();

    await page.keyboard.press("ArrowDown");

    await expect(readout(page, "keys")).toHaveText("ArrowDown");
});

test("a press inside a list keeps focus with its owner, and a press inside a dialog does not", async ({
    page,
    mount,
}) => {
    await mount(STORY);
    await open(page);
    await expect(page.getByTestId("anchor")).toBeFocused();

    await page.getByTestId("alpha").click();

    expect(await activeTestId(page), "a listbox leaves focus on the field that drives it").toBe("anchor");

    await mount(STORY, { role: "dialog" });
    await open(page);
    await page.getByTestId("alpha").click();

    expect(await activeTestId(page), "a dialog lets the press focus what it landed on").toBe("alpha");
});

test("a covered popover hides its content, and a transparent one lets the pointer through", async ({ page, mount }) => {
    await mount(STORY, { isCovered: true });
    await page.getByTestId("anchor").click();

    await expect(page.locator(POPOVER)).toHaveCount(1);
    await expect(page.getByTestId("content"), "the content is not drawn while something sits over it").toBeHidden();

    await mount(STORY, { isTransparentToPointer: true });
    await open(page);

    const isHitInside = await page.locator(POPOVER).evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);

        return !!hit && element.contains(hit);
    });

    expect(isHitInside, "a point over the popup reaches whatever is underneath").toBe(false);
});

test("the transition reports when each fade starts and when it finishes", async ({ page, mount }) => {
    await mount(STORY);

    await expect(readout(page, "transitions"), "at rest, nothing is in flight").toHaveText("true");

    await open(page);
    await expect(readout(page, "transitions"), "opening starts a fade and finishes it").toHaveText("true,false,true");

    await page.getByTestId("anchor").click();

    await expect(page.locator(POPOVER)).toHaveCount(0);
    await expect(readout(page, "transitions"), "and so does closing").toHaveText("true,false,true,false,true");
});

test("a pinned popover gives up once its anchor has scrolled off the screen", async ({ page, mount }) => {
    await mount(STORY, { isPinned: true });
    await open(page);

    await page.evaluate((top) => window.scrollTo(0, top), SCROLL_AWAY_PX);

    await expect(page.locator(POPOVER)).toHaveCount(0);
    await expect(readout(page, "reason"), "and says why").toHaveText("anchorGone");
});

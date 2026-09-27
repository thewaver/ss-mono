import { expect, test } from "@playwright/test";

import { attributesOf, tagName } from "../helpers";

/**
 * The React `Breadcrumbs`. The cases follow `e2e/breadcrumbs.spec.ts`, which covers the Solid one, so the two
 * frameworks are held to the same markup and the same refusals. The story renders four trails side by side, keyed by
 * `data-testid` in place of the Playground's example keys.
 */
const STORY = "Essentials/Breadcrumbs/Default";

const scope = (key: string) => `[data-testid="${key}"]`;
const crumb = (key: string) => `${scope(key)} nav[aria-label] ol > li`;
const readout = (key: string) => `${scope(key)} [data-readout="pressed"]`;

test("a trail is a named landmark around an ordered list", async ({ page, mount }) => {
    await mount(STORY);

    await expect(page.locator(`${scope("default")} nav`), "the trail is a landmark and names itself").toHaveAttribute(
        "aria-label",
        "Trail",
    );
    await expect(page.locator(`${scope("default")} nav > ol`), "the crumbs are an ordered list inside it").toHaveCount(
        1,
    );
    await expect(page.locator(crumb("default")), "one list entry per crumb").toHaveCount(4);
});

test("the last crumb is the current page, and is not a control", async ({ page, mount }) => {
    await mount(STORY);

    const entries = page.locator(`${scope("default")} [aria-current]`);

    await expect(entries, "exactly one crumb claims to be the current page").toHaveCount(1);
    await expect(entries, "and it says which kind of current it is").toHaveAttribute("aria-current", "page");

    expect(await tagName(entries), "the current crumb is not a control at all").toBe("SPAN");
    expect(
        await tagName(page.locator(`${scope("default")} button`).first()),
        "while the crumbs before it are still pressable",
    ).toBe("BUTTON");

    await expect(
        entries,
        "and being no control, it is out of the tab order rather than a stop that does nothing",
    ).not.toHaveAttribute("tabindex", "0");
});

test("pressing a crumb reports its value, and the current one has nothing to report", async ({ page, mount }) => {
    await mount(STORY);

    await page
        .locator(`${scope("default")} button`)
        .first()
        .click();
    await expect(page.locator(readout("default")), "a crumb reports the value it was given").toHaveText(
        "pressed: home",
    );

    await page
        .locator(`${scope("default")} button`)
        .nth(1)
        .click();
    await page.locator(`${scope("default")} [aria-current]`).click();
    await expect(page.locator(readout("default")), "and the current crumb is inert, so the reading stands").toHaveText(
        "pressed: library",
    );
});

test("separators are hidden from assistive technology, and are optional", async ({ page, mount }) => {
    await mount(STORY);

    await expect(
        page.locator(`${scope("default")} ol [aria-hidden="true"]`),
        "a separator sits between each pair, so one fewer than the crumbs",
    ).toHaveCount(3);

    await expect(
        page.locator(`${scope("bare")} ol [aria-hidden="true"]`),
        "a trail with no separator slot renders nothing between the crumbs",
    ).toHaveCount(0);
});

test("an href makes a crumb an anchor, and a link component replaces the element", async ({ page, mount }) => {
    await mount(STORY);

    expect(
        await tagName(page.locator(`${scope("linked")} a`).first()),
        "an href turns the crumb into a real link",
    ).toBe("A");
    expect(
        await attributesOf(page, `${scope("linked")} a`, "href"),
        "and the address is the consumer's, passed through untouched",
    ).toContain("#breadcrumb-home");

    await expect(
        page.locator(`${scope("linkComponent")} [data-link-component]`),
        "a consumer's own link component renders in place of the anchor",
    ).not.toHaveCount(0);
});

test("a disabled crumb is reachable and refuses the press", async ({ page, mount }) => {
    await mount(STORY, { isDisabled: true });

    const first = page.locator(`${scope("default")} button`).first();

    await expect(first, "the crumb says it is disabled without the native attribute").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    await expect(
        page.locator(`${scope("default")} button[disabled]`),
        "and no crumb carries the native one",
    ).toHaveCount(0);

    await first.click({ force: true });
    await expect(page.locator(readout("default")), "pressing it reports nothing").toHaveText("pressed: nothing yet");
});

import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Modal`. The cases follow `e2e/modal.spec.ts`, which covers the Solid one, so the two frameworks are held
 * to the same behavior: the dialog is out of the tree until opened, traps focus and wraps it, closes on Escape and on
 * the backdrop unless told not to, hands focus back to the trigger, and lets a popup opened inside it close first.
 *
 * The stories mount the dialog into a fixed layer covering the window, which is what the Playground's viewport gives
 * the Solid one; a dialog portaled straight into the body would be only as tall as the body's content.
 */
const DIALOG = '[role="dialog"]';
const ALERT = '[role="alertdialog"]';
const LISTBOX = '[role="listbox"]';
const OVERLAY_INSET = 4;

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

const activeTestId = (page: Page) => page.evaluate(() => document.activeElement?.getAttribute("data-testid"));

/** The overlay's center is under the dialog for a centered one, so a corner is the only reliable point. */
const clickOverlayCorner = async (page: Page) => {
    const box = await page.locator('[aria-modal="true"]').evaluate((element) => {
        const rect = element.parentElement!.firstElementChild!.getBoundingClientRect();

        return { right: rect.right, bottom: rect.bottom };
    });

    await page.mouse.click(box.right - OVERLAY_INSET, box.bottom - OVERLAY_INSET);
};

test("a closed modal is not in the tree, and opening mounts a dialog named by the consumer's own heading", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Modal/Default");

    await expect(page.locator(DIALOG), "a closed modal is not in the tree at all").toHaveCount(0);

    await page.getByTestId("open").click();

    await expect(page.locator(DIALOG), "opening one mounts a modal dialog").toHaveAttribute("aria-modal", "true");
    await expect(page.locator(DIALOG), "named by the consumer's own heading").toHaveAttribute(
        "aria-labelledby",
        "modal-title",
    );
});

test("focus is trapped and wraps both ways", async ({ page, mount }) => {
    await mount("Essentials/Modal/Default");

    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();

    await expect.poll(() => activeTestId(page), "focus lands on the first focusable child").toBe("focus-1");

    await page.keyboard.press("Tab");
    expect(await activeTestId(page), "Tab walks forward inside the dialog").toBe("focus-2");

    await page.keyboard.press("Tab");
    expect(await activeTestId(page), "and on to the last child").toBe("focus-3");

    await page.keyboard.press("Tab");
    expect(await activeTestId(page), "Tab off the last child wraps to the first").toBe("focus-1");

    await page.keyboard.press("Shift+Tab");
    expect(await activeTestId(page), "and Shift+Tab off the first wraps the other way").toBe("focus-3");
});

test("the page behind an open modal is inert and does not scroll", async ({ page, mount }) => {
    await mount("Essentials/Modal/Default");

    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();

    await expect(page.getByTestId("open"), "the trigger behind the overlay is sealed off").toHaveJSProperty(
        "inert",
        true,
    );
    expect(await page.evaluate(() => document.documentElement.style.overflow), "and the document is held still").toBe(
        "hidden",
    );

    await page.keyboard.press("Escape");
    await expect(page.locator(DIALOG)).toHaveCount(0);

    await expect(page.getByTestId("open"), "closing lifts the seal").toHaveJSProperty("inert", false);
    expect(await page.evaluate(() => document.documentElement.style.overflow), "and the scroll lock").toBe("");
});

test("Escape closes it and returns focus to the trigger", async ({ page, mount }) => {
    await mount("Essentials/Modal/Default");

    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator(DIALOG), "Escape closes it").toHaveCount(0);
    await expect(readout(page, "open"), "and the owner's state says so").toHaveText("false");
    await expect(page.getByTestId("open"), "and focus returns to the trigger").toBeFocused();
});

test("a click on the overlay closes it", async ({ page, mount }) => {
    await mount("Essentials/Modal/Default");

    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();

    await clickOverlayCorner(page);

    await expect(page.locator(DIALOG)).toHaveCount(0);
    await expect(readout(page, "open")).toHaveText("false");
});

/**
 * A dialog holding only text has no child to hand focus to. The dialog itself is the fallback target, which is what
 * `initialFocusRef`'s documentation promises, so a Tab never reaches the page behind the overlay.
 */
test("with nothing focusable inside, the dialog takes focus itself and Tab does not walk the page", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Modal/TextOnly");

    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();

    await expect(page.locator(DIALOG), "with no child to focus, the dialog is the one holding focus").toBeFocused();

    await page.keyboard.press("Tab");

    expect(
        await page.evaluate((selector) => {
            const active = document.activeElement;

            return !active || active === document.body || !!document.querySelector(selector)?.contains(active);
        }, DIALOG),
        "and Tab reaches nothing on the page behind the overlay",
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(page.locator(DIALOG), "Escape still closes it").toHaveCount(0);
    await expect(page.getByTestId("open"), "and focus goes back to the trigger").toBeFocused();
});

test("an alert takes the alertdialog role, describes the decision, and focuses its initial target", async ({
    page,
    mount,
}) => {
    await mount("Essentials/Modal/Alert");

    await page.getByTestId("open").click();

    await expect(page.locator(ALERT), "an alert dialog carries role=alertdialog, not role=dialog").toHaveCount(1);
    await expect(page.locator(ALERT), "and points at the text explaining the decision").toHaveAttribute(
        "aria-describedby",
        "modal-alert-body",
    );
    await expect(
        page.getByTestId("cancel"),
        "focus lands on the initial target rather than on the first focusable child",
    ).toBeFocused();
});

test("neither an overlay click nor Escape can dismiss an alert that turns both off", async ({ page, mount }) => {
    await mount("Essentials/Modal/Alert");

    await page.getByTestId("open").click();
    await expect(page.locator(ALERT)).toBeVisible();

    await clickOverlayCorner(page);
    await expect(page.locator(ALERT), "clicking the overlay does not dismiss it").toHaveCount(1);

    await page.keyboard.press("Escape");
    await expect(page.locator(ALERT), "and Escape is refused too").toHaveCount(1);
    await expect(readout(page, "outcome"), "with no outcome").toHaveText("none");
});

test("the initial focus target can be activated straight away", async ({ page, mount }) => {
    await mount("Essentials/Modal/Alert");

    await page.getByTestId("open").click();
    await expect(page.getByTestId("cancel")).toBeFocused();

    await page.keyboard.press("Enter");

    await expect(page.locator(ALERT)).toHaveCount(0);
    await expect(readout(page, "outcome"), "and reports what was answered").toHaveText("canceled");
});

/**
 * A layer opened from inside another one: the popup consumes Escape and a press outside it, and the modal around it
 * stays, because the dismisser hands each event to the topmost layer only.
 */
test.describe("a popup inside a modal", () => {
    const openBoth = async (page: Page) => {
        await page.getByTestId("open").click();
        await expect(page.locator(DIALOG)).toBeVisible();

        await page.getByTestId("combobox").click();
        await expect(page.locator(LISTBOX)).toBeVisible();
    };

    test("Escape closes the innermost layer and leaves the one around it", async ({ page, mount }) => {
        await mount("Essentials/Modal/Layered");
        await openBoth(page);

        await page.keyboard.press("Escape");
        await expect(page.locator(LISTBOX), "the first press closes the list").toHaveCount(0);
        await expect(page.locator(DIALOG), "and the modal around it stays open").toHaveCount(1);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "the second press closes the modal").toHaveCount(0);
    });

    test("pressing inside the modal closes only the list", async ({ page, mount }) => {
        await mount("Essentials/Modal/Layered");
        await openBoth(page);

        await page.getByTestId("title").click();
        await expect(page.locator(LISTBOX), "a press outside the list dismisses it").toHaveCount(0);
        await expect(page.locator(DIALOG), "while a press inside the modal is not outside the modal").toHaveCount(1);
    });

    test("the list paints above the modal it was opened from, so it can be used", async ({ page, mount }) => {
        await mount("Essentials/Modal/Layered");
        await openBoth(page);

        await page.locator(`${LISTBOX} [role="option"]`, { hasText: "Portugal" }).click();

        await expect(page.locator(LISTBOX)).toHaveCount(0);
        await expect(page.locator(DIALOG), "picking from a list inside a modal does not dismiss the modal").toHaveCount(
            1,
        );
        await expect(readout(page, "country")).toHaveText("Portugal");
    });
});

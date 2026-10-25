import { type Page, expect, test } from "@playwright/test";

import { activeText, docsDemo, docsSettled, prop } from "./helpers";

const MODAL_DOCS = "/src/App/Pages/ModalPage/Docs";

const DIALOG = '[role="dialog"]';
const ALERT = '[role="alertdialog"]';
const OVERLAY_INSET = 4;

const ALERT_DEMO = docsDemo(MODAL_DOCS, "Alert");

/** The overlay's center is under the dialog for a centered one, so a corner is the only reliable point. */
const clickOverlayCorner = async (page: Page) => {
    const box = (await page.locator('[aria-modal="true"]').evaluate((element) => {
        const overlay = element.parentElement!.firstElementChild!;
        const rect = overlay.getBoundingClientRect();

        return { right: rect.right, bottom: rect.bottom };
    }))!;

    await page.mouse.click(box.right - OVERLAY_INSET, box.bottom - OVERLAY_INSET);
};

/** A knob that is a picker opens its own list, found through the picker's `aria-controls`. */
const pickOption = async (page: Page, key: string, name: string) => {
    const picker = page.locator(`${prop(key)} [role="combobox"]`);

    await picker.click();
    await page
        .locator(`[id="${await picker.getAttribute("aria-controls")}"]`)
        .getByRole("option", { name, exact: true })
        .click();
};

const alertReadout = async (page: Page) =>
    ((await page.locator(`${ALERT_DEMO} [data-readout]`).textContent()) ?? "").trim();

test.describe("Modal", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/modal/docs");
        await expect(page.locator("#openModal")).toBeVisible();
        await docsSettled(page);
    });

    test("a closed modal is not in the tree", async ({ page }) => {
        await expect(page.locator(DIALOG), "a closed modal is not in the tree at all").toHaveCount(0);
    });

    test("opening mounts a dialog named by the consumer's own heading", async ({ page }) => {
        await page.locator("#openModal").click();

        await expect(page.locator(DIALOG), "opening one mounts a modal dialog").toHaveAttribute("aria-modal", "true");

        expect(
            await page.locator(DIALOG).evaluate((dialog) => {
                const name = document.getElementById(dialog.getAttribute("aria-labelledby") ?? "");

                return !!name && dialog.contains(name) && (name.textContent ?? "").trim().length > 0;
            }),
            "named by the consumer's own heading inside it rather than by a label the library invented",
        ).toBe(true);
    });

    test("focus is trapped and wraps both ways", async ({ page }) => {
        await page.locator("#openModal").click();
        await expect(page.locator(DIALOG)).toBeVisible();

        expect(await activeText(page), "focus lands on the first focusable child").toContain("Focus 1");

        await page.keyboard.press("Tab");
        expect(await activeText(page), "Tab walks forward inside the dialog").toContain("Focus 2");

        await page.keyboard.press("Tab");
        expect(await activeText(page), "and on to the last child").toContain("Focus 3");

        await page.keyboard.press("Tab");
        expect(
            await activeText(page),
            "Tab off the last child wraps to the first rather than escaping to the page behind",
        ).toContain("Focus 1");

        await page.keyboard.press("Shift+Tab");
        expect(await activeText(page), "and Shift+Tab off the first wraps the other way").toContain("Focus 3");
    });

    test("Escape closes it and returns focus to the trigger", async ({ page }) => {
        await page.locator("#openModal").click();
        await expect(page.locator(DIALOG)).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "Escape closes it").toHaveCount(0);
        await expect(
            page.locator("#openModal"),
            "and focus returns to the trigger rather than being dropped on the body",
        ).toBeFocused();
    });
});

/**
 * A dialog holding only text has no child to hand focus to, and that is the case that used to leave focus on
 * the trigger behind the overlay: the trap listens on the dialog's own subtree, so a Tab pressed from the
 * trigger never reached it and walked the page instead. The dialog itself is the fallback target, which is
 * what `initialFocusRef`'s documentation promises.
 */
test.describe("Modal with nothing focusable inside", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/modal/docs");
        await expect(page.locator("#openNotice")).toBeVisible();
        await docsSettled(page);
    });

    test("the dialog takes focus itself, so Tab does not walk the page behind it", async ({ page }) => {
        await page.locator("#openNotice").click();
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
        await expect(page.locator("#openNotice"), "and focus goes back to the trigger").toBeFocused();
    });
});

/**
 * The drawer is a `Modal` with an edge, and its Docs example has one Edge knob in place of the four drawers the old
 * page drew, so each test sets the edge and then opens the one drawer.
 */
test.describe("Drawer", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/drawer/docs");
        await expect(page.locator("#openDrawer")).toBeVisible();
        await docsSettled(page);
    });

    /**
     * In layout space rather than through `boundingBox`, per the note in `playwright.config.ts`: the dialog
     * lives inside `Viewport`'s scaled subtree, so a client rect is the layout value times a factor that
     * depends on the size of this window. Offsets against the drawer's own parent are exact integers and
     * the window stops mattering.
     */
    const layoutBox = (page: Page) =>
        page.locator(DIALOG).evaluate((element) => {
            const dialog = element as HTMLElement;
            const root = dialog.offsetParent as HTMLElement;

            return {
                top: dialog.offsetTop,
                left: dialog.offsetLeft,
                width: dialog.offsetWidth,
                height: dialog.offsetHeight,
                rootWidth: root.clientWidth,
                rootHeight: root.clientHeight,
            };
        });

    const openAt = async (page: Page, edge: string) => {
        await pickOption(page, "edge", edge);
        await page.locator("#openDrawer").click();
        await expect(page.locator(DIALOG)).toBeVisible();
    };

    test("a closed drawer is not in the tree", async ({ page }) => {
        await expect(page.locator(DIALOG), "a closed drawer is not in the tree").toHaveCount(0);
    });

    test("an edge drawer sits against its edge and stretches the cross axis", async ({ page }) => {
        await openAt(page, "left");

        await expect(page.locator(DIALOG), "opening one mounts a modal dialog").toHaveAttribute("aria-modal", "true");
        await expect(page.locator(DIALOG), "named by the consumer").toHaveAttribute("aria-label", /.+/);

        const box = await layoutBox(page);

        expect(box.left, "a left drawer sits against the left edge rather than being centered").toBe(0);
        expect(box.height, "and stretches down the cross axis, which is the placement the library owns").toBe(
            box.rootHeight,
        );

        expect(await activeText(page), "focus lands on the first focusable child by default").toContain("First");
    });

    /**
     * `modalRoot` is a grid rather than a flex row precisely so both axes can state "stretch"
     * independently, and a left drawer cannot show that — sticking to the left and filling the height is
     * one axis each way. A top drawer is the case that would have failed as a flex row, because it has to
     * stick to the top *and* fill the width, so it is the one worth driving.
     */
    test("a top drawer sticks to its edge and fills the other axis", async ({ page }) => {
        await openAt(page, "top");

        const box = await layoutBox(page);

        expect(box.top, "it sits against the top edge").toBe(0);
        expect(
            box.width,
            "and fills the width, which is the axis a flex row could not have stretched at the same time",
        ).toBe(box.rootWidth);
    });

    test("the far edges are honored too, so all four are the same grid stating different corners", async ({ page }) => {
        await openAt(page, "right");

        const right = await layoutBox(page);

        expect(right.left + right.width, "a right drawer ends at the right edge").toBe(right.rootWidth);
        expect(right.height, "and still stretches the cross axis").toBe(right.rootHeight);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG)).toHaveCount(0);

        await openAt(page, "bottom");

        const bottom = await layoutBox(page);

        expect(bottom.top + bottom.height, "a bottom drawer ends at the bottom edge").toBe(bottom.rootHeight);
        expect(bottom.width, "filling the other axis, as the top one does").toBe(bottom.rootWidth);
    });

    test("Escape and an overlay click both close it", async ({ page }) => {
        await page.locator("#openDrawer").click();
        await expect(page.locator(DIALOG)).toBeVisible();

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "Escape closes it").toHaveCount(0);
        await expect(page.locator("#openDrawer"), "and the owner's button has focus back").toBeFocused();

        await page.locator("#openDrawer").click();
        await expect(page.locator(DIALOG)).toBeVisible();
        await clickOverlayCorner(page);
        await expect(page.locator(DIALOG), "a click on the overlay closes it too").toHaveCount(0);
    });
});

/**
 * The alert example's two dismissal knobs start off, which is the case the section is about: an alert must be
 * answered. Turning them on is what shows the knobs reach the dialog.
 */
test.describe("Modal in its alert mode", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/modal/docs");
        await expect(page.locator("#openAlert")).toBeVisible();
        await docsSettled(page);
    });

    test("it takes the alertdialog role and describes the decision", async ({ page }) => {
        await page.locator("#openAlert").click();

        await expect(page.locator(ALERT), "an alert dialog carries role=alertdialog, not role=dialog").toHaveCount(1);
        await expect(page.locator(ALERT), "and points at the text explaining the decision").toHaveAttribute(
            "aria-describedby",
            /.+/,
        );
        expect(
            await activeText(page),
            "focus lands on the mandatory initial target rather than on the first focusable child",
        ).toContain("Cancel");
    });

    test("neither an overlay click nor Escape can dismiss it", async ({ page }) => {
        const before = await alertReadout(page);

        await page.locator("#openAlert").click();
        await expect(page.locator(ALERT)).toBeVisible();

        await clickOverlayCorner(page);
        await expect(
            page.locator(ALERT),
            "clicking the overlay does not dismiss it — an alert must be answered",
        ).toHaveCount(1);

        await page.keyboard.press("Escape");
        await expect(page.locator(ALERT), "Escape is refused too, since a stray key is not an answer").toHaveCount(1);
        expect(await alertReadout(page), "with no outcome").toBe(before);
    });

    test("with its dismissal knobs on, Escape and the overlay close it again", async ({ page }) => {
        await page.locator(`${prop("isDismissableOnOverlayClick")} input`).click();
        await page.locator(`${prop("isDismissableOnEscape")} input`).click();

        await page.locator("#openAlert").click();
        await expect(page.locator(ALERT)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.locator(ALERT), "Escape closes it once allowed").toHaveCount(0);

        await page.locator("#openAlert").click();
        await expect(page.locator(ALERT)).toBeVisible();
        await clickOverlayCorner(page);
        await expect(page.locator(ALERT), "and so does the overlay").toHaveCount(0);
    });

    test("the initial focus target can be activated straight away", async ({ page }) => {
        const before = await alertReadout(page);

        await page.locator("#openAlert").click();
        await expect(page.locator(ALERT)).toBeVisible();

        await page.keyboard.press("Enter");
        await expect(page.locator(ALERT), "the initial focus target can be activated straight away").toHaveCount(0);
        expect(await alertReadout(page), "and reports what was answered").not.toBe(before);
    });
});

/**
 * A layer opened from inside another one is the case a single dismissal listener per control cannot get
 * right: every control used to handle `Escape` on its own and let the key travel on, so the modal
 * listening at the document heard the same press and closed underneath the popup that had just consumed
 * it. One Escape closes one layer, the top one.
 */
test.describe("A popup inside a modal", () => {
    const LISTBOX = '[role="listbox"]';
    const COMBOBOX = `${DIALOG} [role="combobox"]`;

    const openBoth = async (page: Page) => {
        await page.locator("#openLayers").click();
        await expect(page.locator(DIALOG)).toBeVisible();

        await page.locator(COMBOBOX).click();
        await expect(page.locator(LISTBOX)).toBeVisible();
    };

    test.beforeEach(async ({ page }) => {
        await page.goto("/modal/docs");
        await expect(page.locator("#openLayers")).toBeVisible();
        await docsSettled(page);
    });

    test("one Escape closes only the top layer", async ({ page }) => {
        await openBoth(page);

        await page.keyboard.press("Escape");
        await expect(page.locator(LISTBOX), "the first press closes the list").toHaveCount(0);
        await expect(page.locator(DIALOG), "and the modal around it stays open").toHaveCount(1);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "the second press closes the modal").toHaveCount(0);
    });

    test("pressing inside the modal closes only the list", async ({ page }) => {
        await openBoth(page);

        await page.locator(`[id="${await page.locator(DIALOG).getAttribute("aria-labelledby")}"]`).click();
        await expect(page.locator(LISTBOX), "a press outside the list dismisses it").toHaveCount(0);
        await expect(page.locator(DIALOG), "while a press inside the modal is not outside the modal").toHaveCount(1);
    });

    test("the list paints above the modal it was opened from, so it can be used", async ({ page }) => {
        await openBoth(page);

        await page.locator(`${LISTBOX} [role="option"]`, { hasText: "Portugal" }).click();

        await expect(page.locator(LISTBOX)).toHaveCount(0);
        await expect(page.locator(DIALOG), "picking from a list inside a modal does not dismiss the modal").toHaveCount(
            1,
        );
        await expect(page.locator(COMBOBOX), "and the pick lands in the field").toContainText("Portugal");
    });
});

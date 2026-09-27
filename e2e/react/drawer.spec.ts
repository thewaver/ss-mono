import { type Page, expect, test } from "@playwright/test";

/**
 * The React `Drawer`, which is the React `Modal` attached to an edge. The cases follow the Drawer block of
 * `e2e/modal.spec.ts` and the swipe cases of `e2e/drawer.spec.ts`, which cover the Solid one: each edge sits against
 * its edge and stretches the other axis, Escape and the backdrop close it, and a push towards its own edge swipes it
 * away while anything else leaves it alone.
 *
 * Each drag runs in enough steps to clear the slop the gesture waits for before it takes the pointer over, and
 * opening waits for the panel to finish sliding in, since a panel measured mid-slide reports a box the pointer would
 * never land in.
 */
const DIALOG = '[aria-modal="true"]';
const STORY = "Essentials/Drawer/Default";
const OVERLAY_INSET = 4;
const DRAG_STEPS = 10;
const SETTLED_PX = 1;
const MIN_STRETCHED_HEIGHT = 600;

const readout = (page: Page, key: string) => page.locator(`[data-readout="${key}"]`);

const hasPanelSettled = async (page: Page) => {
    const dialog = (await page.locator(DIALOG).boundingBox())!;
    const panel = (await page.locator(`${DIALOG} > *`).boundingBox())!;

    return Math.abs(dialog.x - panel.x) < SETTLED_PX && Math.abs(dialog.y - panel.y) < SETTLED_PX;
};

const openDrawer = async (page: Page) => {
    await page.getByTestId("open").click();
    await expect(page.locator(DIALOG)).toBeVisible();
    await expect.poll(() => hasPanelSettled(page)).toBe(true);
};

/** In layout space, against the dialog's own positioned parent, so the numbers are exact integers. */
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

const pushDrawer = async (page: Page, from: [number, number], to: [number, number]) => {
    const box = (await page.locator(DIALOG).boundingBox())!;

    await page.mouse.move(box.x + box.width * from[0], box.y + box.height * from[1]);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * to[0], box.y + box.height * to[1], { steps: DRAG_STEPS });
    await page.mouse.up();
};

const clickOverlayCorner = async (page: Page) => {
    const box = await page.locator(DIALOG).evaluate((element) => {
        const rect = element.parentElement!.firstElementChild!.getBoundingClientRect();

        return { right: rect.right, bottom: rect.bottom };
    });

    await page.mouse.click(box.right - OVERLAY_INSET, box.bottom - OVERLAY_INSET);
};

test.describe("placement", () => {
    test("a closed drawer is not in the tree", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });

        await expect(page.locator(DIALOG)).toHaveCount(0);
    });

    test("a left drawer sits against its edge, stretches the cross axis, and focuses its first child", async ({
        page,
        mount,
    }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        await expect(page.locator(DIALOG), "it is a dialog").toHaveAttribute("role", "dialog");
        await expect(page.locator(DIALOG), "named by the consumer").toHaveAttribute("aria-label", "left drawer");

        const box = await layoutBox(page);

        expect(box.left, "a left drawer sits against the left edge rather than being centered").toBe(0);
        expect(box.height, "and stretches down the cross axis").toBeGreaterThan(MIN_STRETCHED_HEIGHT);
        await expect(page.getByTestId("first"), "focus lands on the first focusable child").toBeFocused();
    });

    test("a top drawer sticks to its edge and fills the other axis", async ({ page, mount }) => {
        await mount(STORY, { edge: "top" });
        await openDrawer(page);

        const box = await layoutBox(page);

        expect(box.top, "it sits against the top edge").toBe(0);
        expect(box.width, "and fills the width").toBe(box.rootWidth);
    });

    test("the far edges are honored too", async ({ page, mount }) => {
        await mount(STORY, { edge: "right" });
        await openDrawer(page);

        const right = await layoutBox(page);

        expect(right.left + right.width, "a right drawer ends at the right edge").toBe(right.rootWidth);
        expect(right.height, "and still stretches the cross axis").toBe(right.rootHeight);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG)).toHaveCount(0);

        await mount(STORY, { edge: "bottom" });
        await openDrawer(page);

        const bottom = await layoutBox(page);

        expect(bottom.top + bottom.height, "a bottom drawer ends at the bottom edge").toBe(bottom.rootHeight);
        expect(bottom.width, "filling the other axis, as the top one does").toBe(bottom.rootWidth);
    });

    test("Escape and an overlay click both close it", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        await page.keyboard.press("Escape");
        await expect(page.locator(DIALOG), "Escape closes it").toHaveCount(0);
        await expect(readout(page, "open"), "and the owner's state says so").toHaveText("false");

        await openDrawer(page);
        await clickOverlayCorner(page);
        await expect(page.locator(DIALOG), "a click on the overlay closes it too").toHaveCount(0);
    });
});

test.describe("swipe", () => {
    test("pushing a drawer towards its own edge closes it", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        await pushDrawer(page, [0.7, 0.5], [0.05, 0.5]);

        await expect(page.locator(DIALOG), "a push past the threshold dismisses it").toHaveCount(0);
    });

    test("a push that stops short of the threshold leaves the drawer open where it was", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        await pushDrawer(page, [0.7, 0.5], [0.6, 0.5]);

        await expect(page.locator(DIALOG), "the drawer is still there").toBeVisible();
        await expect
            .poll(async () => page.locator(DIALOG).evaluate((element) => (element as HTMLElement).style.transform), {
                message: "and it springs back to where it started rather than resting part-way",
            })
            .toBe("");
    });

    test("a push away from the edge moves nothing, because that is not the way out", async ({ page, mount }) => {
        await mount(STORY, { edge: "right" });
        await openDrawer(page);

        await pushDrawer(page, [0.3, 0.5], [0.9, 0.5]);

        await expect(page.locator(DIALOG), "pushing a right-edge drawer into the page keeps it open").toBeVisible();

        await pushDrawer(page, [0.3, 0.5], [0.95, 0.5]);

        await expect(page.locator(DIALOG), "and pushing it towards its own edge does close it").toHaveCount(0);
    });

    test("a drawer on a horizontal edge still lets the page pan the other way", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        await expect(page.locator(DIALOG), "the gesture claims its own axis and leaves the other").toHaveCSS(
            "touch-action",
            "pan-y",
        );
    });

    test("a drawer on a vertical edge is pushed the other way, and claims the other axis", async ({ page, mount }) => {
        await mount(STORY, { edge: "bottom" });
        await openDrawer(page);

        await expect(page.locator(DIALOG), "the vertical gesture leaves horizontal panning").toHaveCSS(
            "touch-action",
            "pan-x",
        );

        await pushDrawer(page, [0.5, 0.2], [0.5, 0.95]);

        await expect(page.locator(DIALOG), "pushing a bottom sheet downwards dismisses it").toHaveCount(0);

        await mount(STORY, { edge: "top" });
        await openDrawer(page);

        await pushDrawer(page, [0.5, 0.8], [0.5, 0.05]);

        await expect(page.locator(DIALOG), "and a top drawer goes back up the way it came").toHaveCount(0);
    });

    test("a swipe that starts on a control inside the drawer does not press it", async ({ page, mount }) => {
        await mount(STORY, { edge: "left" });
        await openDrawer(page);

        const box = (await page.locator(DIALOG).boundingBox())!;
        const close = (await page.getByTestId("close").boundingBox())!;

        await page.mouse.move(close.x + close.width * 0.5, close.y + close.height * 0.5);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.9, close.y + close.height * 0.5, { steps: DRAG_STEPS });
        await page.mouse.up();

        await expect(
            page.locator(DIALOG),
            "the drag reads as a swipe the wrong way rather than as a press on the control it began over",
        ).toBeVisible();
    });

    test("a drawer whose backdrop does not close it cannot be swiped either", async ({ page, mount }) => {
        await mount(STORY, { edge: "left", isDismissableOnOverlayClick: false });
        await openDrawer(page);

        await pushDrawer(page, [0.7, 0.5], [0.05, 0.5]);

        await expect(page.locator(DIALOG), "the swipe has no single-pointer twin, so it is off").toBeVisible();
    });
});

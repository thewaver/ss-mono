import { type Locator, expect, test } from "@playwright/test";

import { activeMatches, clickIsAllowed, inputValue, pickFiles, tabIndex } from "../helpers";

/**
 * The React `FileInput`, a real file input laid over a painter, over the React `InteractionWrapper`. The cases follow
 * `e2e/fileInput.spec.ts`, which covers the Solid one: the attributes passed through, a pick reaching the owner and
 * the painter, an owner refusing a pick and the input cleared to match, and a disabled control cancelling the click
 * that would open the dialog. The drop cases have no Solid counterpart in `e2e/`, and cover the drop area the
 * control makes of the box around it: a file drag shown to the painter, a drop checked against the same limits as a
 * pick, and a disabled control refusing it.
 */
const FIELD = "#field";
const FILES = '[data-readout="files"]';
const REJECTIONS = '[data-readout="rejections"]';
const PAINTER = "[data-drag-over], [aria-hidden]";

type FileDescriptor = { name: string; size: number; type: string };

/**
 * A drag cannot be made with real files from a test, so each drag event is dispatched by hand with a `DataTransfer`
 * holding the files, which is what the browser hands a drop area. It lands on the box around the input, where the
 * control listens.
 */
const dispatchDrag = (field: Locator, type: string, files: FileDescriptor[]) =>
    field.evaluate(
        (element, args) => {
            const transfer = new DataTransfer();

            for (const descriptor of args.files) {
                transfer.items.add(new File(["x".repeat(descriptor.size)], descriptor.name, { type: descriptor.type }));
            }

            element.parentElement!.dispatchEvent(
                new DragEvent(args.type, { bubbles: true, cancelable: true, dataTransfer: transfer }),
            );
        },
        { type, files },
    );

test("the control is a real file input and passes its attributes through", async ({ mount }) => {
    const plain = await mount("Essentials/FileInput/Default");

    await expect(plain.locator(FIELD), "the control is a real file input").toHaveAttribute("type", "file");
    await expect(plain.locator("input[disabled]"), "and it carries no native disabled attribute").toHaveCount(0);

    const multiple = await mount("Essentials/FileInput/Multiple");

    await expect(multiple.locator(FIELD), "multiple is passed through").toHaveAttribute("multiple", "");

    const images = await mount("Essentials/FileInput/Images");

    await expect(images.locator(FIELD), "so is accept").toHaveAttribute("accept", "image/*");
});

test("a pick reaches the owner and is drawn by the painter", async ({ mount }) => {
    const component = await mount("Essentials/FileInput/Default");

    await pickFiles(component.locator(FIELD), [{ name: "notes.txt", size: 10, type: "text/plain" }]);

    await expect(component.locator(FILES), "a pick reaches the owner's state").toHaveText("files: notes.txt");
    await expect(
        component.locator("[aria-hidden]").first(),
        "and the painter draws it from the flags, since the native rendering is suppressed",
    ).toContainText("notes.txt");
});

test("a rejecting owner can refuse a pick and the input is cleared to match", async ({ mount }) => {
    const component = await mount("Essentials/FileInput/RejectingSetter");

    await pickFiles(component.locator(FIELD), [{ name: "huge.bin", size: 4096, type: "application/octet-stream" }]);

    await expect(component.locator(FILES), "a rejecting owner can refuse a pick").toHaveText(
        "huge.bin is too big, pick again",
    );
    await expect
        .poll(
            () => inputValue(component.locator(FIELD)),
            "and the input is cleared to match, so re-picking the same file still fires a change",
        )
        .toBe("");
    await expect(component.locator(FIELD), "with the field announced invalid").toHaveAttribute("aria-invalid", "true");

    await pickFiles(component.locator(FIELD), [{ name: "tiny.txt", size: 10, type: "text/plain" }]);

    await expect(component.locator(FILES), "and an accepted pick lands").toHaveText("files: tiny.txt");
});

test("a pick the control's own limits refuse leaves the value, and the input, as they were", async ({ mount }) => {
    const component = await mount("Essentials/FileInput/DropZone");

    await pickFiles(component.locator(FIELD), [{ name: "a.png", size: 10, type: "image/png" }]);
    await expect(component.locator(FILES)).toHaveText("files: a.png");

    await pickFiles(component.locator(FIELD), [{ name: "notes.txt", size: 10, type: "text/plain" }]);

    await expect(component.locator(REJECTIONS), "the refused file is reported with its reason").toHaveText(
        "notes.txt: type",
    );
    await expect(component.locator(FILES), "while the value keeps what it held").toHaveText("files: a.png");
    await expect
        .poll(
            () => component.locator(FIELD).evaluate((element) => (element as HTMLInputElement).files?.[0]?.name),
            "and the input is put back to hold it too",
        )
        .toBe("a.png");
});

test("a disabled field cancels the click that would open the OS dialog", async ({ page, mount }) => {
    const component = await mount("Essentials/FileInput/Disabled");

    await expect(component.locator(FIELD), "a disabled field says so through ARIA").toHaveAttribute(
        "aria-disabled",
        "true",
    );
    expect(await tabIndex(component.locator(FIELD)), "and is out of the tab order").toBe(-1);
    expect(
        await clickIsAllowed(component.locator(FIELD)),
        "activation is refused by cancelling the click, which is the only thing that can stop a native file dialog",
    ).toBe(false);

    await component.locator(FIELD).click({ force: true });

    expect(await activeMatches(page, FIELD), "and clicking it does not focus it either").toBe(false);
});

test("its reachable twin keeps its tab stop and explains itself", async ({ page, mount }) => {
    const component = await mount("Essentials/FileInput/Disabled", { isReachable: true });

    expect(await tabIndex(component.locator(FIELD)), "its reachable twin keeps its tab stop").toBe(0);

    await component.locator(FIELD).hover({ force: true });

    await expect(page.locator('[role="tooltip"]'), "and reveals the tooltip explaining why").toBeVisible();
});

test("a file dragged over the control is shown to the painter, and a drop is checked like a pick", async ({
    mount,
}) => {
    const component = await mount("Essentials/FileInput/DropZone");
    const painter = component.locator(PAINTER).first();

    const arriving = [
        { name: "a.png", size: 10, type: "image/png" },
        { name: "notes.txt", size: 10, type: "text/plain" },
        { name: "b.png", size: 10, type: "image/png" },
        { name: "c.png", size: 10, type: "image/png" },
    ];

    await dispatchDrag(component.locator(FIELD), "dragenter", arriving);

    await expect(painter, "a file drag over the control is the painter's to show").toHaveAttribute(
        "data-drag-over",
        "true",
    );

    await dispatchDrag(component.locator(FIELD), "drop", arriving);

    await expect(painter, "and the drop ends it").not.toHaveAttribute("data-drag-over");
    await expect(component.locator(FILES), "the files that passed become the value, earliest first").toHaveText(
        "files: a.png, b.png",
    );
    await expect(component.locator(REJECTIONS), "and the rest are reported, in the order they arrived").toHaveText(
        "notes.txt: type, c.png: count",
    );
});

test("a drag that carries no files is not taken", async ({ mount }) => {
    const component = await mount("Essentials/FileInput/DropZone");

    await dispatchDrag(component.locator(FIELD), "dragenter", []);

    await expect(component.locator(PAINTER).first()).not.toHaveAttribute("data-drag-over");
});

test("a disabled control shows no drag and refuses the drop", async ({ mount }) => {
    const component = await mount("Essentials/FileInput/Disabled");
    const file = [{ name: "a.png", size: 10, type: "image/png" }];

    await dispatchDrag(component.locator(FIELD), "dragenter", file);

    await expect(component.locator(PAINTER).first()).not.toHaveAttribute("data-drag-over");

    await dispatchDrag(component.locator(FIELD), "drop", file);

    await expect(component.locator(PAINTER).first(), "and nothing arrived").toHaveText("Choose a file");
});

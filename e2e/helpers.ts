import type { Locator, Page } from "@playwright/test";

/**
 * A demo is found by the key its page gave it, never by the caption it displays. A caption is editorial —
 * anybody may reword one without touching a behavior — and a suite that reads captions answers "has the
 * copy changed" in the same red as "has the behavior changed". The key is chosen once, is never displayed,
 * and every Playground example, variant, props row and driven control carries its own in `data-testid`.
 */
export const variant = (key: string) => `[data-variant][data-testid="${key}"]`;

export const example = (key: string) => `[data-example][data-testid="${key}"]`;

/**
 * Each of the three carries the kind it is as a bare attribute and its key in `data-testid`, so a key is
 * only ever looked up among things of the same kind — a variant and a props row may both be keyed `size`
 * without either lookup becoming ambiguous. The bare attribute is also what `[data-variant]` presence
 * checks read, which is why the kind did not simply move into the key.
 */
export const prop = (key: string) => `[data-prop][data-testid="${key}"]`;

/**
 * Takes WebGL 2 away from the page before it loads, so every slice animation and particle component draws with page
 * elements — what a browser without WebGL 2 in an offscreen canvas gets. The specs that read one cell or one particle
 * at a time use it: the graphics card paints them all into one canvas, where none can be told apart, and which slices
 * play what, when and where is worked out the same way for both renderers. `graphicsCard.spec.ts` covers the canvas.
 */
export const useElementRenderer = (page: Page) =>
    page.addInitScript(() => {
        const getContext = OffscreenCanvas.prototype.getContext;

        OffscreenCanvas.prototype.getContext = function (this: OffscreenCanvas, type: string, ...rest: unknown[]) {
            return type === "webgl2" ? null : getContext.call(this, type as "2d", ...(rest as []));
        } as typeof getContext;
    });

/**
 * The demo itself, without the card around it. An example card carries a source-code button beside its
 * title, so a lookup for "the button in this card" finds that one first unless it is scoped to the demo.
 */
export const demo = (key: string) => `${example(key)} [data-demo]`;

/**
 * A Docs view's live example, found by the file its code is read from. The demo carries that file's path as its key,
 * and the path is the same in all four Playgrounds but for the extension, so the match stops at the dot: `Basic`
 * finds `Basic.tsx`, `Basic.vue` and `Basic.svelte`, and never `BasicGrouped.tsx`. `root` is the page's
 * `DOCS_ROOT`. A file renamed is a key renamed, and moves with the spec's locators in the same change.
 */
export const docsDemo = (root: string, name: string) =>
    `[data-docs-example] [data-demo][data-testid^="${root}/${name}."]`;

/**
 * Waits until every live example on a Docs view has its "Show code" box under it. Each box arrives only once its
 * source file has loaded, after the page has drawn, and each one pushes everything below it down the page — so a
 * pointer aimed at a control before then can land where the control used to be, and a hover is lost. A spec that
 * points at anything on a Docs view waits for this first.
 */
export const docsSettled = (page: Page) =>
    page.waitForFunction(() => {
        const examples = [...document.querySelectorAll("[data-docs-example]")];

        return examples.length > 0 && examples.every((example) => example.nextElementSibling !== null);
    });

/**
 * The whole box of a Docs view's live example — the demo and the knobs beside it — for a knob whose key another
 * example on the same page also uses, such as two examples each with an orientation.
 */
export const docsExample = (root: string, name: string) =>
    `[data-docs-example]:has([data-demo][data-testid^="${root}/${name}."])`;

/**
 * An example's own knobs sit in a popup its card opens from a settings button, so a props row belonging to
 * one example is not in the document until that popup is open. This opens it when the row is not already on
 * screen — the named example's popup when one is given, otherwise each card's in turn until the row appears.
 * Only one popup is open at a time, so opening a second closes the first.
 *
 * A row on screen is not necessarily a row that can be used: a popup that has just been closed stays painted
 * while it fades out, and is taken away the moment the fade ends, so a press aimed at a row in it lands on
 * nothing. Such a row only counts while the button that opened its popup still says the popup is open — which
 * `aria-controls` does only while it is — and one in a closing popup is waited out before the popup is reopened.
 */
const POPUP_WAIT_MS = 1000;

const readRowState = (page: Page, key: string) =>
    page.evaluate((selector) => {
        const row = document.querySelector(selector) as HTMLElement | null;

        if (!row || row.getClientRects().length === 0 || getComputedStyle(row).visibility === "hidden") return "absent";

        const popup = row.closest('[role="dialog"]');

        return !popup || document.querySelector(`[aria-controls="${popup.id}"]`) ? "usable" : "closing";
    }, prop(key));

export const revealProp = async (page: Page, key: string, exampleKey?: string) => {
    const row = page.locator(prop(key)).first();
    const state = await readRowState(page, key);

    if (state === "usable") return;
    if (state === "closing") await row.waitFor({ state: "hidden", timeout: POPUP_WAIT_MS });

    const triggers = page.locator(exampleKey ? `#${exampleKey}Knobs` : '[id$="Knobs"][aria-haspopup="dialog"]');

    for (let index = 0; index < (await triggers.count()); index++) {
        const trigger = triggers.nth(index);

        if ((await trigger.getAttribute("aria-expanded")) !== "true") await trigger.click();

        const isShown = await row.waitFor({ state: "visible", timeout: POPUP_WAIT_MS }).then(
            () => true,
            () => false,
        );

        if (isShown) return;
    }

    throw new Error(`no settings popup on this page holds the props row "${key}"`);
};

/** The reading the Playground itself displays, so a spec checks state the way the page shows it. */
export const readout = async (page: Page, key: string) =>
    ((await page.locator(`${variant(key)} [data-readout], ${example(key)} [data-readout]`).textContent()) ?? "").trim();

export const tagName = (locator: Locator) => locator.evaluate((element) => element.tagName);

export const tabIndex = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).tabIndex);

export const inputValue = (locator: Locator) => locator.evaluate((element) => (element as HTMLInputElement).value);

export const offsetHeight = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetHeight);

export const offsetTop = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetTop);

export const offsetLeft = (locator: Locator) => locator.evaluate((element) => (element as HTMLElement).offsetLeft);

export const scrollTop = (locator: Locator) => locator.evaluate((element) => element.scrollTop);

export const isScrolling = (locator: Locator) =>
    locator.evaluate((element) => element.scrollHeight > element.clientHeight);

export const isIndeterminate = (locator: Locator) =>
    locator.evaluate((element) => (element as HTMLInputElement).indeterminate);

export const isChecked = (locator: Locator) => locator.evaluate((element) => (element as HTMLInputElement).checked);

export const isReadOnly = (locator: Locator) => locator.evaluate((element) => (element as HTMLInputElement).readOnly);

export const inlineStyle = (locator: Locator, property: string) =>
    locator.evaluate((element, name) => (element as HTMLElement).style.getPropertyValue(name), property);

export const computedStyle = (locator: Locator, property: string) =>
    locator.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

/**
 * How far an element is turned, in degrees, whichever way the turn was written: the `rotate` property, a
 * `rotate(…)` inside `transform`, or both added together. A spec asks whether something is turned, and where
 * the stylesheet happens to write the angle is not part of that question.
 */
export const turnDegrees = (locator: Locator) =>
    locator.evaluate((element) => {
        const own = /(-?[\d.]+)deg/.exec(getComputedStyle(element).rotate)?.[1];
        const inTransform = /rotate\((-?[\d.]+)deg\)/.exec((element as HTMLElement).style.transform)?.[1];

        return Number(own ?? 0) + Number(inTransform ?? 0);
    });

export const selectionRange = (locator: Locator) =>
    locator.evaluate((element) => ({
        start: (element as HTMLInputElement).selectionStart,
        end: (element as HTMLInputElement).selectionEnd,
    }));

export const setSelectionRange = (locator: Locator, start: number, end: number) =>
    locator.evaluate((element, range) => (element as HTMLInputElement).setSelectionRange(range.start, range.end), {
        start,
        end,
    });

export const activeMatches = (page: Page, selector: string) =>
    page.evaluate((value) => document.activeElement?.matches(value) ?? false, selector);

export const activeText = async (page: Page) =>
    (await page.evaluate(() => document.activeElement?.textContent ?? "")).trim();

/**
 * What a screen reader would read out of an element, which is not `textContent`: a painter's decorative
 * glyphs are marked `aria-hidden` precisely so they stay out of the accessible name, and a harness that
 * reads them back has stopped checking the thing that matters.
 */
export const accessibleText = (locator: Locator) =>
    locator.evaluate((element) => {
        const clone = element.cloneNode(true) as HTMLElement;

        for (const hidden of clone.querySelectorAll("[aria-hidden]")) hidden.remove();

        return (clone.textContent ?? "").trim();
    });

/**
 * The highlight a `Select` or `Menu` painter draws is not in the DOM, so `aria-activedescendant` is the
 * only honest way to read it back — which is also the thing a screen reader goes by.
 */
export const activeDescendantText = (page: Page, selector: string) =>
    page.evaluate((value) => {
        const id = document.querySelector(value)?.getAttribute("aria-activedescendant");
        const option = id ? document.getElementById(id) : null;

        if (!option) return null;

        const clone = option.cloneNode(true) as HTMLElement;

        for (const hidden of clone.querySelectorAll("[aria-hidden]")) hidden.remove();

        return (clone.textContent ?? "").trim();
    }, selector);

export const selectedTexts = (page: Page, selector: string) =>
    page.evaluate(
        (value) =>
            [...document.querySelectorAll(value)]
                .filter((element) => element.getAttribute("aria-selected") === "true")
                .map((element) => {
                    const clone = element.cloneNode(true) as HTMLElement;

                    for (const hidden of clone.querySelectorAll("[aria-hidden]")) hidden.remove();

                    return (clone.textContent ?? "").trim();
                }),
        selector,
    );

export const attributesOf = (page: Page, selector: string, name: string) =>
    page.evaluate(
        (args) => [...document.querySelectorAll(args.selector)].map((element) => element.getAttribute(args.name)),
        { selector, name },
    );

/**
 * `input.files` cannot be assigned, so a pick is faked through a `DataTransfer` — the same object the
 * platform uses for a drop. It dispatches a real `change`, which is the event the control listens to.
 * Playwright's own `setInputFiles` would need real files on disk and would not exercise the refusal path.
 */
export const pickFiles = (locator: Locator, descriptors: Array<{ name: string; size: number; type: string }>) =>
    locator.evaluate((element, files) => {
        const transfer = new DataTransfer();

        for (const descriptor of files) {
            transfer.items.add(new File(["x".repeat(descriptor.size)], descriptor.name, { type: descriptor.type }));
        }

        (element as HTMLInputElement).files = transfer.files;
        element.dispatchEvent(new Event("change", { bubbles: true }));
    }, descriptors);

/** A color picker is an OS dialog, so the only drivable path is writing the value and reporting it. */
export const setColor = (locator: Locator, value: string) =>
    locator.evaluate((element, next) => {
        (element as HTMLInputElement).value = next;
        element.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);

/**
 * Canceling the click is the only thing that can stop a native file or color dialog, so the refusal is
 * observable as `defaultPrevented` and nowhere else.
 */
export const clickIsAllowed = (locator: Locator) =>
    locator.evaluate((element) => {
        const event = new MouseEvent("click", { bubbles: true, cancelable: true });

        element.dispatchEvent(event);

        return !event.defaultPrevented;
    });

/**
 * Waits until an element has stopped moving, resizing and scrolling, counted in animation frames rather
 * than on a clock.
 *
 * A spec that opens something and then waits a fixed span before measuring is asking two questions at once
 * — "did it end up in the right place" and "was the machine quick enough to have finished putting it
 * there" — and the second answers in the same red as the first. Under a full parallel run the second is
 * the one that fires. Watching frames instead means a loaded machine simply waits longer, while a layout
 * that is actually wrong still never arrives.
 *
 * Two thresholds, and both are needed. **`STILL_FRAMES` frames without movement** is what ends the wait,
 * matching what Playwright's own actionability check requires before it will click a moving target.
 * **`MIN_FRAMES` frames before that can count** is what stops the wait ending before the movement has
 * begun: a transition takes a frame or two to get going, and without the floor a caller that asked
 * immediately after a click would be told "it is still" about an element that had not yet moved. The floor
 * is in frames rather than milliseconds so that it stretches on a slow machine for the same reason the
 * rest of this does.
 *
 * @param locator The element to watch.
 * @param timeoutMs How long to give up after, as a guard against something that never settles. Arriving
 * late is not the failure being watched for, so it is generous.
 */
export const waitUntilStill = (locator: Locator, timeoutMs = 5_000) =>
    locator.evaluate(
        (element, limitMs) =>
            new Promise<void>((resolve, reject) => {
                const STILL_FRAMES = 2;
                const MIN_FRAMES = 6;
                const started = performance.now();

                let previous = "";
                let frames = 0;
                let stillFor = 0;

                const step = () => {
                    const rect = element.getBoundingClientRect();
                    const current = `${rect.x},${rect.y},${rect.width},${rect.height},${element.scrollLeft},${element.scrollTop}`;

                    stillFor = current === previous ? stillFor + 1 : 0;
                    previous = current;
                    frames++;

                    if (frames >= MIN_FRAMES && stillFor >= STILL_FRAMES) return resolve();

                    if (performance.now() - started > limitMs) {
                        return reject(new Error("the element was still moving when the wait ran out"));
                    }

                    requestAnimationFrame(step);
                };

                requestAnimationFrame(step);
            }),
        timeoutMs,
    );

/**
 * For a demo that lays one paint across a group of separate drawings, where each cell's gradients and clip paths
 * actually sit and where they ought to: across the whole group, shifted back by the cell's own place in it. Both are
 * measured in the group's own pixels, so the `Viewport` scale cancels out. A cell is a child of the group that holds
 * a drawing; the group is the first element whose children all do.
 */
export const readPaintAreas = (locator: Locator) =>
    locator.evaluate((root) => {
        const group = [...root.querySelectorAll("div")].find(
            (element) =>
                element.children.length > 1 && [...element.children].every((cell) => cell.querySelector("svg")),
        )!;
        const groupRect = group.getBoundingClientRect();
        const scale = group.offsetWidth / groupRect.width;

        return [...group.children].flatMap((cell) => {
            const cellRect = cell.getBoundingClientRect();
            const expected = [
                -(cellRect.left - groupRect.left) * scale,
                -(cellRect.top - groupRect.top) * scale,
                group.offsetWidth,
                group.offsetHeight,
            ];

            return [...cell.querySelectorAll("linearGradient, radialGradient, clipPath")].map((paint) => {
                const transform = paint.getAttribute(paint.tagName === "clipPath" ? "transform" : "gradientTransform");
                const match = transform?.match(/^translate\((\S+) (\S+)\) scale\((\S+) (\S+)\)/);

                return {
                    kind: paint.tagName,
                    units: paint.getAttribute(paint.tagName === "clipPath" ? "clipPathUnits" : "gradientUnits"),
                    actual: match ? match.slice(1).map(Number) : [],
                    expected,
                };
            });
        });
    });

/**
 * How far apart the middles of two elements' boxes are, in pixels.
 *
 * Used to ask whether a marker sits on an item without pinning where either of them is, or how big: a marker
 * that has glided onto its item shares its middle whatever padding or inset the painter gives it.
 */
export const centerDistance = async (first: Locator, second: Locator) => {
    const [a, b] = await Promise.all([first.boundingBox(), second.boundingBox()]);

    if (!a || !b) return Number.POSITIVE_INFINITY;

    return Math.hypot(a.x + a.width * 0.5 - (b.x + b.width * 0.5), a.y + a.height * 0.5 - (b.y + b.height * 0.5));
};

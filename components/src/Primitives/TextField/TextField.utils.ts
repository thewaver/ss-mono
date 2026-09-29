import { type CSSPadding, CSSUtils, MathUtils } from "@thewaver/ss-utils";

import { TEXT_FIELD_DEFAULTS } from "./TextField.const";
import type { TextFieldElementType, TextFieldType } from "./TextField.types";

/** The line height assumed, as a multiple of the font size, when the computed style gives none in pixels. */
const FALLBACK_LINE_HEIGHT_RATIO = 1.2;

/**
 * The part of a text field that is not about the framework drawing it: how its text is inset past what sits beside
 * it, how a multi-line box sizes itself to its rows, and what a spin button announces holding.
 */
export namespace TextFieldUtils {
    /**
     * The padding as four numbers, from either one number or four.
     *
     * @param padding One number for every side, or the four sides spelled out.
     * @returns The four sides.
     */
    export const resolvePadding = (padding: CSSPadding | number): CSSPadding =>
        typeof padding === "number" ? CSSUtils.spreadPadding(padding) : padding;

    /**
     * How far the text sits from one edge of the field.
     *
     * The field's own padding on that side, plus the width of whatever is drawn there and the gap after it — so a
     * leading icon pushes the text along, and no icon leaves the padding alone rather than adding a stray gap.
     *
     * @param edge The field's padding on that side.
     * @param adornmentWidth The width of what is drawn on that side, or `0` when nothing is.
     * @param gap The space between that and the text.
     * @returns The inset, in pixels.
     */
    export const computeInset = (edge: number, adornmentWidth: number, gap: number) =>
        edge + (adornmentWidth ? adornmentWidth + gap : 0);

    /**
     * The `type` the element carries.
     *
     * A textarea takes no `type` at all, so it gets none; an input gets the one asked for, or plain text.
     *
     * @param element Whether the field is an input or a textarea.
     * @param type The type asked for, if any.
     * @returns The attribute's value, or `undefined` for a textarea.
     */
    export const computeType = (element: TextFieldElementType | undefined, type: TextFieldType | undefined) =>
        element === "textarea" ? undefined : (type ?? TEXT_FIELD_DEFAULTS.type);

    /**
     * Whether the field grows with its text.
     *
     * Only a textarea can, because only it has rows to add; asking an input to is ignored.
     *
     * @param element Whether the field is an input or a textarea.
     * @param isAutoSizing Whether the caller asked for it.
     * @returns `true` only for an auto-sizing textarea.
     */
    export const computeIsAutoSizing = (element: TextFieldElementType | undefined, isAutoSizing: boolean | undefined) =>
        element === "textarea" && (isAutoSizing ?? false);

    /**
     * The number a spin button announces holding.
     *
     * @param text What the field holds.
     * @param parse The caller's own reading of the text, for text not written the way `Number` reads it. Left out,
     * the text is read with `Number`.
     * @returns The number, or `undefined` for empty text and text that is not a finite number — a spin button then
     * announces no value rather than a wrong one.
     */
    export const computeSpinValue = (text: string, parse?: (text: string) => number | undefined) => {
        if (parse) return parse(text);

        const parsed = Number(text);

        return text !== "" && Number.isFinite(parsed) ? parsed : undefined;
    };

    /**
     * How a textarea handles text taller than itself.
     *
     * An auto-sizing box with no row ceiling never has more text than room, so it hides the scrollbar a rounding
     * error would otherwise flash; every other textarea scrolls. An input is left to the browser.
     *
     * @param element Whether the field is an input or a textarea.
     * @param isAutoSizing Whether the field grows with its text.
     * @param maxRows The most rows it grows to, if any.
     * @returns The `overflow-y` to set, or `undefined` for an input.
     */
    export const computeOverflowY = (
        element: TextFieldElementType | undefined,
        isAutoSizing: boolean,
        maxRows: number | undefined,
    ) => {
        if (element !== "textarea") return undefined;

        return isAutoSizing && maxRows === undefined ? "hidden" : "auto";
    };

    /**
     * The height a multi-line field needs for its text, held between its row floor and ceiling.
     *
     * The element is let go of its stretched bottom edge for the moment it is measured, so it reports the height of
     * its text rather than the height of the box it sits in, and is put back straight afterwards. Rows are counted
     * in the element's own line height, or its font size times 1.2 where the line height is not in pixels, and its
     * vertical padding is added to both limits.
     *
     * @param element The textarea.
     * @param minRows The fewest rows to show, however little text there is.
     * @param maxRows The most rows to grow to, or `undefined` for no ceiling.
     * @returns The height, in pixels.
     */
    export const measureContentHeight = (element: HTMLElement, minRows: number, maxRows: number | undefined) => {
        const style = getComputedStyle(element);
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * FALLBACK_LINE_HEIGHT_RATIO;
        const framing = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

        element.style.bottom = "auto";

        const contentHeight = element.scrollHeight;

        element.style.bottom = "";

        const floor = minRows * lineHeight + framing;
        const ceiling = maxRows === undefined ? Number.POSITIVE_INFINITY : maxRows * lineHeight + framing;

        return MathUtils.clamp(contentHeight, floor, ceiling);
    };

    /**
     * Calls back whenever an element's content width changes, which is when its text rewraps.
     *
     * A change of height alone is ignored, since that is what measuring the text and applying the result causes —
     * reacting to it would measure again for nothing. Nothing is reported on the spot; the width the element starts
     * at is the one later readings are compared with.
     *
     * @param element The element to watch.
     * @param onChange Called after the width changes.
     * @returns The function that stops watching.
     */
    export const observeWidthChange = (element: HTMLElement, onChange: () => void) => {
        let lastWidth = element.clientWidth;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentBoxSize[0].inlineSize;

            if (width === lastWidth) return;

            lastWidth = width;

            onChange();
        });

        observer.observe(element);

        return () => observer.disconnect();
    };
}

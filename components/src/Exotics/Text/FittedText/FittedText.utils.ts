import { JSXTextMetricsUtils, type Size2d, StoreUtils, type TextMetricsStyle } from "@thewaver/ss-utils";

import type { FittedTextLayout, FittedTextLayoutOpts, FittedTextLayoutState } from "./FittedText.types";

/** The font size the lines are measured at before they are scaled; any size would do, since widths scale with it. */
const REFERENCE_FONT_PX = 100;

const NO_SIZES: number[] = [];

const getIsSameSizes = (a: readonly number[], b: readonly number[]) =>
    a.length === b.length && a.every((size, index) => size === b[index]);

/**
 * Sizes a stack of lines so the block fills its box: every line as wide as the box, then all of them shrunk together
 * until the stack fits the height, so a short line comes out larger than a long one.
 */
export namespace FittedTextUtils {
    /**
     * The font the lines are drawn in, read off the element they sit in, at the size they are measured at.
     *
     * Letter and word spacing are carried across as a share of the element's own font size, so spacing written in
     * `em` keeps its proportion as the lines are scaled.
     *
     * @param element The element the lines inherit their font from.
     * @returns The measured properties, with `font-size` at the reference size.
     */
    export const readMetrics = (element: HTMLElement): TextMetricsStyle => {
        const style = getComputedStyle(element);
        const fontPx = parseFloat(style.fontSize) || REFERENCE_FONT_PX;
        const toReference = (value: string) =>
            `${((JSXTextMetricsUtils.parseTextMetric(value) || 0) / fontPx) * REFERENCE_FONT_PX}px`;

        return {
            "font-family": style.fontFamily,
            "font-size": `${REFERENCE_FONT_PX}px`,
            "font-style": style.fontStyle,
            "font-weight": style.fontWeight,
            "letter-spacing": toReference(style.letterSpacing),
            "text-transform": style.textTransform,
            "word-spacing": toReference(style.wordSpacing),
        };
    };

    /**
     * One font size per line, so the stack fills the box.
     *
     * Each line is first scaled to the box's full width, then every line is shrunk by the same factor until the
     * stack, with each line as tall as its size times `lineHeightRatio`, fits the height.
     *
     * @param lines The lines, top to bottom. An empty line takes no room and gets a size of `0`.
     * @param metrics The font, from {@link readMetrics}.
     * @param size The box to fill, in pixels.
     * @param lineHeightRatio Each line's height as a multiple of its font size.
     * @returns One whole-pixel size per line, or all zeroes for a box with no area.
     */
    export const computeFontSizes = (
        lines: readonly string[],
        metrics: TextMetricsStyle,
        size: Size2d,
        lineHeightRatio: number,
    ) => {
        if (size.width <= 0 || size.height <= 0) return lines.map(() => 0);

        return JSXTextMetricsUtils.getNormalizedFontSizes([...lines], metrics, size, {
            lineHeightRatios: lines.map(() => lineHeightRatio),
        });
    };

    /**
     * Holds the sizes a `FittedText` draws its lines at, and measures them again when they could have changed.
     *
     * `observe` attaches it to the element the lines sit in: it measures at once, and again when that element changes
     * size or a web font finishes loading, since a font arriving changes every width without changing any box.
     * The box's size is its layout size, so a scaled ancestor does not change the answer.
     *
     * @param opts What the layout reads, at the moment it measures.
     * @returns The layout.
     */
    export const createLayout = (opts: FittedTextLayoutOpts): FittedTextLayout => {
        const store = StoreUtils.create<FittedTextLayoutState>({ fontSizes: NO_SIZES });

        let root: HTMLElement | undefined;

        const update = () => {
            if (!root) return false;

            const fontSizes = computeFontSizes(
                opts.getLines(),
                readMetrics(root),
                { width: root.clientWidth, height: root.clientHeight },
                opts.getLineHeightRatio(),
            );

            store.update((state) => (getIsSameSizes(state.fontSizes, fontSizes) ? state : { fontSizes }));

            return true;
        };

        const observe = (element: HTMLElement) => {
            root = element;

            const resizeObserver = new ResizeObserver(() => update());
            const handleLoaded = () => update();

            resizeObserver.observe(element);
            document.fonts.addEventListener("loadingdone", handleLoaded);
            update();

            return () => {
                resizeObserver.disconnect();
                document.fonts.removeEventListener("loadingdone", handleLoaded);

                if (root === element) root = undefined;
            };
        };

        return { get: store.get, subscribe: store.subscribe, update, observe };
    };
}

import { type ElementSegment, JSXTextParserUtils, StoreUtils } from "@thewaver/ss-utils";

import type { SVGDefsOf } from "../../../Generators/SVGDefs/SVGDefs.types";
import type {
    PaintedTextLayout,
    PaintedTextLayoutOpts,
    PaintedTextLayoutState,
    PaintedTextRun,
    PaintedTextStrokeAlignment,
    PaintedTextStrokePaint,
} from "./PaintedText.types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const MASKED_STROKE_SCALE = 2;
const CURRENT_COLOR = "currentColor";
const NO_SCALE = 1;

/** What a whole element is drawn as once it is in the SVG. */
type AtomicKind = "image" | "svg" | "foreign";

/** Names the elements in the text the painted copy cannot reproduce, so the difference is never a mystery. */
const warnIfUnsupported = (source: HTMLElement) => {
    const unsupported = JSXTextParserUtils.findUnsupportedElements(source);

    if (!unsupported.length) return;

    console.warn(
        `PaintedText: ${unsupported.map((element) => `<${element.localName}>`).join(", ")} cannot be copied faithfully into the painted text, which loses a canvas's drawing, media playback, a frame's page and a form control's value.`,
    );
};

/** Which SVG element stands in for a whole element: an image for `<img>`, itself for `<svg>`, a foreign object otherwise. */
const getAtomicKind = (element: Element): AtomicKind => {
    if (element instanceof HTMLImageElement) return "image";
    if (element instanceof SVGSVGElement) return "svg";

    return "foreign";
};

/**
 * How much larger an element is drawn on screen than it is laid out, which is not `1` inside a scaled ancestor. A
 * client rect is on screen and an SVG coordinate is in layout, so every rect is divided by this before it is used.
 */
const getScreenScale = (element: HTMLElement, box: DOMRect) =>
    element.offsetWidth > 0 ? box.width / element.offsetWidth : NO_SCALE;

/** A zero-sized inline block, whose top sits exactly on the baseline of the line it is placed in. */
const createBaselineProbe = () => {
    const probe = document.createElement("span");

    probe.style.display = "inline-block";
    probe.style.width = "0";
    probe.style.height = "0";

    return probe;
};

/** The HTML one segment is laid out as in the hidden layout host, which is what `Typewriter` draws for it. */
const createLayoutNode = (segment: ElementSegment) => {
    switch (segment.type) {
        case "linebreak":
            return document.createElement("br");
        case "atomic": {
            const wrap = document.createElement("span");

            wrap.style.display = "inline-block";

            if (segment.isBlockLike) wrap.style.width = "100%";

            wrap.append(segment.element.cloneNode(true));

            return wrap;
        }
        case "text": {
            const span = document.createElement("span");

            for (const [key, value] of Object.entries({ ...segment.nonMetrics, ...segment.metrics })) {
                span.style.setProperty(key, String(value));
            }

            span.append(segment.text, createBaselineProbe());

            return span;
        }
    }
};

/** Builds the SVG element a whole element is drawn as, placed over the box its copy took in the layout. */
const createAtomicNode = (element: Element, box: { x: number; y: number; width: number; height: number }) => {
    const kind = getAtomicKind(element);
    const node =
        kind === "image"
            ? document.createElementNS(SVG_NAMESPACE, "image")
            : kind === "svg"
              ? (element.cloneNode(true) as SVGSVGElement)
              : document.createElementNS(SVG_NAMESPACE, "foreignObject");

    node.setAttribute("x", `${box.x}`);
    node.setAttribute("y", `${box.y}`);
    node.setAttribute("width", `${box.width}`);
    node.setAttribute("height", `${box.height}`);

    if (kind === "image") {
        const image = element as HTMLImageElement;

        node.setAttribute("href", image.currentSrc || image.src);
        node.setAttribute("preserveAspectRatio", "none");

        if (image.alt) {
            node.setAttribute("role", "img");
            node.setAttribute("aria-label", image.alt);
        } else {
            node.setAttribute("aria-hidden", "true");
        }
    } else if (kind === "foreign") {
        node.append(element.cloneNode(true));
    }

    return node;
};

/**
 * Paints text with SVG gradients, patterns and filters: measures the consumer's text, wraps it as `Typewriter` does,
 * and finds where every run and every image lands, so a component can redraw it as SVG text in the same places.
 */
export namespace PaintedTextUtils {
    /**
     * How a stroke is drawn for an alignment.
     *
     * SVG draws a stroke centered on the edge of each letter. Keeping only the half outside or inside the letters
     * means drawing it twice as wide and masking the other half away, so the visible width is what was asked for
     * either way.
     *
     * @param alignment Where the stroke sits relative to the edge of each letter.
     * @param strokeWidth How wide the visible stroke is.
     */
    export const computeStrokePaint = (
        alignment: PaintedTextStrokeAlignment,
        strokeWidth: number,
    ): PaintedTextStrokePaint =>
        alignment === "center"
            ? { drawnWidth: strokeWidth, maskKind: undefined }
            : { drawnWidth: strokeWidth * MASKED_STROKE_SCALE, maskKind: alignment };

    /**
     * The fill layers to draw: the consumer's, or the current text color when there is no paint of any kind, so the
     * text never vanishes for want of a def.
     *
     * Asking for a stroke alone draws no fill, which is what leaves the letters hollow. An empty list counts as no
     * fill, the same as a missing one.
     *
     * @param fillDefs The fill's records, if any.
     * @param strokeDefs The stroke's records, if any.
     */
    export const resolveFillDefs = <TElement>(
        fillDefs: SVGDefsOf<TElement>[] | undefined,
        strokeDefs: SVGDefsOf<TElement>[] | undefined,
    ): SVGDefsOf<TElement>[] => {
        if (fillDefs?.length) return fillDefs;

        return strokeDefs?.length ? [] : [{ color: CURRENT_COLOR }];
    };

    /**
     * Whether a layer is the one read aloud and carrying the links.
     *
     * The text is drawn once per layer, and only one copy may reach a screen reader or the tab order: the first fill,
     * or the first stroke when there is no fill.
     *
     * @param kind Whether the layer is a fill or a stroke.
     * @param index The layer's place among its kind.
     * @param fillCount How many fill layers there are.
     */
    export const getIsReadableLayer = (kind: "fill" | "stroke", index: number, fillCount: number) =>
        index === 0 && (kind === "fill" || fillCount === 0);

    /**
     * Lays the consumer's text out and keeps the result: where every run's baseline starts, and every image and
     * other whole element built as SVG and placed.
     *
     * The text is taken from the hidden source copy, wrapped at its width by `JSXTextParserUtils`, then laid out as
     * HTML in the layout host — which stays in the flow, invisibly, and gives the component its height — and read
     * back from there, so vertical alignment, line height and text alignment are the browser's own. An `<img>`
     * becomes an SVG `<image>`, an `<svg>` is copied in whole, and anything else is copied into a `<foreignObject>`.
     *
     * The first measurement, and every one after the content changes, warns about elements the copy cannot
     * reproduce — see `JSXTextParserUtils.findUnsupportedElements`.
     *
     * @param opts The two elements the layout reads and writes.
     * @returns The layout.
     */
    export const createLayout = (opts: PaintedTextLayoutOpts): PaintedTextLayout => {
        const store = StoreUtils.create<PaintedTextLayoutState>(
            { width: undefined, height: 0, runs: [], atomics: [] },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const measure = (isContentChange: boolean) => {
            const source = opts.getSource();
            const host = opts.getLayoutHost();

            if (!source || !host) return false;

            if (isContentChange || store.get().width === undefined) warnIfUnsupported(source);

            const width = source.clientWidth;
            const segments = JSXTextParserUtils.getInlinedSegments(JSXTextParserUtils.getSegmentTokens(source), width);
            const nodes = segments.map(createLayoutNode);

            host.replaceChildren(...nodes);

            const hostBox = host.getBoundingClientRect();
            const scale = getScreenScale(host, hostBox);
            const runs: PaintedTextRun[] = [];
            const atomics: SVGElement[] = [];

            segments.forEach((segment, index) => {
                const node = nodes[index];

                if (segment.type === "text") {
                    const box = node.getBoundingClientRect();
                    const baseline = (node.lastChild as HTMLElement).getBoundingClientRect().top;

                    runs.push({
                        text: segment.text,
                        x: (box.left - hostBox.left) / scale,
                        y: (baseline - hostBox.top) / scale,
                        style: segment.metrics,
                        title: segment.meta.common.title,
                        anchor: segment.meta.anchor,
                    });
                } else if (segment.type === "atomic") {
                    const element = node.firstChild as Element;
                    const box = element.getBoundingClientRect();

                    atomics.push(
                        createAtomicNode(segment.element, {
                            x: (box.left - hostBox.left) / scale,
                            y: (box.top - hostBox.top) / scale,
                            width: box.width / scale,
                            height: box.height / scale,
                        }),
                    );
                }
            });

            store.set({ width, height: host.offsetHeight, runs, atomics });

            return true;
        };

        const update = () => measure(false);

        const observe = (source: HTMLElement) => {
            const resizeObserver = new ResizeObserver(() => measure(false));
            const mutationObserver = new MutationObserver(() => measure(true));
            const handleLoaded = () => measure(false);

            resizeObserver.observe(source);
            mutationObserver.observe(source, { subtree: true, childList: true, characterData: true, attributes: true });
            source.addEventListener("load", handleLoaded, true);
            document.fonts.addEventListener("loadingdone", handleLoaded);

            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
                source.removeEventListener("load", handleLoaded, true);
                document.fonts.removeEventListener("loadingdone", handleLoaded);
            };
        };

        return { get: store.get, subscribe: store.subscribe, update, observe };
    };
}

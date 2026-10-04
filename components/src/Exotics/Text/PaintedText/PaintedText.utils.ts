import { type ElementSegment, JSXTextParserUtils, StoreUtils } from "@thewaver/ss-utils";

import type { LetterState } from "../../../Abstracts/LetterDriver/LetterDriver.types";
import { LetterDriverUtils } from "../../../Abstracts/LetterDriver/LetterDriver.utils";
import type { SVGDefsOf } from "../../../Generators/SVGDefs/SVGDefs.types";
import type {
    PaintedTextLayout,
    PaintedTextLayoutOpts,
    PaintedTextLayoutState,
    PaintedTextLetter,
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

/** A letter laid out in a box of its own, so it can be styled and measured again while it pushes its neighbors. */
type PushedLetter =
    | { kind: "break" }
    | { kind: "text"; element: HTMLElement; probe: HTMLElement; style?: Record<string, string> }
    | { kind: "atomic"; element: HTMLElement; atomic: SVGElement; style?: Record<string, string> };

/**
 * The HTML one segment is laid out as when its letters push each other along: every character in an inline block of
 * its own, so a letter's keyframes can be applied to it alone and its box read back.
 */
const createPushingLayoutNode = (segment: ElementSegment) => {
    if (segment.type !== "text") return createLayoutNode(segment);

    const span = document.createElement("span");

    for (const [key, value] of Object.entries({ ...segment.nonMetrics, ...segment.metrics })) {
        span.style.setProperty(key, String(value));
    }

    for (const character of Array.from(segment.text)) {
        const letter = document.createElement("span");

        letter.style.display = "inline-block";
        letter.textContent = character;
        span.append(letter);
    }

    span.append(createBaselineProbe());

    return span;
};

/** Swaps one inline style set for another on an element, leaving every other property alone. */
const applyStyle = (
    element: HTMLElement,
    previous: Record<string, string> | undefined,
    next: Record<string, string> | undefined,
) => {
    for (const key of Object.keys(previous ?? {})) {
        if (!next || !(key in next)) element.style.removeProperty(key);
    }

    for (const [key, value] of Object.entries(next ?? {})) element.style.setProperty(key, value);
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
     * The style one drawn letter wears for what a wrapper says it is doing: hidden or not, and the keyframes it plays.
     *
     * The keyframes are a wrapper's own, written for HTML, so the letter is made to transform about its own center
     * — an SVG element otherwise scales and turns about the corner of the whole drawing — and is held at the moment
     * the wrapper's run has reached, as {@link LetterDriverUtils.computeAnimationStyle} describes.
     *
     * @param state What the letter is doing.
     * @param timeVar `LetterDriverStyles.letterDriverTimeVar`, which the wrapper sets on its root.
     * @returns Dashed CSS properties, empty for a letter doing nothing.
     */
    export const computeLetterStyle = (state: LetterState, timeVar: string): Record<string, string> => ({
        ...(state.isHidden ? { visibility: "hidden" } : {}),
        ...(state.animation
            ? {
                  ...LetterDriverUtils.computeAnimationStyle(state.animation, timeVar),
                  "transform-box": "fill-box",
                  "transform-origin": "center",
              }
            : {}),
    });

    /**
     * Lays the consumer's text out and keeps the result: where every run's baseline starts, and every image and
     * other whole element built as SVG and placed.
     *
     * The text is taken from the hidden source copy, wrapped at its width by `JSXTextParserUtils`, then laid out as
     * HTML in the layout host — which stays in the flow, invisibly, and gives the component its height — and read
     * back from there, so vertical alignment, line height and text alignment are the browser's own. An `<img>`
     * becomes an SVG `<image>`, an `<svg>` is copied in whole, and anything else is copied into a `<foreignObject>`.
     *
     * While a wrapper's letters push each other along as they grow (`getComputePushingAnimationName`), the text is
     * wrapped with every letter at its last frame, as `ProximityText` wraps it, and each letter is laid out in a box
     * of its own; `relayout` then styles those boxes and reads them back, moving each letter by as much as the ones
     * before it on its line grew, while the line breaks and `restLetters` stay where the text was first laid out.
     *
     * The first measurement, and every one after the content changes, warns about elements the copy cannot
     * reproduce — see `JSXTextParserUtils.findUnsupportedElements`.
     *
     * @param opts The two elements the layout reads and writes, and how the letters are driven.
     * @returns The layout.
     */
    export const createLayout = (opts: PaintedTextLayoutOpts): PaintedTextLayout => {
        const store = StoreUtils.create<PaintedTextLayoutState>(
            { width: undefined, height: 0, runs: [], atomics: [], letters: [], restLetters: [] },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        let pushed: PushedLetter[] = [];

        const measure = (isContentChange: boolean) => {
            const source = opts.getSource();
            const host = opts.getLayoutHost();

            if (!source || !host) return false;

            if (isContentChange || store.get().width === undefined) warnIfUnsupported(source);

            const width = source.clientWidth;
            const computePushingName = opts.getComputePushingAnimationName?.();
            const tokens = JSXTextParserUtils.getSegmentTokens(source);
            const segments = computePushingName
                ? LetterDriverUtils.wrapAtLastFrame(tokens, width, host.parentElement ?? host, computePushingName)
                : JSXTextParserUtils.getInlinedSegments(tokens, width);
            const nodes = segments.map((segment) =>
                computePushingName ? createPushingLayoutNode(segment) : createLayoutNode(segment),
            );

            host.replaceChildren(...nodes);

            const hostBox = host.getBoundingClientRect();
            const scale = getScreenScale(host, hostBox);
            const runs: PaintedTextRun[] = [];
            const atomics: SVGElement[] = [];
            const letters: PaintedTextLetter[] = [];
            const isMeasuringLetters = !!opts.getIsMeasuringLetters?.();

            pushed = [];

            const toBox = (rect: DOMRect) => ({
                x: (rect.left - hostBox.left) / scale,
                top: (rect.top - hostBox.top) / scale,
                width: rect.width / scale,
                height: rect.height / scale,
            });

            segments.forEach((segment, index) => {
                const node = nodes[index];

                if (segment.type === "linebreak") {
                    const previous = letters.at(-1);

                    if (isMeasuringLetters && !JSXTextParserUtils.getIsWrapBreak(segment)) {
                        letters.push({
                            kind: "break",
                            character: LetterDriverUtils.LINE_BREAK_CHARACTER,
                            x: previous ? previous.x + previous.width : 0,
                            top: previous?.top ?? 0,
                            width: 0,
                            height: previous?.height ?? 0,
                            baseline: previous?.baseline ?? 0,
                        });

                        if (computePushingName) pushed.push({ kind: "break" });
                    }
                } else if (segment.type === "text") {
                    const box = node.getBoundingClientRect();
                    const probe = node.lastChild as HTMLElement;
                    const baseline = probe.getBoundingClientRect().top;

                    if (computePushingName) {
                        Array.from(segment.text).forEach((character, charIndex) => {
                            const element = node.childNodes[charIndex] as HTMLElement;

                            letters.push({
                                kind: "text",
                                character,
                                ...toBox(element.getBoundingClientRect()),
                                baseline: (baseline - hostBox.top) / scale,
                                runIndex: runs.length,
                            });
                            pushed.push({ kind: "text", element, probe });
                        });
                    } else if (isMeasuringLetters) {
                        const textNode = node.firstChild as Text;
                        const range = document.createRange();
                        let offset = 0;

                        for (const character of Array.from(segment.text)) {
                            range.setStart(textNode, offset);
                            range.setEnd(textNode, offset + character.length);
                            offset += character.length;

                            letters.push({
                                kind: "text",
                                character,
                                ...toBox(range.getBoundingClientRect()),
                                baseline: (baseline - hostBox.top) / scale,
                                runIndex: runs.length,
                            });
                        }
                    }

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
                    const atomic = createAtomicNode(segment.element, {
                        x: (box.left - hostBox.left) / scale,
                        y: (box.top - hostBox.top) / scale,
                        width: box.width / scale,
                        height: box.height / scale,
                    });

                    if (isMeasuringLetters) {
                        letters.push({
                            kind: "atomic",
                            character: LetterDriverUtils.WHOLE_ELEMENT_CHARACTER,
                            ...toBox(box),
                            baseline: (box.bottom - hostBox.top) / scale,
                            atomicIndex: atomics.length,
                        });

                        if (computePushingName) pushed.push({ kind: "atomic", element: node, atomic });
                    }

                    atomics.push(atomic);
                }
            });

            store.set({ width, height: host.offsetHeight, runs, atomics, letters, restLetters: letters });

            return true;
        };

        const relayout = (styles: readonly (Record<string, string> | undefined)[]) => {
            const host = opts.getLayoutHost();
            const state = store.get();

            if (!host || !pushed.length || pushed.length !== state.restLetters.length) return;

            pushed.forEach((letter, index) => {
                if (letter.kind === "break") return;

                const next = styles[index];

                applyStyle(letter.element, letter.style, next);
                letter.style = next;
            });

            const hostBox = host.getBoundingClientRect();
            const scale = getScreenScale(host, hostBox);
            const letters: PaintedTextLetter[] = [];

            pushed.forEach((letter, index) => {
                const rest = state.restLetters[index];
                const previous = letters.at(-1);

                if (letter.kind === "break") {
                    letters.push({
                        ...rest,
                        x: previous ? previous.x + previous.width : 0,
                        top: previous?.top ?? 0,
                        height: previous?.height ?? 0,
                        baseline: previous?.baseline ?? 0,
                    });

                    return;
                }

                const measured = letter.kind === "atomic" ? (letter.element.firstChild as Element) : letter.element;
                const rect = measured.getBoundingClientRect();
                const box = {
                    x: (rect.left - hostBox.left) / scale,
                    top: (rect.top - hostBox.top) / scale,
                    width: rect.width / scale,
                    height: rect.height / scale,
                };

                if (letter.kind === "atomic") {
                    letter.atomic.setAttribute("x", `${box.x}`);
                    letter.atomic.setAttribute("y", `${box.top}`);
                    letters.push({ ...rest, ...box, baseline: (rect.bottom - hostBox.top) / scale });
                } else {
                    letters.push({
                        ...rest,
                        ...box,
                        baseline: (letter.probe.getBoundingClientRect().top - hostBox.top) / scale,
                    });
                }
            });

            store.set({ ...state, height: host.offsetHeight, letters });
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

        return { get: store.get, subscribe: store.subscribe, update, relayout, observe };
    };
}

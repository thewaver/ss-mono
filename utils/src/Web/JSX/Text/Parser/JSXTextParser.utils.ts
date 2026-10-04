import { deepEqual } from "fast-equals";

import { EMPTY_ARRAY } from "../../../../Abstracts/object.js";
import { StringUtils } from "../../../../Abstracts/string.js";
import { CSSUtils } from "../../../CSS/CSS.utils.js";
import type { TextMetricsStyle, TextNonMetricStyle } from "../Metrics/JSXTextMetrics.types.js";
import { JSXTextMetricsUtils } from "../Metrics/JSXTextMetrics.utils.js";

type SegmentType = "text" | "linebreak" | "atomic";

/** Details carried down from the surrounding elements, so a piece of text remembers where it came from. */
type StyledTextSegmentMeta = {
    common: {
        dataset: DOMStringMap;
        title: string;
    };
    anchor?: {
        href?: string;
        target?: string;
        rel?: string;
    };
};

/** A run of text along with the styles it should be measured and drawn with. */
type StyledTextSegment = {
    type: Extract<SegmentType, "text">;
    text: string;
    metrics: TextMetricsStyle;
    nonMetrics: TextNonMetricStyle;
    meta: StyledTextSegmentMeta;
};

/** A forced break — a `<br>`, a newline, or the edge of a block element. */
type LineBreakSegment = {
    type: Extract<SegmentType, "linebreak">;
};

/**
 * An element carried through whole, such as an image or icon, which cannot be split.
 *
 * `element` is a detached copy, which has no size of its own until it is put back in a page, so `width` and
 * `height` are the original's, read while it was still laid out. They are layout pixels, the same units text is
 * measured in, whatever scale an ancestor draws the page at. An inline copy is pinned to that size and to the
 * original's vertical alignment, since a style that reached the original through its parent does not reach a copy
 * placed somewhere else.
 */
type AtomicElementSegment = {
    type: Extract<SegmentType, "atomic">;
    element: HTMLElement;
    width: number;
    height: number;
    isBlockLike?: boolean;
};

/** One piece of parsed content: a run of text, a line break, or an unsplittable element. */
export type ElementSegment = StyledTextSegment | LineBreakSegment | AtomicElementSegment;

const lineBreakToken: LineBreakSegment = { type: "linebreak" };

/**
 * The break {@link JSXTextParserUtils.getInlinedSegments} inserts where a line runs out of room, kept apart from
 * {@link lineBreakToken} only by identity, so a caller can tell a break the content holds from one the width made.
 */
const wrapLineBreakToken: LineBreakSegment = { type: "linebreak" };

/**
 * The break standing for the edge of a block element, kept apart from {@link lineBreakToken} only by
 * identity, so the walk can tell a break the content asked for from one it inferred.
 */
const structuralLineBreakToken: LineBreakSegment = { type: "linebreak" };

/**
 * Elements whose children are not text a reader would see as text, so the walk copies them whole instead of
 * walking into them: an `<svg>`'s shapes mean nothing apart, and a `<video>`'s `<source>` or a `<select>`'s
 * `<option>` would otherwise be spelled out as words.
 */
const WHOLE_ELEMENT_SELECTOR = "svg, video, audio, canvas, iframe, object, embed, select, textarea";

/**
 * Elements a copy cannot reproduce: a canvas loses what was drawn on it, media loses its playback, a frame
 * reloads, and a form control loses its value and stops being one.
 */
const UNSUPPORTED_ELEMENT_SELECTOR = "canvas, video, audio, iframe, object, embed, input, select, textarea, button";

const NO_SCALE = 1;

/**
 * How much larger an element is drawn on screen than it is laid out — not `1` inside a scaled ancestor. A client rect
 * is on screen while a canvas measurement is in layout, so a rect is divided by this before the two are compared.
 */
const getScreenScale = (el: HTMLElement) =>
    el.offsetWidth > 0 ? el.getBoundingClientRect().width / el.offsetWidth : NO_SCALE;

/**
 * Splits text into words, built on first use.
 *
 * `undefined` means "not tried yet". Deliberately lazy so nothing runs while the file
 * loads, which keeps the package importable outside a browser.
 */
let wordSegmenter: Intl.Segmenter | undefined;

const getWordSegmenter = () => (wordSegmenter ??= new Intl.Segmenter(undefined, { granularity: "word" }));

/**
 * Splits one element's computed style into what a measurement needs and what a
 * rendering needs.
 *
 * `baselineStyle` is the style the parsed text will be redrawn under, not the element's
 * own parent. An inherited property is only safe to leave out when the destination
 * already resolves it to the same value, and the destination sits outside the tree being
 * walked — comparing against the immediate parent instead drops a color or a shadow set
 * two or more levels up, which then never arrives.
 *
 * `visibility` is never forced. The source being walked is usually a hidden copy, and the
 * destination is what decides whether the result is showing — forcing `visible` onto every
 * piece would stop the caller from hiding it with a class.
 */
const splitComputedStyle = (style: CSSStyleDeclaration, baselineStyle?: CSSStyleDeclaration) => {
    const metrics: TextMetricsStyle = {};
    const nonMetrics: TextNonMetricStyle = {};

    for (const key of style) {
        const value = style[key as keyof CSSStyleDeclaration] as any;

        if (!value) continue;

        const cssKey = StringUtils.camelToKebabCase(key);

        if (CSSUtils.isCssKeyUsedToMeasureText(cssKey)) {
            metrics[cssKey] = value;
        } else if (
            CSSUtils.isCssKeyUsedToRenderText(cssKey) &&
            !CSSUtils.isCssKeyExcludedForDisplayInline(cssKey) &&
            !CSSUtils.isCssKeyExcludedForCanvasTextMeasuring(cssKey)
        ) {
            const baselineValue = baselineStyle?.[key as keyof CSSStyleDeclaration];

            if (baselineValue !== value || !CSSUtils.isInheritedCssKey(cssKey)) {
                nonMetrics[cssKey as keyof TextNonMetricStyle] = value;
            }
        }
    }

    nonMetrics.display = "inline";
    nonMetrics["white-space"] = "pre";

    return { metrics, nonMetrics };
};

export namespace JSXTextParserUtils {
    /** Tests whether two runs of text would be measured identically — same font, spacing and case. */
    export const isSameMetricsStyle = (a: StyledTextSegment, b: StyledTextSegment) => deepEqual(a.metrics, b.metrics);

    /** Tests whether two runs of text would be drawn identically — same color, decoration and so on. */
    export const isSameNonMetricsStyle = (a: StyledTextSegment, b: StyledTextSegment) =>
        deepEqual(a.nonMetrics, b.nonMetrics);

    /** Tests whether two runs of text came from the same surroundings — same link, title and data attributes. */
    export const isSameMeta = (a: StyledTextSegment, b: StyledTextSegment) => deepEqual(a.meta, b.meta);

    /**
     * Tests whether a piece is a break {@link getInlinedSegments} inserted because a line ran out of room, rather
     * than one the content itself holds.
     *
     * A caller counting the pieces of a text — one per character, image and break — can leave these out, so the
     * count and every position in it stay the same at any width.
     */
    export const getIsWrapBreak = (segment: ElementSegment) => segment === wrapLineBreakToken;

    /**
     * Walks a rendered element and flattens it into a list of text runs, line breaks
     * and unsplittable elements.
     *
     * Each run of text carries the styles actually in force on it, read from the live
     * page, so the result can be re-measured or re-drawn faithfully. Block elements
     * become breaks between their contents and whatever sits beside them — never before
     * the first piece or after the last, where there is nothing to separate, so the result
     * never ends on an empty line the source did not draw; `<br>` and newlines become
     * breaks in place, wherever they are; childless elements such as images are carried
     * through whole as a copy, and so are an `<svg>`, media, frames, `<select>` and
     * `<textarea>`, whose children are not text, along with the size the original
     * was laid out at.
     *
     * Inherited properties are weighed against `el` itself rather than against each
     * piece's own parent, since `el` is the context the result will be redrawn in — so a
     * color or a shadow set anywhere between the two is carried, however deep.
     *
     * Browser only — it reads computed styles, so the element must already be in the
     * document.
     *
     * @param el The element to flatten. Its own styles stand in for the ones the result
     * will be drawn under, so it should be a sibling of wherever that happens.
     * @returns The pieces in reading order, or an empty list if there is no element.
     */
    export const getSegmentTokens = (el: Node): readonly ElementSegment[] => {
        if (!el) return EMPTY_ARRAY;

        const tokens: ElementSegment[] = [];
        const baselineStyle = el.nodeType === Node.ELEMENT_NODE ? getComputedStyle(el as Element) : undefined;
        const scale = el instanceof HTMLElement ? getScreenScale(el) : NO_SCALE;

        const pushStructuralLineBreak = () => {
            if (tokens.at(-1)?.type === "linebreak") return;

            tokens.push(structuralLineBreakToken);
        };

        const walk = (node: Node, meta: StyledTextSegmentMeta) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent ?? "";

                if (!text) return;

                const parent = node.parentElement;

                if (!parent) return;

                const { metrics, nonMetrics } = splitComputedStyle(getComputedStyle(parent), baselineStyle);

                for (const part of StringUtils.splitByLinebreaks(text)) {
                    const parsedPart = StringUtils.replaceTabs(part);

                    if (StringUtils.isLineBreak(parsedPart)) {
                        tokens.push(lineBreakToken);
                    } else {
                        tokens.push({
                            type: "text",
                            text: parsedPart,
                            metrics,
                            nonMetrics,
                            meta,
                        });
                    }
                }

                return;
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return;

            const element = node as HTMLElement;

            if (element.nodeName === "BR") {
                tokens.push(lineBreakToken);

                return;
            }

            const computed = getComputedStyle(element);
            const isBlockLike = CSSUtils.isBlockLike(computed.display);

            if (
                (element.childNodes.length === 0 && computed.display !== "contents") ||
                element.matches(WHOLE_ELEMENT_SELECTOR)
            ) {
                const box = element.getBoundingClientRect();
                const width = box.width / scale;
                const height = box.height / scale;
                const copy = node.cloneNode(true) as HTMLElement;

                if (!isBlockLike) {
                    copy.style.width = `${width}px`;
                    copy.style.height = `${height}px`;
                    copy.style.verticalAlign = computed.verticalAlign;
                }

                tokens.push({
                    type: "atomic",
                    element: copy,
                    width,
                    height,
                    isBlockLike,
                });
            } else {
                const nextMeta = {
                    ...meta,
                    common: {
                        dataset: element.dataset,
                        title: element.title,
                    },
                };

                if (element instanceof HTMLAnchorElement) {
                    nextMeta.anchor = {
                        href: element.href,
                        target: element.target,
                        rel: element.rel,
                    };
                }

                if (isBlockLike && tokens.length > 0) {
                    pushStructuralLineBreak();
                }

                for (const child of Array.from(element.childNodes)) {
                    walk(child, nextMeta);
                }

                if (isBlockLike && tokens.length > 0) {
                    pushStructuralLineBreak();
                }
            }
        };

        walk(el, {
            common: {
                dataset: {},
                title: "",
            },
        });

        if (tokens.at(-1) === structuralLineBreakToken) tokens.pop();

        return tokens;
    };

    /**
     * Finds the elements inside a rendered element that {@link getSegmentTokens} cannot carry faithfully.
     *
     * A canvas's copy is blank, a video or audio copy starts over, a frame's copy reloads, and a form control's
     * copy has lost its value and is no longer the control the consumer is holding. A component redrawing the
     * text can name these to the consumer, who otherwise sees the difference with no explanation.
     *
     * @param el The element the pieces are taken from.
     * @returns The elements in document order, the element itself included, or an empty list if there is none.
     */
    export const findUnsupportedElements = (el: Element | undefined): readonly Element[] => {
        if (!el) return EMPTY_ARRAY;

        const found = Array.from(el.querySelectorAll(UNSUPPORTED_ELEMENT_SELECTOR));

        return el.matches(UNSUPPORTED_ELEMENT_SELECTOR) ? [el, ...found] : found;
    };

    /**
     * Gathers neighboring runs of text that match into groups, so each group can be
     * measured in one go.
     *
     * Line breaks and unsplittable elements always stand alone and break up a run.
     *
     * @param segments The pieces to group.
     * @param compare Decides whether a piece belongs with the one before it.
     * @returns Groups in reading order. Flattening them gives back the original list.
     */
    export const groupIdenticalTextSegments = (
        segments: readonly ElementSegment[],
        compare: (A: StyledTextSegment, B: StyledTextSegment) => boolean,
    ) => {
        const groups: ElementSegment[][] = [];

        let current: ElementSegment[] = [];

        for (const segment of segments) {
            if (segment.type === "linebreak" || segment.type === "atomic") {
                if (current.length) {
                    groups.push(current);
                }

                groups.push([segment]);
                current = [];

                continue;
            } else if (!current.length || compare(current.at(-1) as StyledTextSegment, segment)) {
                current.push(segment);

                continue;
            }

            groups.push(current);
            current = [segment];
        }

        if (current.length) groups.push(current);

        return groups;
    };

    /**
     * Lays parsed content out to a given width, inserting line breaks where the text
     * runs out of room.
     *
     * Text is split into words, measured with its real styles, and wrapped when a word
     * will not fit. Words that end up next to each other with identical styling are
     * glued back into a single run, so the result holds as few pieces as possible.
     * Unsplittable elements take their own width, or the full line if they are
     * block-like. A break inserted for want of room is told apart from one the content
     * held by {@link getIsWrapBreak}.
     *
     * Browser only, since measuring reads from a canvas.
     *
     * @param segments The pieces to lay out, from {@link getSegmentTokens}.
     * @param width The line width to wrap at, in pixels.
     * @param opts.measureTextWidths Measures a run of words in place of the canvas, for text that will be drawn
     * wider or narrower than its own style says — letters that grow under an animation, say. It is handed the
     * words of one run in order, the run's measuring style, and where the run's first character falls among
     * every character, whole element and break the content holds, counted from `0`, so it can tell which
     * letters it is measuring. It answers one width per word, in pixels.
     * @returns A new list with breaks inserted. The input is not modified.
     */
    export const getInlinedSegments = (
        segments: readonly ElementSegment[],
        width: number,
        opts?: {
            measureTextWidths?: (texts: readonly string[], metrics: TextMetricsStyle, startIndex: number) => number[];
        },
    ) => {
        const result: ElementSegment[] = [];
        const identicalSegmentGroups = groupIdenticalTextSegments(
            segments,
            (a, b) => isSameMeta(a, b) && isSameMetricsStyle(a, b) && isSameNonMetricsStyle(a, b),
        );

        let remainingWidth = width;
        let segmentId = 0;
        let lastTextSegmentId = 0;
        let characterIndex = 0;

        const addLineBreak = (token: LineBreakSegment) => {
            result.push(token);
            remainingWidth = width;
        };

        const addToken = (token: ElementSegment, tokenWidth: number) => {
            if (tokenWidth > remainingWidth && !(token.type === "text" && StringUtils.isWhitespace(token.text))) {
                addLineBreak(wrapLineBreakToken);
            }

            const prevToken = result.at(-1);

            if (segmentId === lastTextSegmentId && prevToken?.type === "text" && token.type === "text") {
                prevToken.text += token.text;
            } else {
                result.push(token);
            }

            remainingWidth -= tokenWidth;

            if (token.type === "text") {
                lastTextSegmentId = segmentId;
            }
        };

        for (const segment of identicalSegmentGroups) {
            switch (segment[0].type) {
                case "atomic": {
                    for (const token of segment) {
                        addToken(
                            token,
                            (token as AtomicElementSegment).isBlockLike ? width : (token as AtomicElementSegment).width,
                        );
                        characterIndex++;
                    }

                    break;
                }
                case "linebreak": {
                    addLineBreak(lineBreakToken);
                    characterIndex += segment.length;

                    break;
                }
                case "text": {
                    const metrics = segment[0].metrics;
                    const intlSegments = segment.flatMap((s) =>
                        getWordSegmenter().segment((s as StyledTextSegment).text),
                    );
                    const texts = StringUtils.mergePunctuation(StringUtils.intlSegmentsArrayToStrings(intlSegments));
                    const widths = opts?.measureTextWidths
                        ? opts.measureTextWidths(texts, metrics, characterIndex)
                        : JSXTextMetricsUtils.measureTextWidths(texts, metrics);

                    for (let idx = 0; idx < texts.length; idx++) {
                        addToken({ ...segment[0], text: texts[idx] }, widths[idx]);
                        characterIndex += Array.from(texts[idx]).length;
                    }

                    break;
                }
            }

            segmentId++;
        }

        return result;
    };
}

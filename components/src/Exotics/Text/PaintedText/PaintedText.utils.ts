import {
    AngleUtils,
    type ElementSegment,
    JSXTextParserUtils,
    type Point2d,
    type Rect,
    StoreUtils,
} from "@thewaver/ss-utils";

import type { LetterState } from "../../../Abstracts/LetterDriver/LetterDriver.types";
import { LetterDriverUtils } from "../../../Abstracts/LetterDriver/LetterDriver.utils";
import type { SVGDefsOf } from "../../../Generators/SVGDefs/SVGDefs.types";
import { TrailUtils } from "../../Trail/Trail.utils";
import type {
    PaintedTextCaretBox,
    PaintedTextCircleDirection,
    PaintedTextLayout,
    PaintedTextLayoutOpts,
    PaintedTextLayoutState,
    PaintedTextLetter,
    PaintedTextPathPlacement,
    PaintedTextRun,
    PaintedTextStrokeAlignment,
    PaintedTextStrokePaint,
} from "./PaintedText.types";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const MASKED_STROKE_SCALE = 2;
const CURRENT_COLOR = "currentColor";
const NO_SCALE = 1;
const ORIGIN: Point2d = { x: 0, y: 0 };
const NO_LENGTH = 0;
const BEFORE_FIRST = -1;
const NO_OFFSET = 0;
const SAMPLE_STEP_PX = 1;
const STRAIGHT_TRACK_LENGTH = 1000000;
const MEASURING_SVG_SIZE = 1;
const BACKWARDS = -1;
const FORWARDS = 1;

let trackCount = 0;

/** A run of text, as `JSXTextParserUtils.getSegmentTokens` hands it over. */
type TextSegment = Extract<ElementSegment, { type: "text" }>;

/** A letter on a path, as measured once along a straight line: everything about it the slide does not change. */
type PathLetterBase = {
    character: string;
    runIndex: number;
    distance: number;
    advance: number;
};

/** Whether a piece of the text is a run of words, which is all a path can carry. */
const getIsTextSegment = (segment: ElementSegment): segment is TextSegment => segment.type === "text";

/** Names the parts of the text a path cannot carry, so the difference is never a mystery. */
const warnIfNotOnPath = (tokens: readonly ElementSegment[]) => {
    const elements = tokens.flatMap((token) => (token.type === "atomic" ? [`<${token.element.localName}>`] : []));
    const breakCount = tokens.filter((token) => token.type === "linebreak").length;

    if (!elements.length && !breakCount) return;

    const parts = [
        ...(elements.length ? [`${elements.join(", ")} cannot be drawn`] : []),
        ...(breakCount ? ["line breaks are left out"] : []),
    ];

    console.warn(`PaintedText: on a path, ${parts.join(" and ")}, since text along a path is one line of letters.`);
};

/** An SVG element, made in the SVG namespace. */
const createSVGElement = <TName extends keyof SVGElementTagNameMap>(name: TName) =>
    document.createElementNS(SVG_NAMESPACE, name);

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
     * The path data for a circle, for text set round it.
     *
     * The circle starts at its top and runs round once, so text along it starts at the top. Clockwise, the letters
     * stand on the outside of the circle and read left to right across the top; counterclockwise, they hang inside it
     * and read left to right across the bottom.
     *
     * @param center Where the circle's center sits.
     * @param radius How far the circle is from its center, in pixels.
     * @param opts.direction Which way round the circle runs. Clockwise when left out.
     * @returns A closed path, ready for `PaintedText`'s `path`.
     */
    export const computeCirclePath = (
        center: Point2d,
        radius: number,
        opts?: { direction?: PaintedTextCircleDirection },
    ) => {
        const sweep = opts?.direction === "counterclockwise" ? 0 : 1;
        const top = center.y - radius;
        const bottom = center.y + radius;

        return `M ${center.x} ${top} A ${radius} ${radius} 0 1 ${sweep} ${center.x} ${bottom} A ${radius} ${radius} 0 1 ${sweep} ${center.x} ${top} Z`;
    };

    /**
     * The path a sliding text is drawn along: the consumer's path traced twice, end to end.
     *
     * Text slides by moving where it starts along the path, so part of it is always past the end and has to show
     * again at the start. Two copies of the text, one a whole path length behind the other, would hand each letter
     * from one to the other at the seam, and the browser draws a letter only while its middle is on the path — with
     * a pixel or so at the seam that neither copy counts as on, so a letter crossing it would vanish for a frame. One
     * copy on a path that goes round twice has no seam to cross: the second lap is the same line on the page, and the
     * text carries on along it. An open path traced twice jumps back to its start between the laps, which is what
     * sends the text in at the near end as it leaves at the far one.
     *
     * @param d The path, as an SVG path's `d`.
     * @returns The same path twice over, as one `d`.
     */
    export const computeLapPath = (d: string) => `${d} ${d}`;

    /**
     * Where a point some way along a sliding text lands on the path, once the part past the end has come round
     * from the start.
     *
     * Text along a path is drawn along the path traced twice, from {@link computeLapPath}, so what slides past the end
     * of the first lap carries on along the second, which is the same line on the page. A point up to one path length
     * past the end is therefore on the path, that far from the start; one further than that is drawn nowhere.
     *
     * @param along How far along the path the point would be, without coming round, in pixels.
     * @param length How long the path is.
     * @returns The distance from the path's start, or `undefined` when the point is drawn nowhere, which includes
     * every point on a path with no length.
     */
    export const wrapAlongPath = (along: number, length: number) => {
        if (length <= NO_LENGTH) return undefined;
        if (along >= NO_LENGTH && along <= length) return along;

        const wrapped = along - length;

        return wrapped >= NO_LENGTH && wrapped <= length ? wrapped : undefined;
    };

    /**
     * The upright box round a letter turned to follow a path.
     *
     * The letter is the band its advance takes along its baseline, reaching `ascent` above and `descent` below it,
     * turned about the middle of its baseline.
     *
     * @param placement Where the letter sits and which way it is turned.
     * @param ascent How far the letter reaches above its baseline.
     * @param descent How far it reaches below.
     */
    export const computeTurnedBounds = (placement: PaintedTextPathPlacement, ascent: number, descent: number): Rect => {
        const radians = AngleUtils.toRadians(placement.angle);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const half = placement.advance * 0.5;
        const corners = [
            { x: -half, y: -ascent },
            { x: half, y: -ascent },
            { x: half, y: descent },
            { x: -half, y: descent },
        ].map((corner) => ({
            x: placement.point.x + corner.x * cos - corner.y * sin,
            y: placement.point.y + corner.x * sin + corner.y * cos,
        }));
        const xs = corners.map((corner) => corner.x);
        const ys = corners.map((corner) => corner.y);
        const left = Math.min(...xs);
        const top = Math.min(...ys);

        return { x: left, y: top, width: Math.max(...xs) - left, height: Math.max(...ys) - top };
    };

    /**
     * The box text along a path is drawn in: the path's own box, grown on every side by as far as a letter reaches
     * from its baseline.
     *
     * Letters turn to follow the path, so the side of the path their tops point to depends on its direction and
     * changes along a curve; growing every side by the larger reach keeps every letter inside the box wherever it
     * slides.
     *
     * @param pathBounds The path's own box, as `getBBox` reads it.
     * @param ascent How far the tallest letter reaches above its baseline.
     * @param descent How far the deepest letter reaches below it.
     */
    export const computePathBox = (pathBounds: Rect, ascent: number, descent: number): Rect => {
        const reach = Math.max(ascent, descent, NO_LENGTH);

        return {
            x: pathBounds.x - reach,
            y: pathBounds.y - reach,
            width: pathBounds.width + reach * 2,
            height: pathBounds.height + reach * 2,
        };
    };

    /**
     * Where a wrapper's caret goes among one drawer's letters.
     *
     * The caret sits after the letter it follows, or before the first letter when it follows none. Off a path it is
     * as tall as the letter's line; on a path it is as tall as the letters reach and turned to stand on the letter
     * beside it.
     *
     * @param letters The drawer's letters, from the layout.
     * @param caretIndex The letter the caret follows, counted across every drawer, or `-1` for before the first.
     * @param offset Where this drawer's first letter falls among every drawer's letters.
     * @param pathMetrics On a path, how far the letters reach above and below their baseline.
     * @returns The caret's box, or `undefined` when it belongs to another drawer or its letter is not drawn.
     */
    export const computeCaretBox = (
        letters: readonly PaintedTextLetter[],
        caretIndex: number,
        offset: number,
        pathMetrics?: { ascent: number; descent: number },
    ): PaintedTextCaretBox | undefined => {
        const isBefore = caretIndex === BEFORE_FIRST;
        const letter = isBefore ? (offset === NO_OFFSET ? letters[0] : undefined) : letters[caretIndex - offset];

        if (!letter) return undefined;

        if (!pathMetrics) {
            return { x: isBefore ? letter.x : letter.x + letter.width, top: letter.top, height: letter.height };
        }

        const placement = letter.placement;

        if (!placement) return undefined;

        const radians = AngleUtils.toRadians(placement.angle);
        const along = placement.advance * 0.5 * (isBefore ? BACKWARDS : FORWARDS);

        return {
            x: placement.point.x + Math.cos(radians) * along,
            top: placement.point.y + Math.sin(radians) * along - pathMetrics.ascent,
            height: pathMetrics.ascent + pathMetrics.descent,
            angle: placement.angle,
            pivotY: pathMetrics.ascent,
        };
    };

    /**
     * The style that puts a caret's box in place over the drawing.
     *
     * @param box The caret's box, from {@link computeCaretBox}.
     * @param origin Where the drawing's box starts in its own coordinates, the layout's `origin`.
     * @returns Dashed CSS properties for the element holding the caret.
     */
    export const computeCaretStyle = (box: PaintedTextCaretBox, origin: Point2d): Record<string, string> => ({
        left: `${box.x - origin.x}px`,
        top: `${box.top - origin.y}px`,
        height: `${box.height}px`,
        ...(box.angle === undefined
            ? {}
            : { "transform": `rotate(${box.angle}deg)`, "transform-origin": `0 ${box.pivotY ?? 0}px` }),
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
     * wrapped with every letter at its widest end frame, as `ProximityText` wraps it, and each letter is laid out in a
     * box of its own; `relayout` then styles those boxes and reads them back, moving each letter by as much as the
     * ones before it on its line grew, while the line breaks and `restLetters` stay where the text was first laid out.
     *
     * On a path (`getPath`), the text is one line that never wraps: its runs are set along a straight line in the
     * layout host, as SVG, and every letter's distance from the start and its advance are read back, so the spacing
     * — kerning, letter spacing and the stretch `getIsFittedToPath` asks for included — is the browser's own. The
     * box is the path's own box grown by how far the letters reach either side of it ({@link computePathBox}).
     * Line breaks and whole elements are left out, with a warning, and letters never push each other along. While a
     * wrapper drives the letters, {@link PaintedTextLayout.placeAlongPath} turns those distances into a place and a
     * turn for each letter, wherever the text has slid to.
     *
     * The first measurement, and every one after the content changes, warns about elements the copy cannot
     * reproduce — see `JSXTextParserUtils.findUnsupportedElements`.
     *
     * @param opts The two elements the layout reads and writes, and how the letters are driven.
     * @returns The layout.
     */
    export const createLayout = (opts: PaintedTextLayoutOpts): PaintedTextLayout => {
        const store = StoreUtils.create<PaintedTextLayoutState>(
            {
                width: undefined,
                height: 0,
                origin: ORIGIN,
                pathLength: NO_LENGTH,
                ascent: 0,
                descent: 0,
                runs: [],
                atomics: [],
                letters: [],
                restLetters: [],
            },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const trackId = `painted-text-track-${trackCount++}`;

        let pushed: PushedLetter[] = [];
        let pathBases: PathLetterBase[] = [];
        let pathShape: SVGPathElement | undefined;
        let startOffset = NO_LENGTH;

        const placeLetter = (base: PathLetterBase, state: PaintedTextLayoutState): PaintedTextLetter => {
            const along = wrapAlongPath(startOffset + base.distance + base.advance * 0.5, state.pathLength);

            if (!pathShape || along === undefined) {
                return {
                    kind: "text",
                    character: base.character,
                    x: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                    baseline: 0,
                    runIndex: base.runIndex,
                };
            }

            const span = TrailUtils.getSampleSpan(state.pathLength, along, SAMPLE_STEP_PX);
            const point = pathShape.getPointAtLength(along);
            const placement: PaintedTextPathPlacement = {
                point: { x: point.x, y: point.y },
                angle: TrailUtils.getAngle(pathShape.getPointAtLength(span.from), pathShape.getPointAtLength(span.to)),
                advance: base.advance,
            };
            const bounds = computeTurnedBounds(placement, state.ascent, state.descent);

            return {
                kind: "text",
                character: base.character,
                x: bounds.x,
                top: bounds.y,
                width: bounds.width,
                height: bounds.height,
                baseline: placement.point.y,
                runIndex: base.runIndex,
                placement,
            };
        };

        const placeLetters = (state: PaintedTextLayoutState) =>
            opts.getIsMeasuringLetters?.() ? pathBases.map((base) => placeLetter(base, state)) : [];

        const measureOnPath = (source: HTMLElement, host: HTMLElement, path: string, isContentChange: boolean) => {
            const tokens = JSXTextParserUtils.getSegmentTokens(source);
            const segments = tokens.filter(getIsTextSegment);

            if (isContentChange || store.get().width === undefined) {
                warnIfUnsupported(source);
                warnIfNotOnPath(tokens);
            }

            const svg = createSVGElement("svg");
            const shape = createSVGElement("path");
            const track = createSVGElement("path");
            const text = createSVGElement("text");
            const textPath = createSVGElement("textPath");

            svg.setAttribute("width", `${MEASURING_SVG_SIZE}`);
            svg.setAttribute("height", `${MEASURING_SVG_SIZE}`);
            shape.setAttribute("d", path);
            track.setAttribute("id", trackId);
            track.setAttribute("d", `M 0 0 H ${STRAIGHT_TRACK_LENGTH}`);
            text.style.whiteSpace = "pre";
            textPath.setAttribute("href", `#${trackId}`);

            for (const segment of segments) {
                const tspan = createSVGElement("tspan");

                for (const [key, value] of Object.entries(segment.metrics)) tspan.style.setProperty(key, String(value));

                tspan.textContent = segment.text;
                textPath.append(tspan);
            }

            text.append(textPath);
            svg.append(shape, track, text);
            host.replaceChildren(svg);

            pushed = [];
            pathShape = shape;

            const pathLength = shape.getTotalLength();
            const pathBounds = shape.getBBox();

            if (opts.getIsFittedToPath?.()) {
                text.setAttribute("textLength", `${pathLength}`);
                text.setAttribute("lengthAdjust", "spacing");
            }

            const charCount = text.getNumberOfChars();
            const bases: PathLetterBase[] = [];
            let ascent = 0;
            let descent = 0;
            let unit = 0;

            segments.forEach((segment, runIndex) => {
                for (const character of Array.from(segment.text)) {
                    if (unit < charCount) {
                        const start = text.getStartPositionOfChar(unit);
                        const end = text.getEndPositionOfChar(unit);
                        const extent = text.getExtentOfChar(unit);

                        ascent = Math.max(ascent, start.y - extent.y);
                        descent = Math.max(descent, extent.y + extent.height - start.y);
                        bases.push({ character, runIndex, distance: start.x, advance: end.x - start.x });
                    }

                    unit += character.length;
                }
            });

            pathBases = bases;

            const box = computePathBox(
                { x: pathBounds.x, y: pathBounds.y, width: pathBounds.width, height: pathBounds.height },
                ascent,
                descent,
            );
            const runs: PaintedTextRun[] = segments.map((segment) => ({
                text: segment.text,
                x: 0,
                y: 0,
                style: segment.metrics,
                title: segment.meta.common.title,
                anchor: segment.meta.anchor,
            }));
            const state: PaintedTextLayoutState = {
                width: box.width,
                height: box.height,
                origin: { x: box.x, y: box.y },
                pathLength,
                ascent,
                descent,
                runs,
                atomics: [],
                letters: [],
                restLetters: [],
            };
            const letters = placeLetters(state);

            store.set({ ...state, letters, restLetters: letters });

            return true;
        };

        const measure = (isContentChange: boolean) => {
            const source = opts.getSource();
            const host = opts.getLayoutHost();

            if (!source || !host) return false;

            const path = opts.getPath?.();

            if (path !== undefined) return measureOnPath(source, host, path, isContentChange);

            pathBases = [];
            pathShape = undefined;

            if (isContentChange || store.get().width === undefined) warnIfUnsupported(source);

            const width = source.clientWidth;
            const computePushingName = opts.getComputePushingAnimationName?.();
            const tokens = JSXTextParserUtils.getSegmentTokens(source);
            const segments = computePushingName
                ? LetterDriverUtils.wrapAtWidestFrame(tokens, width, host.parentElement ?? host, computePushingName)
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

            store.set({
                width,
                height: host.offsetHeight,
                origin: ORIGIN,
                pathLength: NO_LENGTH,
                ascent: 0,
                descent: 0,
                runs,
                atomics,
                letters,
                restLetters: letters,
            });

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

        const placeAlongPath = (offset: number) => {
            startOffset = offset;

            if (!pathBases.length || !opts.getIsMeasuringLetters?.()) return;

            const state = store.get();
            const letters = placeLetters(state);

            store.set({ ...state, letters, restLetters: letters });
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

        return { get: store.get, subscribe: store.subscribe, update, relayout, placeAlongPath, observe };
    };
}

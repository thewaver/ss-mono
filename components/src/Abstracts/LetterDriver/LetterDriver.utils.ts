import { CSSUtils, type ElementSegment, JSXTextParserUtils, type Rect, StoreUtils } from "@thewaver/ss-utils";

import type {
    LetterAnimation,
    LetterRegistry,
    LetterRegistryEntry,
    LetterRegistryState,
    LetterSegment,
} from "./LetterDriver.types";

const EMPTY_OFFSET = 0;
const SINGLE_ELEMENT = 1;

/** Which end of a keyframes rule a letter is measured at. */
type FrameEdge = "first" | "last";

/** Properties beyond the text-measuring ones that change how wide a letter is drawn. */
const EXTRA_WIDTH_KEYS = new Set([
    "font-variation-settings",
    "font-stretch",
    "font-width",
    "font",
    "padding-left",
    "padding-right",
    "padding-inline-start",
    "padding-inline-end",
    "margin-left",
    "margin-right",
    "margin-inline-start",
    "margin-inline-end",
]);

/** The width-changing declarations of each keyframes rule's first or last frame, by edge and name, once found. */
const edgeFrameCache = new Map<string, Record<string, string>>();

/** Whether a declaration can change how wide a letter is drawn. */
const getIsWidthKey = (key: string) => CSSUtils.isCssKeyUsedToMeasureText(key) || EXTRA_WIDTH_KEYS.has(key);

/** Finds a keyframes rule by name among the page's style sheets, skipping any whose rules cannot be read. */
const findKeyframes = (name: string): CSSKeyframesRule | undefined => {
    for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;

        try {
            rules = sheet.cssRules;
        } catch {
            continue;
        }

        for (const rule of Array.from(rules)) {
            if (rule instanceof CSSKeyframesRule && rule.name === name) return rule;
        }
    }

    return undefined;
};

/** The offset of a keyframe's selector, as a share of the run, taking the furthest when it names several. */
const toKeyframeOffset = (keyText: string) =>
    Math.max(
        ...keyText.split(",").map((key) => {
            const trimmed = key.trim();

            if (trimmed === "from") return 0;
            if (trimmed === "to") return 1;

            return parseFloat(trimmed) / 100;
        }),
    );

/**
 * What a keyframes rule's first or last frame sets that changes a letter's width, empty when nothing does or the rule
 * is missing.
 */
const getEdgeFrameWidthStyle = (name: string, edge: FrameEdge): Record<string, string> => {
    const cacheKey = `${edge}:${name}`;
    const cached = edgeFrameCache.get(cacheKey);

    if (cached) return cached;

    const rule = findKeyframes(name);

    if (!rule) return {};

    let picked: CSSKeyframeRule | undefined;

    for (const frame of Array.from(rule.cssRules) as CSSKeyframeRule[]) {
        const offset = toKeyframeOffset(frame.keyText);

        if (!picked) picked = frame;
        else if (edge === "last" && offset >= toKeyframeOffset(picked.keyText)) picked = frame;
        else if (edge === "first" && offset < toKeyframeOffset(picked.keyText)) picked = frame;
    }

    const style: Record<string, string> = {};

    if (picked) {
        for (const key of Array.from(picked.style)) {
            if (getIsWidthKey(key)) style[key] = picked.style.getPropertyValue(key);
        }
    }

    edgeFrameCache.set(cacheKey, style);

    return style;
};

/**
 * Measures words with every letter drawn at its animation's first or last frame, by laying them out in a hidden box
 * inside `host` and reading their widths back.
 */
const measureAtEdgeFrame = (
    host: HTMLElement,
    texts: readonly string[],
    metrics: Record<string, string>,
    startIndex: number,
    getName: (character: string, index: number) => string,
    edge: FrameEdge,
) => {
    const box = document.createElement("div");

    box.style.cssText = "position:absolute;left:0;top:0;visibility:hidden;white-space:pre;pointer-events:none;";

    let index = startIndex;

    const words = texts.map((text) => {
        const word = document.createElement("span");

        word.style.display = "inline-block";

        for (const character of Array.from(text)) {
            const letter = document.createElement("span");

            for (const [key, value] of Object.entries(metrics)) letter.style.setProperty(key, value);

            letter.style.display = "inline-block";
            letter.style.whiteSpace = "pre";
            letter.style.animation = `${getName(character, index)} 1ms linear ${edge === "last" ? "-1ms" : "0ms"} 1 normal both paused`;
            letter.textContent = character;
            word.appendChild(letter);
            index++;
        }

        box.appendChild(word);

        return word;
    });

    host.appendChild(box);

    const widths = words.map((word) => word.getBoundingClientRect().width / getScreenScale(box));

    box.remove();

    return widths;
};

/** How much larger the box is drawn on screen than it is laid out, inside a scaled ancestor. */
const getScreenScale = (element: HTMLElement) =>
    element.offsetWidth > 0 ? element.getBoundingClientRect().width / element.offsetWidth : 1;

/** Orders two renderers by where their roots sit on the page, earlier first. */
const compareByPagePosition = (a: LetterRegistryEntry, b: LetterRegistryEntry) =>
    a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * The link between a component that decides what each letter does over time, such as `Typewriter` or
 * `ScrambleText`, and one that draws the letters, such as `PaintedText`.
 *
 * The wrapper owns the timing and the drawer owns the layout, so neither measures the other's work: the drawer
 * reports its letters, the wrapper reads them all as one text and answers, letter by letter, what each should be
 * doing. Several drawers inside one wrapper share one run, in the order they appear on the page.
 */
export namespace LetterDriverUtils {
    /** What a line break stands as among a text's letters, wherever a letter is asked for its character. */
    export const LINE_BREAK_CHARACTER = "\n";

    /** What an image or any other whole element stands as among a text's letters. */
    export const WHOLE_ELEMENT_CHARACTER = "\uFFFC";

    /**
     * Numbers every segment by where its first character sits among all of them.
     *
     * A run of text counts one per character, by code point; an image or a line break counts as one.
     *
     * @param segments The segments, in reading order.
     * @returns The segments with their start index, and how many characters there are in all.
     */
    export const indexSegments = (segments: readonly ElementSegment[]) => {
        let count = 0;

        const indexed = segments.map((segment): LetterSegment => {
            const result = { ...segment, startIndex: count };

            if (segment.type === "text") count += Array.from(segment.text).length;
            else if (!JSXTextParserUtils.getIsWrapBreak(segment)) count += SINGLE_ELEMENT;

            return result;
        });

        return { segments: indexed, count };
    };

    /**
     * Whether a segment takes a place among the animated characters.
     *
     * @param segment A segment from {@link indexSegments}.
     * @returns `false` only for a break the wrapping inserted, which is drawn but neither counted nor animated.
     */
    export const getIsAnimated = (segment: ElementSegment) => !JSXTextParserUtils.getIsWrapBreak(segment);

    /**
     * Every animated character as the text it stands for, in reading order.
     *
     * A character of text is itself; an image or other whole element is {@link WHOLE_ELEMENT_CHARACTER} and a break
     * the text holds is {@link LINE_BREAK_CHARACTER}, which are what a drawer reports for the
     * same slots, so an animation chosen by character picks the same letters either way.
     *
     * @param segments The segments, from {@link indexSegments}.
     * @returns One entry per animated character.
     */
    export const getCharacters = (segments: readonly ElementSegment[]) =>
        segments.flatMap((segment) => {
            if (segment.type === "text") return Array.from(segment.text);
            if (segment.type === "atomic") return [WHOLE_ELEMENT_CHARACTER];

            return getIsAnimated(segment) ? [LINE_BREAK_CHARACTER] : [];
        });

    /**
     * The CSS that holds one letter's keyframes at the moment the run has reached.
     *
     * The letter's animation is paused, and its delay is its own start less the run's time, read from
     * `LetterDriverStyles.letterDriverTimeVar` on an ancestor — so the browser draws, for every letter at once, the
     * frame that moment calls for. A letter whose turn has not come shows its first frame and one that has finished
     * shows its last, since the animation fills both ways; a moment can fall partway through a letter's own
     * keyframes. Moving the run is one write of the variable, with nothing per letter and nothing per frame here.
     *
     * @param animation What the letter plays and when it starts.
     * @param timeVar `LetterDriverStyles.letterDriverTimeVar`, which the driver sets on its root.
     * @returns Dashed CSS properties, for the element drawing the letter.
     */
    export const computeAnimationStyle = (animation: LetterAnimation, timeVar: string): Record<string, string> => ({
        "animation-name": animation.name,
        "animation-duration": `${animation.durationMs}ms`,
        "animation-delay": `calc(${animation.delayMs}ms - ${timeVar})`,
        "animation-direction": animation.direction,
        "animation-fill-mode": "both",
        "animation-play-state": "paused",
    });

    /**
     * The value to give `LetterDriverStyles.letterDriverTimeVar` on the driver's root.
     *
     * @param timeMs How far the run has gone, in milliseconds.
     */
    export const getTimeValue = (timeMs: number) => `${timeMs}ms`;

    /**
     * Wraps a driver's text so that no line is too long for the box with every letter at the wider end of its
     * keyframes.
     *
     * A letter whose keyframes make it wider — a heavier weight, a looser spacing, padding beside it — pushes the rest
     * of its line along as it grows, and a line wrapped for the letters at their narrowest would then run out of the
     * box. So each word is measured with its letters at their first frame and again at their last, and the wider of
     * the two is what the line is fitted to; the spare room sits at the end of each line while the letters are
     * narrower. Either end may be the wide one — a letter that starts spread and closes up as well as one that swells
     * — and the contract this rests on is that the widest frame is one of the two ends; a keyframe widest partway
     * through can still push past the box. When neither end changes a letter's width, the text is wrapped exactly as
     * `JSXTextParserUtils.getInlinedSegments` wraps it.
     *
     * Browser only: the keyframes are read from the page's style sheets, and the words are laid out in a hidden box.
     *
     * @param segments The pieces to lay out, from `JSXTextParserUtils.getSegmentTokens`.
     * @param width The line width to wrap at, in pixels.
     * @param host An element in the page, positioned, that a hidden measuring box can be put in for a moment. It
     * should not be the element whose content is being watched for changes.
     * @param computeAnimationName Names each letter's keyframes from its character, its place among every letter
     * from `0`, and how many there are.
     * @returns The pieces with breaks inserted, as `getInlinedSegments` returns them.
     */
    export const wrapAtWidestFrame = (
        segments: readonly ElementSegment[],
        width: number,
        host: HTMLElement,
        computeAnimationName: (character: string, index: number, count: number) => string,
    ) => {
        const { count } = indexSegments(segments);
        const names = new Set<string>();
        let index = 0;

        for (const segment of segments) {
            if (segment.type === "text") {
                for (const character of Array.from(segment.text))
                    names.add(computeAnimationName(character, index++, count));
            } else if (!JSXTextParserUtils.getIsWrapBreak(segment)) {
                index++;
            }
        }

        const isWidening = Array.from(names).some(
            (name) =>
                Object.keys(getEdgeFrameWidthStyle(name, "first")).length > 0 ||
                Object.keys(getEdgeFrameWidthStyle(name, "last")).length > 0,
        );

        if (!isWidening) return JSXTextParserUtils.getInlinedSegments(segments, width);

        const getName = (character: string, at: number) => computeAnimationName(character, at, count);

        return JSXTextParserUtils.getInlinedSegments(segments, width, {
            measureTextWidths: (texts, metrics, startIndex) => {
                const style = metrics as Record<string, string>;
                const atFirst = measureAtEdgeFrame(host, texts, style, startIndex, getName, "first");
                const atLast = measureAtEdgeFrame(host, texts, style, startIndex, getName, "last");

                return atLast.map((widthAtLast, at) => Math.max(widthAtLast, atFirst[at] ?? widthAtLast));
            },
        });
    };
    /**
     * Builds the registry a wrapper keeps its drawers in.
     *
     * Drawers are kept sorted by page position whenever one joins or changes, so the letters run in reading order
     * however they mounted. A drawer that reports the same letters again changes nothing, and the run of every
     * drawer's letters keeps its identity while the letters stay the same, so reporting where letters sit is not
     * read as the text changing.
     *
     * @returns The registry, readable as a store of every drawer and their letters run together.
     */
    export const createRegistry = (): LetterRegistry => {
        const store = StoreUtils.create<LetterRegistryState>(
            { entries: [], characters: [] },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const write = (entries: LetterRegistryEntry[]) => {
            const sorted = [...entries].sort(compareByPagePosition);
            const characters = sorted.flatMap((entry) => entry.characters);
            const previous = store.get().characters;
            const isSame =
                previous.length === characters.length &&
                previous.every((character, index) => character === characters[index]);

            store.set({ entries: sorted, characters: isSame ? previous : characters });
        };

        const register = (element: Element) => {
            write([...store.get().entries, { element, characters: [], boxes: [] }]);

            return {
                setCharacters: (characters: string[]) => {
                    const entries = store.get().entries;
                    const current = entries.find((entry) => entry.element === element);

                    if (!current || current.characters.join("") === characters.join("")) return;

                    write(entries.map((entry) => (entry.element === element ? { ...entry, characters } : entry)));
                },
                setBoxes: (boxes: Rect[]) => {
                    const entries = store.get().entries;

                    if (!entries.some((entry) => entry.element === element)) return;

                    write(entries.map((entry) => (entry.element === element ? { ...entry, boxes } : entry)));
                },
                unregister: () => write(store.get().entries.filter((entry) => entry.element !== element)),
            };
        };

        const getOffset = (element: Element) => {
            let offset = EMPTY_OFFSET;

            for (const entry of store.get().entries) {
                if (entry.element === element) return offset;

                offset += entry.characters.length;
            }

            return EMPTY_OFFSET;
        };

        return { get: store.get, subscribe: store.subscribe, register, getOffset };
    };
}

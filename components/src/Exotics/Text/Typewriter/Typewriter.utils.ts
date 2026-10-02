import { type ElementSegment, JSXTextParserUtils, StoreUtils } from "@thewaver/ss-utils";

import { ScrambleTextUtils } from "../ScrambleText/ScrambleText.utils";
import type {
    TypewriterPlayer,
    TypewriterPlayerOpts,
    TypewriterSegment,
    TypewriterState,
    TypewriterUpdateCause,
} from "./Typewriter.types";

/** The caret's place before the first character. */
const BEFORE_FIRST = -1;
/** One character, or one image or break standing for one. */
const SINGLE_ELEMENT = 1;
/** The weight of the last character to arrive, which erasing turns into the first. */
const FULL_WEIGHT = 1;

/** Names the elements in the text the typed copy cannot reproduce, so the difference is never a mystery. */
const warnIfUnsupported = (container: HTMLElement) => {
    const unsupported = JSXTextParserUtils.findUnsupportedElements(container);

    if (!unsupported.length) return;

    console.warn(
        `Typewriter: ${unsupported.map((element) => `<${element.localName}>`).join(", ")} cannot be copied faithfully into the typed text, which loses a canvas's drawing, media playback, a frame's page and a form control's value.`,
    );
};

/**
 * Plays text in a character at a time: measures what the consumer rendered, splits it into characters wrapped at the
 * width it was measured at, and runs the timer that says when a run has ended.
 *
 * Each character's arrival is a CSS animation of its own, started at a delay worked out here, so nothing runs per
 * frame. The caret follows the characters' own `animationstart` events rather than a clock, so it cannot drift.
 */
export namespace TypewriterUtils {
    /** The caret's place before the first character. */
    export const CARET_BEFORE_FIRST = BEFORE_FIRST;

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

        const indexed = segments.map((segment): TypewriterSegment => {
            const result = { ...segment, startIndex: count };

            count += segment.type === "text" ? Array.from(segment.text).length : SINGLE_ELEMENT;

            return result;
        });

        return { segments: indexed, count };
    };

    /**
     * When each character starts arriving, from the start of a run.
     *
     * The run lasts the character count times the delay, and each character starts at its weight's share of it.
     * Erasing turns the weights round, so the last to arrive is the first to leave.
     *
     * @param count How many characters there are.
     * @param computedWeights The weights the consumer gave, from `0` for the first to `1` for the last, if any.
     * Missing entries fall back to left to right.
     * @param isErasing Whether the characters are leaving.
     * @param initialDelayMs How long before the first character starts.
     * @param delayMs How long each character waits after the one before it.
     * @returns One start time per character.
     */
    export const computeStartTimes = (
        count: number,
        computedWeights: number[] | undefined,
        isErasing: boolean,
        initialDelayMs: number,
        delayMs: number,
    ) => {
        const weights = ScrambleTextUtils.resolveWeights(count, computedWeights);

        return ScrambleTextUtils.getSettleTimes(
            isErasing ? weights.map((weight) => FULL_WEIGHT - weight) : weights,
            initialDelayMs,
            count * delayMs,
        );
    };

    /**
     * Where the caret sits as a run starts: before the first character while typing, after the last while erasing.
     *
     * @param isErasing Whether the characters are leaving.
     * @param count How many characters there are.
     */
    export const getFirstCaretIndex = (isErasing: boolean, count: number) =>
        isErasing ? count - SINGLE_ELEMENT : BEFORE_FIRST;

    /**
     * Where the caret rests once a run has ended: after the last character once typed, before the first once erased.
     *
     * @param isErasing Whether the characters were leaving.
     * @param count How many characters there are.
     */
    export const getLastCaretIndex = (isErasing: boolean, count: number) =>
        isErasing ? BEFORE_FIRST : count - SINGLE_ELEMENT;

    /**
     * Where the caret goes when one character's own animation starts: after it while typing, before it while erasing.
     *
     * @param isErasing Whether the characters are leaving.
     * @param index The character that started.
     */
    export const getCaretIndexOnStart = (isErasing: boolean, index: number) =>
        isErasing ? index - SINGLE_ELEMENT : index;

    /**
     * How long a whole run takes, from the start to the last character having arrived.
     *
     * @param count How many characters there are.
     * @param delayMs How long each character waits after the one before it.
     * @param initialDelayMs How long before the first character starts.
     * @param durationMs How long one character takes to arrive.
     */
    export const getRunDurationMs = (count: number, delayMs: number, initialDelayMs: number, durationMs: number) =>
        count * delayMs + initialDelayMs + durationMs;

    /**
     * Whether a cause asks for no new run, because the consumer turned its reset off and a run has already played.
     *
     * The first run always plays. After it, a content change is skipped only when `resetAnimationOnContent` is
     * `false`, and a layout change only when `resetAnimationOnLayout` is; leaving either out keeps the reset.
     *
     * @param hasAnimatedOnce Whether a run has ever started.
     * @param cause What changed.
     * @param resetOnContent The consumer's `resetAnimationOnContent`.
     * @param resetOnLayout The consumer's `resetAnimationOnLayout`.
     */
    export const getIsResetSkipped = (
        hasAnimatedOnce: boolean,
        cause: TypewriterUpdateCause,
        resetOnContent: boolean | undefined,
        resetOnLayout: boolean | undefined,
    ) =>
        hasAnimatedOnce &&
        ((cause === "content" && resetOnContent === false) || (cause === "layout" && resetOnLayout === false));

    /**
     * Runs a typewriter: measures and splits the text, plays runs, and ends each one on a timer.
     *
     * A run starts with the caret at {@link getFirstCaretIndex} and ends, after {@link getRunDurationMs}, with it at
     * {@link getLastCaretIndex} and the end reported. Starting a run throws away one under way. A layout cause that
     * finds the container the same width as last time is skipped outright, which is what keeps the size observer
     * from restarting the text on every change that is not a change of width. A web font or an image in the
     * text finishing loading is measured again whatever the width, as a layout cause, since it moves line breaks
     * without moving the box. Any change to what the container holds is a content cause, so a consumer who wants
     * the typing to wait for a pause debounces the text they pass in.
     *
     * The first measurement and every content cause warn about elements the typed copy cannot reproduce — see
     * `JSXTextParserUtils.findUnsupportedElements`.
     *
     * The measurement reads the live page, so the container must already hold the text it is to measure. The
     * functions in `opts` are read when they are needed, so they may answer differently over time.
     *
     * @param opts What the player reads.
     * @returns The player.
     */
    export const createPlayer = (opts: TypewriterPlayerOpts): TypewriterPlayer => {
        let timeout: ReturnType<typeof setTimeout> | undefined;

        const store = StoreUtils.create<TypewriterState>(
            {
                segments: [],
                count: 0,
                width: undefined,
                isAnimating: false,
                hasAnimatedOnce: false,
                caretIndex: BEFORE_FIRST,
            },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const write = (next: Partial<TypewriterState>) => store.update((current) => ({ ...current, ...next }));

        const stop = () => {
            write({ isAnimating: false });
            clearTimeout(timeout);
        };

        const restart = (cause: TypewriterUpdateCause = "other") => {
            stop();

            const { count, hasAnimatedOnce } = store.get();
            const isErasing = opts.getIsErasing();
            const durationMs = getRunDurationMs(
                count,
                opts.getAnimationDelayMs(),
                opts.getInitialAnimationDelayMs(),
                opts.getAnimationDurationMs(),
            );

            if (
                getIsResetSkipped(
                    hasAnimatedOnce,
                    cause,
                    opts.getResetAnimationOnContent(),
                    opts.getResetAnimationOnLayout(),
                )
            ) {
                write({ caretIndex: getLastCaretIndex(isErasing, count) });

                return;
            }

            write({ caretIndex: getFirstCaretIndex(isErasing, count), isAnimating: true, hasAnimatedOnce: true });

            timeout = setTimeout(() => {
                write({ caretIndex: getLastCaretIndex(opts.getIsErasing(), store.get().count), isAnimating: false });

                opts.onAnimationEnd?.();
            }, durationMs);
        };

        const measure = (cause: TypewriterUpdateCause, isForced: boolean) => {
            const container = opts.getContainer();

            if (!container) return false;

            const width = container.clientWidth;

            if (!isForced && cause === "layout" && width === store.get().width) return false;

            if (store.get().width === undefined || cause === "content") warnIfUnsupported(container);

            write({ width });
            stop();

            const tokens = JSXTextParserUtils.getSegmentTokens(container);
            const { segments, count } = indexSegments(JSXTextParserUtils.getInlinedSegments(tokens, width));

            write({ segments, count });
            restart(cause);

            return true;
        };

        const update = (cause: TypewriterUpdateCause) => measure(cause, false);

        const reportCharacterStart = (index: number) =>
            write({ caretIndex: getCaretIndexOnStart(opts.getIsErasing(), index) });

        const observe = (container: HTMLElement) => {
            const resizeObserver = new ResizeObserver(() => update("layout"));
            const mutationObserver = new MutationObserver(() => update("content"));
            const handleLoaded = () => measure("layout", true);

            resizeObserver.observe(container);
            mutationObserver.observe(container, {
                subtree: true,
                childList: true,
                characterData: true,
                attributes: true,
            });
            container.addEventListener("load", handleLoaded, true);
            document.fonts.addEventListener("loadingdone", handleLoaded);

            return () => {
                resizeObserver.disconnect();
                mutationObserver.disconnect();
                container.removeEventListener("load", handleLoaded, true);
                document.fonts.removeEventListener("loadingdone", handleLoaded);
            };
        };

        return { get: store.get, subscribe: store.subscribe, update, restart, reportCharacterStart, observe, stop };
    };
}

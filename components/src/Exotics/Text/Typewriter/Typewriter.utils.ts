import { JSXTextParserUtils, MathUtils, StoreUtils } from "@thewaver/ss-utils";

import { LetterDriverUtils } from "../../../Abstracts/LetterDriver/LetterDriver.utils";
import { ScrambleTextUtils } from "../ScrambleText/ScrambleText.utils";
import type {
    TypewriterPlayer,
    TypewriterPlayerOpts,
    TypewriterState,
    TypewriterUpdateCause,
} from "./Typewriter.types";

/** The caret's place before the first character. */
const BEFORE_FIRST = -1;
/** One character, or one image or break standing for one. */
const SINGLE_ELEMENT = 1;
/** The weight of the last character to arrive, which erasing turns into the first. */
const FULL_WEIGHT = 1;
/** Where a run begins. */
const RUN_START = 0;
/** Where a run has every character in place. */
const RUN_END = 1;

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
 * width it was measured at, and walks a run's progress from `0` to `1`.
 *
 * Each character's arrival is a CSS animation of its own, held at the moment the run has reached (see
 * `LetterDriverUtils.computeAnimationStyle`), so the progress alone decides what is drawn — whether it is walked
 * forward here or written from outside. The caret is placed from the same progress, so it cannot drift from the
 * letters.
 */
export namespace TypewriterUtils {
    /** The caret's place before the first character. */
    export const CARET_BEFORE_FIRST = BEFORE_FIRST;

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
     * Where the caret sits at a moment of the run.
     *
     * It follows the character that most recently started — after it while typing, before it while erasing — so with
     * a scatter of weights it jumps to wherever the latest arrival was. Before any has started it is at
     * {@link getFirstCaretIndex}, and once the run is over at {@link getLastCaretIndex}.
     *
     * @param startTimesMs When each character starts, from {@link computeStartTimes}.
     * @param timeMs How far the run has gone.
     * @param isErasing Whether the characters are leaving.
     * @param isOver Whether the run has reached its end.
     */
    export const computeCaretIndex = (
        startTimesMs: readonly number[],
        timeMs: number,
        isErasing: boolean,
        isOver: boolean,
    ) => {
        const count = startTimesMs.length;

        if (isOver) return getLastCaretIndex(isErasing, count);

        let latest = BEFORE_FIRST;

        for (let index = 0; index < count; index++) {
            if (
                startTimesMs[index] <= timeMs &&
                (latest === BEFORE_FIRST || startTimesMs[index] >= startTimesMs[latest])
            )
                latest = index;
        }

        return latest === BEFORE_FIRST ? getFirstCaretIndex(isErasing, count) : getCaretIndexOnStart(isErasing, latest);
    };

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
     * Whether the letters are drawn one by one and held at the run's moment, rather than as the text at rest.
     *
     * A played run comes to rest once it reaches the end. A run whose progress is driven from outside never does,
     * since its end is a moment like any other: keyframes that end somewhere other than the text at rest — letters
     * flying away, say — stay where they ended.
     *
     * @param count How many characters there are.
     * @param progress How far the run has gone, `0` to `1`.
     * @param isPlaying Whether the run is playing on its own.
     */
    export const getIsRunning = (count: number, progress: number, isPlaying: boolean) =>
        count > 0 && (progress < RUN_END || !isPlaying);

    /**
     * Walks a run's progress forward on every animation frame until it reaches the end or is stopped.
     *
     * Each frame reads the progress afresh, so a write from outside between frames is carried on from rather than
     * overwritten.
     *
     * @param defs.getProgress The run's progress now.
     * @param defs.setProgress Writes the stepped progress.
     * @param defs.getRunDurationMs How long the whole run takes, from {@link getRunDurationMs}.
     * @param defs.onEnd Runs once the progress reaches `1`; the walking has stopped by then.
     * @returns Stops the walking. It can be started again with another call.
     */
    export const run = (defs: {
        getProgress: () => number;
        setProgress: (progress: number) => void;
        getRunDurationMs: () => number;
        onEnd: () => void;
    }) => {
        let frameId: number | undefined;
        let lastMs = performance.now();

        const advance = () => {
            const nowMs = performance.now();
            const durationMs = defs.getRunDurationMs();
            const next =
                durationMs > 0 ? MathUtils.clamp01(defs.getProgress() + (nowMs - lastMs) / durationMs) : RUN_END;

            lastMs = nowMs;
            frameId = undefined;
            defs.setProgress(next);

            if (next >= RUN_END) {
                defs.onEnd();

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        frameId = requestAnimationFrame(advance);

        return () => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);
        };
    };

    /**
     * Runs a typewriter's measuring: measures and splits the text, and sends the run back to its beginning when the
     * text or its layout changes.
     *
     * Nothing here moves the run forward — {@link run} does that, and a consumer driving the progress from outside
     * does it themselves. A change only rewinds the run while it is playing, so text whose progress the consumer owns
     * keeps the moment they gave it. A rewind is skipped when the cause's preference says so (see
     * {@link getIsResetSkipped}), and the run is then put at its end instead. A layout cause that finds the container
     * the same width as last time is skipped outright, which is what keeps the size observer from restarting the text
     * on every change that is not a change of width. A web font or an image in the text finishing loading is measured
     * again whatever the width, as a layout cause, since it moves line breaks without moving the box. Any change to
     * what the container holds is a content cause, so a consumer who wants the typing to wait for a pause debounces
     * the text they pass in.
     *
     * The text is wrapped for every letter at its animation's last frame, so a keyframe that widens letters pushes
     * no line out of the box — see `LetterDriverUtils.wrapAtLastFrame`. The first measurement and every content cause
     * warn about elements the typed copy cannot reproduce — see `JSXTextParserUtils.findUnsupportedElements`.
     *
     * While `opts.getIsDriven` says a drawer such as `PaintedText` is drawing the letters, the player measures
     * nothing and takes its letter count from {@link TypewriterPlayer.setCount} instead.
     *
     * The measurement reads the live page, so the container must already hold the text it is to measure. The
     * functions in `opts` are read when they are needed, so they may answer differently over time.
     *
     * @param opts What the player reads.
     * @returns The player.
     */
    export const createPlayer = (opts: TypewriterPlayerOpts): TypewriterPlayer => {
        const store = StoreUtils.create<TypewriterState>(
            { segments: [], count: 0, width: undefined, hasAnimatedOnce: false },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const write = (next: Partial<TypewriterState>) => store.update((current) => ({ ...current, ...next }));

        const restart = (cause: TypewriterUpdateCause = "other") => {
            if (!opts.getIsPlaying()) return;

            if (
                getIsResetSkipped(
                    store.get().hasAnimatedOnce,
                    cause,
                    opts.getResetAnimationOnContent(),
                    opts.getResetAnimationOnLayout(),
                )
            ) {
                opts.setProgress(RUN_END);

                return;
            }

            write({ hasAnimatedOnce: true });
            opts.setProgress(RUN_START);
        };

        const measure = (cause: TypewriterUpdateCause, isForced: boolean) => {
            const container = opts.getContainer();

            if (!container || opts.getIsDriven?.()) return false;

            const width = container.clientWidth;

            if (!isForced && cause === "layout" && width === store.get().width) return false;

            if (store.get().width === undefined || cause === "content") warnIfUnsupported(container);

            const tokens = JSXTextParserUtils.getSegmentTokens(container);
            const { segments, count } = LetterDriverUtils.indexSegments(
                LetterDriverUtils.wrapAtLastFrame(
                    tokens,
                    width,
                    container.parentElement ?? container,
                    opts.getComputeAnimationName(),
                ),
            );

            write({ width, segments, count });
            restart(cause);

            return true;
        };

        const update = (cause: TypewriterUpdateCause) => measure(cause, false);

        const setCount = (count: number, cause: TypewriterUpdateCause) => {
            write({ segments: [], count });
            restart(cause);
        };

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

        return { get: store.get, subscribe: store.subscribe, update, restart, setCount, observe };
    };
}

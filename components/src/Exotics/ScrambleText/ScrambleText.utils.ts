import { MathUtils, StoreUtils } from "@thewaver/ss-utils";

import type {
    ScrambleTextScrambler,
    ScrambleTextScramblerOpts,
    ScrambleTextSegment,
    ScrambleTextState,
} from "./ScrambleText.types";

/** One character. */
const SINGLE_CHARACTER = 1;
/** The start of the animation. */
const NO_TIME = 0;
/** The length of a match against an empty tail. */
const NO_MATCH = 0;
/** The part of a run's state that says where it is, which is all the settle and pending checks read. */
type ScrambleTextTiming = Pick<ScrambleTextState, "isScrambling" | "kept" | "elapsedMs">;

/** No position kept from the text before, which is how a first run and a restart begin. */
const NOTHING_KEPT: boolean[] = [];

/**
 * Schedules the character-by-character reveal of scrambled text.
 *
 * Each character churns through random glyphs and then settles into its real one, and the effect
 * comes from them settling at different times. All the timing is worked out in advance rather than
 * per frame, so the animation is a matter of reading a schedule.
 */
export namespace ScrambleTextUtils {
    /** Whether a character is whitespace, and so should never be scrambled. */
    export const getIsWhitespace = (character: string) => !character.trim();

    /**
     * Splits the characters into alternating runs of whitespace and non-whitespace.
     *
     * Scrambling a space would make the text change width as it animates, and worse, words would appear
     * to break apart and rejoin. Keeping the runs separate means the layout holds still while the
     * letters churn.
     *
     * @param characters The text, split into characters.
     * @returns The runs in order, each knowing where in the text it starts.
     */
    export const getSegments = (characters: string[]) =>
        characters.reduce<ScrambleTextSegment[]>((segments, character, index) => {
            const isWhitespace = getIsWhitespace(character);
            const last = segments[segments.length - SINGLE_CHARACTER];

            if (last?.isWhitespace === isWhitespace) {
                last.characters.push(character);

                return segments;
            }

            return [...segments, { isWhitespace, startIndex: index, characters: [character] }];
        }, []);

    /**
     * Fills in when each character should settle, relative to the others.
     *
     * @param count How many characters there are.
     * @param computed Weights the caller has supplied, from `0` for the first to settle to `1` for the
     * last. Missing entries fall back to an even spread left to right.
     * @returns One weight per character, held within `0` and `1`.
     */
    export const resolveWeights = (count: number, computed: number[] | undefined) => {
        const span = Math.max(count - SINGLE_CHARACTER, SINGLE_CHARACTER);

        return Array.from({ length: count }, (_unused, index) => MathUtils.clamp01(computed?.[index] ?? index / span));
    };

    /**
     * When each character settles, in milliseconds from the start.
     *
     * @param weights The characters' weights.
     * @param initialDelayMs How long before the first character settles.
     * @param durationMs How long the whole reveal takes.
     */
    export const getSettleTimes = (weights: number[], initialDelayMs: number, durationMs: number) =>
        weights.map((weight) => initialDelayMs + weight * durationMs);

    /**
     * When each character begins churning.
     *
     * @param settleTimes When each character settles.
     * @param churnDurationMs How long a character churns before settling. Omitted means every character
     * churns from the start of the animation, so the whole string is scrambled at once and resolves left
     * to right.
     */
    export const getStartTimes = (settleTimes: number[], churnDurationMs: number | undefined) =>
        settleTimes.map((settleTime) => (churnDurationMs === undefined ? NO_TIME : settleTime - churnDurationMs));

    /**
     * Picks a random glyph to show, never the one already there.
     *
     * Excluding the current glyph matters: a repeat reads as the animation having stopped rather than as
     * a coincidence.
     *
     * @param glyphs The glyphs to churn through.
     * @param excluded The glyph currently shown.
     * @param roll A number from `0` to `1`, so the caller owns the randomness and an animation can be
     * made repeatable.
     * @returns A different glyph, or the excluded one when there is no alternative.
     */
    export const pickGlyph = (glyphs: string[], excluded: string, roll: number) => {
        const excludedAt = glyphs.indexOf(excluded);
        const count = excludedAt < 0 ? glyphs.length : glyphs.length - SINGLE_CHARACTER;

        if (count < SINGLE_CHARACTER) return excluded;

        const picked = Math.min(Math.floor(roll * count), count - SINGLE_CHARACTER);

        return glyphs[excludedAt < 0 || picked < excludedAt ? picked : picked + SINGLE_CHARACTER];
    };

    /**
     * Pairs each character of a new text with the one it was carried over from in the old text.
     *
     * This is what lets a text change scramble only what changed. The pairing is a longest common
     * subsequence rather than a position-by-position comparison, so an insertion or a deletion shifts the
     * characters after it along without breaking their pairing: adding a word at the front of a line still
     * finds every character that was already there. Where two pairings are equally long, the one that keeps
     * the earlier characters of the new text wins, so the answer never depends on anything but the two texts.
     * The table it builds is the product of the two lengths, which is nothing for a line and too much for a
     * page.
     *
     * @param previous The old text, split into characters.
     * @param next The new text, split into characters.
     * @returns One entry per character of `next`: the index in `previous` it was carried over from, or
     * `undefined` for a character the old text did not have.
     */
    export const getCarriedIndices = (previous: string[], next: string[]) => {
        const lengths = Array.from({ length: previous.length + SINGLE_CHARACTER }, () =>
            new Array<number>(next.length + SINGLE_CHARACTER).fill(NO_MATCH),
        );

        for (let from = previous.length - SINGLE_CHARACTER; from >= 0; from--) {
            for (let to = next.length - SINGLE_CHARACTER; to >= 0; to--) {
                lengths[from][to] =
                    previous[from] === next[to]
                        ? lengths[from + SINGLE_CHARACTER][to + SINGLE_CHARACTER] + SINGLE_CHARACTER
                        : Math.max(lengths[from + SINGLE_CHARACTER][to], lengths[from][to + SINGLE_CHARACTER]);
            }
        }

        const carried = new Array<number | undefined>(next.length).fill(undefined);

        let from = 0;
        let to = 0;

        while (from < previous.length && to < next.length) {
            if (previous[from] === next[to]) {
                carried[to] = from;
                from++;
                to++;
            } else if (lengths[from + SINGLE_CHARACTER][to] >= lengths[from][to + SINGLE_CHARACTER]) {
                from++;
            } else {
                to++;
            }
        }

        return carried;
    };

    /**
     * Whether a position shows its own character rather than noise.
     *
     * @param state Where the run is: whether it is under way, what it keeps and how long it has gone.
     * @param settleTime When the position settles.
     * @param index The position.
     * @returns `true` outside a run, for a position kept from the text before, and once its settle time has passed.
     */
    export const getIsSettled = (state: ScrambleTextTiming, settleTime: number | undefined, index: number) =>
        !state.isScrambling || !!state.kept[index] || (settleTime !== undefined && state.elapsedMs >= settleTime);

    /**
     * Whether a position is still waiting for its churn to start, and so shows nothing but its reserved space.
     *
     * @param state Where the run is: whether it is under way and how long it has gone.
     * @param startTime When the position starts churning.
     * @returns `true` during a run, before the position's start time.
     */
    export const getIsPending = (state: ScrambleTextTiming, startTime: number | undefined) =>
        state.isScrambling && state.elapsedMs < (startTime ?? NO_TIME);

    /**
     * Runs the scramble: a timer that swaps each unsettled position's glyph and ends the run once every position
     * has settled.
     *
     * The schedule is read afresh on every tick, so a change to the durations takes effect on a run already
     * under way. A settled or pending position keeps the glyph it had; a churning one gets a new glyph each tick,
     * never the character it is going to settle on. Whitespace never churns.
     *
     * Which positions a text change carries over is decided against the run as it stood when the change came:
     * only a position that had settled by then counts, so a change made mid-run cannot let a churning character
     * jump to its answer. The functions in `opts` are read when they are needed, so they may answer differently
     * over time.
     *
     * @param opts What the scrambler reads.
     * @returns The scrambler.
     */
    export const createScrambler = (opts: ScrambleTextScramblerOpts): ScrambleTextScrambler => {
        let interval: ReturnType<typeof setInterval> | undefined;
        let startedAtMs = NO_TIME;
        let runSettleTimes: number[] = [];

        const store = StoreUtils.create<ScrambleTextState>(
            { elapsedMs: NO_TIME, noise: [], isScrambling: false, kept: [] },
            { isEqual: StoreUtils.getIsShallowEqual },
        );

        const rollNoise = (state: ScrambleTextState) => {
            const glyphSets = opts.getGlyphSets();
            const settleTimes = opts.getSettleTimes();
            const startTimes = opts.getStartTimes();

            return opts.getCharacters().map((character, index) => {
                if (getIsWhitespace(character)) return character;

                const isQuiet =
                    getIsSettled(state, settleTimes[index], index) || getIsPending(state, startTimes[index]);

                return isQuiet
                    ? (state.noise[index] ?? pickGlyph(glyphSets[index] ?? [], character, Math.random()))
                    : pickGlyph(glyphSets[index] ?? [], character, Math.random());
            });
        };

        const stop = () => {
            clearInterval(interval);
            store.update((state) => ({ ...state, isScrambling: false }));
        };

        const start = (kept: boolean[] = NOTHING_KEPT) => {
            stop();

            startedAtMs = Date.now();
            runSettleTimes = opts.getSettleTimes();

            const resting = { ...store.get(), kept, elapsedMs: NO_TIME };

            store.set({ ...resting, noise: rollNoise(resting), isScrambling: true });

            interval = setInterval(() => {
                const elapsedMs = Date.now() - startedAtMs;
                const ticked = { ...store.get(), elapsedMs };

                store.set({ ...ticked, noise: rollNoise(ticked) });

                if (elapsedMs < opts.getInitialDelayMs() + opts.getSettleDurationMs()) return;

                stop();
                opts.onAnimationEnd?.();
            }, opts.getScrambleIntervalMs());

            return true;
        };

        const getKeptAfterChange = (previous: string[], next: string[]) => {
            const elapsedMs = Date.now() - startedAtMs;
            const state = store.get();
            const wasSettled = runSettleTimes.map(
                (settleTime, index) => !state.isScrambling || !!state.kept[index] || elapsedMs >= settleTime,
            );

            return getCarriedIndices(previous, next).map((from) => from !== undefined && !!wasSettled[from]);
        };

        return { get: store.get, subscribe: store.subscribe, start, stop, getKeptAfterChange };
    };
}

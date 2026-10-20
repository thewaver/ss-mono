const HASH_SHIFT_WIDE = 16;
const HASH_SHIFT_NARROW = 13;
const HASH_MULTIPLIER_A = 0x85ebca6b;
const HASH_MULTIPLIER_B = 0xc2b2ae35;
const HASH_RANGE = 4294967296;

const mix = (value: number) => {
    let hash = value | 0;

    hash ^= hash >>> HASH_SHIFT_WIDE;
    hash = Math.imul(hash, HASH_MULTIPLIER_A);
    hash ^= hash >>> HASH_SHIFT_NARROW;
    hash = Math.imul(hash, HASH_MULTIPLIER_B);
    hash ^= hash >>> HASH_SHIFT_WIDE;

    return hash >>> 0;
};

export namespace RandomUtils {
    /**
     * Builds a random alternating `0;1;0;…` string for an SVG animation `values`
     * attribute.
     *
     * Whether it starts at `0` or `1` is random, as is the number of flips, so several
     * elements sharing one animation length blink out of step with each other. The
     * result always ends on the value it started with, keeping the loop seamless.
     *
     * @param maxLength The most flip pairs to produce. Always produces at least one.
     * @returns A string such as `"0;1;0;1;0"`. Uses `Math.random`, so this is not
     * suitable for anything security-related.
     */
    export const get01ValueString = (maxLength: number) => {
        const pattern = Math.random() >= 0.5 ? "0;1;" : "1;0;";
        const repeatCount = Math.max(1, Math.ceil(Math.random() * maxLength));

        return pattern.repeat(repeatCount) + pattern[0];
    };

    /**
     * Turns a few numbers into a number from `0` up to `1` that looks random but is always the same for the same
     * numbers.
     *
     * For anything that must be scattered but must not change between one drawing and the next — which cell of a
     * grid lights up, how far apart two items sit — keyed by whatever identifies it: a cell's row and column, an
     * item's index, plus a seed choosing which of the many scatterings it is. Changing any one number, or their
     * order, gives an unrelated answer.
     *
     * Only the whole-number part of each value takes part, within the 32-bit range, so `1.5` and `1` hash alike.
     * Not suitable for anything security-related.
     *
     * @param values The numbers to hash. None at all answers `0`.
     * @returns A number from `0` (inclusive) to `1` (exclusive).
     */
    export const hash = (...values: number[]) => {
        let result = mix(values[0] ?? 0);

        for (let index = 1; index < values.length; index++) {
            result = mix(result ^ values[index]);
        }

        return result / HASH_RANGE;
    };

    /**
     * Makes a source of random-looking numbers that gives the same run every time for the same seed.
     *
     * Each call gives the next number of the run, from `0` up to `1`, like `Math.random`. Two sources made with
     * the same seed give the same run, which is what a layout needs when it has to come out the same on every
     * drawing.
     *
     * @param seed Which run to give. Only its whole-number part takes part.
     * @returns The source.
     */
    export const createSeeded = (seed = 0) => {
        let index = 0;

        return () => hash(seed, index++);
    };

    /**
     * Puts a list in a random order.
     *
     * Every order is equally likely, given a source that is. Pass a source from {@link createSeeded} for an order
     * that is the same every time.
     *
     * @param values The list. It is not changed.
     * @param random Where the randomness comes from. Defaults to `Math.random`.
     * @returns A new list holding the same values.
     */
    export const shuffle = <T>(values: readonly T[], random: () => number = Math.random): T[] => {
        const shuffled = [...values];

        for (let remaining = shuffled.length; remaining > 1; remaining--) {
            const index = Math.floor(random() * remaining);
            const held = shuffled[remaining - 1];

            shuffled[remaining - 1] = shuffled[index];
            shuffled[index] = held;
        }

        return shuffled;
    };
}

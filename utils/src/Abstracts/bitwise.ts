export namespace BitwiseUtils {
    /**
     * Checks whether a single flag is switched on inside a bitmask.
     *
     * @param currentFlags The bitmask to inspect.
     * @param flagToCheck The single flag to look for. Must be a power of two.
     * @returns `true` if the flag is set.
     */
    export const hasFlag = <T extends number>(currentFlags: number, flagToCheck: T): boolean => {
        return Boolean(currentFlags & flagToCheck);
    };

    /**
     * Checks whether *every* one of the given flags is switched on inside a bitmask.
     *
     * @param currentFlags The bitmask to inspect.
     * @param flagsToCheck The flags that must all be present. An empty list returns `true`.
     * @returns `true` only if no flag is missing.
     */
    export const hasFlags = <T extends number>(currentFlags: number, flagsToCheck: T[]): boolean => {
        for (const flag of flagsToCheck) {
            if (!hasFlag(currentFlags, flag)) {
                return false;
            }
        }

        return true;
    };

    /**
     * Switches the given flags on, leaving every other bit untouched.
     *
     * Flags that are already set are left alone, so calling this twice with the same
     * flag is safe.
     *
     * @param currentFlags The starting bitmask.
     * @param add The flags to switch on.
     * @returns A new bitmask. The input is not modified.
     */
    export const addFlags = <T extends number>(currentFlags: number, add: T[]): number => {
        return add.reduce<number>((result, flag) => result | flag, currentFlags);
    };

    /**
     * Switches the given flags off, leaving every other bit untouched.
     *
     * Flags that are already absent are left alone, so calling this twice with the same
     * flag is safe.
     *
     * @param currentFlags The starting bitmask.
     * @param remove The flags to switch off.
     * @returns A new bitmask. The input is not modified.
     */
    export const removeFlags = <T extends number>(currentFlags: number, remove: T[]): number => {
        return remove.reduce<number>((result, flag) => result & ~flag, currentFlags);
    };

    /**
     * Weaves the low bits of two numbers together, one from each in turn.
     *
     * Bit `i` of `first` lands at bit `2i` and bit `i` of `second` at bit `2i + 1`. Read as a position, the
     * result walks a square grid in Z-shaped steps — the Morton order — so cells near each other on the grid
     * tend to sit near each other in the result.
     *
     * @param first The number whose bits take the even places.
     * @param second The number whose bits take the odd places.
     * @param bits How many low bits of each take part. Higher bits are dropped.
     * @returns The interleaved number.
     */
    export const interleave = (first: number, second: number, bits: number) => {
        let result = 0;

        for (let bit = 0; bit < bits; bit++) {
            result |= ((first >> bit) & 1) << (bit * 2);
            result |= ((second >> bit) & 1) << (bit * 2 + 1);
        }

        return result;
    };
}

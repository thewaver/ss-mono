/** Turns the values a control holds into the text a native form submit carries. */
export namespace FormValueUtils {
    /**
     * Writes one value as the text a form submits for it.
     *
     * A string goes as it is, and a number, a boolean or a big integer as its plain spelling, which is what a native
     * select sends for its options. Anything else, such as a record, goes as JSON. `compute` replaces all of that
     * when the caller knows what the server wants, such as a record's id.
     *
     * @param value The value to write.
     * @param compute Writes the value itself, and is the only thing used when given.
     * @returns The text, or `undefined` for a value JSON cannot write: `undefined`, a function or a symbol. A value
     * JSON refuses to write, such as a circular object, or a big integer inside an object, throws.
     */
    export const computeText = <T>(value: T, compute?: (value: T) => string): string | undefined => {
        if (compute) return compute(value);

        if (typeof value === "string") return value;

        if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
            return String(value);
        }

        return JSON.stringify(value);
    };

    /**
     * Writes a list of values as the texts a form submits, in order.
     *
     * @param values The values to write.
     * @param compute Writes one value itself, as in {@link computeText}.
     * @returns One text per value. A value {@link computeText} cannot write is left out rather than submitted as an
     * empty entry.
     */
    export const computeTexts = <T>(values: readonly T[], compute?: (value: T) => string): string[] =>
        values.flatMap((value) => computeText(value, compute) ?? []);
}

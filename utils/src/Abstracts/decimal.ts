const FALLBACK_GROUP_SEPARATOR = ",";
const FALLBACK_DECIMAL_SEPARATOR = ".";
const SAMPLE_VALUE = 1234.5;
const RADIX = 10;
const HALF_DIGIT = 5;
const THOUSAND = 1000;
const DIGITS_PER_THOUSAND = 3;
const SI_SMALL_PREFIXES = ["m", "μ", "n", "p", "f", "a", "z", "y", "r", "q"];
const SI_LARGE_PREFIXES = ["k", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"];
const SHORT_SCALE_SUFFIXES = ["K", "M", "B", "T"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const MIN_LETTER_SUFFIX_LENGTH = 2;

const formatByThousands = (
    value: number,
    decimals: number,
    padded: boolean,
    locale: string | undefined,
    minStep: number,
    maxStep: number,
    suffixOf: (step: number) => string,
) => {
    const format = (scaled: number, suffix: string) =>
        `${new Intl.NumberFormat(locale, {
            maximumFractionDigits: decimals,
            minimumFractionDigits: padded ? decimals : 0,
        }).format(scaled)}${suffix}`;

    if (value === 0 || !Number.isFinite(value)) return format(value, "");

    const scale = (step: number) => (step < 0 ? value * THOUSAND ** -step : value / THOUSAND ** step);
    const clamp = (step: number) => Math.min(maxStep, Math.max(minStep, step));

    let step = clamp(Math.floor(Math.log10(Math.abs(value)) / DIGITS_PER_THOUSAND));

    if (Math.abs(Number(scale(step).toFixed(decimals))) >= THOUSAND) step = clamp(step + 1);

    return format(scale(step), suffixOf(step));
};

const repeatedLetters = (index: number) =>
    ALPHABET[index % ALPHABET.length].repeat(MIN_LETTER_SUFFIX_LENGTH + Math.floor(index / ALPHABET.length));

const countingLetters = (index: number) => {
    let remaining = index;
    let length = MIN_LETTER_SUFFIX_LENGTH;

    while (remaining >= ALPHABET.length ** length) {
        remaining -= ALPHABET.length ** length;
        length++;
    }

    let letters = "";

    for (let i = 0; i < length; i++) {
        letters = `${ALPHABET[remaining % ALPHABET.length]}${letters}`;
        remaining = Math.floor(remaining / ALPHABET.length);
    }

    return letters;
};

/** Reading and writing decimal numbers as digit strings, for amount fields and the like. */
export namespace DecimalUtils {
    /**
     * Finds the characters a locale uses to group thousands and to mark the fraction.
     *
     * These are read out of `Intl` rather than taken as arguments, for the same reason month
     * names are: a consumer who has said which locale they are in has already answered this,
     * and a library that asks again invites the two to disagree.
     *
     * @param locale Which locale to read, or the environment's own when left out.
     * @returns The group and decimal separators, falling back to `,` and `.` if the locale
     * names neither.
     */
    export const getSeparators = (locale?: string) => {
        const parts = new Intl.NumberFormat(locale, { minimumFractionDigits: 1 }).formatToParts(SAMPLE_VALUE);

        return {
            groupSeparator: parts.find((part) => part.type === "group")?.value ?? FALLBACK_GROUP_SEPARATOR,
            decimalSeparator: parts.find((part) => part.type === "decimal")?.value ?? FALLBACK_DECIMAL_SEPARATOR,
        };
    };

    /**
     * Converts a number into its value in the smallest unit, as a run of digits.
     *
     * The shift is done on the number's **decimal spelling** rather than by multiplying it.
     * Multiplying is the obvious way and it rounds the wrong way at every halfway case a money
     * field is built for: `1.005 * 100` is `100.49999999999999`, so `Math.round` gives ten
     * pounds fifty rather than fifty-one, and `toFixed` inherits the same fault. `${value}`
     * prints the shortest decimal that reads back as the same number — `"1.005"` — so moving
     * the point along that string and looking at the next digit rounds on what the consumer
     * wrote instead of on its binary approximation.
     *
     * A magnitude large or small enough to print in exponential form falls back to multiplying,
     * which is the one case this cannot spell; an amount field is not where `1e21` belongs.
     *
     * @param value The number to convert. The sign is dropped.
     * @param decimals How many digits the smallest unit sits below the point, so `2` for pennies.
     * @returns The digits, rounded half up. Reverse it with {@link fromDigits}.
     */
    export const toDigits = (value: number, decimals: number) => {
        const text = `${Math.abs(value)}`;

        if (text.includes("e")) return `${Math.round(Math.abs(value) * RADIX ** decimals)}`;

        const [whole, fraction = ""] = text.split(".");
        const padded = `${fraction}${"0".repeat(decimals + 1)}`.slice(0, decimals + 1);
        const shifted = Number(`${whole}${padded.slice(0, decimals)}`);

        return `${shifted + (Number(padded[decimals]) >= HALF_DIGIT ? 1 : 0)}`;
    };

    /**
     * Reads a run of digits back as a number, putting the decimal point back in.
     *
     * @param digits The value in its smallest unit, as produced by {@link toDigits}.
     * @param decimals How many digits the smallest unit sits below the point, so `2` for pennies.
     * @returns The number, or `undefined` for an empty run — an empty amount field has no value
     * rather than a value of zero.
     */
    export const fromDigits = (digits: string, decimals: number) =>
        digits.length === 0 ? undefined : Number(digits) / RADIX ** decimals;

    /**
     * Shortens a number with an SI prefix, so `10002` reads as `"10.002k"` and `0.0025` as `"2.5m"`.
     *
     * The prefixes are the SI ones — `k`, `M`, `G` up to `Q`, and `m`, `μ`, `n` down to `q` — and
     * they are the same in every locale. That is the point of it: `Intl.NumberFormat`'s compact
     * notation already abbreviates for a reader's language, but it writes `K` and `B` in English,
     * `mil` in Spanish and groups by ten thousand in Japanese, and it has nothing below one. Only the
     * number in front of the prefix is formatted through `Intl`, so the decimal separator is still
     * the locale's.
     *
     * The prefix is chosen after rounding, so a value that rounds up to a thousand moves to the next
     * prefix: `999_999` at one decimal is `"1M"`, never `"1000k"`. A value past either end of the
     * table keeps the outermost prefix rather than switching to exponential form. Zero, `NaN` and
     * the infinities get no prefix.
     *
     * @param value The number to shorten. The sign is kept.
     * @param decimals The most digits to show after the point.
     * @param padded Whether to always show `decimals` digits, so `10000` at two is `"10.00k"`
     * rather than `"10k"`.
     * @param locale Which locale to format the number for, or the environment's own when left out.
     * @returns The number followed directly by its prefix, with no space, so a unit can be appended.
     */
    export const formatSI = (value: number, decimals: number, padded = false, locale?: string) =>
        formatByThousands(
            value,
            decimals,
            padded,
            locale,
            -SI_SMALL_PREFIXES.length,
            SI_LARGE_PREFIXES.length,
            (step) => (step > 0 ? SI_LARGE_PREFIXES[step - 1] : step < 0 ? SI_SMALL_PREFIXES[-step - 1] : ""),
        );

    /**
     * Shortens a number the way idle games do: `K`, `M`, `B`, `T`, then letters that never run out.
     *
     * The first four suffixes are thousand, million, billion and trillion. Past a trillion the suffix
     * becomes letters, in one of two schemes:
     *
     * - `"counting"` counts like spreadsheet columns: `AA`, `AB` … `AZ`, `BA` … `ZZ`, then `AAA`.
     *   All 676 two-letter suffixes come before a third letter is needed, and `Number` runs out at
     *   `DT`, so in practice the suffix is always two letters.
     * - `"repeated"` cycles one letter and grows the run every 26 steps: `AA`, `BB` … `ZZ`, then
     *   `AAA` … `ZZZ`, then `AAAA`.
     *
     * Every suffix is a thousand times the one before it, and none runs out before `Number` does,
     * which is what this offers over {@link formatSI}. Suffixes are upper case to match `K` to `T`;
     * lower-casing the result gives `"10aa"`, since it touches nothing else. Rounding moves to the
     * next suffix exactly as {@link formatSI} does, so `999_999` at one decimal is `"1M"`. A value
     * below a thousand gets no suffix, fractions included, and so do zero, `NaN` and the infinities.
     *
     * @param value The number to shorten. The sign is kept.
     * @param decimals The most digits to show after the point.
     * @param scheme How the letters past `T` advance.
     * @param padded Whether to always show `decimals` digits, so `10000` at two is `"10.00K"`
     * rather than `"10K"`.
     * @param locale Which locale to format the number for, or the environment's own when left out.
     * @returns The number followed directly by its suffix, with no space.
     */
    export const formatLetters = (
        value: number,
        decimals: number,
        scheme: "counting" | "repeated" = "counting",
        padded = false,
        locale?: string,
    ) =>
        formatByThousands(value, decimals, padded, locale, 0, Infinity, (step) => {
            if (step <= SHORT_SCALE_SUFFIXES.length) return step === 0 ? "" : SHORT_SCALE_SUFFIXES[step - 1];

            const index = step - SHORT_SCALE_SUFFIXES.length - 1;

            return scheme === "counting" ? countingLetters(index) : repeatedLetters(index);
        });
}

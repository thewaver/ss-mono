import { createRenderEffect, createSignal } from "solid-js";

import type { TextSyncElement, TextSyncGroupDefs, TextSyncMaskResult } from "./TextSync.types";

/** The low end of the digit range. */
const DIGIT_FIRST = "0";
/** The high end of the digit range. */
const DIGIT_LAST = "9";

/** The sign a negative number carries. */
const MINUS_SIGN = "-";

/** A number wide enough to show how a locale groups its digits. */
const GROUP_SAMPLE_VALUE = 1234567890;

/** Thousands, for a locale that reports no grouping at all. */
const FALLBACK_GROUP_SIZE = 3;

/** Whether a character is an ASCII digit. */
const getIsDigit = (char: string) => char >= DIGIT_FIRST && char <= DIGIT_LAST;

/** Everything but the digits, thrown away. */
const getDigits = (text: string) => [...text].filter(getIsDigit).join("");

/**
 * Splits a whole number into its groups, counting from the right.
 *
 * Right to left because that is the end grouping is anchored to: `12345` is `12,345` and not
 * `123,45`. Sizes are consumed in order and the last one repeats, which covers the Indian grouping
 * of three then twos.
 */
const getGroups = (whole: string, sizes: number[]) => {
    const groups: string[] = [];

    let end = whole.length;
    let index = 0;

    while (end > 0) {
        const size = sizes[Math.min(index, sizes.length - 1)];

        if (size === undefined || size < 1) {
            groups.unshift(whole.slice(0, end));
            break;
        }

        groups.unshift(whole.slice(Math.max(0, end - size), end));

        end -= size;
        index += 1;
    }

    return groups;
};

/** Separates a leading minus from the rest of the text, when signs are allowed. */
const splitSign = (text: string, hasSign: boolean | undefined) =>
    hasSign && text.includes(MINUS_SIGN)
        ? { sign: MINUS_SIGN, rest: text.split(MINUS_SIGN).join("") }
        : { sign: "", rest: text };

/**
 * Keeps a text input's displayed value in step with the value a component holds, masks included.
 *
 * Writing to an input's `value` moves the caret to the end, which makes a formatted field
 * unusable — type a digit in the middle of a phone number and the caret jumps away. So every path
 * here works out where the caret should end up and puts it back, counting digits rather than
 * characters so that inserted separators do not displace it.
 */
export namespace TextSyncUtils {
    /** The character standing for one digit in a mask pattern. Everything else in a pattern is a literal separator. */
    export const MASK_DIGIT = "#";

    /**
     * Applies a fixed pattern to what the user typed, and works out where the caret goes.
     *
     * Only the digits are data; the separators are re-inserted from the pattern each time. That is what
     * makes deleting a separator do the right thing: the text is unchanged, so the deletion is taken to
     * mean the digit before it, which is what the user was reaching for.
     *
     * The text stops as soon as the digits run out, so a partly-typed field shows no trailing
     * separators.
     *
     * @param pattern The mask, with {@link TextSyncUtils.MASK_DIGIT} for each digit.
     * @param previous The text before this edit, needed to tell an insertion from a deletion.
     * @param next The text the input now holds.
     * @param caret Where the caret is in `next`.
     * @returns The masked text and where to put the caret.
     */
    export const applyMask = (pattern: string, previous: string, next: string, caret: number): TextSyncMaskResult => {
        const previousDigits = getDigits(previous);
        const isDeletion = next.length < previous.length;

        let digits = getDigits(next);
        let digitIndex = getDigits(next.slice(0, caret)).length;

        if (isDeletion && digits.length === previousDigits.length && digitIndex > 0) {
            digits = digits.slice(0, digitIndex - 1) + digits.slice(digitIndex);
            digitIndex -= 1;
        }

        const offsetsAfterDigit: number[] = [];

        let text = "";
        let used = 0;

        for (const char of pattern) {
            if (char === MASK_DIGIT) {
                if (used >= digits.length) break;

                text += digits[used];
                used += 1;
                offsetsAfterDigit.push(text.length);
            } else {
                if (digits.length === 0) break;

                text += char;
            }
        }

        const clampedIndex = Math.min(digitIndex, offsetsAfterDigit.length);

        if (clampedIndex === offsetsAfterDigit.length) return { text, caret: text.length };

        return { text, caret: clampedIndex === 0 ? 0 : offsetsAfterDigit[clampedIndex - 1] };
    };

    /** The digits in a masked field's text, with the separators dropped. */
    export const getMaskedDigits = getDigits;

    /**
     * Reads a run of digits as a series of fixed-width numbers.
     *
     * For a masked field whose parts are numbers rather than one value — a date's day, month and year.
     *
     * @param digits The digits entered.
     * @param lengths How many digits each part takes.
     * @returns One number per complete part. A part the digits do not reach is left out rather than
     * guessed at, so a half-typed entry gives a shorter list.
     */
    export const readGroups = (digits: string, lengths: number[]) => {
        const groups: number[] = [];

        let offset = 0;

        for (const length of lengths) {
            if (offset + length > digits.length) break;

            groups.push(Number(digits.slice(offset, offset + length)));
            offset += length;
        }

        return groups;
    };

    /**
     * Formats a run of digits through a mask, ignoring the caret.
     *
     * For displaying a value rather than editing one.
     *
     * @param pattern The mask, with {@link TextSyncUtils.MASK_DIGIT} for each digit.
     * @param digits The digits to place. Anything that is not a digit is dropped.
     */
    export const formatWithMask = (pattern: string, digits: string) =>
        applyMask(pattern, "", getDigits(digits), digits.length).text;

    /** The sign a masked field uses for a negative number. */
    export const MASK_MINUS = MINUS_SIGN;

    /**
     * How a locale groups its digits.
     *
     * Asked of `Intl` rather than assumed, because the answer is not always threes: Indian locales
     * group the last three and then in twos.
     *
     * @param locale The locale to ask about. The platform's default when omitted.
     * @returns The group sizes from the right, trailing repeats collapsed since the last size repeats
     * indefinitely. `[3]` for most locales, `[3, 2]` for Indian ones.
     */
    export const getGroupSizes = (locale?: string) => {
        const lengths = new Intl.NumberFormat(locale)
            .formatToParts(GROUP_SAMPLE_VALUE)
            .filter((part) => part.type === "integer")
            .map((part) => part.value.length);

        const sizes = lengths.slice(1).reverse();

        if (sizes.length === 0) return [FALLBACK_GROUP_SIZE];

        while (sizes.length > 1 && sizes[sizes.length - 1] === sizes[sizes.length - 2]) sizes.pop();

        return sizes;
    };

    /**
     * Formats a number as the user types it, grouping the digits and placing the decimal separator.
     *
     * The digits are read as the smallest unit and the decimal separator is placed a fixed distance
     * from the right, so typing `1`, `2`, `3` into a two-decimal field walks through `0.01`, `0.12`,
     * `1.23`. That means the separator never has to be typed and the caret never has to cross it.
     *
     * The caret is counted in digits from the right rather than from the left, which is what keeps it
     * next to the digit the user was working on as groups appear and shift everything along.
     *
     * @param defs.groupSizes The group sizes from the right, as {@link TextSyncUtils.getGroupSizes}
     * gives them.
     * @param defs.groupSeparator What goes between groups.
     * @param defs.decimalSeparator What goes before the fraction.
     * @param defs.decimals How many decimal places the field holds. Zero leaves the fraction out
     * entirely.
     * @param defs.hasSign Whether a leading minus is allowed.
     * @param previous The text before this edit, needed to tell an insertion from a deletion.
     * @param next The text the input now holds.
     * @param caret Where the caret is in `next`.
     * @returns The formatted text and where to put the caret. Leading zeroes are dropped, and clearing
     * every digit leaves the sign alone.
     */
    export const applyGroupedMask = (
        defs: TextSyncGroupDefs,
        previous: string,
        next: string,
        caret: number,
    ): TextSyncMaskResult => {
        const { sign } = splitSign(next, defs.hasSign);
        const previousDigits = getDigits(previous);
        const isDeletion = next.length < previous.length;

        let digits = getDigits(next);
        let digitsAfter = getDigits(next.slice(caret)).length;

        if (isDeletion && digits.length === previousDigits.length && digits.length > digitsAfter) {
            const index = digits.length - digitsAfter;

            digits = digits.slice(0, index - 1) + digits.slice(index);
        }

        digits = digits.replace(/^0+(?=\d)/, "");

        if (digits.length === 0) return { text: sign, caret: sign.length };

        const padded = digits.padStart(defs.decimals + 1, "0");
        const whole = padded.slice(0, padded.length - defs.decimals);
        const fraction = padded.slice(padded.length - defs.decimals);

        const groups = getGroups(whole, defs.groupSizes);

        const text =
            sign + groups.join(defs.groupSeparator) + (defs.decimals > 0 ? defs.decimalSeparator + fraction : "");

        digitsAfter = Math.min(digitsAfter, padded.length);

        let seen = 0;
        let offset = text.length;

        while (offset > 0 && seen < digitsAfter) {
            offset -= 1;

            if (getIsDigit(text[offset])) seen += 1;
        }

        return { text, caret: offset };
    };

    /**
     * Formats a run of digits as a grouped number, ignoring the caret.
     *
     * For displaying a value rather than editing one.
     *
     * @param defs The same grouping description {@link TextSyncUtils.applyGroupedMask} takes.
     * @param digits The digits to place, optionally with a leading minus.
     */
    export const formatWithGroups = (defs: TextSyncGroupDefs, digits: string) => {
        const { sign, rest } = splitSign(digits, defs.hasSign);

        return applyGroupedMask(defs, "", sign + getDigits(rest), 0).text;
    };

    /** The digits in a grouped field's text, keeping a leading minus and dropping the separators. */
    export const readSignedDigits = (text: string) => {
        const { sign, rest } = splitSign(text, true);

        return sign + getDigits(rest);
    };

    /**
     * Binds an input element to a value, preserving the caret and honouring composition.
     *
     * Two problems handled. Writing to `value` collapses the selection, so the selection is read before
     * the write and restored after it — which is what lets a controlled input be typed in at all. And
     * an input mid-composition, as with an input method editor for Chinese or Japanese, must not be
     * written to: doing so destroys the composition in progress, so writes are held off until it ends.
     *
     * @param getRef The input or textarea.
     * @param getValue The value it should show.
     * @param opts.onInput Called with what the user has produced — the masked text, where a mask is in
     * use, rather than the raw keystrokes.
     * @param opts.computeMaskedText Applies a mask on every keystroke, as
     * {@link TextSyncUtils.applyMask} or {@link TextSyncUtils.applyGroupedMask} do. Without one the text
     * passes through unchanged.
     * @returns `handleInput`, `handleCompositionStart` and `handleCompositionEnd` to attach to the
     * element's own handlers. All three are needed; composition is not optional for a field that anyone
     * might type Japanese into.
     */
    export const createValueSync = (
        getRef: () => TextSyncElement | undefined,
        getValue: () => string,
        opts: {
            onInput: (value: string) => void;
            computeMaskedText?: (previous: string, next: string, caret: number) => TextSyncMaskResult;
        },
    ) => {
        const [getIsComposing, setIsComposing] = createSignal(false);

        const syncElement = (element: TextSyncElement) => {
            const value = getValue();

            if (getIsComposing() || element.value === value) return;

            const { selectionStart, selectionEnd } = element;

            element.value = value;

            if (selectionStart === null || selectionEnd === null) return;

            element.setSelectionRange(selectionStart, selectionEnd);
        };

        const reportValue = (element: TextSyncElement) => {
            opts.onInput(element.value);

            syncElement(element);
        };

        createRenderEffect(() => {
            const element = getRef();

            if (!element) return;

            syncElement(element);
        });

        const reportMaskedValue = (
            element: TextSyncElement,
            computeMaskedText: (previous: string, next: string, caret: number) => TextSyncMaskResult,
        ) => {
            const hasSelection = element.selectionStart !== null;
            const { text, caret } = computeMaskedText(
                getValue(),
                element.value,
                element.selectionStart ?? element.value.length,
            );

            element.value = text;

            if (hasSelection) element.setSelectionRange(caret, caret);

            opts.onInput(text);
        };

        return {
            handleInput: (element: TextSyncElement) => {
                if (getIsComposing()) return;

                if (opts.computeMaskedText) {
                    reportMaskedValue(element, opts.computeMaskedText);

                    return;
                }

                reportValue(element);
            },
            handleCompositionStart: () => {
                setIsComposing(true);
            },
            handleCompositionEnd: (element: TextSyncElement) => {
                opts.onInput(element.value);

                setIsComposing(false);
            },
        };
    };
}

import { DecimalUtils } from "@thewaver/ss-utils";

import type { MaskedFieldDefs } from "../../../Abstracts/MaskedField/MaskedField.types";
import type { TextSyncGroupDefs } from "../../../Abstracts/TextSync/TextSync.types";
import { TextSyncUtils } from "../../../Abstracts/TextSync/TextSync.utils";
import type { CurrencyInputFormatDefs, CurrencyInputRuleDefs } from "./CurrencyInput.types";

/** Matches every digit, so a hint can be written as zeros whatever digits it was built from. */
const DIGIT = /\d/g;

/** The digit a hint is written in. */
const HINT_DIGIT = "0";

/**
 * How an amount field reads and writes its text.
 *
 * The field holds digits that fill from the right, so the fraction is always complete, and the separators are
 * the field's rather than the reader's to type. These are the rules for that; keeping the text and the amount in
 * step as the reader types is `MaskedFieldUtils`', wired by each framework.
 */
export namespace CurrencyInputUtils {
    /**
     * The grouping an amount is written with.
     *
     * The separators come from the locale, and so does the grouping unless it is given — which is what spells
     * `en-IN`'s two-digit groups above the first three correctly without the consumer knowing about them.
     *
     * @param defs.locale Which country's conventions to write in. Left out, the reader's own.
     * @param defs.groupSizes How the digits before the decimal separator are grouped, overriding the locale's.
     * @param defs.decimals How many digits are kept after the decimal separator.
     * @param defs.hasSign Whether a minus may lead the amount.
     * @returns What `TextSyncUtils.applyGroupedMask` and `TextSyncUtils.formatWithGroups` take.
     */
    export const computeGroupDefs = (defs: CurrencyInputFormatDefs): TextSyncGroupDefs => ({
        ...DecimalUtils.getSeparators(defs.locale),
        groupSizes: defs.groupSizes ?? TextSyncUtils.getGroupSizes(defs.locale),
        decimals: defs.decimals,
        hasSign: defs.hasSign,
    });

    /**
     * A zero written the way the field writes amounts, shown as the placeholder's hint.
     *
     * It has one whole digit and the full fraction, so a reader sees which separator marks the fraction and how
     * many digits follow it before typing anything.
     *
     * @param groupDefs The grouping the field writes with, as {@link computeGroupDefs} gives it.
     */
    export const computeHint = (groupDefs: TextSyncGroupDefs) =>
        TextSyncUtils.formatWithGroups(groupDefs, HINT_DIGIT.repeat(groupDefs.decimals + 1)).replace(DIGIT, HINT_DIGIT);

    /**
     * Everything `MaskedFieldUtils` needs to know about an amount except where the amount is held.
     *
     * Digits become an amount by placing the decimal separator `decimals` from the right, with a leading minus
     * read as the sign where the field takes one. An amount outside the bounds is no amount at all, so typing past
     * a bound leaves the last amount inside it in place and marks what is shown as wrong, rather than nudging the
     * figure back. A complete entry has no fixed length.
     *
     * Each rule reads only the getters it needs, every time it is called, so a change of locale, grouping or bounds
     * takes effect without the rules being made again — and a framework that follows what each rule reads is told
     * about exactly the changes that concern it. That is not only tidiness: when the decimal count changes, a masked
     * field has to rewrite its text in the new spelling before the old digits are read as an amount, and it does so
     * only while reading the digits does not depend on the grouping.
     *
     * @param defs.getGroupDefs The grouping the amount is written with, as {@link computeGroupDefs} gives it.
     * @param defs.getDecimals How many digits are kept after the decimal separator.
     * @param defs.getHasSign Whether a minus may lead the amount.
     * @param defs.getMin The smallest amount the field takes, if there is one.
     * @param defs.getMax The largest amount the field takes, if there is one.
     * @returns The rules, to spread into a masked field's definition beside its value's getter and setter.
     */
    export const createFieldRules = (
        defs: CurrencyInputRuleDefs,
    ): Omit<MaskedFieldDefs<number>, "getValue" | "setValue"> => {
        const fromDigits = (digits: string) => {
            const isNegative = digits.startsWith(TextSyncUtils.MASK_MINUS);
            const magnitude = DecimalUtils.fromDigits(isNegative ? digits.slice(1) : digits, defs.getDecimals());

            if (magnitude === undefined) return undefined;

            const parsed = isNegative ? -magnitude : magnitude;

            const min = defs.getMin();
            const max = defs.getMax();

            return (min !== undefined && parsed < min) || (max !== undefined && parsed > max) ? undefined : parsed;
        };

        return {
            formatDigits: (digits) => TextSyncUtils.formatWithGroups(defs.getGroupDefs(), digits),
            readDigits: (text) =>
                defs.getHasSign() ? TextSyncUtils.readSignedDigits(text) : TextSyncUtils.getMaskedDigits(text),
            getDigitCount: () => undefined,
            toDigits: (value) =>
                (value < 0 && defs.getHasSign() ? TextSyncUtils.MASK_MINUS : "") +
                DecimalUtils.toDigits(value, defs.getDecimals()),
            fromDigits,
            getHasImpossibleDigits: (digits) => digits.length > 0 && fromDigits(digits) === undefined,
            getIsSame: (a, b) => a === b,
        };
    };
}

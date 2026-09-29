import { Color } from "@thewaver/ss-utils";

/**
 * The part of a color input that is not about drawing it: holding the consumer's color as the hue, saturation,
 * value and alpha the picker moves in, while handing it back in the notation it arrived in.
 *
 * The field keeps three things beside the consumer's value — the color split into channels, the notation the value
 * was written in, and whether the value could be read at all — and these rules keep them and the value in step
 * without either overwriting the other.
 */
export namespace ColorInputUtils {
    /** The color the picker holds when the value it was first handed cannot be read: opaque black. */
    export const STARTING_COLOR: Color.HSVA = { h: 0, s: 0, v: 0, a: 1 };

    /** The notation written back when the value's own cannot be told. */
    export const DEFAULT_NOTATION: Color.Notation = "hex";

    /** The top of the hue slider, in degrees. */
    export const HUE_MAX = 360;

    /** How far one key press moves the hue slider, in degrees. */
    export const HUE_STEP = 1;

    /**
     * What the field holds when it is first made.
     *
     * @param value The consumer's value at that moment.
     * @returns The color it parses to, or {@link STARTING_COLOR} when it parses to nothing; the notation it is
     * written in, or {@link DEFAULT_NOTATION}; and whether it could not be read.
     */
    export const computeStartingState = (value: string) => {
        const parsed = Color.parse(value);

        return {
            hsv: parsed ?? STARTING_COLOR,
            notation: Color.getNotationOf(value) ?? DEFAULT_NOTATION,
            isUnreadable: parsed === undefined,
        };
    };

    /**
     * Writes the color back in a notation.
     *
     * @param hsv The color.
     * @param notation The notation.
     * @returns The color as text.
     */
    export const toValue = (hsv: Color.HSVA, notation: Color.Notation) => Color.toNotation(hsv, notation);

    /**
     * What a new value from the consumer changes inside the field.
     *
     * A value that cannot be read changes nothing but the flag saying so, so the last color the picker held stays
     * on screen and nothing of the consumer's is overwritten. A readable one sets the notation to its own, and
     * replaces the color only when it is a different color from the one already held — so the field's own write
     * coming back, spelled differently, does not throw away what the picker holds, such as a hue that a grey
     * cannot carry.
     *
     * @param value The consumer's new value.
     * @param hsv The color the field holds.
     * @returns `isUnreadable`; the `notation` to take, or `undefined` to keep the current one; and the `hsv` to
     * take, or `undefined` to keep the current one.
     */
    export const computeIncoming = (value: string, hsv: Color.HSVA) => {
        const parsed = Color.parse(value);

        if (parsed === undefined) return { isUnreadable: true, notation: undefined, hsv: undefined };

        const notation = Color.getNotationOf(value) ?? DEFAULT_NOTATION;
        const isEcho = Color.isSame(value, toValue(hsv, notation));

        return { isUnreadable: false, notation, hsv: isEcho ? undefined : parsed };
    };

    /**
     * What the field hands the consumer after its color changes.
     *
     * Nothing is written while the value cannot be read, so the consumer's text survives until it is replaced with
     * a color, and nothing is written when the consumer already holds the same color.
     *
     * @param hsv The color the field now holds.
     * @param notation The notation to write it in.
     * @param value The consumer's value as it stands.
     * @param isUnreadable Whether that value could not be read.
     * @returns The value to write, or `undefined` when there is nothing to write.
     */
    export const computeOutgoing = (
        hsv: Color.HSVA,
        notation: Color.Notation,
        value: string,
        isUnreadable: boolean,
    ) => {
        if (isUnreadable) return undefined;

        const next = toValue(hsv, notation);

        return Color.isSame(value, next) ? undefined : next;
    };
}

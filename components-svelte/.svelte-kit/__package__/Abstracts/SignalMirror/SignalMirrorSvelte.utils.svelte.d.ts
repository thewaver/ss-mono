import { type SignalMirrorSplitDefs } from "@thewaver/ss-components";
import type { ValuePair } from "../../Utils/typeUtils.js";
/**
 * Gives a helper one value to work with whether or not somebody else supplied it, or in a representation of its own.
 *
 * A component's own two-way props need none of this — `$bindable` already keeps a value of the component's own when
 * none is bound. These are for the cases it does not cover: a helper handed a pair that may be missing, an inner copy
 * that absorbs writes the owner may refuse, a value held in one representation and worked on in another, and one
 * composite value edited as two halves. Each hands back a {@link ValuePair}, so the code using it reads and writes
 * one thing.
 */
export declare namespace SignalMirrorSvelteUtils {
    /**
     * Mirrors an outer value into an inner value of a different type, in both directions.
     *
     * For when a component works in one representation and its consumer holds another — a date as a string outside
     * and a structured value inside, say. Each direction converts, then checks whether the other side already agrees,
     * which is what keeps the two effects from bouncing a value back and forth forever.
     *
     * Must run while a component is being set up.
     *
     * @param getOuter Reads the consumer's value.
     * @param setOuter Writes it back.
     * @param opts.toInner Converts inwards.
     * @param opts.toOuter Converts outwards.
     * @param opts.getIsSame Compares two outer values. Identity when omitted, which is wrong for any value held as an
     * object, since a conversion produces a new one each time.
     * @returns The inner value, in the inner representation.
     */
    const createMirror: <TOuter, TInner>(getOuter: () => TOuter, setOuter: (value: TOuter) => void, opts: {
        toInner: (value: TOuter) => TInner;
        toOuter: (value: TInner) => TOuter;
        getIsSame?: (a: TOuter, b: TOuter) => boolean;
    }) => ValuePair<TInner>;
    /**
     * Mirrors an outer value into an inner value of the same type.
     *
     * {@link SignalMirrorSvelteUtils.createMirror} without the conversions, for when the inner copy exists to absorb
     * writes the consumer may reject or clamp rather than to change representation.
     *
     * Must run while a component is being set up.
     *
     * @param getOuter Reads the consumer's value.
     * @param setOuter Writes it back.
     * @param getIsSame Compares two values. Identity when omitted.
     * @returns The inner value.
     */
    const createValueMirror: <T>(getOuter: () => T, setOuter: (value: T) => void, getIsSame?: (a: T, b: T) => boolean) => ValuePair<T>;
    /**
     * Uses the pair it was handed if there is one, and a value of its own if there is not.
     *
     * For a helper whose two-way input is optional. The source is read on every access, so a caller may also start
     * handing a pair over later; the helper's own value is then ignored for as long as it does.
     *
     * Creates no effect, so it may run anywhere.
     *
     * @param getSource The pair, or `undefined`.
     * @param initial What the helper's own value starts at.
     * @returns A pair that reads and writes whichever of the two is in play.
     */
    const createOptional: <T>(getSource: () => ValuePair<T> | undefined, initial: T) => ValuePair<T>;
    /**
     * Splits one composite value into a value per half.
     *
     * {@link SignalMirrorUtils.createSplitter} with its halves read as getters and the whole value handed to it
     * whenever it changes. The rule that tells an outside clear from the echo of an inside one is the splitter's.
     *
     * **One case it cannot see**: a consumer clearing a value that is already `undefined` — because a half was
     * cleared a moment earlier — changes nothing, so no effect runs and the held half stays held. Only a clear that
     * actually changes the whole value arrives.
     *
     * Must run while a component is being set up.
     *
     * @param whole The whole value, read and written.
     * @param defs What {@link SignalMirrorUtils.createSplitter} takes.
     * @returns A pair per half. Either can be set to `undefined`, which leaves the whole value `undefined` until both
     * are filled in again.
     */
    const createSplit: <TWhole, TFirst, TSecond>(whole: ValuePair<TWhole | undefined>, defs: SignalMirrorSplitDefs<TWhole, TFirst, TSecond>) => {
        first: ValuePair<TFirst | undefined>;
        second: ValuePair<TSecond | undefined>;
    };
}

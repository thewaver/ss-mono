import type { CheckedState } from "../../Abstracts/CheckedState/CheckedState.types";

/** The rules a checkbox, a radio and a switch share: what they announce, and what the native input is left holding. */
export namespace BinarySwitchUtils {
    /**
     * The role the input announces itself with.
     *
     * A switch is announced as one, except while it is mixed: ARIA gives `switch` no mixed state, so a mixed switch
     * falls back to the native checkbox, which has one, and takes the role back once it is resolved.
     *
     * @param isSwitch Whether the control is a switch rather than a checkbox or a radio.
     * @param isMixed Whether it currently stands for a group whose members disagree.
     * @returns `"switch"`, or `undefined` to leave the role to the native input.
     */
    export const computeRole = (isSwitch: boolean, isMixed: boolean) => (isSwitch && !isMixed ? "switch" : undefined);

    /**
     * The one state a painter reads, folding mixed into checked.
     *
     * @param isChecked Whether the control is on.
     * @param isMixed Whether it stands for a group whose members disagree, which outranks `isChecked`.
     * @returns `"mixed"` while mixed, and otherwise whether it is on.
     */
    export const computeCheckedState = (isChecked: boolean, isMixed: boolean): CheckedState =>
        isMixed ? "mixed" : isChecked;

    /**
     * Writes the owner's state onto the native input.
     *
     * The browser flips `checked` and clears `indeterminate` itself as a click lands, before anyone has decided
     * whether the change is accepted. Call this once the owner has answered, so an owner that refused the change, or
     * made a different one, is what the input shows — and again whenever the state changes from outside.
     *
     * @param element The native input.
     * @param isChecked Whether the owner holds the control on.
     * @param isMixed Whether the owner holds it mixed.
     */
    export const syncElement = (element: HTMLInputElement, isChecked: boolean, isMixed: boolean) => {
        element.checked = isChecked;
        element.indeterminate = isMixed;
    };
}

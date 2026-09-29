import type { CheckedState } from "../../../Abstracts/CheckedState/CheckedState.types";
import { CheckedStateUtils } from "../../../Abstracts/CheckedState/CheckedState.utils";
import type { CheckboxGroupEntry } from "./CheckboxGroup.context.types";

/**
 * The rules of a checkbox group: its value is the list of ticked members' values, and a select-all box reads and
 * writes it through the members that can still change.
 */
export namespace CheckboxGroupUtils {
    /**
     * The group's list with one member's value put in or taken out.
     *
     * @param values The list as it stands.
     * @param value The member's value.
     * @param isChecked Whether the member is being ticked or cleared.
     * @returns A new list: the value appended when ticked, every copy of it removed when cleared. Checking first
     * whether anything changes is the caller's, so an unchanged press writes nothing.
     */
    export const toggleValue = <T>(values: T[], value: T, isChecked: boolean) =>
        isChecked ? [...values, value] : values.filter((held) => held !== value);

    /**
     * What a select-all box standing for the group shows.
     *
     * Disabled members are left out of the count while any member is enabled, because pressing the parent cannot
     * change them and a count including them could never settle. A group with every member disabled counts them
     * all, so the box still says what the group holds.
     *
     * @param values The group's list.
     * @param entries The members, in the order they registered.
     * @returns `true` when every counted member is ticked, `false` when none is, `"mixed"` when they disagree.
     */
    export const computeCheckedState = (values: unknown[], entries: CheckboxGroupEntry[]): CheckedState => {
        const enabled = entries.filter((entry) => !entry.getIsDisabled());
        const counted = enabled.length > 0 ? enabled : entries;

        return CheckedStateUtils.fromMembers(counted.map((entry) => values.includes(entry.getValue())));
    };

    /**
     * The values a select-all press would change.
     *
     * Only enabled members move, and only those not already where the press is taking them.
     *
     * @param values The group's list.
     * @param entries The members.
     * @param isChecked Whether the press ticks every member or clears them.
     * @returns The values of the members that would change, empty when the press changes nothing.
     */
    export const computeChangedValues = <T>(values: T[], entries: CheckboxGroupEntry[], isChecked: boolean) =>
        entries
            .filter((entry) => !entry.getIsDisabled() && values.includes(entry.getValue() as T) !== isChecked)
            .map((entry) => entry.getValue() as T);

    /**
     * The group's list with a select-all press applied.
     *
     * @param values The list as it stands.
     * @param changedValues What {@link computeChangedValues} answered.
     * @param isChecked Whether the press ticks or clears.
     * @returns A new list: the changed values appended when ticking, removed when clearing.
     */
    export const applyChangedValues = <T>(values: T[], changedValues: T[], isChecked: boolean) =>
        isChecked ? [...values, ...changedValues] : values.filter((held) => !changedValues.includes(held));
}

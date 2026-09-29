import type { CheckedState } from "../../../Abstracts/CheckedState/CheckedState.types";

export type CheckboxGroupOrientation = "horizontal" | "vertical";

export type CheckboxGroupController = {
    /**
     * What a select-all box standing for the group should show: `true` when every member is ticked, `false` when
     * none is, `"mixed"` when they disagree. Disabled members are left out of the count while any member is
     * enabled, because pressing the parent cannot change them and a count including them could never settle.
     */
    getCheckedState: () => CheckedState;
    /**
     * Ticks every enabled member, or clears every enabled member, which is what pressing a select-all box does.
     * Disabled members keep whatever they had. Answers `false` when nothing changed.
     */
    setIsEveryChecked: (isChecked: boolean) => boolean;
};

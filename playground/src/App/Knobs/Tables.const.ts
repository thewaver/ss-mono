import { STRESS_PART_COUNT } from "../Pages/TablePage/TableParts.const";

export namespace TableKnobs {
    export const MIN_STRESS_COUNT = 0;
    export const MAX_STRESS_COUNT = 200000;
    export const STRESS_COUNT_STEP = 1000;

    export const STARTING_STRESS_COUNT = STRESS_PART_COUNT;

    export const SELECTION_MODE_TEXT = {
        label: "Selection",
        hint: "Whether rows can be picked: not at all, one at a time, so picking a second drops the first, or several at once.",
        controls: "Sets TableProps.selectionMode",
    };

    export const IS_DISABLED_TEXT = {
        label: "Disabled",
        hint: "Turns the table off: nothing sorts or selects, and every cell still reads out to a screen reader.",
        controls: "Sets TableProps.isDisabled",
    };

    export const COUNT_TEXT = {
        label: "Row count",
        hint: "How many rows the table holds. Only the ones in view are built.",
        controls: "Sets the number of example rows sent to TableProps.rows",
    };
}

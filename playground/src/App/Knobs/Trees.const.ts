import type { TreeFalloff } from "../Pages/TreePage/TreeFalloffs.types";

export namespace TreeKnobs {
    export const FALLOFFS: TreeFalloff[] = ["smooth", "linear", "sharp"];

    export const STARTING_FALLOFF: TreeFalloff = "smooth";

    export const MIN_STRESS_COUNT = 0;
    export const MAX_STRESS_COUNT = 200000;
    export const STRESS_COUNT_STEP = 1000;

    export const STARTING_STRESS_COUNT = 10000;

    export const IS_REACHABLE_TEXT = {
        label: "Reachable when disabled",
        hint: "Lets the arrow keys stop on the disabled nodes, which then show a tooltip.",
        controls: "Sets TreeNode.isReachableWhenDisabled on the disabled nodes",
    };

    export const HAS_LINK_COMPONENT_TEXT = {
        label: "Custom link component",
        hint: "Draws the linking nodes with a custom link component, as a router's link would be. Off, they use the native HTML anchor element.",
        controls: "Sets TreeProps.linkComponent",
    };

    export const COUNT_TEXT = {
        label: "Node count",
        hint: "How many nodes the tree holds, in folders of fifty files. Only the rows in view are built.",
        controls: "Sets the number of example nodes sent to TreeProps.nodes",
    };

    export const FALLOFF_TEXT = {
        label: "Falloff",
        hint: "How the lean fades with distance from the pointer: smoothly, in a straight line, or sharply, so only the nearest nodes move.",
        controls: "Picks how fast the example effect sent to TreeProps.computeEffect fades with distance",
    };
}

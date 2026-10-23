import type { Point2d } from "@thewaver/ss-utils";

import type { CheckedState } from "../../Abstracts/CheckedState/CheckedState.types";
import type { FlatRow } from "../../Abstracts/Flattener/Flattener.types";
import type { PlacementLayoutFn, PlacementRect } from "../../Abstracts/Placement/Placement.types";
import type { ProximityEffectFn } from "../../Abstracts/Proximity/Proximity.types";

export type TreeNodeRenderProps<T = unknown> = {
    /**
     * The item this node was built from, so whatever is drawn for the node — its tooltip, say — can tell which one
     * it is for without a function of its own made per node.
     */
    value: T;
    /**
     * Whether this node can hold children, which is what separates a folder from a leaf even when the folder is empty.
     */
    isBranch: boolean;
    /** Whether this node is open. */
    isExpanded: boolean;
    /** Whether this node's children are still being fetched. */
    isPending: boolean;
    /** Whether this node is the selected one, or in a `MultiTree`, whether it is ticked. */
    isSelected: boolean;
    /**
     * Whether this node is ticked, untouched, or — for a folder in a `MultiTree` — `"mixed"`, when some of what is
     * inside it is ticked and some is not. In a `Tree` it follows `isSelected`.
     */
    checkedState: CheckedState;
    /** How deep this node sits, counting from the roots, so a consumer can indent it. */
    depth: number;
};

export type TreeNodeRecord<T, TTooltipDefs> = {
    value: T;
    href?: string;
    children?: TreeNodeRecord<T, TTooltipDefs>[];
    hasMoreChildren?: boolean;
    isDisabled?: boolean;
    isReachableWhenDisabled?: boolean;
    tooltipDefs?: TTooltipDefs;
};

export type TreeRecordRow<T, TTooltipDefs> = FlatRow<TreeNodeRecord<T, TTooltipDefs>>;

export type TreeConnectorDefs<T> = {
    /** The node the connector reaches. */
    value: T;
    /** The node it leaves, which is the first one's parent. */
    parentValue: T;
    /** Where the parent was placed. */
    from?: PlacementRect;
    /** Where the child was placed. */
    to?: PlacementRect;
    /** The point the layout turns about, for a connector that bends round it. */
    origin?: Point2d;
    /** The radii of the curve the layout places on, for a connector that follows it. */
    radii?: Point2d;
};

export type TreeMultiKeyAction<T, TTooltipDefs> =
    | { kind: "check"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "focus_check"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "check_range"; rows: TreeRecordRow<T, TTooltipDefs>[]; focus?: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "check_all" };

export type TreeKeyAction<T, TTooltipDefs> =
    | { kind: "claim" }
    | { kind: "expand_siblings"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "focus"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "expand"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "collapse"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "activate"; row: TreeRecordRow<T, TTooltipDefs> }
    | { kind: "click"; row: TreeRecordRow<T, TTooltipDefs> };

export type BaseTreeValues = {
    /**
     * Names the tree for assistive technology. It is required because nothing else can name it, and a reader landing
     * on an unnamed tree is told only that it is one.
     */
    ariaLabel: string;
    /** How long either marker takes to slide from one node to the next, and to fade. */
    floaterTransitionDurationMs?: number;
};

export type BaseTreeCbs<T> = {
    /** Arranges the nodes, for a tree drawn as something other than an indented run. */
    computeLayout?: PlacementLayoutFn;
    /** What the nodes do as the pointer nears them. */
    computeEffect?: ProximityEffectFn;
    /**
     * Guesses how tall a node will be before it is drawn, which is what lets a long tree render only what is on
     * screen.
     */
    computeEstimatedNodeHeight?: (index: number) => number;
};

export type BaseSingleTreeCbs<T> = {
    /** Runs when a different node is selected. */
    onSelectionChange?: (value: T) => void;
};

export type BaseTreeProps<T> = BaseTreeValues & BaseTreeCbs<T> & BaseSingleTreeCbs<T>;

export type TreeConnectorNeedsLayout = { computeLayout: PlacementLayoutFn } | { renderConnector?: undefined };

export type BaseMultiTreeCbs<T> = {
    /** Runs when what is ticked changes, with every ticked value. */
    onCheckedChange?: (values: T[]) => void;
};

export type BaseMultiTreeProps<T> = BaseTreeValues & BaseTreeCbs<T> & BaseMultiTreeCbs<T>;

import { FlattenerUtils } from "../../Abstracts/Flattener/Flattener.utils";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import type { NavigatorDirection } from "../../Abstracts/Navigator/Navigator.types";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { PlacementLayout } from "../../Abstracts/Placement/Placement.types";
import type { SelectionBranchDefs } from "../../Abstracts/Selection/Selection.types";
import { TypeaheadUtils } from "../../Abstracts/Typeahead/Typeahead.utils";
import type { TreeConnectorDefs, TreeKeyAction, TreeMultiKeyAction, TreeNodeRecord, TreeRecordRow } from "./Tree.types";

/** What the library prints when a tree is handed a connector painter and no layout. */
const IGNORED_CONNECTOR_WARNING =
    "Tree: renderConnector is ignored without computeLayout. An indented tree has no placements for a connector to run between — pass a layout or drop the painter.";

/** The key the tree pattern gives to opening every branch beside the focused one. */
const EXPAND_SIBLINGS_KEY = "*";

/** The activation key a link answers to on its own, which the tree therefore leaves alone on a linked node. */
const LINK_ACTIVATION_KEY = "Enter";

/** The arrow that goes into a branch, once the direction text runs in has been allowed for. */
const INWARD_KEY = "ArrowRight";

/** The arrow that comes back out of one. */
const OUTWARD_KEY = "ArrowLeft";

/** The key that ticks the focused node in a tree that ticks several. */
const CHECK_KEY = " ";

/** The key that, with Control held, ticks everything. */
const CHECK_ALL_KEY = "a";

/** The arrows that, with Shift held, move and tick as they go. */
const NEXT_KEY = "ArrowDown";
const PREVIOUS_KEY = "ArrowUp";

/** The keys that, with Control and Shift held, tick from the focused node to an end. */
const FIRST_KEY = "Home";
const LAST_KEY = "End";

/** No children, for a node whose children are not there. */
const NO_CHILDREN: never[] = [];

/** What `indexOf` answers for something not in the list. */
const NOT_FOUND = -1;

/**
 * Flattens a tree's nodes into the rows it draws, and decides what the keyboard does to them.
 *
 * Every function takes the node record whatever its tooltip is written in, so one set of rules serves each framework's
 * tree.
 */
export namespace TreeUtils {
    /**
     * Whether a node can be expanded.
     *
     * A node with no children loaded is still a branch when it says there are more to come, which is
     * what lets a lazily-loaded tree show a twisty before its contents have been fetched.
     */
    export const getIsBranch = <T, TTooltipDefs>(node: TreeNodeRecord<T, TTooltipDefs>) =>
        (node.children?.length ?? 0) > 0 || (node.hasMoreChildren ?? false);

    /**
     * Turns the nodes into rows, skipping the contents of collapsed branches.
     *
     * @param nodes The roots, in the order they should appear.
     * @param computeIsExpanded Whether a node is open. Given the node's value rather than the node, so
     * the caller can hold the expansion state however it likes.
     * @returns The rows, nested, each carrying its depth and its position among its siblings for the
     * accessibility attributes.
     */
    export const getVisibleRows = <T, TTooltipDefs>(
        nodes: TreeNodeRecord<T, TTooltipDefs>[],
        computeIsExpanded: (value: T) => boolean,
    ): TreeRecordRow<T, TTooltipDefs>[] =>
        FlattenerUtils.getRows(nodes, {
            computeChildren: (node) => node.children,
            computeIsBranch: getIsBranch,
            computeIsExpanded: (node) => computeIsExpanded(node.value),
        });

    /**
     * Whether the arrow keys may land on a row.
     *
     * A disabled node is skipped unless it asked to stay reachable, in which case focus can rest on it so a reader
     * hears its name, that it is unavailable, and its tooltip — though it still cannot be opened or chosen.
     */
    export const computeIsNavigable = <T, TTooltipDefs>(row: TreeRecordRow<T, TTooltipDefs>) =>
        !row.node.isDisabled ||
        InteractionTrackerUtils.computeIsReachable(
            row.node.isDisabled ?? false,
            row.node.isReachableWhenDisabled ?? false,
        );

    /**
     * Which row holds the tree's single tab stop.
     *
     * The row the keys last moved to keeps it; failing that the selected row does, so tabbing back into the tree
     * lands on the choice already made; failing that, the first row focus can rest on.
     *
     * @param navigable The rows focus can rest on, in order.
     * @param focusedValue The value of the row the keys last moved to, if they have moved since the selection last
     * changed.
     * @param selectedValue The selected value.
     * @returns The row to make tabbable, or `undefined` for a tree with nowhere for focus to go.
     */
    export const computeRovingRow = <T, TTooltipDefs>(
        navigable: TreeRecordRow<T, TTooltipDefs>[],
        focusedValue: T | undefined,
        selectedValue: T | undefined,
    ) =>
        navigable.find((row) => row.node.value === focusedValue) ??
        navigable.find((row) => row.node.value === selectedValue) ??
        navigable[0];

    /**
     * Whether a row is open and waiting for its children to arrive.
     *
     * That is an expanded branch with nothing in it yet, which is what a lazily-loaded node looks like between being
     * opened and being handed its contents.
     */
    export const computeIsPending = <T, TTooltipDefs>(row: TreeRecordRow<T, TTooltipDefs>) =>
        row.isExpanded && row.rows.length < 1;

    /**
     * The id a row's element carries, so focus and typeahead can find it in the document.
     *
     * @param treeId An id unique to the tree.
     * @param row The row.
     * @returns An id unique to the row within the page.
     */
    export const computeRowId = <T, TTooltipDefs>(treeId: string, row: TreeRecordRow<T, TTooltipDefs>) =>
        `${treeId}-node-${row.index}`;

    /**
     * The expanded list with one more branch open.
     *
     * @param expanded The values open now.
     * @param node The branch to open.
     * @returns The new list, or the same list when the node is disabled or already open — so a caller can tell
     * nothing changed.
     */
    export const expand = <T, TTooltipDefs>(expanded: T[], node: TreeNodeRecord<T, TTooltipDefs>) =>
        node.isDisabled || expanded.includes(node.value) ? expanded : [...expanded, node.value];

    /**
     * The expanded list with one branch closed.
     *
     * @param expanded The values open now.
     * @param node The branch to close.
     * @returns The new list, or the same list when the node is disabled.
     */
    export const collapse = <T, TTooltipDefs>(expanded: T[], node: TreeNodeRecord<T, TTooltipDefs>) =>
        node.isDisabled ? expanded : expanded.filter((value) => value !== node.value);

    /**
     * The rows that share a row's parent, the row itself included.
     *
     * @param rows The tree's rows, nested, as {@link getVisibleRows} gives them.
     * @param flatRows The same rows in walking order.
     * @param row The row whose siblings to find.
     * @returns Its parent's children, or the top level for a root.
     */
    export const computeSiblings = <T, TTooltipDefs>(
        rows: TreeRecordRow<T, TTooltipDefs>[],
        flatRows: TreeRecordRow<T, TTooltipDefs>[],
        row: TreeRecordRow<T, TTooltipDefs>,
    ) => (row.parentIndex === undefined ? rows : (flatRows[row.parentIndex]?.rows ?? rows));

    /**
     * The expanded list with every branch among some siblings opened, which is what the asterisk key does.
     *
     * Leaves and disabled branches are left alone, and a branch already open is not listed twice.
     *
     * @param expanded The values open now.
     * @param siblings The rows to open, from {@link computeSiblings}.
     * @returns The new list.
     */
    export const expandSiblings = <T, TTooltipDefs>(expanded: T[], siblings: TreeRecordRow<T, TTooltipDefs>[]) => [
        ...expanded,
        ...siblings
            .filter(
                (sibling) =>
                    getIsBranch(sibling.node) && !sibling.node.isDisabled && !expanded.includes(sibling.node.value),
            )
            .map((sibling) => sibling.node.value),
    ];

    /**
     * Where focus should go when a branch is closed from outside while focus was inside it.
     *
     * A key or a click closing a branch acts on the branch itself, so focus is already on a row that stays. A
     * consumer writing the expanded list from their own code does not, and the focused row simply goes, leaving focus
     * on the page. The branch that closed is where a reader expects to be put back.
     *
     * @param previousExpanded The values that were open before the change.
     * @param expanded The values open now.
     * @param visibleRows The rows now drawn, in walking order.
     * @param lastFocusedValue The value of the row that last held focus.
     * @returns The closed branch to focus, or `undefined` when nothing closed, nothing had focus, or the row that had
     * it is still drawn. The caller should also check that focus really was lost before moving it.
     */
    export const findCollapsedFocusTarget = <T, TTooltipDefs>(
        previousExpanded: T[],
        expanded: T[],
        visibleRows: TreeRecordRow<T, TTooltipDefs>[],
        lastFocusedValue: T | undefined,
    ) => {
        const collapsed = previousExpanded.filter((value) => !expanded.includes(value));

        if (collapsed.length < 1) return;
        if (lastFocusedValue === undefined) return;
        if (visibleRows.some((row) => row.node.value === lastFocusedValue)) return;

        return visibleRows.find((row) => collapsed.includes(row.node.value));
    };

    /**
     * What a key pressed on a row does, following the tree pattern.
     *
     * In order: the asterisk opens every branch beside the row; a printable character searches the rows by their
     * text; Enter and Space activate the row — except that Enter is left to a linked row, which follows its own link,
     * and Space clicks it instead; the inward arrow opens a closed branch and enters an open one; the outward arrow
     * closes an open branch and otherwise climbs to the parent; the vertical arrows, Home and End walk the rows focus
     * can rest on and stop at either end rather than wrapping.
     *
     * @param key The `key` of the keyboard event.
     * @param current The row the key was pressed on.
     * @param opts.flatRows The rows drawn, in walking order.
     * @param opts.navigable The rows focus can rest on, in walking order.
     * @param opts.direction Which way text runs, which decides which arrow goes inward.
     * @param opts.pushQuery Offers the key to the typeahead buffer. Called only once the asterisk has been ruled out,
     * so that key never starts a search. Returns the query when the key was taken.
     * @param opts.computeRowText The text a row is found by.
     * @returns What to do, or `undefined` when the key is not the tree's and should be left alone. Every action but
     * `undefined` claims the key, `claim` doing nothing more.
     */
    export const computeKeyAction = <T, TTooltipDefs>(
        key: string,
        current: TreeRecordRow<T, TTooltipDefs>,
        opts: {
            flatRows: TreeRecordRow<T, TTooltipDefs>[];
            navigable: TreeRecordRow<T, TTooltipDefs>[];
            direction: NavigatorDirection | undefined;
            pushQuery: () => string | undefined;
            computeRowText: (row: TreeRecordRow<T, TTooltipDefs>) => string;
        },
    ): TreeKeyAction<T, TTooltipDefs> | undefined => {
        const navigable = opts.navigable;

        if (key === EXPAND_SIBLINGS_KEY) return { kind: "expand_siblings", row: current };

        const query = opts.pushQuery();

        if (query !== undefined) {
            const position = TypeaheadUtils.computeNextIndex(
                query,
                navigable.indexOf(current),
                navigable.length,
                (index) => opts.computeRowText(navigable[index]),
            );

            return position === undefined ? { kind: "claim" } : { kind: "focus", row: navigable[position] };
        }

        if (NavigatorUtils.getIsActivationKey(key)) {
            if (!current.node.href) return { kind: "activate", row: current };
            if (key === LINK_ACTIVATION_KEY) return;

            return { kind: "click", row: current };
        }

        const logicalKey = NavigatorUtils.computeLogicalKey(key, opts.direction);

        if (logicalKey === INWARD_KEY) {
            if (!getIsBranch(current.node)) return;
            if (!current.isExpanded) return { kind: "expand", row: current };

            const child = FlattenerUtils.getFlatRows(current.rows).find(computeIsNavigable);

            return child ? { kind: "focus", row: child } : { kind: "claim" };
        }

        if (logicalKey === OUTWARD_KEY) {
            if (getIsBranch(current.node) && current.isExpanded) return { kind: "collapse", row: current };

            const parent = current.parentIndex === undefined ? undefined : opts.flatRows[current.parentIndex];

            if (!parent || !computeIsNavigable(parent)) return;

            return { kind: "focus", row: parent };
        }

        const position = NavigatorUtils.computeNextPosition(key, navigable.indexOf(current), navigable.length, {
            isLooping: false,
        });

        if (position === undefined) return;

        return { kind: "focus", row: navigable[position] };
    };

    /**
     * Warns, in the console, that a tree's connector painter is being ignored.
     *
     * Call it once per tree, when it is set up. It says nothing unless a connector painter was given without a layout,
     * since only a laid-out tree knows where its nodes sit.
     *
     * @param hasLayout Whether the tree was given `computeLayout`.
     * @param hasConnector Whether it was given `renderConnector`.
     */
    export const warnIfConnectorIgnored = (hasLayout: boolean, hasConnector: boolean) => {
        if (!hasLayout && hasConnector) console.warn(IGNORED_CONNECTOR_WARNING);
    };

    /**
     * What the connector reaching one node from its parent is told about the line it has to draw.
     *
     * It is handed the placements of both ends, plus the layout's center and radii, so a radial tree can bend its
     * connectors round the middle rather than cut straight across.
     *
     * @param flatRows Every row the tree draws, in order, which is what `parentIndex` counts into.
     * @param row The node the connector reaches.
     * @param layout The layout the nodes were placed by.
     * @returns The connector's defs, or `undefined` for a root, which has no parent to reach.
     */
    export const computeConnectorDefs = <T, TTooltipDefs>(
        flatRows: TreeRecordRow<T, TTooltipDefs>[],
        row: TreeRecordRow<T, TTooltipDefs>,
        layout: PlacementLayout | undefined,
    ): TreeConnectorDefs<T> | undefined => {
        const parent = row.parentIndex === undefined ? undefined : flatRows[row.parentIndex];

        if (!parent) return undefined;

        return {
            value: row.node.value,
            parentValue: parent.node.value,
            from: layout?.placements[parent.index],
            to: layout?.placements[row.index],
            origin: layout?.origin,
            radii: layout?.radii,
        };
    };

    /**
     * What a tree that ticks several needs to tick a folder and everything in it, and to tell whether a folder is
     * fully, partly or not ticked.
     *
     * A disabled node is left out of every folder, so ticking a folder never changes it and it never counts toward the
     * folder's state; it can still hold a tick of its own from before.
     *
     * @param nodes The tree's roots, with everything under them.
     * @returns Defs for `SelectionUtils.getBranchState` and `SelectionUtils.getBranchSelection`, keyed by value.
     */
    export const createBranchDefs = <T, TTooltipDefs>(
        nodes: TreeNodeRecord<T, TTooltipDefs>[],
    ): SelectionBranchDefs<T> => {
        const children = new Map<T, T[]>();

        const walk = (list: TreeNodeRecord<T, TTooltipDefs>[]) =>
            list.forEach((node) => {
                const own = node.children ?? NO_CHILDREN;

                children.set(
                    node.value,
                    own.filter((child) => !child.isDisabled).map((child) => child.value),
                );
                walk(own);
            });

        walk(nodes);

        return { computeChildren: (value) => children.get(value) };
    };

    /**
     * Every value in the tree that can be ticked, opened or not, in walking order.
     *
     * @param nodes The tree's roots, with everything under them.
     * @returns The value of every node that is not disabled.
     */
    export const getCheckableValues = <T, TTooltipDefs>(nodes: TreeNodeRecord<T, TTooltipDefs>[]): T[] =>
        nodes.flatMap((node) => [
            ...(node.isDisabled ? NO_CHILDREN : [node.value]),
            ...getCheckableValues(node.children ?? NO_CHILDREN),
        ]);

    /**
     * What a key does in a tree that ticks several, for the keys that tick.
     *
     * The published tree pattern's recommended model: Space ticks or unticks the focused node; Shift with Space ticks
     * every node from the last one ticked to this one; Shift with an arrow moves and ticks the node it lands on;
     * Control with Shift and Home or End ticks from this node to the first or last; Control with A ticks everything.
     * Every other key — the walk, opening and closing, typing to find — is {@link TreeUtils.computeKeyAction}'s.
     *
     * @param key The `key` of the keyboard event.
     * @param modifiers Which of Shift and Control (or Command) were held.
     * @param current The row the key was pressed on.
     * @param opts.navigable The rows focus can rest on, in walking order.
     * @param opts.anchor The row last ticked by a single press, which a range starts from. Missing, the range starts
     * at the current row.
     * @returns What to do, or `undefined` when the key is not one of these and should go on to the ordinary handling.
     */
    export const computeMultiKeyAction = <T, TTooltipDefs>(
        key: string,
        modifiers: { isShiftHeld: boolean; isControlHeld: boolean },
        current: TreeRecordRow<T, TTooltipDefs>,
        opts: {
            navigable: TreeRecordRow<T, TTooltipDefs>[];
            anchor: TreeRecordRow<T, TTooltipDefs> | undefined;
        },
    ): TreeMultiKeyAction<T, TTooltipDefs> | undefined => {
        const { navigable } = opts;
        const position = navigable.indexOf(current);
        const between = (from: number, to: number) => navigable.slice(Math.min(from, to), Math.max(from, to) + 1);

        if (key === CHECK_KEY) {
            if (!modifiers.isShiftHeld) return { kind: "check", row: current };

            const anchorPosition = opts.anchor === undefined ? NOT_FOUND : navigable.indexOf(opts.anchor);

            return { kind: "check_range", rows: between(anchorPosition < 0 ? position : anchorPosition, position) };
        }

        if (modifiers.isControlHeld && key.toLowerCase() === CHECK_ALL_KEY) return { kind: "check_all" };

        if (modifiers.isControlHeld && modifiers.isShiftHeld && (key === FIRST_KEY || key === LAST_KEY)) {
            const end = key === FIRST_KEY ? 0 : navigable.length - 1;

            return { kind: "check_range", rows: between(position, end), focus: navigable[end] };
        }

        if (modifiers.isShiftHeld && (key === NEXT_KEY || key === PREVIOUS_KEY)) {
            const next = navigable[position + (key === NEXT_KEY ? 1 : -1)];

            return next === undefined ? undefined : { kind: "focus_check", row: next };
        }

        return undefined;
    };
}

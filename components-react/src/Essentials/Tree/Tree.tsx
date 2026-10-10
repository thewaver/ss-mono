import {
    type FocusEvent,
    Fragment,
    type KeyboardEvent,
    type MouseEvent,
    type ReactNode,
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    FlattenerUtils,
    FloaterStyles,
    TREE_DEFAULTS,
    TreeStyles,
    TreeUtils,
    TypeaheadUtils,
} from "@thewaver/ss-components";

import { FloaterReactUtils } from "../../Abstracts/Floater/FloaterReact.utils";
import { NavigatorReactUtils } from "../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { TypeaheadReactUtils } from "../../Abstracts/Typeahead/TypeaheadReact.utils";
import { VirtualizerReactUtils } from "../../Abstracts/Virtualizer/VirtualizerReact.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { useElement } from "../../Utils/refUtils";
import type { TreeNodeItemProps, TreeProps, TreeRow } from "./Tree.types";

const EMPTY_PINNED_ROWS: number[] = [];

const TREE_ITEM_SELECTOR = '[role="treeitem"]';

type FloaterTargets = {
    selection: HTMLElement | undefined;
    highlight: HTMLElement | undefined;
};

const TreeNodeItem = (props: TreeNodeItemProps) => {
    const isDisabled = props.flags.isDisabled ?? false;

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onActivate();
    };

    const commonProps = {
        "className": TreeStyles.treeNode,
        "role": "treeitem",
        "id": props.id,
        "aria-disabled": isDisabled || undefined,
        "aria-selected": props.flags.isSelected,
        "aria-expanded": props.flags.isBranch ? props.flags.isExpanded : undefined,
        "aria-busy": props.flags.isPending || undefined,
        "aria-level": props.level,
        "aria-posinset": props.position,
        "aria-setsize": props.setSize,
    };

    if (props.href === undefined) {
        return (
            <div ref={props.ref} {...commonProps} onClick={handleClick}>
                {props.renderContent(props.flags)}
            </div>
        );
    }

    const Link = props.linkComponent ?? "a";

    return (
        <Link ref={props.ref} href={props.href} {...commonProps} onClick={handleClick}>
            {props.renderContent(props.flags)}
        </Link>
    );
};

export const Tree = <T,>(props: TreeProps<T>) => {
    const [value, setValue] = SignalMirrorReactUtils.useOptionalState<T | undefined>(props.value, undefined);
    const [expanded, setExpanded] = SignalMirrorReactUtils.useOptionalState<T[]>(props.expanded, []);

    const treeId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const sizerRef = useRef<HTMLDivElement | null>(null);
    const lastFocusedValueRef = useRef<T | undefined>(undefined);
    const lastExpandedRef = useRef<T[]>([]);
    const pendingFocusIdRef = useRef<string | undefined>(undefined);

    const direction = NavigatorReactUtils.useDirection(rootRef);
    const typeahead = TypeaheadReactUtils.useBuffer();

    const [focusedValue, setFocusedValue] = useState<T | undefined>();
    const [previousValue, setPreviousValue] = useState(value);

    if (previousValue !== value) {
        setPreviousValue(value);
        setFocusedValue(undefined);
    }

    const nodes = props.nodes;

    const rows = useMemo(() => TreeUtils.getVisibleRows(nodes, (entry) => expanded.includes(entry)), [nodes, expanded]);
    const flatRows = useMemo(() => FlattenerUtils.getFlatRows(rows), [rows]);
    const navigableRows = useMemo(() => flatRows.filter(TreeUtils.computeIsNavigable), [flatRows]);

    const isVirtualized = props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined;
    const rovingRow = TreeUtils.computeRovingRow(navigableRows, focusedValue, value);

    const rowWindow = VirtualizerReactUtils.useRowWindow(sizerRef, flatRows.length, {
        isDisabled: !isVirtualized,
        computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
        pinnedRows: rovingRow === undefined ? EMPTY_PINNED_ROWS : [rovingRow.index],
    });

    const computeLayout = props.computeLayout;
    const layout = useMemo(
        () => computeLayout?.({ itemCount: flatRows.length, itemParents: flatRows.map((row) => row.parentIndex) }),
        [computeLayout, flatRows],
    );

    const getRowId = (row: TreeRow<T>) => TreeUtils.computeRowId(treeId, row);

    const findRowById = (id: string | undefined) => navigableRows.find((row) => getRowId(row) === id);

    const computeRowText = (row: TreeRow<T>) => {
        const custom = props.computeCustomText?.(row.node);

        if (custom !== undefined) return custom;

        const painted = TypeaheadUtils.getElementText(document.getElementById(getRowId(row)));

        return painted.length > 0 ? painted : String(row.node.value);
    };

    const focusRow = (row: TreeRow<T>) => {
        const id = getRowId(row);

        setFocusedValue(row.node.value);

        if (rowWindow.isLive) rowWindow.scrollToRow(row.index);

        const element = document.getElementById(id);

        if (element) {
            element.focus();

            return;
        }

        pendingFocusIdRef.current = id;
    };

    useLayoutEffect(() => {
        const id = pendingFocusIdRef.current;
        const element = id === undefined ? undefined : document.getElementById(id);

        if (!element) return;

        pendingFocusIdRef.current = undefined;
        element.focus();
    });

    useEffect(() => {
        const branch = TreeUtils.findCollapsedFocusTarget(
            lastExpandedRef.current,
            expanded,
            flatRows,
            lastFocusedValueRef.current,
        );

        lastExpandedRef.current = expanded;

        if (branch && document.activeElement === document.body) focusRow(branch);
    }, [expanded, flatRows]);

    const writeExpanded = (next: T[]) => {
        if (next !== expanded) setExpanded(next);
    };

    const expand = (row: TreeRow<T>) => writeExpanded(TreeUtils.expand(expanded, row.node));

    const collapse = (row: TreeRow<T>) => writeExpanded(TreeUtils.collapse(expanded, row.node));

    const toggle = (row: TreeRow<T>) => {
        if (row.isExpanded) {
            collapse(row);

            return;
        }

        expand(row);
    };

    const expandSiblings = (row: TreeRow<T>) =>
        setExpanded(TreeUtils.expandSiblings(expanded, TreeUtils.computeSiblings(rows, flatRows, row)));

    const select = (next: T) => {
        if (next === value) return;

        setValue(next);

        props.onSelectionChange?.(next);
    };

    const activate = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        select(row.node.value);

        if (TreeUtils.getIsBranch(row.node)) toggle(row);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (navigableRows.length < 1) return;

        const current = findRowById(document.activeElement?.id) ?? rovingRow;

        if (!current) return;

        const action = TreeUtils.computeKeyAction(e.key, current, {
            flatRows,
            navigable: navigableRows,
            direction,
            pushQuery: () => typeahead.push(e.nativeEvent),
            computeRowText,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "expandSiblings") expandSiblings(action.row);
        if (action.kind === "focus") focusRow(action.row);
        if (action.kind === "expand") expand(action.row);
        if (action.kind === "collapse") collapse(action.row);
        if (action.kind === "activate") activate(action.row);
        if (action.kind === "click") document.getElementById(getRowId(action.row))?.click();
    };

    const [hoveredValue, setHoveredValue] = useState<T>();
    const [focusInValue, setFocusInValue] = useState<T>();
    const [floaterTargets, setFloaterTargets] = useState<FloaterTargets>({
        selection: undefined,
        highlight: undefined,
    });

    const floaterTransitionDurationMs = props.floaterTransitionDurationMs ?? TREE_DEFAULTS.floaterTransitionDurationMs;

    const root = useElement(rootRef);
    const sizer = useElement(sizerRef);
    const container = isVirtualized ? sizer : root;

    const findRow = (rowValue: T | undefined) =>
        rowValue === undefined ? undefined : flatRows.find((row) => row.node.value === rowValue);

    const findNodeElement = (row: TreeRow<T> | undefined) => {
        if (row === undefined || !container) return undefined;

        const element = document.getElementById(getRowId(row)) ?? undefined;

        return element && container.contains(element) ? element : undefined;
    };

    const selectedRow = findRow(value);
    const highlightRow = findRow(hoveredValue ?? focusInValue);

    useLayoutEffect(() => {
        const selection = findNodeElement(selectedRow);
        const highlight = findNodeElement(highlightRow);

        setFloaterTargets((previous) =>
            previous.selection === selection && previous.highlight === highlight ? previous : { selection, highlight },
        );
    });

    const useNodeFloater = (isEnabled: boolean, target: HTMLElement | undefined, row: TreeRow<T> | undefined) =>
        FloaterReactUtils.useFloater({
            isEnabled,
            container,
            target,
            layout,
            placement: row === undefined ? undefined : layout?.placements[row.index],
            transitionDurationMs: floaterTransitionDurationMs,
        });

    const selectionFloater = useNodeFloater(
        props.renderSelectionFloater !== undefined,
        floaterTargets.selection,
        selectedRow,
    );

    const highlightFloater = useNodeFloater(
        props.renderHighlightFloater !== undefined,
        floaterTargets.highlight,
        highlightRow,
    );

    const renderFloater = (
        floater: ReturnType<typeof useNodeFloater>,
        renderContent: TreeProps<T>["renderSelectionFloater"],
    ) =>
        floater.isRendered && (
            <div
                ref={floater.ref}
                className={FloaterStyles.floater}
                style={{ ...floater.bounds, transitionDuration: `${floaterTransitionDurationMs}ms` }}
            >
                {renderContent?.(floater.visibilityTarget, floaterTransitionDurationMs)}
            </div>
        );

    const renderFloaters = () => (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
        </>
    );

    const findRowByTarget = (target: EventTarget | null) =>
        target instanceof Element ? findRowById(target.closest(TREE_ITEM_SELECTOR)?.id) : undefined;

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        lastFocusedValueRef.current = findRowById((e.target as HTMLElement).id)?.node.value;

        setFocusInValue(() => findRowByTarget(e.target)?.node.value);
    };

    const hasPendingPaint = (row: TreeRow<T>) =>
        TreeUtils.computeIsPending(row) && props.renderPendingChildren !== undefined;

    const renderRow = (row: TreeRow<T>) => {
        const placement = layout?.placements[row.index];

        const element = (
            <InteractionWrapper
                sizing={"fill"}
                isDisabled={row.node.isDisabled ?? false}
                isReachableWhenDisabled={row.node.isReachableWhenDisabled ?? false}
                isTabbable={row.node.value === rovingRow?.node.value}
                tooltipDefs={row.node.tooltipDefs}
                extraFlags={{
                    value: row.node.value,
                    isBranch: TreeUtils.getIsBranch(row.node),
                    isExpanded: row.isExpanded,
                    isPending: TreeUtils.computeIsPending(row),
                    isSelected: row.node.value === value,
                    depth: row.depth,
                }}
                renderControl={(setElementRef, renderProps) => (
                    <TreeNodeItem
                        ref={setElementRef}
                        id={getRowId(row)}
                        href={row.node.href}
                        level={row.depth + 1}
                        position={row.position + 1}
                        setSize={row.setSize}
                        flags={renderProps}
                        linkComponent={props.linkComponent}
                        renderContent={() => props.renderNode(row.node, renderProps)}
                        onActivate={() => activate(row)}
                    />
                )}
            />
        );

        return placement ? <PlacementItem placement={placement}>{element}</PlacementItem> : element;
    };

    const renderRows = (levelRows: TreeRow<T>[]): ReactNode =>
        levelRows.map((row, index) => (
            <Fragment key={index}>
                {renderRow(row)}

                {(row.rows.length > 0 || hasPendingPaint(row)) && (
                    <div role="group">
                        {TreeUtils.computeIsPending(row)
                            ? props.renderPendingChildren?.(row.node, row.depth + 1)
                            : renderRows(row.rows)}
                    </div>
                )}
            </Fragment>
        ));

    const renderWindowedRows = () => (
        <div ref={sizerRef} className={TreeStyles.treeSizer} style={{ height: `${rowWindow.totalSize}px` }}>
            {renderFloaters()}

            {rowWindow.rows.map((windowRow) => {
                const row = flatRows[windowRow.index];

                if (!row) return null;

                return (
                    <div
                        key={windowRow.index}
                        className={TreeStyles.treeSizerRow}
                        style={{ transform: `translateY(${rowWindow.getRowStart(windowRow)}px)` }}
                        ref={rowWindow.measureRow(windowRow.index)}
                    >
                        {renderRow(row)}

                        {hasPendingPaint(row) && props.renderPendingChildren?.(row.node, row.depth + 1)}
                    </div>
                );
            })}
        </div>
    );

    const tiers = isVirtualized ? (
        renderWindowedRows()
    ) : (
        <>
            {renderFloaters()}
            {renderRows(rows)}
        </>
    );

    return (
        <div
            ref={rootRef}
            className={TreeStyles.treeRoot}
            role="tree"
            aria-label={props.ariaLabel}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={() => setFocusInValue(undefined)}
            onPointerOver={(e) => setHoveredValue(() => findRowByTarget(e.target)?.node.value)}
            onPointerLeave={() => setHoveredValue(undefined)}
        >
            {layout ? (
                <PlacementBox layout={layout} computeEffect={props.computeEffect}>
                    {tiers}
                </PlacementBox>
            ) : (
                tiers
            )}
        </div>
    );
};

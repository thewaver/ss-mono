import type { Accessor, JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    FlattenerUtils,
    TREE_DEFAULTS,
    TreeUtils,
    TypeaheadUtils,
    FloaterStyles as floaterStyles,
    TreeStyles as styles,
} from "@thewaver/ss-components";

import { FloaterSolidUtils } from "../../Abstracts/Floater/FloaterSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { TypeaheadSolidUtils } from "../../Abstracts/Typeahead/TypeaheadSolid.utils";
import { VirtualizerSolidUtils } from "../../Abstracts/Virtualizer/VirtualizerSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import type { TreeNodeItemProps, TreeProps, TreeRow } from "./TreeSolid.types";

const EMPTY_PINNED_ROWS: number[] = [];

const TreeNodeItem = (props: TreeNodeItemProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const handleClick = (e: MouseEvent) => {
        if (getIsDisabled()) {
            e.preventDefault();
            return;
        }

        props.onActivate();
    };

    const commonProps: Omit<JSX.HTMLAttributes<HTMLElement>, "ref"> = {
        "class": styles.treeNode,
        "role": "treeitem",
        get "id"() {
            return access(props.id);
        },
        get "aria-disabled"() {
            return getIsDisabled() || undefined;
        },
        get "aria-selected"() {
            return access(props.flags).isSelected;
        },
        get "aria-expanded"() {
            return access(props.flags).isBranch ? access(props.flags).isExpanded : undefined;
        },
        get "aria-busy"() {
            return access(props.flags).isPending || undefined;
        },
        get "aria-level"() {
            return access(props.level);
        },
        get "aria-posinset"() {
            return access(props.position);
        },
        get "aria-setsize"() {
            return access(props.setSize);
        },
    };

    return (
        <Show
            when={access(props.href)}
            fallback={
                <div ref={(element) => props.ref?.(element)} {...commonProps} onClick={handleClick}>
                    {props.renderContent(() => access(props.flags))}
                </div>
            }
        >
            <Dynamic
                component={props.linkComponent ?? "a"}
                ref={(element: HTMLElement) => props.ref?.(element)}
                href={access(props.href)!}
                {...commonProps}
                onClick={handleClick}
            >
                {props.renderContent(() => access(props.flags))}
            </Dynamic>
        </Show>
    );
};

export const Tree = <T,>(props: TreeProps<T>) => {
    const valueSignal = SignalMirrorSolidUtils.createOptional<T | undefined>(() => props.value, undefined);
    const expandedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.expanded, []);

    const treeId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const [getFocusedValue, setFocusedValue] = createSignal<T | undefined>();

    const typeahead = TypeaheadSolidUtils.createBuffer();

    const getRows = createMemo(() =>
        TreeUtils.getVisibleRows(access(props.nodes), (value) => expandedSignal[0]().includes(value)),
    );

    const getFlatRows = createMemo(() => FlattenerUtils.getFlatRows(getRows()));

    const getNavigableRows = createMemo(() => getFlatRows().filter(TreeUtils.computeIsNavigable));

    const getIsVirtualized = createMemo(
        () => props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined,
    );

    const getHasPendingPaint = (row: TreeRow<T>) =>
        TreeUtils.computeIsPending(row) && props.renderPendingChildren !== undefined;

    const getRovingRow = createMemo(() =>
        TreeUtils.computeRovingRow(getNavigableRows(), getFocusedValue(), valueSignal[0]()),
    );

    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = VirtualizerSolidUtils.createRowWindow(getSizerRef, () => getFlatRows().length, {
        getIsDisabled: () => !getIsVirtualized(),
        computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
        getPinnedRows: () => {
            const roving = getRovingRow();

            return roving === undefined ? EMPTY_PINNED_ROWS : [roving.index];
        },
    });

    createEffect(() => {
        valueSignal[0]();

        setFocusedValue(() => undefined);
    });

    const getRowId = (row: TreeRow<T>) => TreeUtils.computeRowId(treeId, row);

    const findRowById = (id: string | undefined) => getNavigableRows().find((row) => getRowId(row) === id);

    const computeRowText = (row: TreeRow<T>) => {
        const custom = props.computeCustomText?.(row.node);

        if (custom !== undefined) return custom;

        const painted = TypeaheadUtils.getElementText(document.getElementById(getRowId(row)));

        return painted.length > 0 ? painted : String(row.node.value);
    };

    let lastFocusedValue: T | undefined;
    let lastExpanded: T[] = [];

    createEffect(() => {
        const expanded = expandedSignal[0]();
        const branch = TreeUtils.findCollapsedFocusTarget(lastExpanded, expanded, getFlatRows(), lastFocusedValue);

        lastExpanded = expanded;

        if (branch && document.activeElement === document.body) focusRow(branch);
    });

    const focusRow = (row: TreeRow<T>) => {
        setFocusedValue(() => row.node.value);

        if (rowWindow.getIsLive()) rowWindow.scrollToRow(row.index);

        document.getElementById(getRowId(row))?.focus();
    };

    const expand = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        expandedSignal[1]((prev) => TreeUtils.expand(prev, row.node));
    };

    const collapse = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        expandedSignal[1]((prev) => TreeUtils.collapse(prev, row.node));
    };

    const toggle = (row: TreeRow<T>) => {
        if (row.isExpanded) {
            collapse(row);

            return;
        }

        expand(row);
    };

    const expandSiblings = (row: TreeRow<T>) => {
        const siblings = TreeUtils.computeSiblings(getRows(), getFlatRows(), row);

        expandedSignal[1]((prev) => TreeUtils.expandSiblings(prev, siblings));
    };

    const select = (value: T) => {
        if (value === valueSignal[0]()) return;

        valueSignal[1](() => value);

        void props.onSelectionChange?.(value);
    };

    const activate = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        select(row.node.value);

        if (TreeUtils.getIsBranch(row.node)) toggle(row);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const navigable = getNavigableRows();

        if (navigable.length < 1) return;

        const current = findRowById(document.activeElement?.id) ?? getRovingRow();

        if (!current) return;

        const action = TreeUtils.computeKeyAction(e.key, current, {
            flatRows: getFlatRows(),
            navigable,
            direction: getDirection(),
            pushQuery: () => typeahead.push(e),
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

    const getLayout = createMemo(() =>
        props.computeLayout?.({
            itemCount: getFlatRows().length,
            itemParents: getFlatRows().map((row) => row.parentIndex),
        }),
    );

    const getPlacementAt = (index: number) => getLayout()?.placements[index];

    const [getNodeRefs, setNodeRefs] = createSignal<Map<T, HTMLElement>>(new Map(), { equals: false });
    const [getHoveredValue, setHoveredValue] = createSignal<T>();
    const [getFocusInValue, setFocusInValue] = createSignal<T>();

    const recordNodeRef = (value: T, element: HTMLElement) => {
        setNodeRefs((refs) => refs.set(value, element));

        onCleanup(() =>
            setNodeRefs((refs) => {
                if (refs.get(value) === element) refs.delete(value);

                return refs;
            }),
        );
    };

    const getFloaterTransitionDurationMs = createMemo(
        () => access(props.floaterTransitionDurationMs) ?? TREE_DEFAULTS.floaterTransitionDurationMs,
    );

    const createFloater = (getIsEnabled: () => boolean, getValue: () => T | undefined) => {
        const getRow = () => {
            const value = getValue();

            return value === undefined ? undefined : getFlatRows().find((row) => row.node.value === value);
        };

        return FloaterSolidUtils.create({
            getIsEnabled,
            getContainer: () => (getIsVirtualized() ? getSizerRef() : getRootRef()),
            getTarget: () => {
                const row = getRow();

                return row === undefined ? undefined : getNodeRefs().get(row.node.value);
            },
            getLayout,
            getPlacement: () => {
                const row = getRow();

                return row === undefined ? undefined : getPlacementAt(row.index);
            },
            getTransitionDurationMs: getFloaterTransitionDurationMs,
        });
    };

    const selectionFloater = createFloater(
        () => props.renderSelectionFloater !== undefined,
        () => valueSignal[0](),
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => getHoveredValue() ?? getFocusInValue(),
    );

    const renderFloater = (
        floater: ReturnType<typeof createFloater>,
        renderContent: TreeProps<T>["renderSelectionFloater"],
    ) => (
        <Show when={floater.getIsRendered()}>
            <div
                ref={floater.setRef}
                class={floaterStyles.floater}
                style={{ ...floater.getBounds(), "transition-duration": `${getFloaterTransitionDurationMs()}ms` }}
            >
                {renderContent?.(floater.getVisibilityTarget, getFloaterTransitionDurationMs)}
            </div>
        </Show>
    );

    const renderFloaters = () => (
        <>
            {renderFloater(highlightFloater, props.renderHighlightFloater)}
            {renderFloater(selectionFloater, props.renderSelectionFloater)}
        </>
    );

    const findRowByTarget = (target: EventTarget | null) =>
        target instanceof Element ? findRowById(target.closest('[role="treeitem"]')?.id) : undefined;

    const renderPlaced = (getRow: Accessor<TreeRow<T>>, element: JSX.Element) => (
        <Show when={getPlacementAt(getRow().index)} fallback={element}>
            {(getRect) => <PlacementItem placement={getRect}>{element}</PlacementItem>}
        </Show>
    );

    const renderRow = (getRow: Accessor<TreeRow<T>>): JSX.Element =>
        renderPlaced(
            getRow,
            <InteractionWrapper
                sizing={"fill"}
                isDisabled={() => getRow().node.isDisabled ?? false}
                isReachableWhenDisabled={() => getRow().node.isReachableWhenDisabled ?? false}
                isTabbable={() => getRow().node.value === getRovingRow()?.node.value}
                tooltipDefs={() => getRow().node.tooltipDefs}
                extraFlags={() => ({
                    isBranch: TreeUtils.getIsBranch(getRow().node),
                    isExpanded: getRow().isExpanded,
                    isPending: TreeUtils.computeIsPending(getRow()),
                    isSelected: getRow().node.value === valueSignal[0](),
                    depth: getRow().depth,
                })}
                renderControl={(setElementRef, getRenderProps) => (
                    <TreeNodeItem
                        ref={(element) => {
                            setElementRef(element);
                            recordNodeRef(getRow().node.value, element);
                        }}
                        id={() => getRowId(getRow())}
                        href={() => getRow().node.href}
                        level={() => getRow().depth + 1}
                        position={() => getRow().position + 1}
                        setSize={() => getRow().setSize}
                        flags={getRenderProps}
                        linkComponent={props.linkComponent}
                        renderContent={(getNodeFlags) => props.renderNode(() => getRow().node, getNodeFlags)}
                        onActivate={() => activate(getRow())}
                    />
                )}
            />,
        );

    const renderRows = (getLevelRows: Accessor<TreeRow<T>[]>): JSX.Element => (
        <Index each={getLevelRows()}>
            {(getRow) => (
                <>
                    {renderRow(getRow)}

                    <Show when={getRow().rows.length > 0 || getHasPendingPaint(getRow())}>
                        <div role="group">
                            <Show
                                when={TreeUtils.computeIsPending(getRow())}
                                fallback={renderRows(() => getRow().rows)}
                            >
                                {props.renderPendingChildren?.(
                                    () => getRow().node,
                                    () => getRow().depth + 1,
                                )}
                            </Show>
                        </div>
                    </Show>
                </>
            )}
        </Index>
    );

    const renderTiers = () => (
        <Show
            when={getIsVirtualized()}
            fallback={
                <>
                    {renderFloaters()}
                    {renderRows(getRows)}
                </>
            }
        >
            {renderWindowedRows()}
        </Show>
    );

    const renderWindowedRows = () => (
        <div ref={setSizerRef} class={styles.treeSizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
            {renderFloaters()}

            <For each={rowWindow.getRows()}>
                {(row) => (
                    <div
                        class={styles.treeSizerRow}
                        style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                        ref={(element) => rowWindow.measureRow(element, row.index)}
                    >
                        {renderRow(() => getFlatRows()[row.index])}

                        <Show when={getHasPendingPaint(getFlatRows()[row.index])}>
                            {props.renderPendingChildren?.(
                                () => getFlatRows()[row.index].node,
                                () => getFlatRows()[row.index].depth + 1,
                            )}
                        </Show>
                    </div>
                )}
            </For>
        </div>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.treeRoot}
            role="tree"
            aria-label={access(props.ariaLabel)}
            onKeyDown={handleKeyDown}
            onFocusIn={(e) => {
                lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;

                setFocusInValue(() => findRowByTarget(e.target)?.node.value);
            }}
            onFocusOut={() => setFocusInValue(undefined)}
            onPointerOver={(e) => setHoveredValue(() => findRowByTarget(e.target)?.node.value)}
            onPointerLeave={() => setHoveredValue(undefined)}
        >
            <Show when={getLayout()} fallback={renderTiers()}>
                {(getResolved) => (
                    <PlacementBox layout={getResolved} computeEffect={props.computeEffect}>
                        {renderTiers()}
                    </PlacementBox>
                )}
            </Show>
        </div>
    );
};

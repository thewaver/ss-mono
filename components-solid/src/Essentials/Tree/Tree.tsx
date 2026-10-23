import type { Accessor, JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Dynamic } from "solid-js/web";

import {
    FlattenerUtils,
    InteractionTrackerUtils,
    SelectionUtils,
    TREE_DEFAULTS,
    TreeUtils,
    TypeaheadUtils,
    FloaterStyles as floaterStyles,
    TreeStyles as styles,
} from "@thewaver/ss-components";
import { TreeConst } from "@thewaver/ss-components/internal";

import { FloaterSolidUtils } from "../../Abstracts/Floater/FloaterSolid.utils";
import { NavigatorSolidUtils } from "../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { TypeaheadSolidUtils } from "../../Abstracts/Typeahead/TypeaheadSolid.utils";
import { VirtualizerSolidUtils } from "../../Abstracts/Virtualizer/VirtualizerSolid.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { access } from "../../Utils/propUtils";
import { TooltipSolidUtils } from "../Overlays/Tooltip/TooltipSolid.utils";
import type { MultiTreeProps, TreeCompositeProps, TreeNodeItemProps, TreeProps, TreeRow } from "./TreeSolid.types";

const TreeNodeItem = (props: TreeNodeItemProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    const handleClick = (e: MouseEvent) => {
        if (getIsDisabled()) {
            e.preventDefault();
            return;
        }

        props.onActivate(e);
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
            return access(props.isMultiple) ? undefined : access(props.flags).isSelected;
        },
        get "aria-checked"() {
            return access(props.isMultiple) ? access(props.flags).checkedState : undefined;
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

const TreeComposite = <T,>(props: TreeCompositeProps<T>) => {
    TreeUtils.warnIfConnectorIgnored(props.computeLayout !== undefined, props.renderConnector !== undefined);

    const valueSignal = SignalMirrorSolidUtils.createOptional<T | undefined>(() => props.value, undefined);
    const checkedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.checked, []);
    const expandedSignal = SignalMirrorSolidUtils.createOptional<T[]>(() => props.expanded, []);

    const treeId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const [getFocusedValue, setFocusedValue] = createSignal<T | undefined>();

    const typeahead = TypeaheadSolidUtils.createBuffer();

    const getExpandedSet = createMemo(() => new Set(expandedSignal[0]()));

    const getRows = createMemo(() =>
        TreeUtils.getVisibleRows(access(props.nodes), (value) => getExpandedSet().has(value)),
    );

    const getFlatRows = createMemo(() => FlattenerUtils.getFlatRows(getRows()));

    const getNavigableRows = createMemo(() => getFlatRows().filter(TreeUtils.computeIsNavigable));

    const getIsVirtualized = createMemo(
        () => props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined,
    );

    const getHasPendingPaint = (row: TreeRow<T>) =>
        TreeUtils.computeIsPending(row) && props.renderPendingChildren !== undefined;

    const getBranchDefs = createMemo(() => TreeUtils.createBranchDefs(access(props.nodes)));

    const getCheckedState = (value: T) =>
        props.isMultiple
            ? SelectionUtils.getBranchState(value, checkedSignal[0](), getBranchDefs())
            : value === valueSignal[0]();

    const getFirstCheckedValue = () =>
        getNavigableRows().find((row) => getCheckedState(row.node.value) === true)?.node.value;

    const getRovingRow = createMemo(() =>
        TreeUtils.computeRovingRow(
            getNavigableRows(),
            getFocusedValue(),
            props.isMultiple ? getFirstCheckedValue() : valueSignal[0](),
        ),
    );

    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = VirtualizerSolidUtils.createRowWindow(getSizerRef, () => getFlatRows().length, {
        getIsDisabled: () => !getIsVirtualized(),
        computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
        getPinnedRows: () => {
            const roving = getRovingRow();

            return roving === undefined ? TreeConst.EMPTY_PINNED_ROWS : [roving.index];
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

    let checkAnchor: T | undefined;

    const writeChecked = (next: T[]) => {
        checkedSignal[1](() => next);

        props.onCheckedChange?.(next);
    };

    const check = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        checkAnchor = row.node.value;

        writeChecked(SelectionUtils.getBranchSelection(row.node.value, checkedSignal[0](), getBranchDefs()));
    };

    const checkRows = (rows: TreeRow<T>[]) =>
        writeChecked(
            SelectionUtils.getMerged(
                checkedSignal[0](),
                rows
                    .filter((row) => !row.node.isDisabled)
                    .flatMap((row) => SelectionUtils.getBranchItems(row.node.value, getBranchDefs())),
            ),
        );

    const checkAll = () => {
        const all = TreeUtils.getCheckableValues(access(props.nodes));
        const isAllChecked = all.every((value) => checkedSignal[0]().includes(value));

        writeChecked(isAllChecked ? [] : all);
    };

    const activate = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        const isBranch = TreeUtils.getIsBranch(row.node);

        if (props.isMultiple) {
            if (isBranch) toggle(row);
            else check(row);

            return;
        }

        select(row.node.value);

        if (isBranch) toggle(row);
    };

    const press = (row: TreeRow<T>, expander: HTMLElement | undefined, e: MouseEvent) => {
        if (row.node.isDisabled) return;

        const isBranch = TreeUtils.getIsBranch(row.node);

        if (expander !== undefined && e.target instanceof Node && expander.contains(e.target)) {
            if (isBranch) toggle(row);

            return;
        }

        if (props.isMultiple) check(row);
        else select(row.node.value);

        if (expander === undefined && isBranch) toggle(row);
    };

    const handleMultiKeyDown = (e: KeyboardEvent, current: TreeRow<T>, navigable: TreeRow<T>[]) => {
        const action = TreeUtils.computeMultiKeyAction(
            e.key,
            { isShiftHeld: e.shiftKey, isControlHeld: e.ctrlKey || e.metaKey },
            current,
            { navigable, anchor: navigable.find((row) => row.node.value === checkAnchor) },
        );

        if (action === undefined) return false;

        e.preventDefault();

        if (action.kind === "check") check(action.row);
        if (action.kind === "check_all") checkAll();
        if (action.kind === "check_range") checkRows(action.rows);
        if (action.kind === "check_range" && action.focus) focusRow(action.focus);

        if (action.kind === "focus_check") {
            focusRow(action.row);
            check(action.row);
        }

        return true;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const navigable = getNavigableRows();

        if (navigable.length < 1) return;

        const current = findRowById(document.activeElement?.id) ?? getRovingRow();

        if (!current) return;

        if (props.isMultiple && handleMultiKeyDown(e, current, navigable)) return;

        const action = TreeUtils.computeKeyAction(e.key, current, {
            flatRows: getFlatRows(),
            navigable,
            direction: getDirection(),
            pushQuery: () => typeahead.push(e),
            computeRowText,
        });

        if (action === undefined) return;

        e.preventDefault();

        if (action.kind === "expand_siblings") expandSiblings(action.row);
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

    const getConnectorDefs = (row: TreeRow<T>) =>
        props.renderConnector === undefined || getLayout() === undefined
            ? undefined
            : TreeUtils.computeConnectorDefs(getFlatRows(), row, getLayout());

    const [getNodeRefs, setNodeRefs] = createSignal<Map<T, HTMLElement>>(new Map(), { equals: false });
    const [getHoveredValue, setHoveredValue] = createSignal<T>();
    const [getFocusVisibleValue, setFocusVisibleValue] = createSignal<T>();

    const recordNodeRef = (getValue: () => T, element: HTMLElement) =>
        createEffect(() => {
            const value = getValue();

            setNodeRefs((refs) => refs.set(value, element));

            onCleanup(() =>
                setNodeRefs((refs) => {
                    if (refs.get(value) === element) refs.delete(value);

                    return refs;
                }),
            );
        });

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
        () => props.renderSelectionFloater !== undefined && !props.isMultiple,
        () => valueSignal[0](),
    );

    const hoverHold = TooltipSolidUtils.createHoverHold(
        () => {
            const value = getHoveredValue();

            return value === undefined ? undefined : getNodeRefs().get(value);
        },
        () => setHoveredValue(undefined),
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => getHoveredValue() ?? getFocusVisibleValue(),
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

    const readFocusVisibleValue = (target: EventTarget | null) =>
        target instanceof HTMLElement && InteractionTrackerUtils.computeIsFocusVisible(target)
            ? findRowByTarget(target)?.node.value
            : undefined;

    const renderPlaced = (getRow: Accessor<TreeRow<T>>, element: JSX.Element) => (
        <Show when={getPlacementAt(getRow().index)} fallback={element}>
            {(getRect) => <PlacementItem placement={getRect}>{element}</PlacementItem>}
        </Show>
    );

    const renderRow = (getRow: Accessor<TreeRow<T>>): JSX.Element => {
        let expander: HTMLElement | undefined;

        return renderPlaced(
            getRow,
            <InteractionWrapper
                sizing={"fill"}
                isDisabled={() => getRow().node.isDisabled ?? false}
                isReachableWhenDisabled={() => getRow().node.isReachableWhenDisabled ?? false}
                isTabbable={() => getRow().node.value === getRovingRow()?.node.value}
                tooltipDefs={() => getRow().node.tooltipDefs}
                extraFlags={() => ({
                    value: getRow().node.value,
                    isBranch: TreeUtils.getIsBranch(getRow().node),
                    isExpanded: getRow().isExpanded,
                    isPending: TreeUtils.computeIsPending(getRow()),
                    isSelected: getCheckedState(getRow().node.value) === true,
                    checkedState: getCheckedState(getRow().node.value),
                    depth: getRow().depth,
                })}
                renderControl={(setElementRef, getRenderProps) => (
                    <TreeNodeItem
                        ref={(element) => {
                            setElementRef(element);
                            recordNodeRef(() => getRow().node.value, element);
                        }}
                        id={() => getRowId(getRow())}
                        href={() => getRow().node.href}
                        level={() => getRow().depth + 1}
                        position={() => getRow().position + 1}
                        setSize={() => getRow().setSize}
                        flags={getRenderProps}
                        linkComponent={props.linkComponent}
                        isMultiple={props.isMultiple}
                        renderContent={() =>
                            props.renderNode(
                                () => getRow().node,
                                getRenderProps,
                                (element) => {
                                    expander = element;
                                },
                            )
                        }
                        onActivate={(e) => press(getRow(), expander, e)}
                    />
                )}
            />,
        );
    };

    const renderRows = (getLevelRows: Accessor<TreeRow<T>[]>): JSX.Element => (
        <Index each={getLevelRows()}>
            {(getRow) => (
                <>
                    <Show when={getConnectorDefs(getRow())}>
                        {(getDefs) => (
                            <span class={styles.treeConnector} aria-hidden="true">
                                {props.renderConnector!(getDefs)}
                            </span>
                        )}
                    </Show>

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
        <div
            ref={setSizerRef}
            class={rowWindow.getHasNoScroller() ? undefined : styles.treeSizer}
            style={{ height: rowWindow.getHasNoScroller() ? undefined : `${rowWindow.getTotalSize()}px` }}
        >
            {renderFloaters()}

            <Show when={!rowWindow.getHasNoScroller()} fallback={renderRows(getRows)}>
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
            </Show>
        </div>
    );

    return (
        <div
            ref={setRootRef}
            class={styles.treeRoot}
            role="tree"
            aria-label={access(props.ariaLabel)}
            aria-multiselectable={props.isMultiple || undefined}
            onKeyDown={(e) => {
                handleKeyDown(e);

                setFocusVisibleValue(() => readFocusVisibleValue(document.activeElement));
            }}
            onFocusIn={(e) => {
                lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;

                setFocusVisibleValue(() => readFocusVisibleValue(e.target));
            }}
            onFocusOut={() => setFocusVisibleValue(undefined)}
            onPointerOver={(e) => {
                if (hoverHold.getIsOnTooltip(e.target)) return;

                setHoveredValue(() => findRowByTarget(e.target)?.node.value);
            }}
            onPointerLeave={hoverHold.handlePointerLeave}
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

export const Tree = <T,>(props: TreeProps<T>) => <TreeComposite {...props} isMultiple={false} />;

export const MultiTree = <T,>(props: MultiTreeProps<T>) => <TreeComposite {...props} isMultiple={true} />;

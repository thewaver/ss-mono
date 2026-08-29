import type { Accessor, JSX } from "solid-js";
import { For, Index, Show, createEffect, createMemo, createSignal, createUniqueId } from "solid-js";
import { Dynamic } from "solid-js/web";

import { FlattenerUtils } from "../../Abstracts/Flattener/Flattener.utils";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { Typeahead } from "../../Abstracts/Typeahead/Typeahead";
import { TypeaheadUtils } from "../../Abstracts/Typeahead/Typeahead.utils";
import { Virtualizer } from "../../Abstracts/Virtualizer/Virtualizer";
import { access, accessSignal } from "../../Utils/propUtils";
import { InteractionWrapper } from "../InteractionWrapper/InteractionWrapper";
import type { TreeNodeItemProps, TreeProps, TreeRow } from "./Tree.types";
import { TreeUtils } from "./Tree.utils";

import * as styles from "./Tree.css";

const EMPTY_PINNED_ROWS: number[] = [];

const EXPAND_SIBLINGS_KEY = "*";

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
    const valueSignal = accessSignal(() => props.valueSignal);
    const expandedSignal = accessSignal(() => props.expandedSignal);

    const treeId = createUniqueId();

    const [getFocusedValue, setFocusedValue] = createSignal<T | undefined>();

    const typeahead = Typeahead.createBuffer();

    const getRows = createMemo(() =>
        TreeUtils.getVisibleRows(access(props.nodes), (value) => expandedSignal[0]().includes(value)),
    );

    const getFlatRows = createMemo(() => FlattenerUtils.getFlatRows(getRows()));

    const computeIsNavigable = (row: TreeRow<T>) => {
        const isReachable = InteractionTracker.computeIsReachable(
            row.node.isDisabled ?? false,
            row.node.isReachableWhenDisabled ?? false,
            row.node.tooltipDefs !== undefined,
        );

        return !row.node.isDisabled || isReachable;
    };

    const getNavigableRows = createMemo(() => getFlatRows().filter(computeIsNavigable));

    const getIsVirtualized = createMemo(() => props.computeEstimatedNodeHeight !== undefined);

    const getIsPending = (row: TreeRow<T>) => row.isExpanded && row.rows.length < 1;

    const getHasPendingPaint = (row: TreeRow<T>) => getIsPending(row) && props.renderPendingChildren !== undefined;

    const getRovingRow = createMemo(() => {
        const navigable = getNavigableRows();
        const focusedValue = getFocusedValue();

        const focusedRow = navigable.find((row) => row.node.value === focusedValue);

        if (focusedRow) return focusedRow;

        const selectedValue = valueSignal[0]();

        return navigable.find((row) => row.node.value === selectedValue) ?? navigable[0];
    });

    const [getSizerRef, setSizerRef] = createSignal<HTMLElement>();

    const rowWindow = Virtualizer.createRowWindow(getSizerRef, () => getFlatRows().length, {
        getIsEnabled: getIsVirtualized,
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

    const getRowId = (row: TreeRow<T>) => `${treeId}-node-${row.index}`;

    const findRowById = (id: string | undefined) => getNavigableRows().find((row) => getRowId(row) === id);

    const computeRowText = (row: TreeRow<T>) =>
        props.computeCustomText?.(row.node) ?? TypeaheadUtils.getElementText(document.getElementById(getRowId(row)));

    let lastFocusedValue: T | undefined;
    let lastExpanded: T[] = [];

    createEffect(() => {
        const expanded = expandedSignal[0]();
        const collapsed = lastExpanded.filter((value) => !expanded.includes(value));
        const visible = getFlatRows();

        lastExpanded = expanded;

        if (collapsed.length < 1) return;
        if (lastFocusedValue === undefined) return;
        if (document.activeElement !== document.body) return;
        if (visible.some((row) => row.node.value === lastFocusedValue)) return;

        const branch = visible.find((row) => collapsed.includes(row.node.value));

        if (branch) focusRow(branch);
    });

    const focusRow = (row: TreeRow<T>) => {
        setFocusedValue(() => row.node.value);

        if (rowWindow.getIsLive()) rowWindow.scrollToRow(row.index);

        document.getElementById(getRowId(row))?.focus();
    };

    const findParentRow = (row: TreeRow<T>) =>
        row.parentIndex === undefined ? undefined : getFlatRows()[row.parentIndex];

    const expand = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        expandedSignal[1]((prev) => (prev.includes(row.node.value) ? prev : [...prev, row.node.value]));
    };

    const collapse = (row: TreeRow<T>) => {
        if (row.node.isDisabled) return;

        expandedSignal[1]((prev) => prev.filter((value) => value !== row.node.value));
    };

    const toggle = (row: TreeRow<T>) => {
        if (row.isExpanded) {
            collapse(row);

            return;
        }

        expand(row);
    };

    const expandSiblings = (row: TreeRow<T>) => {
        const parent = findParentRow(row);
        const siblings = parent ? parent.rows : getRows();

        expandedSignal[1]((prev) => [
            ...prev,
            ...siblings
                .filter(
                    (sibling) =>
                        TreeUtils.getIsBranch(sibling.node) &&
                        !sibling.node.isDisabled &&
                        !prev.includes(sibling.node.value),
                )
                .map((sibling) => sibling.node.value),
        ]);
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

        if (e.key === EXPAND_SIBLINGS_KEY) {
            e.preventDefault();

            expandSiblings(current);

            return;
        }

        const query = typeahead.push(e);

        if (query !== undefined) {
            e.preventDefault();

            const position = TypeaheadUtils.computeNextIndex(
                query,
                navigable.indexOf(current),
                navigable.length,
                (index) => computeRowText(navigable[index]),
            );

            if (position !== undefined) focusRow(navigable[position]);

            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            if (current.node.href) {
                if (e.key === "Enter") return;

                e.preventDefault();

                document.getElementById(getRowId(current))?.click();

                return;
            }

            e.preventDefault();

            activate(current);

            return;
        }

        if (e.key === "ArrowRight") {
            if (!TreeUtils.getIsBranch(current.node)) return;

            e.preventDefault();

            if (!current.isExpanded) {
                expand(current);

                return;
            }

            const child = FlattenerUtils.getFlatRows(current.rows).find(computeIsNavigable);

            if (child) focusRow(child);

            return;
        }

        if (e.key === "ArrowLeft") {
            if (TreeUtils.getIsBranch(current.node) && current.isExpanded) {
                e.preventDefault();

                collapse(current);

                return;
            }

            const parent = findParentRow(current);

            if (!parent || !computeIsNavigable(parent)) return;

            e.preventDefault();

            focusRow(parent);

            return;
        }

        const position = NavigatorUtils.computeNextPosition(e.key, navigable.indexOf(current), navigable.length);

        if (position === undefined) return;

        e.preventDefault();

        focusRow(navigable[position]);
    };

    const renderRow = (getRow: Accessor<TreeRow<T>>): JSX.Element => (
        <InteractionWrapper
            sizing={"fill"}
            isDisabled={() => getRow().node.isDisabled ?? false}
            isReachableWhenDisabled={() => getRow().node.isReachableWhenDisabled ?? false}
            isTabbable={() => getRow().node.value === getRovingRow()?.node.value}
            tooltipDefs={() => getRow().node.tooltipDefs}
            extraFlags={() => ({
                isBranch: TreeUtils.getIsBranch(getRow().node),
                isExpanded: getRow().isExpanded,
                isPending: getIsPending(getRow()),
                isSelected: getRow().node.value === valueSignal[0](),
                depth: getRow().depth,
            })}
            renderControl={(setElementRef, getFlags) => (
                <TreeNodeItem
                    ref={setElementRef}
                    id={() => getRowId(getRow())}
                    href={() => getRow().node.href}
                    level={() => getRow().depth + 1}
                    position={() => getRow().position + 1}
                    setSize={() => getRow().setSize}
                    flags={getFlags}
                    linkComponent={props.linkComponent}
                    renderContent={(getNodeFlags) => props.renderNode(() => getRow().node, getNodeFlags)}
                    onActivate={() => activate(getRow())}
                />
            )}
        />
    );

    const renderRows = (getLevelRows: Accessor<TreeRow<T>[]>): JSX.Element => (
        <Index each={getLevelRows()}>
            {(getRow) => (
                <>
                    {renderRow(getRow)}

                    <Show when={getRow().rows.length > 0 || getHasPendingPaint(getRow())}>
                        <div role="group">
                            <Show when={getIsPending(getRow())} fallback={renderRows(() => getRow().rows)}>
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

    const renderWindowedRows = () => (
        <div ref={setSizerRef} class={styles.treeSizer} style={{ height: `${rowWindow.getTotalSize()}px` }}>
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
            role="tree"
            aria-label={access(props.ariaLabel)}
            onKeyDown={handleKeyDown}
            onFocusIn={(e) => {
                lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;
            }}
        >
            <Show when={getIsVirtualized()} fallback={renderRows(getRows)}>
                {renderWindowedRows()}
            </Show>
        </div>
    );
};

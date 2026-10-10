import {
    type SlotsType,
    type VNodeChild,
    computed,
    defineComponent,
    h,
    onMounted,
    onUpdated,
    shallowRef,
    useId,
    watch,
} from "vue";

import {
    FlattenerUtils,
    FloaterStyles,
    TREE_DEFAULTS,
    type TreeNodeRenderProps,
    TreeStyles,
    TreeUtils,
    TypeaheadUtils,
} from "@thewaver/ss-components";

import { FloaterVueUtils } from "../../Abstracts/Floater/FloaterVue.utils";
import { NavigatorVueUtils } from "../../Abstracts/Navigator/NavigatorVue.utils";
import { TypeaheadVueUtils } from "../../Abstracts/Typeahead/TypeaheadVue.utils";
import { VirtualizerVueUtils } from "../../Abstracts/Virtualizer/VirtualizerVue.utils";
import { InteractionWrapper } from "../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { PlacementBox } from "../../Primitives/PlacementBox/PlacementBox";
import { PlacementItem } from "../../Primitives/PlacementItem/PlacementItem";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TreeNodeItemProps, TreeProps, TreeRow, TreeSlots } from "./Tree.types";

const EMPTY_PINNED_ROWS: number[] = [];

const TreeNodeItem = defineComponent(
    (props: TreeNodeItemProps, { slots }: SlotsContext<InteractionControlSlots<TreeNodeRenderProps>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const handleClick = (e: MouseEvent) => {
                if (isDisabled) {
                    e.preventDefault();

                    return;
                }

                props.onActivate();
            };

            const commonProps = {
                "class": TreeStyles.treeNode,
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

            const content = callSlot(slots.renderContent, props.flags);

            if (props.href === undefined) {
                return (
                    <div {...commonProps} onClick={handleClick}>
                        {content}
                    </div>
                );
            }

            if (props.linkComponent === undefined) {
                return (
                    <a href={props.href} {...commonProps} onClick={handleClick}>
                        {content}
                    </a>
                );
            }

            return h(
                props.linkComponent,
                { href: props.href, ...commonProps, onClick: handleClick },
                { default: () => content },
            );
        },
    {
        name: "TreeNodeItem",
        props: declareProps<TreeNodeItemProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            level: null,
            position: null,
            setSize: null,
            href: null,
            linkComponent: null,
            onActivate: null,
        }),
    },
);

export const Tree = defineComponent(
    <T,>(props: TreeProps<T>, { slots }: SlotsContext<TreeSlots<T>>) => {
        const value = useTwoWay(props, "value");
        const expanded = useTwoWay(props, "expanded", []);

        const treeId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const sizerRef = shallowRef<HTMLDivElement>();
        const focusedValue = shallowRef<T>();

        let lastFocusedValue: T | undefined;
        let lastExpanded: T[] = [];
        let pendingFocusId: string | undefined;

        const direction = NavigatorVueUtils.useDirection(rootRef);
        const typeahead = TypeaheadVueUtils.useBuffer();

        watch(value, () => {
            focusedValue.value = undefined;
        });

        const rows = computed(() => TreeUtils.getVisibleRows(props.nodes, (entry) => expanded.value.includes(entry)));
        const flatRows = computed(() => FlattenerUtils.getFlatRows(rows.value));
        const navigableRows = computed(() => flatRows.value.filter(TreeUtils.computeIsNavigable));

        const getIsVirtualized = () =>
            props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined;

        const rovingRow = computed(() =>
            TreeUtils.computeRovingRow(navigableRows.value, focusedValue.value, value.value),
        );

        const rowWindow = VirtualizerVueUtils.useRowWindow(sizerRef, () => flatRows.value.length, {
            isDisabled: () => !getIsVirtualized(),
            computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
            pinnedRows: () => (rovingRow.value === undefined ? EMPTY_PINNED_ROWS : [rovingRow.value.index]),
        });

        const layout = computed(() =>
            props.computeLayout?.({
                itemCount: flatRows.value.length,
                itemParents: flatRows.value.map((row) => row.parentIndex),
            }),
        );

        const getRowId = (row: TreeRow<T>) => TreeUtils.computeRowId(treeId, row);

        const findRowById = (id: string | undefined) => navigableRows.value.find((row) => getRowId(row) === id);

        const computeRowText = (row: TreeRow<T>) => {
            const custom = props.computeCustomText?.(row.node);

            if (custom !== undefined) return custom;

            const painted = TypeaheadUtils.getElementText(document.getElementById(getRowId(row)));

            return painted.length > 0 ? painted : String(row.node.value);
        };

        const focusRow = (row: TreeRow<T>) => {
            const id = getRowId(row);

            focusedValue.value = row.node.value;

            if (rowWindow.isLive.value) rowWindow.scrollToRow(row.index);

            const element = document.getElementById(id);

            if (element) {
                element.focus();

                return;
            }

            pendingFocusId = id;
        };

        const focusPending = () => {
            const element = pendingFocusId === undefined ? undefined : document.getElementById(pendingFocusId);

            if (!element) return;

            pendingFocusId = undefined;
            element.focus();
        };

        onMounted(focusPending);

        onUpdated(focusPending);

        watchAfterRender([expanded, flatRows], ([expandedValues, flat]) => {
            const branch = TreeUtils.findCollapsedFocusTarget(lastExpanded, expandedValues, flat, lastFocusedValue);

            lastExpanded = expandedValues;

            if (branch && document.activeElement === document.body) focusRow(branch);
        });

        const writeExpanded = (next: T[]) => {
            if (next !== expanded.value) expanded.value = next;
        };

        const expand = (row: TreeRow<T>) => writeExpanded(TreeUtils.expand(expanded.value, row.node));

        const collapse = (row: TreeRow<T>) => writeExpanded(TreeUtils.collapse(expanded.value, row.node));

        const toggle = (row: TreeRow<T>) => {
            if (row.isExpanded) {
                collapse(row);

                return;
            }

            expand(row);
        };

        const expandSiblings = (row: TreeRow<T>) => {
            expanded.value = TreeUtils.expandSiblings(
                expanded.value,
                TreeUtils.computeSiblings(rows.value, flatRows.value, row),
            );
        };

        const select = (next: T) => {
            if (next === value.value) return;

            value.value = next;

            props.onSelectionChange?.(next);
        };

        const activate = (row: TreeRow<T>) => {
            if (row.node.isDisabled) return;

            select(row.node.value);

            if (TreeUtils.getIsBranch(row.node)) toggle(row);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (navigableRows.value.length < 1) return;

            const current = findRowById(document.activeElement?.id) ?? rovingRow.value;

            if (!current) return;

            const action = TreeUtils.computeKeyAction(e.key, current, {
                flatRows: flatRows.value,
                navigable: navigableRows.value,
                direction: direction.value,
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

        const nodeRefs = new Map<T, HTMLElement>();
        const nodeRefsVersion = shallowRef(0);
        const hoveredValue = shallowRef<T>();
        const focusInValue = shallowRef<T>();

        const recordNodeRef = (nodeValue: T, element: HTMLElement | undefined, recorded: HTMLElement | undefined) => {
            if (element) {
                if (nodeRefs.get(nodeValue) === element) return element;

                nodeRefs.set(nodeValue, element);
                nodeRefsVersion.value += 1;

                return element;
            }

            if (recorded && nodeRefs.get(nodeValue) === recorded) {
                nodeRefs.delete(nodeValue);
                nodeRefsVersion.value += 1;
            }

            return undefined;
        };

        const getFloaterTransitionDurationMs = () =>
            props.floaterTransitionDurationMs ?? TREE_DEFAULTS.floaterTransitionDurationMs;

        const useNodeFloater = (isEnabled: () => boolean, getValue: () => T | undefined) => {
            const getRow = () => {
                const nodeValue = getValue();

                return nodeValue === undefined ? undefined : flatRows.value.find((row) => row.node.value === nodeValue);
            };

            return FloaterVueUtils.useFloater({
                isEnabled,
                container: () => (getIsVirtualized() ? sizerRef.value : rootRef.value),
                target: () => {
                    const row = getRow();

                    void nodeRefsVersion.value;

                    return row === undefined ? undefined : nodeRefs.get(row.node.value);
                },
                layout,
                placement: () => {
                    const row = getRow();

                    return row === undefined ? undefined : layout.value?.placements[row.index];
                },
                transitionDurationMs: getFloaterTransitionDurationMs,
            });
        };

        const selectionFloater = useNodeFloater(
            () => slots.renderSelectionFloater !== undefined,
            () => value.value,
        );

        const highlightFloater = useNodeFloater(
            () => slots.renderHighlightFloater !== undefined,
            () => hoveredValue.value ?? focusInValue.value,
        );

        const findRowByTarget = (target: EventTarget | null) =>
            target instanceof Element ? findRowById(target.closest('[role="treeitem"]')?.id) : undefined;

        const handleFocus = (e: FocusEvent) => {
            lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;
            focusInValue.value = findRowByTarget(e.target)?.node.value;
        };

        const hasPendingPaint = (row: TreeRow<T>) =>
            TreeUtils.computeIsPending(row) && slots.renderPendingChildren !== undefined;

        return () => {
            const currentLayout = layout.value;
            const currentValue = value.value;
            const rovingValue = rovingRow.value?.node.value;
            const floaterTransitionDurationMs = getFloaterTransitionDurationMs();

            const renderFloater = (
                floater: typeof selectionFloater,
                renderContent: TreeSlots<T>["renderSelectionFloater"],
            ) =>
                floater.isRendered.value && (
                    <div
                        ref={floater.setRef}
                        class={FloaterStyles.floater}
                        style={{ ...floater.bounds.value, transitionDuration: `${floaterTransitionDurationMs}ms` }}
                    >
                        {callSlot(renderContent, {
                            visibilityTarget: floater.visibilityTarget.value,
                            transitionDurationMs: floaterTransitionDurationMs,
                        })}
                    </div>
                );

            const renderFloaters = () => [
                renderFloater(highlightFloater, slots.renderHighlightFloater),
                renderFloater(selectionFloater, slots.renderSelectionFloater),
            ];

            const renderRow = (row: TreeRow<T>, key: string | number) => {
                const placement = currentLayout?.placements[row.index];

                let recorded: HTMLElement | undefined;

                const element = (
                    <InteractionWrapper
                        key={key}
                        sizing={"fill"}
                        isDisabled={row.node.isDisabled ?? false}
                        isReachableWhenDisabled={row.node.isReachableWhenDisabled ?? false}
                        isTabbable={row.node.value === rovingValue}
                        tooltipDefs={row.node.tooltipDefs}
                        extraFlags={{
                            value: row.node.value,
                            isBranch: TreeUtils.getIsBranch(row.node),
                            isExpanded: row.isExpanded,
                            isPending: TreeUtils.computeIsPending(row),
                            isSelected: row.node.value === currentValue,
                            depth: row.depth,
                        }}
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags: renderProps }) => (
                                    <TreeNodeItem
                                        ref={(target) => {
                                            setElementRef(target);
                                            recorded = recordNodeRef(row.node.value, toElement(target), recorded);
                                        }}
                                        id={getRowId(row)}
                                        href={row.node.href}
                                        level={row.depth + 1}
                                        position={row.position + 1}
                                        setSize={row.setSize}
                                        flags={renderProps}
                                        linkComponent={props.linkComponent}
                                        onActivate={() => activate(row)}
                                    >
                                        {
                                            {
                                                renderContent: () =>
                                                    callSlot(slots.renderNode, {
                                                        node: row.node,
                                                        renderProps,
                                                    }),
                                            } satisfies InteractionControlSlots<TreeNodeRenderProps>
                                        }
                                    </TreeNodeItem>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<TreeNodeRenderProps<T>>>
                        }
                    </InteractionWrapper>
                );

                return placement ? (
                    <PlacementItem key={key} placement={placement}>
                        {{ default: () => element }}
                    </PlacementItem>
                ) : (
                    element
                );
            };

            const renderRows = (levelRows: TreeRow<T>[]): VNodeChild[] =>
                levelRows.flatMap((row, index) => {
                    const hasGroup = row.rows.length > 0 || hasPendingPaint(row);

                    if (!hasGroup) return [renderRow(row, `row-${index}`)];

                    return [
                        renderRow(row, `row-${index}`),
                        <div key={`group-${index}`} role="group">
                            {TreeUtils.computeIsPending(row)
                                ? callSlot(slots.renderPendingChildren, { node: row.node, depth: row.depth + 1 })
                                : renderRows(row.rows)}
                        </div>,
                    ];
                });

            const renderWindowedRows = () => (
                <div ref={sizerRef} class={TreeStyles.treeSizer} style={{ height: `${rowWindow.totalSize.value}px` }}>
                    {renderFloaters()}

                    {rowWindow.rows.value.map((windowRow) => {
                        const row = flatRows.value[windowRow.index];

                        if (!row) return null;

                        return (
                            <div
                                key={windowRow.index}
                                class={TreeStyles.treeSizerRow}
                                style={{ transform: `translateY(${rowWindow.getRowStart(windowRow)}px)` }}
                                ref={rowWindow.measureRow(windowRow.index)}
                            >
                                {renderRow(row, windowRow.index)}

                                {hasPendingPaint(row) &&
                                    callSlot(slots.renderPendingChildren, { node: row.node, depth: row.depth + 1 })}
                            </div>
                        );
                    })}
                </div>
            );

            const tiers = getIsVirtualized() ? renderWindowedRows() : [...renderFloaters(), ...renderRows(rows.value)];

            return (
                <div
                    ref={rootRef}
                    class={TreeStyles.treeRoot}
                    role="tree"
                    aria-label={props.ariaLabel}
                    onKeydown={handleKeyDown}
                    onFocusin={handleFocus}
                    onFocusout={() => {
                        focusInValue.value = undefined;
                    }}
                    onPointerover={(e) => {
                        hoveredValue.value = findRowByTarget(e.target)?.node.value;
                    }}
                    onPointerleave={() => {
                        hoveredValue.value = undefined;
                    }}
                >
                    {currentLayout ? (
                        <PlacementBox layout={currentLayout} computeEffect={props.computeEffect}>
                            {{ default: () => tiers }}
                        </PlacementBox>
                    ) : (
                        tiers
                    )}
                </div>
            );
        };
    },
    {
        name: "Tree",
        slots: Object as SlotsType<TreeSlots<any>>,
        props: declareProps<TreeProps<unknown>>({
            "ariaLabel": null,
            "linkComponent": null,
            "computeEstimatedNodeHeight": null,
            "floaterTransitionDurationMs": null,
            "nodes": null,
            "computeLayout": null,
            "computeEffect": null,
            "value": null,
            "onUpdate:value": null,
            "expanded": null,
            "onUpdate:expanded": null,
            "computeCustomText": null,
            "onSelectionChange": null,
        }),
    },
);

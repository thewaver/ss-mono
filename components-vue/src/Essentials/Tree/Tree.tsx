import {
    type ComponentPublicInstance,
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
    InteractionTrackerUtils,
    SelectionUtils,
    TREE_DEFAULTS,
    type TreeNodeRenderProps,
    TreeStyles,
    TreeUtils,
    TypeaheadUtils,
} from "@thewaver/ss-components";
import { TreeConst } from "@thewaver/ss-components/internal";

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
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import { TooltipVueUtils } from "../Overlays/Tooltip/TooltipVue.utils";
import type {
    MultiTreeProps,
    MultiTreeSlots,
    TreeCompositeProps,
    TreeNodeItemProps,
    TreeProps,
    TreeRow,
    TreeSlots,
} from "./Tree.types";

const TreeNodeItem = defineComponent(
    (props: TreeNodeItemProps, { slots }: SlotsContext<InteractionControlSlots<TreeNodeRenderProps>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            const handleClick = (e: MouseEvent) => {
                if (isDisabled) {
                    e.preventDefault();

                    return;
                }

                props.onActivate(e);
            };

            const commonProps = {
                "class": TreeStyles.treeNode,
                "role": "treeitem",
                "id": props.id,
                "aria-disabled": isDisabled || undefined,
                "aria-selected": props.isMultiple ? undefined : props.flags.isSelected,
                "aria-checked": props.isMultiple ? props.flags.checkedState : undefined,
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
            isMultiple: Boolean,
            onActivate: null,
        }),
    },
);

const TreeComposite = defineComponent(
    <T,>(props: TreeCompositeProps<T>, { slots }: SlotsContext<TreeSlots<T>>) => {
        watchAfterRender(
            [() => props.computeLayout !== undefined, () => slots.renderConnector !== undefined],
            ([hasLayout, hasConnector]) => TreeUtils.warnIfConnectorIgnored(hasLayout, hasConnector),
        );

        const value = useTwoWay(props, "value");
        const checked = useTwoWay(props, "checked", []);
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

        const expandedSet = computed(() => new Set(expanded.value));
        const rows = computed(() => TreeUtils.getVisibleRows(props.nodes, (entry) => expandedSet.value.has(entry)));
        const flatRows = computed(() => FlattenerUtils.getFlatRows(rows.value));
        const navigableRows = computed(() => flatRows.value.filter(TreeUtils.computeIsNavigable));

        const getIsVirtualized = () =>
            props.computeEstimatedNodeHeight !== undefined && props.computeLayout === undefined;

        const branchDefs = computed(() => TreeUtils.createBranchDefs(props.nodes));

        const getCheckedState = (nodeValue: T) =>
            props.isMultiple
                ? SelectionUtils.getBranchState(nodeValue, checked.value, branchDefs.value)
                : nodeValue === value.value;

        const getFirstCheckedValue = () =>
            navigableRows.value.find((row) => getCheckedState(row.node.value) === true)?.node.value;

        const rovingRow = computed(() =>
            TreeUtils.computeRovingRow(
                navigableRows.value,
                focusedValue.value,
                props.isMultiple ? getFirstCheckedValue() : value.value,
            ),
        );

        const rowWindow = VirtualizerVueUtils.useRowWindow(sizerRef, () => flatRows.value.length, {
            isDisabled: () => !getIsVirtualized(),
            computeEstimatedSize: (index) => props.computeEstimatedNodeHeight?.(index) ?? 0,
            pinnedRows: () => (rovingRow.value === undefined ? TreeConst.EMPTY_PINNED_ROWS : [rovingRow.value.index]),
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

        const expand = (row: TreeRow<T>) => {
            if (row.node.isDisabled) return;

            writeExpanded(TreeUtils.expand(expanded.value, row.node));
        };

        const collapse = (row: TreeRow<T>) => {
            if (row.node.isDisabled) return;

            writeExpanded(TreeUtils.collapse(expanded.value, row.node));
        };

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

        let checkAnchor: T | undefined;

        const writeChecked = (next: T[]) => {
            checked.value = next;

            props.onCheckedChange?.(next);
        };

        const check = (row: TreeRow<T>) => {
            if (row.node.isDisabled) return;

            checkAnchor = row.node.value;

            writeChecked(SelectionUtils.getBranchSelection(row.node.value, checked.value, branchDefs.value));
        };

        const checkRows = (checkedRows: TreeRow<T>[]) =>
            writeChecked(
                SelectionUtils.getMerged(
                    checked.value,
                    checkedRows
                        .filter((row) => !row.node.isDisabled)
                        .flatMap((row) => SelectionUtils.getBranchItems(row.node.value, branchDefs.value)),
                ),
            );

        const checkAll = () => {
            const all = TreeUtils.getCheckableValues(props.nodes);
            const isAllChecked = all.every((entry) => checked.value.includes(entry));

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
            const navigable = navigableRows.value;

            if (navigable.length < 1) return;

            const current = findRowById(document.activeElement?.id) ?? rovingRow.value;

            if (!current) return;

            if (props.isMultiple && handleMultiKeyDown(e, current, navigable)) return;

            const action = TreeUtils.computeKeyAction(e.key, current, {
                flatRows: flatRows.value,
                navigable,
                direction: direction.value,
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

        const nodeRefs = new Map<T, HTMLElement>();
        const nodeRefsVersion = shallowRef(0);
        const hoveredValue = shallowRef<T>();
        const focusVisibleValue = shallowRef<T>();

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
            () => slots.renderSelectionFloater !== undefined && !props.isMultiple,
            () => value.value,
        );

        const highlightFloater = useNodeFloater(
            () => slots.renderHighlightFloater !== undefined,
            () => hoveredValue.value ?? focusVisibleValue.value,
        );

        const handlePointerLeave = TooltipVueUtils.useHoverHold(
            () => {
                const nodeValue = hoveredValue.value;

                return nodeValue === undefined ? undefined : nodeRefs.get(nodeValue);
            },
            () => {
                hoveredValue.value = undefined;
            },
        );

        const findRowByTarget = (target: EventTarget | null) =>
            target instanceof Element ? findRowById(target.closest('[role="treeitem"]')?.id) : undefined;

        const readFocusVisibleValue = (target: EventTarget | null) =>
            target instanceof HTMLElement && InteractionTrackerUtils.computeIsFocusVisible(target)
                ? findRowByTarget(target)?.node.value
                : undefined;

        const handleFocus = (e: FocusEvent) => {
            lastFocusedValue = findRowById((e.target as HTMLElement).id)?.node.value;
            focusVisibleValue.value = readFocusVisibleValue(e.target);
        };

        const hasPendingPaint = (row: TreeRow<T>) =>
            TreeUtils.computeIsPending(row) && slots.renderPendingChildren !== undefined;

        return () => {
            const currentLayout = layout.value;
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

                const checkedState = getCheckedState(row.node.value);

                let recorded: HTMLElement | undefined;
                let expander: HTMLElement | undefined;

                const setExpanderRef = (target: Element | ComponentPublicInstance | null) => {
                    expander = toElement(target);
                };

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
                            isSelected: checkedState === true,
                            checkedState,
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
                                        isMultiple={props.isMultiple}
                                        onActivate={(e: MouseEvent) => press(row, expander, e)}
                                    >
                                        {
                                            {
                                                renderContent: () =>
                                                    callSlot(slots.renderNode, {
                                                        node: row.node,
                                                        renderProps,
                                                        setExpanderRef,
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

            const renderConnector = (row: TreeRow<T>) => {
                const defs =
                    slots.renderConnector === undefined || currentLayout === undefined
                        ? undefined
                        : TreeUtils.computeConnectorDefs(flatRows.value, row, currentLayout);

                if (defs === undefined) return null;

                return (
                    <span class={TreeStyles.treeConnector} aria-hidden="true">
                        {callSlot(slots.renderConnector, defs)}
                    </span>
                );
            };

            const renderRows = (levelRows: TreeRow<T>[]): VNodeChild[] =>
                levelRows.flatMap((row, index) => {
                    const hasGroup = row.rows.length > 0 || hasPendingPaint(row);

                    if (!hasGroup) return [renderConnector(row), renderRow(row, `row-${index}`)];

                    return [
                        renderConnector(row),
                        renderRow(row, `row-${index}`),
                        <div key={`group-${index}`} role="group">
                            {TreeUtils.computeIsPending(row)
                                ? callSlot(slots.renderPendingChildren, { node: row.node, depth: row.depth + 1 })
                                : renderRows(row.rows)}
                        </div>,
                    ];
                });

            const renderWindowedRows = () => (
                <div
                    ref={sizerRef}
                    class={rowWindow.hasNoScroller.value ? undefined : TreeStyles.treeSizer}
                    style={rowWindow.hasNoScroller.value ? undefined : { height: `${rowWindow.totalSize.value}px` }}
                >
                    {renderFloaters()}

                    {rowWindow.hasNoScroller.value
                        ? renderRows(rows.value)
                        : rowWindow.rows.value.map((windowRow) => {
                              const row = flatRows.value[windowRow.index];

                              if (!row) return null;

                              return (
                                  <div
                                      key={windowRow.index}
                                      class={TreeStyles.treeSizerRow}
                                      style={{ top: `${rowWindow.getRowStart(windowRow)}px` }}
                                      ref={rowWindow.measureRow(windowRow.index)}
                                  >
                                      {renderRow(row, windowRow.index)}

                                      {hasPendingPaint(row) &&
                                          callSlot(slots.renderPendingChildren, {
                                              node: row.node,
                                              depth: row.depth + 1,
                                          })}
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
                    aria-multiselectable={props.isMultiple || undefined}
                    onKeydown={(e) => {
                        handleKeyDown(e);
                        focusVisibleValue.value = readFocusVisibleValue(document.activeElement);
                    }}
                    onFocusin={handleFocus}
                    onFocusout={() => {
                        focusVisibleValue.value = undefined;
                    }}
                    onPointerover={(e) => {
                        hoveredValue.value = findRowByTarget(e.target)?.node.value;
                    }}
                    onPointerleave={handlePointerLeave}
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
        name: "TreeComposite",
        slots: Object as SlotsType<TreeSlots<any>>,
        props: declareProps<TreeCompositeProps<unknown>>({
            "ariaLabel": null,
            "linkComponent": null,
            "computeEstimatedNodeHeight": null,
            "floaterTransitionDurationMs": null,
            "nodes": null,
            "computeLayout": null,
            "computeEffect": null,
            "value": null,
            "onUpdate:value": null,
            "checked": null,
            "onUpdate:checked": null,
            "expanded": null,
            "onUpdate:expanded": null,
            "computeCustomText": null,
            "onSelectionChange": null,
            "onCheckedChange": null,
            "isMultiple": Boolean,
        }),
    },
);

export const Tree = defineComponent(
    <T,>(props: TreeProps<T>, { slots }: SlotsContext<TreeSlots<T>>) => {
        const value = useTwoWay(props, "value");
        const expanded = useTwoWay(props, "expanded", []);

        return () => (
            <TreeComposite
                {...{
                    ...forwardProps(props, TreeComposite),
                    "value": value.value,
                    "onUpdate:value": (next: T | undefined) => {
                        value.value = next;
                    },
                    "expanded": expanded.value,
                    "onUpdate:expanded": (next: T[]) => {
                        expanded.value = next;
                    },
                }}
                nodes={props.nodes}
                isMultiple={false}
            >
                {
                    {
                        renderNode: slots.renderNode,
                        renderPendingChildren: slots.renderPendingChildren,
                        renderSelectionFloater: slots.renderSelectionFloater,
                        renderHighlightFloater: slots.renderHighlightFloater,
                        renderConnector: slots.renderConnector,
                    } satisfies Partial<TreeSlots<T>>
                }
            </TreeComposite>
        );
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

export const MultiTree = defineComponent(
    <T,>(props: MultiTreeProps<T>, { slots }: SlotsContext<MultiTreeSlots<T>>) => {
        const checked = useTwoWay(props, "checked", []);
        const expanded = useTwoWay(props, "expanded", []);

        return () => (
            <TreeComposite
                {...{
                    ...forwardProps(props, TreeComposite),
                    "checked": checked.value,
                    "onUpdate:checked": (next: T[]) => {
                        checked.value = next;
                    },
                    "expanded": expanded.value,
                    "onUpdate:expanded": (next: T[]) => {
                        expanded.value = next;
                    },
                }}
                nodes={props.nodes}
                isMultiple={true}
            >
                {
                    {
                        renderNode: slots.renderNode,
                        renderPendingChildren: slots.renderPendingChildren,
                        renderHighlightFloater: slots.renderHighlightFloater,
                        renderConnector: slots.renderConnector,
                    } satisfies Partial<TreeSlots<T>>
                }
            </TreeComposite>
        );
    },
    {
        name: "MultiTree",
        slots: Object as SlotsType<MultiTreeSlots<any>>,
        props: declareProps<MultiTreeProps<unknown>>({
            "ariaLabel": null,
            "linkComponent": null,
            "computeEstimatedNodeHeight": null,
            "floaterTransitionDurationMs": null,
            "nodes": null,
            "computeLayout": null,
            "computeEffect": null,
            "checked": null,
            "onUpdate:checked": null,
            "expanded": null,
            "onUpdate:expanded": null,
            "computeCustomText": null,
            "onCheckedChange": null,
        }),
    },
);

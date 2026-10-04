import { type SlotsType, type VNodeChild, computed, defineComponent, shallowRef, useId, watch } from "vue";

import {
    FloaterStyles,
    LISTBOX_DEFAULTS,
    ListboxStyles,
    ListboxUtils,
    type SelectOptionFlags,
    SelectUtils,
    type VirtualizerRow,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { FloaterVueUtils } from "../../../Abstracts/Floater/FloaterVue.utils";
import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { VirtualizerVueUtils } from "../../../Abstracts/Virtualizer/VirtualizerVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { SelectItem, SelectOption, SelectOptionGroup } from "../Select/Select.types";
import type {
    ListboxCompositeProps,
    ListboxCompositeSlots,
    ListboxOptionItemProps,
    ListboxOptionsProps,
    ListboxOptionsSlots,
    ListboxProps,
    ListboxSlots,
} from "./Listbox.types";
import { ListboxVueUtils } from "./ListboxVue.utils";

const EMPTY_SELECTION: never[] = [];

const ListboxOptionItem = defineComponent(
    (props: ListboxOptionItemProps, { slots }: SlotsContext<InteractionControlSlots<SelectOptionFlags>>) => {
        const elementRef = shallowRef<HTMLDivElement>();

        watchAfterRender([elementRef], ([element]) =>
            element ? props.onRegister?.(element, () => props.flatIndex ?? -1) : undefined,
        );

        watchAfterRender(
            [() => props.flags.isHighlighted ?? false, () => props.isSelfScrolling, () => props.focusModel],
            ([isHighlighted, isSelfScrolling, focusModel]) => {
                if (!isHighlighted || !isSelfScrolling || !elementRef.value) return;

                ListboxUtils.revealOption(elementRef.value, focusModel);
            },
        );

        return () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <div
                    id={props.id}
                    ref={elementRef}
                    class={ListboxStyles.listboxOption}
                    role="option"
                    tabindex={-1}
                    aria-disabled={isDisabled || undefined}
                    aria-selected={props.flags.isSelected}
                    onFocus={() => props.onFocus?.()}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onSelect();
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </div>
            );
        };
    },
    {
        name: "ListboxOptionItem",
        slots: Object as SlotsType<InteractionControlSlots<SelectOptionFlags>>,
        props: declareProps<ListboxOptionItemProps>({
            id: null,
            ariaLabel: null,
            flags: null,
            isSelfScrolling: Boolean,
            focusModel: null,
            onFocus: null,
            onSelect: null,
            flatIndex: null,
            onRegister: null,
        }),
    },
);

export const ListboxOptions = defineComponent(
    <T,>(props: ListboxOptionsProps<T>, { slots }: SlotsContext<ListboxOptionsSlots<T>>) => {
        const endMarkerRef = shallowRef<HTMLDivElement>();
        const sizerRef = shallowRef<HTMLDivElement>();
        const optionsRef = shallowRef<HTMLDivElement>();
        const optionsGeneration = shallowRef(0);
        const optionRefsVersion = shallowRef(0);
        const hoveredIndex = shallowRef<number>();

        const optionRefs = new Map<HTMLElement, () => number>();

        const registerOption = (element: HTMLElement, getFlatIndex: () => number) => {
            optionRefs.set(element, getFlatIndex);
            optionRefsVersion.value += 1;

            return () => {
                optionRefs.delete(element);
                optionRefsVersion.value += 1;
            };
        };

        const findOptionRef = (index: number) => {
            void optionRefsVersion.value;

            return [...optionRefs].find(([, getFlatIndex]) => getFlatIndex() === index)?.[0];
        };

        const findOptionIndex = (target: EventTarget | null) =>
            target instanceof Node ? [...optionRefs].find(([element]) => element.contains(target))?.[1]() : undefined;

        const getFloaterTransitionDurationMs = () =>
            props.floaterTransitionDurationMs ?? LISTBOX_DEFAULTS.floaterTransitionDurationMs;

        const reachEndGuard = ListboxUtils.createReachEndGuard<SelectItem<T>[]>();

        const getIsVirtualized = () =>
            props.computeEstimatedOptionHeight !== undefined && props.cursor.orientation.value !== "horizontal";

        const isAtEnd = ElementObserverVueUtils.useViewportIntersection(endMarkerRef, () => !props.isLive);

        watch(
            () => props.cursor.options.value,
            () => {
                optionsGeneration.value += 1;
            },
        );

        watchAfterRender([isAtEnd, () => props.hasMoreOptions ?? false], ([isEndShown, hasMoreOptions]) => {
            if (!isEndShown || !hasMoreOptions) return;

            if (!reachEndGuard.claim(props.cursor.options.value)) return;

            props.onReachEnd?.();
        });

        watchAfterRender([() => props.isLive], ([isLive]) => {
            if (isLive) return;

            reachEndGuard.reset();
        });

        const rowWindow = VirtualizerVueUtils.useRowWindow(sizerRef, () => props.cursor.rows.value.length, {
            isDisabled: () => !getIsVirtualized() || !props.isLive,
            computeEstimatedSize: (index) =>
                ListboxUtils.computeEstimatedRowSize(
                    props.cursor.rows.value[index],
                    props.computeEstimatedOptionHeight,
                    props.computeEstimatedGroupHeight,
                ),
            pinnedRows: () => ListboxUtils.getPinnedRows(props.cursor.rows.value, props.cursor.highlightedIndex.value),
        });

        const highlightedRowIndex = computed(() =>
            ListboxUtils.getHighlightedRowIndex(props.cursor.rows.value, props.cursor.highlightedIndex.value),
        );

        watchAfterRender(
            [rowWindow.isLive, highlightedRowIndex, () => props.cursor.rows.value],
            ([isWindowLive, rowIndex]) => {
                if (!isWindowLive || rowIndex === undefined) return;

                rowWindow.scrollToRow(rowIndex);
            },
        );

        const selectedIndex = computed(() => {
            const index = SelectUtils.getFlatOptions(props.cursor.options.value).findIndex((option) =>
                props.computeIsSelected(option.value),
            );

            return index < 0 ? undefined : index;
        });

        const useOptionFloater = (isEnabled: () => boolean, getIndex: () => number | undefined) =>
            FloaterVueUtils.useFloater({
                isEnabled,
                container: () => (getIsVirtualized() ? sizerRef.value : optionsRef.value),
                target: () => {
                    const index = getIndex();

                    return index === undefined ? undefined : findOptionRef(index);
                },
                transitionDurationMs: getFloaterTransitionDurationMs,
            });

        const selectionFloater = useOptionFloater(
            () => slots.renderSelectionFloater !== undefined,
            () => selectedIndex.value,
        );

        const highlightFloater = useOptionFloater(
            () => slots.renderHighlightFloater !== undefined,
            () =>
                hoveredIndex.value ??
                (props.cursor.isHighlightShown.value ? props.cursor.highlightedIndex.value : undefined),
        );

        const handleOptionsPointerOver = (e: PointerEvent) => {
            hoveredIndex.value = findOptionIndex(e.target);
        };

        const handleOptionsPointerLeave = () => {
            hoveredIndex.value = undefined;
        };

        let hadFocus = false;

        watch(
            rowWindow.rows,
            () => {
                hadFocus = sizerRef.value?.contains(document.activeElement) ?? false;
            },
            { flush: "sync" },
        );

        watchAfterRender([rowWindow.rows], () => {
            const index = props.cursor.highlightedIndex.value;

            if (!hadFocus || index === undefined || sizerRef.value?.contains(document.activeElement)) return;

            ListboxUtils.focusOption(props.cursor.listboxId.value, index);
        });

        return () => {
            const cursor = props.cursor;
            const isRoving = cursor.focusModel === "roving";
            const isListDisabled = props.isDisabled ?? false;
            const hasMoreOptions = props.hasMoreOptions ?? false;
            const isHorizontal = cursor.orientation.value === "horizontal";
            const isVirtualized = getIsVirtualized();
            const rows = cursor.rows.value;
            const highlightedIndex = cursor.highlightedIndex.value;
            const floaterTransitionDurationMs = getFloaterTransitionDurationMs();

            const renderFloater = (
                floater: typeof selectionFloater,
                renderContent: ListboxOptionsSlots<T>["renderSelectionFloater"],
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

            const renderEndMarker = () =>
                hasMoreOptions && (
                    <div
                        key={optionsGeneration.value}
                        ref={endMarkerRef}
                        class={ListboxStyles.listboxEndMarker}
                        aria-hidden="true"
                    />
                );

            const renderGroupHeading = (group: SelectOptionGroup<T>) =>
                callSlot(slots.renderGroup, {
                    group,
                    flags: ListboxUtils.computeGroupFlags(group, props.computeIsSelected),
                });

            const renderOptionSlot = (option: SelectOption<T>, flatIndex: number, key: string | number) => (
                <InteractionWrapper
                    key={key}
                    sizing={isHorizontal ? "fit-content" : "fill"}
                    isDisabled={(option.isDisabled ?? false) || isListDisabled}
                    isReachableWhenDisabled={option.isReachableWhenDisabled ?? false}
                    isFocusableWhenDisabled={isRoving && !isListDisabled && (option.isReachableWhenDisabled ?? false)}
                    isTabbable={isRoving && flatIndex === highlightedIndex}
                    tooltipDefs={option.tooltipDefs}
                    extraFlags={
                        {
                            isHighlighted: cursor.isHighlightShown.value && flatIndex === highlightedIndex,
                            isSelected: props.computeIsSelected(option.value),
                        } satisfies SelectOptionFlags
                    }
                >
                    {
                        {
                            renderControl: ({ setElementRef, flags }) => (
                                <ListboxOptionItem
                                    ref={setElementRef}
                                    id={cursor.getOptionId(flatIndex)}
                                    isSelfScrolling={!isVirtualized}
                                    focusModel={cursor.focusModel}
                                    flags={flags}
                                    onFocus={isRoving ? () => cursor.highlight(option.value) : undefined}
                                    onSelect={() => cursor.pick(option.value)}
                                    flatIndex={flatIndex}
                                    onRegister={registerOption}
                                >
                                    {
                                        {
                                            renderContent: (optionFlags) =>
                                                callSlot(slots.renderOption, { option, flags: optionFlags }),
                                        } satisfies InteractionControlSlots<SelectOptionFlags>
                                    }
                                </ListboxOptionItem>
                            ),
                        } satisfies Partial<InteractionWrapperSlots<SelectOptionFlags>>
                    }
                </InteractionWrapper>
            );

            const renderMountedOptions = () => (
                <div
                    ref={optionsRef}
                    class={[ListboxStyles.listboxOptions, isHorizontal && ListboxStyles.listboxHorizontal]}
                    role="presentation"
                    onPointerover={handleOptionsPointerOver}
                    onPointerleave={handleOptionsPointerLeave}
                >
                    {renderFloaters()}

                    {cursor.options.value.map((item, index) => {
                        const offset = cursor.itemRows.value[index].entryOffset;

                        if (!SelectUtils.getIsGroup(item)) return renderOptionSlot(item, offset, index);

                        return (
                            <div key={index} role="group" aria-label={item.label}>
                                {renderGroupHeading(item)}

                                {item.options.map((option, groupIndex) =>
                                    renderOptionSlot(option, offset + groupIndex, groupIndex),
                                )}
                            </div>
                        );
                    })}

                    {renderEndMarker()}
                </div>
            );

            const renderWindowedRow = (row: VirtualizerRow): VNodeChild => {
                const source = rows[row.index];

                return (
                    <div
                        key={row.index}
                        ref={rowWindow.measureRow(row.index)}
                        class={ListboxStyles.listboxSizerRow}
                        style={{ transform: `translateY(${rowWindow.getRowStart(row)}px)` }}
                    >
                        {source.isEntry
                            ? renderOptionSlot(source.node as SelectOption<T>, source.entryOffset, row.index)
                            : renderGroupHeading(source.node as SelectOptionGroup<T>)}
                    </div>
                );
            };

            const renderWindowedOptions = () => (
                <div
                    ref={sizerRef}
                    class={ListboxStyles.listboxSizer}
                    style={{ height: `${rowWindow.totalSize.value}px` }}
                    onPointerover={handleOptionsPointerOver}
                    onPointerleave={handleOptionsPointerLeave}
                >
                    {renderFloaters()}

                    {ListboxUtils.getWindowedRuns(rowWindow.rows.value, rows).flatMap((run) =>
                        run.group ? (
                            <div key={`group-${run.groupIndex}`} role="group" aria-label={run.group.label}>
                                {run.rows.map(renderWindowedRow)}
                            </div>
                        ) : (
                            run.rows.map(renderWindowedRow)
                        ),
                    )}
                </div>
            );

            return isVirtualized ? (
                <>
                    {renderWindowedOptions()}

                    {renderEndMarker()}
                </>
            ) : (
                renderMountedOptions()
            );
        };
    },
    {
        name: "ListboxOptions",
        slots: Object as SlotsType<ListboxOptionsSlots<any>>,
        props: declareProps<ListboxOptionsProps<unknown>>({
            isLive: Boolean,
            isDisabled: Boolean,
            hasMoreOptions: Boolean,
            onReachEnd: null,
            computeEstimatedOptionHeight: null,
            computeEstimatedGroupHeight: null,
            floaterTransitionDurationMs: null,
            cursor: null,
            computeIsSelected: null,
        }),
    },
);

export const ListboxComposite = defineComponent(
    <T,>(props: ListboxCompositeProps<T>, { slots }: SlotsContext<ListboxCompositeSlots<T>>) => {
        const fallbackId = useId();

        const rootRef = shallowRef<HTMLDivElement>();

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const cursor = ListboxVueUtils.useCursor<T>({
            focusModel: "roving",
            listboxId: () => props.id ?? fallbackId,
            options: () => props.options,
            selectedOptions: () => props.selectedOptions,
            isDisabled: () => props.isDisabled ?? false,
            isMultiple: () => props.isMultiple ?? false,
            hasMoreOptions: () => props.hasMoreOptions ?? false,
            orientation: () => props.orientation ?? LISTBOX_DEFAULTS.orientation,
            direction,
            getComputeCustomText: () => props.computeCustomText,
            onPick: (value) => props.onPick(value),
        });

        return () => {
            const orientation = props.orientation ?? LISTBOX_DEFAULTS.orientation;
            const isDisabled = props.isDisabled ?? false;
            const isMultiple = props.isMultiple ?? false;

            return (
                <div
                    ref={rootRef}
                    id={cursor.listboxId.value}
                    role="listbox"
                    aria-label={props.ariaLabel}
                    aria-multiselectable={isMultiple || undefined}
                    aria-orientation={orientation}
                    aria-disabled={isDisabled || undefined}
                    onKeydown={(e) => cursor.handleKeyDown(e)}
                    onFocusin={() => cursor.setHasFocus(true)}
                    onFocusout={(e) => {
                        const next = e.relatedTarget;

                        cursor.setHasFocus(next instanceof Node && (rootRef.value?.contains(next) ?? false));
                    }}
                >
                    <ListboxOptions
                        cursor={cursor}
                        isLive={true}
                        isDisabled={isDisabled}
                        hasMoreOptions={props.hasMoreOptions}
                        computeEstimatedOptionHeight={props.computeEstimatedOptionHeight}
                        computeEstimatedGroupHeight={props.computeEstimatedGroupHeight}
                        computeIsSelected={props.computeIsSelected}
                        floaterTransitionDurationMs={props.floaterTransitionDurationMs}
                        onReachEnd={props.onReachEnd}
                    >
                        {
                            {
                                renderOption: slots.renderOption,
                                renderGroup: slots.renderGroup,
                                renderSelectionFloater: slots.renderSelectionFloater,
                                renderHighlightFloater: slots.renderHighlightFloater,
                            } satisfies Partial<ListboxOptionsSlots<T>>
                        }
                    </ListboxOptions>
                </div>
            );
        };
    },
    {
        name: "ListboxComposite",
        slots: Object as SlotsType<ListboxCompositeSlots<any>>,
        props: declareProps<ListboxCompositeProps<unknown>>({
            id: null,
            ariaLabel: null,
            isDisabled: Boolean,
            orientation: null,
            isMultiple: Boolean,
            hasMoreOptions: Boolean,
            onReachEnd: null,
            computeEstimatedOptionHeight: null,
            computeEstimatedGroupHeight: null,
            floaterTransitionDurationMs: null,
            options: null,
            selectedOptions: null,
            computeIsSelected: null,
            computeCustomText: null,
            onPick: null,
        }),
    },
);

export const Listbox = defineComponent(
    <T,>(props: ListboxProps<T>, { slots }: SlotsContext<ListboxSlots<T>>) => {
        const value = useTwoWay(props, "value");

        const selectedOptions = computed(() => {
            const selectedOption = SelectUtils.getFlatOptions(props.options).find(
                (option) => option.value === value.value,
            );

            return selectedOption ? [selectedOption] : EMPTY_SELECTION;
        });

        return () => (
            <ListboxComposite
                {...forwardProps(props, ListboxComposite)}
                options={props.options}
                ariaLabel={props.ariaLabel}
                selectedOptions={selectedOptions.value}
                computeIsSelected={(candidate: T) => candidate === value.value}
                onPick={(picked: T) => {
                    if (picked === value.value) return;

                    value.value = picked;

                    props.onSelectionChange?.(picked);
                }}
            >
                {
                    {
                        renderOption: slots.renderOption,
                        renderGroup: slots.renderGroup,
                        renderSelectionFloater: slots.renderSelectionFloater,
                        renderHighlightFloater: slots.renderHighlightFloater,
                    } satisfies Partial<ListboxCompositeSlots<T>>
                }
            </ListboxComposite>
        );
    },
    {
        name: "Listbox",
        slots: Object as SlotsType<ListboxSlots<any>>,
        props: declareProps<ListboxProps<unknown>>({
            "id": null,
            "ariaLabel": null,
            "isDisabled": Boolean,
            "orientation": null,
            "hasMoreOptions": Boolean,
            "onReachEnd": null,
            "computeEstimatedOptionHeight": null,
            "computeEstimatedGroupHeight": null,
            "floaterTransitionDurationMs": null,
            "options": null,
            "computeCustomText": null,
            "value": null,
            "onUpdate:value": null,
            "onSelectionChange": null,
        }),
    },
);

import { type SlotsType, type VNodeChild, computed, defineComponent, shallowRef, useId } from "vue";

import {
    CLOCK_DEFAULTS,
    type ClockColumn,
    type ClockRenderProps,
    type ClockSteps,
    ClockStyles,
    type ClockUnit,
    ClockUtils,
    PopoverUtils,
} from "@thewaver/ss-components";
import type { TimeValue } from "@thewaver/ss-utils";

import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ClockOptionProps, ClockProps, ClockSlots } from "./Clock.types";

const NO_CLOCK_STEPS: ClockSteps = {};

const toOptionKey = (unit: ClockUnit, index: number) => `${unit}:${index}`;

const ClockOptionControl = defineComponent(
    (props: ClockOptionProps, { slots }: SlotsContext<InteractionControlSlots<ClockRenderProps>>) =>
        () => {
            const isDisabled = props.flags.isDisabled ?? false;

            return (
                <div
                    id={props.id}
                    class={ClockStyles.clockOption}
                    role="option"
                    aria-label={props.ariaLabel}
                    aria-selected={props.flags.isSelected}
                    aria-current={props.flags.isNow ? "time" : undefined}
                    aria-disabled={isDisabled || undefined}
                    onClick={() => {
                        if (isDisabled) return;

                        props.onSelect();
                    }}
                >
                    {callSlot(slots.renderContent, props.flags)}
                </div>
            );
        },
    {
        name: "ClockOptionControl",
        slots: Object as SlotsType<InteractionControlSlots<ClockRenderProps>>,
        props: declareProps<ClockOptionProps>({
            id: null,
            flags: null,
            ariaLabel: null,
            onSelect: null,
        }),
    },
);

export const Clock = defineComponent(
    (props: ClockProps, { slots }: SlotsContext<ClockSlots>) => {
        const value = useTwoWay(props, "value");

        const groupId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const optionRefs = new Map<string, HTMLElement>();
        const columnRenderers = new Map<ClockUnit, () => VNodeChild>();
        const highlighted = shallowRef<TimeValue>();
        const highlightedUnit = shallowRef<ClockUnit>();
        const fallbackNow = ClockUtils.fromDate(new Date());

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const getIsTwelveHour = () => props.isTwelveHour ?? false;
        const getNow = () => props.now ?? fallbackNow;

        const meridiemNames = computed(() => ClockUtils.getMeridiemNames(props.locale));

        const base = computed(() =>
            ClockUtils.computeBase(value.value, getNow(), props.hasSeconds ?? false, props.minValue, props.maxValue),
        );
        const units = computed(() => ClockUtils.getUnits(props.hasSeconds ?? false, getIsTwelveHour()));
        const columns = computed(() =>
            ClockUtils.getColumns(
                units.value,
                base.value,
                getIsTwelveHour(),
                props.steps ?? NO_CLOCK_STEPS,
                meridiemNames.value,
            ),
        );

        const rovingTime = computed(() => highlighted.value ?? base.value);
        const rovingUnit = computed(() => ClockUtils.resolveRovingUnit(highlightedUnit.value, units.value));

        const rovingKeys = computed(() =>
            columns.value.map((column) =>
                toOptionKey(column.unit, ClockUtils.getRovingIndex(column, rovingTime.value, getIsTwelveHour())),
            ),
        );
        const rovingKey = computed(() => rovingKeys.value[units.value.indexOf(rovingUnit.value)]);

        const getIsTimeDisabled = (time: TimeValue) =>
            ClockUtils.getIsTimeDisabled(time, {
                isDisabled: props.isDisabled,
                minValue: props.minValue,
                maxValue: props.maxValue,
                computeIsTimeDisabled: props.computeIsTimeDisabled,
            });

        const pick = (time: TimeValue, unit: ClockUnit) => {
            if (getIsTimeDisabled(time)) return;

            highlighted.value = time;
            highlightedUnit.value = unit;
            value.value = time;
        };

        watchAfterRender([value], ([next]) => {
            if (next) highlighted.value = next;
        });

        watchAfterRender([() => rovingKeys.value.join()], () => {
            const root = rootRef.value;

            rovingKeys.value.forEach((key) => {
                const element = optionRefs.get(key);

                if (element && root) PopoverUtils.revealWithin(element, root);
            });
        });

        watchAfterRender([rovingKey], ([key]) => {
            const element = optionRefs.get(key);
            const root = rootRef.value;

            if (!element || !root?.contains(document.activeElement) || root === document.activeElement) return;

            element.focus();
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            const action = ClockUtils.computeKeyAction(e.key, {
                columns: columns.value,
                rovingUnit: rovingUnit.value,
                rovingTime: rovingTime.value,
                isTwelveHour: getIsTwelveHour(),
                direction: direction.value,
            });

            if (!action) return;

            e.preventDefault();

            if (action.kind === "pick") pick(action.time, action.unit);
            else if (action.kind === "highlight") highlighted.value = action.time;
            else highlightedUnit.value = action.unit;
        };

        const renderOptions = (column: ClockColumn) =>
            column.options.map((option, optionIndex) => {
                const key = toOptionKey(column.unit, optionIndex);
                const isHighlighted = key === rovingKey.value;
                const isTwelveHour = getIsTwelveHour();

                return (
                    <InteractionWrapper
                        key={optionIndex}
                        ref={(target) => {
                            const element = toElement(target);

                            if (element) optionRefs.set(key, element);
                            else optionRefs.delete(key);
                        }}
                        sizing={"fill"}
                        isDisabled={getIsTimeDisabled(option.time)}
                        isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                        isTabbable={isHighlighted}
                        extraFlags={
                            {
                                option,
                                isSelected: ClockUtils.getIsAt(column, optionIndex, value.value, isTwelveHour),
                                isNow: ClockUtils.getIsAt(column, optionIndex, getNow(), isTwelveHour),
                                isHighlighted,
                            } satisfies ClockRenderProps
                        }
                    >
                        {
                            {
                                renderControl: ({ setElementRef, flags }) => (
                                    <ClockOptionControl
                                        ref={setElementRef}
                                        id={`${groupId}-${column.unit}-${optionIndex}`}
                                        flags={flags}
                                        ariaLabel={option.label}
                                        onSelect={() => pick(option.time, option.unit)}
                                    >
                                        {
                                            {
                                                renderContent: (optionFlags) =>
                                                    callSlot(slots.renderOption, { option, flags: optionFlags }),
                                            } satisfies InteractionControlSlots<ClockRenderProps>
                                        }
                                    </ClockOptionControl>
                                ),
                            } satisfies Partial<InteractionWrapperSlots<ClockRenderProps>>
                        }
                    </InteractionWrapper>
                );
            });

        const getColumnRenderer = (unit: ClockUnit) => {
            const known = columnRenderers.get(unit);

            if (known) return known;

            const renderer = () => {
                const column = columns.value.find((candidate) => candidate.unit === unit);

                return column ? renderOptions(column) : null;
            };

            columnRenderers.set(unit, renderer);

            return renderer;
        };

        return () => {
            const gap = `${props.gap ?? CLOCK_DEFAULTS.gap}px`;

            return (
                <div
                    ref={rootRef}
                    id={groupId}
                    class={ClockStyles.clockRoot}
                    style={{ gap }}
                    role="group"
                    aria-label={props.ariaLabel}
                    aria-disabled={props.isDisabled || undefined}
                    onKeydown={handleKeyDown}
                >
                    {columns.value.map((column) => {
                        const name = ClockUtils.getUnitName(column.unit, props.locale);

                        return (
                            <div key={column.unit} class={ClockStyles.clockColumn}>
                                <div class={ClockStyles.clockUnit} aria-hidden="true">
                                    {callSlot(slots.renderUnit, { name, unit: column.unit })}
                                </div>

                                <div
                                    class={ClockStyles.clockList}
                                    style={{ gap }}
                                    role="listbox"
                                    aria-label={name}
                                    aria-disabled={props.isDisabled || undefined}
                                >
                                    {slots.renderColumn
                                        ? callSlot(slots.renderColumn, {
                                              renderOptions: getColumnRenderer(column.unit),
                                              unit: column.unit,
                                          })
                                        : renderOptions(column)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        };
    },
    {
        name: "Clock",
        slots: Object as SlotsType<ClockSlots>,
        props: declareProps<ClockProps>({
            "ariaLabel": null,
            "locale": null,
            "now": null,
            "minValue": null,
            "maxValue": null,
            "steps": null,
            "hasSeconds": Boolean,
            "isTwelveHour": Boolean,
            "isDisabled": Boolean,
            "gap": null,
            "computeIsTimeDisabled": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);

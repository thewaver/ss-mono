import { type SlotsType, computed, defineComponent, shallowRef, useId } from "vue";

import {
    CALENDAR_DEFAULTS,
    type CalendarRenderProps,
    CalendarStyles,
    CalendarUtils,
    type DateValue,
    DateValueUtils,
    LiveAnnouncerUtils,
} from "@thewaver/ss-components";

import { NavigatorVueUtils } from "../../../Abstracts/Navigator/NavigatorVue.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import type {
    InteractionControlSlots,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, forwardProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type {
    CalendarCompositeProps,
    CalendarDayProps,
    CalendarProps,
    CalendarSlots,
} from "./Calendar.types";

const toCellId = (gridId: string, day: DateValue) => `${gridId}-day-${DateValueUtils.toIso(day)}`;

const CalendarDay = defineComponent(
    (props: CalendarDayProps, { slots }: SlotsContext<InteractionControlSlots<CalendarRenderProps>>) => () => {
        const isDisabled = props.flags.isDisabled ?? false;

        return (
            <div
                id={props.id}
                class={CalendarStyles.calendarDay}
                role="gridcell"
                aria-label={props.ariaLabel}
                aria-selected={props.flags.isSelected}
                aria-current={props.flags.isToday ? "date" : undefined}
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
        name: "CalendarDay",
        slots: Object as SlotsType<InteractionControlSlots<CalendarRenderProps>>,
        props: declareProps<CalendarDayProps>({
            id: null,
            flags: null,
            ariaLabel: null,
            onSelect: null,
        }),
    },
);

export const CalendarComposite = defineComponent(
    (props: CalendarCompositeProps, { slots }: SlotsContext<CalendarSlots>) => {
        const month = useTwoWay(props, "month");

        const gridId = useId();

        const rootRef = shallowRef<HTMLDivElement>();
        const highlighted = shallowRef<DateValue>();

        let previousPageStart: DateValue | undefined;

        const direction = NavigatorVueUtils.useDirection(rootRef);

        const getPrecision = () => props.precision ?? CALENDAR_DEFAULTS.precision;
        const getWeekStartsOn = () => props.weekStartsOn ?? CALENDAR_DEFAULTS.weekStartsOn;

        const pageStart = computed(() => CalendarUtils.getPageStart(month.value, getPrecision()));
        const today = computed(() => CalendarUtils.resolveToday(props.today, month.value));
        const cells = computed(() => CalendarUtils.getCells(month.value, getPrecision(), getWeekStartsOn()));
        const currentEraId = computed(() => CalendarUtils.getCurrentEraId(month.value, props.locale));

        const labelCell = computed(() =>
            CalendarUtils.createCellLabeler(cells.value[0], getPrecision(), currentEraId.value, props.locale),
        );

        const weekdayNames = computed(() =>
            DateValueUtils.getWeekdayNames(
                getWeekStartsOn(),
                props.weekdayWidth ?? CALENDAR_DEFAULTS.weekdayWidth,
                props.locale,
            ),
        );

        const rovingDay = computed(() =>
            CalendarUtils.computeRovingDay(cells.value, getPrecision(), {
                highlighted: highlighted.value,
                anchor: props.anchorDay,
                today: today.value,
                pageStart: pageStart.value,
            }),
        );

        const rovingCellId = computed(() => {
            const rovingIndex = CalendarUtils.findCellIndex(cells.value, rovingDay.value, getPrecision());
            const rovingCell = rovingIndex === undefined ? undefined : cells.value[rovingIndex];

            return rovingCell && toCellId(gridId, rovingCell);
        });

        const getIsDayDisabled = (day: DateValue) =>
            CalendarUtils.getIsCellDisabled(day, getPrecision(), {
                isDisabled: props.isDisabled,
                minValue: props.minValue,
                maxValue: props.maxValue,
                computeIsDayDisabled: props.computeIsDayDisabled,
            });

        const moveTo = (day: DateValue) => {
            const move = CalendarUtils.computeMove(
                day,
                getPrecision(),
                pageStart.value,
                props.minValue,
                props.maxValue,
            );

            highlighted.value = move.day;

            if (move.month) month.value = move.month;
        };

        const pickDay = (day: DateValue) => {
            if (getIsDayDisabled(day)) return;

            const picked = CalendarUtils.computePick(day, getPrecision(), props.minValue, props.maxValue);

            highlighted.value = picked;
            props.onPick(picked);
        };

        watchAfterRender([], () => LiveAnnouncerUtils.reserve("polite"));

        watchAfterRender([() => props.anchorDay], ([anchorDay]) => {
            if (anchorDay) highlighted.value = anchorDay;
        });

        watchAfterRender([pageStart], ([start]) => {
            const previous = previousPageStart;

            previousPageStart = start;

            if (!previous || DateValueUtils.isSame(previous, start)) return;

            LiveAnnouncerUtils.announce(
                CalendarUtils.formatPage(start, cells.value, getPrecision(), currentEraId.value, props.locale),
            );
        });

        watchAfterRender([rovingCellId], ([cellId]) => {
            const root = rootRef.value;

            if (!cellId || !root?.contains(document.activeElement) || root === document.activeElement) return;

            document.getElementById(cellId)?.focus();
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            const precision = getPrecision();

            const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
                roving: rovingDay.value,
                precision,
                cells: cells.value,
                shape: CalendarUtils.getGridShape(month.value, precision),
                direction: direction.value,
            });

            if (!action) return;

            e.preventDefault();

            if (action.kind === "pick") pickDay(action.day);
            else moveTo(action.day);
        };

        return () => {
            const precision = getPrecision();
            const shape = CalendarUtils.getGridShape(month.value, precision);
            const rows = CalendarUtils.getRows(cells.value, shape.colCount);
            const paintedRange = props.computeRange?.(rovingDay.value);
            const rowStyle = { gridColumn: `span ${shape.colCount}` };

            return (
                <div
                    ref={rootRef}
                    id={gridId}
                    class={CalendarStyles.calendarRoot}
                    style={{
                        gridTemplateColumns: `repeat(${shape.colCount}, 1fr)`,
                        gap: `${props.gap ?? CALENDAR_DEFAULTS.gap}px`,
                    }}
                    role="grid"
                    aria-label={props.ariaLabel}
                    aria-disabled={props.isDisabled || undefined}
                    onKeydown={handleKeyDown}
                >
                    {precision === "day" && (
                        <div class={CalendarStyles.calendarRow} style={rowStyle} role="row">
                            {weekdayNames.value.map((name, index) => (
                                <div
                                    key={index}
                                    class={CalendarStyles.calendarWeekday}
                                    role="columnheader"
                                    aria-label={name}
                                >
                                    {callSlot(slots.renderWeekday, { name, index })}
                                </div>
                            ))}
                        </div>
                    )}

                    {rows.map((row, rowIndex) => (
                        <div key={rowIndex} class={CalendarStyles.calendarRow} style={rowStyle} role="row">
                            {row.map((day, colIndex) => (
                                <InteractionWrapper
                                    key={colIndex}
                                    sizing={"fill"}
                                    isDisabled={getIsDayDisabled(day)}
                                    isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                                    isTabbable={CalendarUtils.getIsSameCell(day, rovingDay.value, precision)}
                                    extraFlags={CalendarUtils.computeCellFlags(day, {
                                        precision,
                                        month: month.value,
                                        roving: rovingDay.value,
                                        today: today.value,
                                        isSelected: props.computeIsSelected(day),
                                        range: paintedRange,
                                    })}
                                >
                                    {
                                        {
                                            renderControl: ({ setElementRef, flags }) => (
                                                <CalendarDay
                                                    ref={setElementRef}
                                                    id={toCellId(gridId, day)}
                                                    flags={flags}
                                                    ariaLabel={labelCell.value(day)}
                                                    onSelect={() => pickDay(day)}
                                                >
                                                    {
                                                        {
                                                            renderContent: (dayFlags) =>
                                                                callSlot(slots.renderDay, { day, flags: dayFlags }),
                                                        } satisfies InteractionControlSlots<CalendarRenderProps>
                                                    }
                                                </CalendarDay>
                                            ),
                                        } satisfies Partial<InteractionWrapperSlots<CalendarRenderProps>>
                                    }
                                </InteractionWrapper>
                            ))}
                        </div>
                    ))}
                </div>
            );
        };
    },
    {
        name: "CalendarComposite",
        slots: Object as SlotsType<CalendarSlots>,
        props: declareProps<CalendarCompositeProps>({
            "ariaLabel": null,
            "locale": null,
            "weekStartsOn": null,
            "weekdayWidth": null,
            "today": null,
            "minValue": null,
            "maxValue": null,
            "isDisabled": Boolean,
            "gap": null,
            "computeIsDayDisabled": null,
            "month": null,
            "onUpdate:month": null,
            "precision": null,
            "computeIsSelected": null,
            "anchorDay": null,
            "computeRange": null,
            "onPick": null,
        }),
    },
);

export const Calendar = defineComponent(
    (props: CalendarProps, { slots }: SlotsContext<CalendarSlots>) => {
        const value = useTwoWay(props, "value");
        const month = useTwoWay(props, "month");

        return () => {
            const precision = props.precision ?? CALENDAR_DEFAULTS.precision;

            return (
                <CalendarComposite
                    {...{
                        ...forwardProps(props, CalendarComposite),
                        "month": month.value,
                        "onUpdate:month": (next: DateValue) => {
                            month.value = next;
                        },
                    }}
                    computeIsSelected={(day: DateValue) => CalendarUtils.getIsSameCell(day, value.value, precision)}
                    anchorDay={value.value}
                    onPick={(day: DateValue) => {
                        value.value = day;
                    }}
                >
                    {
                        {
                            renderDay: slots.renderDay,
                            renderWeekday: slots.renderWeekday,
                        } satisfies Partial<CalendarSlots>
                    }
                </CalendarComposite>
            );
        };
    },
    {
        name: "Calendar",
        slots: Object as SlotsType<CalendarSlots>,
        props: declareProps<CalendarProps>({
            "ariaLabel": null,
            "locale": null,
            "weekStartsOn": null,
            "weekdayWidth": null,
            "today": null,
            "minValue": null,
            "maxValue": null,
            "isDisabled": Boolean,
            "gap": null,
            "computeIsDayDisabled": null,
            "month": null,
            "onUpdate:month": null,
            "precision": null,
            "value": null,
            "onUpdate:value": null,
        }),
    },
);

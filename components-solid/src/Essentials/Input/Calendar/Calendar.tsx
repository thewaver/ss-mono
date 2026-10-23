import { type Accessor, Index, Show, createEffect, createMemo, createSignal, createUniqueId, onMount } from "solid-js";

import {
    CALENDAR_DEFAULTS,
    type CalendarRenderProps,
    CalendarUtils,
    type DateValue,
    DateValueUtils,
    LiveAnnouncerUtils,
    CalendarStyles as styles,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { CalendarCompositeProps, CalendarDayProps, CalendarProps } from "./CalendarSolid.types";

const CalendarDay = (props: CalendarDayProps) => {
    const getIsDisabled = () => access(props.flags).isDisabled ?? false;

    return (
        <div
            id={access(props.id)}
            ref={(element) => props.ref?.(element)}
            class={styles.calendarDay}
            role="gridcell"
            aria-label={access(props.ariaLabel)}
            aria-selected={access(props.flags).isSelected}
            aria-current={access(props.flags).isToday ? "date" : undefined}
            aria-disabled={getIsDisabled() || undefined}
            onClick={() => {
                if (getIsDisabled()) return;

                props.onSelect();
            }}
        >
            {props.renderContent(() => access(props.flags))}
        </div>
    );
};

type CalendarPage = { start: DateValue; cells: DateValue[] };

export const CalendarComposite = (props: CalendarCompositeProps) => {
    CalendarUtils.warnIfMonthCountIgnored(access(props.precision), access(props.monthCount));

    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const monthSignal = accessSignal(() => props.month);

    const gridId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<DateValue | undefined>();

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getPrecision = createMemo(() => access(props.precision) ?? CALENDAR_DEFAULTS.precision);

    const getWeekStartsOn = createMemo(() => access(props.weekStartsOn) ?? CALENDAR_DEFAULTS.weekStartsOn);

    const getMonth = createMemo(() => monthSignal[0]());

    const getMonthCount = createMemo(() =>
        getPrecision() === "day" ? (access(props.monthCount) ?? CALENDAR_DEFAULTS.monthCount) : 1,
    );

    const getIsMultiMonth = createMemo(() => getMonthCount() > 1);

    const getPageStart = createMemo(() => CalendarUtils.getPageStart(getMonth(), getPrecision()));

    const getToday = createMemo(() => CalendarUtils.resolveToday(access(props.today), getMonth()));

    const getPages = createMemo<CalendarPage[]>(() =>
        getMonthCount() === 1
            ? [{ start: getPageStart(), cells: CalendarUtils.getCells(getMonth(), getPrecision(), getWeekStartsOn()) }]
            : CalendarUtils.getMonthStarts(getMonth(), getMonthCount()).map((start) => ({
                  start,
                  cells: CalendarUtils.getCells(start, getPrecision(), getWeekStartsOn()),
              })),
    );

    const getCells = createMemo(() =>
        getIsMultiMonth()
            ? getPages().flatMap((page) => CalendarUtils.getOwnDays(page.cells, page.start))
            : getPages()[0].cells,
    );

    const getShape = createMemo(() => CalendarUtils.getGridShape(getMonth(), getPrecision()));

    const getHasWeekNumbers = createMemo(() => getPrecision() === "day" && props.renderWeekNumber !== undefined);

    const getColumnCount = createMemo(() => getShape().colCount + (getHasWeekNumbers() ? 1 : 0));

    const getCurrentEraId = createMemo(() => CalendarUtils.getCurrentEraId(getMonth(), access(props.locale)));

    const getFirstCell = createMemo(() => getPages()[0].cells[0]);

    const getWeekFieldName = createMemo(() =>
        getHasWeekNumbers() ? CalendarUtils.getWeekFieldName(access(props.locale)) : "",
    );

    const getMinDaysInFirstWeek = createMemo(
        () => access(props.minDaysInFirstWeek) ?? CALENDAR_DEFAULTS.minDaysInFirstWeek,
    );

    const getCellLabeler = createMemo(() =>
        CalendarUtils.createCellLabeler(getFirstCell(), getPrecision(), getCurrentEraId(), access(props.locale)),
    );

    const computeMonthLabel = (page: CalendarPage) =>
        CalendarUtils.formatPage(page.start, page.cells, getPrecision(), getCurrentEraId(), access(props.locale));

    const computePageLabel = () => {
        const pages = getPages();

        return getIsMultiMonth()
            ? CalendarUtils.formatMonthSpan(
                  pages[0].start,
                  pages[pages.length - 1].start,
                  getCurrentEraId(),
                  access(props.locale),
              )
            : computeMonthLabel(pages[0]);
    };

    const getWeekdayNames = createMemo(() =>
        DateValueUtils.getWeekdayNames(
            getWeekStartsOn(),
            access(props.weekdayWidth) ?? CALENDAR_DEFAULTS.weekdayWidth,
            access(props.locale),
        ),
    );

    const getIsDayDisabled = (day: DateValue) =>
        CalendarUtils.getIsCellDisabled(day, getPrecision(), {
            isDisabled: access(props.isDisabled),
            minValue: access(props.minValue),
            maxValue: access(props.maxValue),
            disabledDays: access(props.disabledDays),
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const getRovingDay = createMemo(() =>
        CalendarUtils.computeRovingDay(getCells(), getPrecision(), {
            highlighted: getHighlighted(),
            anchor: props.computeAnchorDay?.(),
            today: getToday(),
            pageStart: getPageStart(),
        }),
    );

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(
            day,
            getPrecision(),
            getPageStart(),
            access(props.minValue),
            access(props.maxValue),
            getMonthCount(),
        );

        setHighlighted(() => move.day);

        if (move.month) monthSignal[1](() => move.month!);
    };

    const pickDay = (day: DateValue) => {
        if (getIsDayDisabled(day)) return;

        const picked = CalendarUtils.computePick(day, getPrecision(), access(props.minValue), access(props.maxValue));

        setHighlighted(() => picked);
        props.onPick(picked);
    };

    const getPaintedRange = createMemo(() => props.computeRange?.(getRovingDay()));

    createEffect(() => {
        const anchor = props.computeAnchorDay?.();

        if (!anchor) return;

        setHighlighted(() => anchor);
    });

    createEffect<DateValue | undefined>((previous) => {
        const pageStart = getPageStart();

        if (previous && !DateValueUtils.isSame(previous, pageStart)) LiveAnnouncerUtils.announce(computePageLabel());

        return pageStart;
    });

    createEffect(() => {
        const cell = getCells()[CalendarUtils.findCellIndex(getCells(), getRovingDay(), getPrecision()) ?? -1];
        const root = getRootRef();

        if (!cell || !root?.contains(document.activeElement) || root === document.activeElement) return;

        document.getElementById(`${gridId}-day-${DateValueUtils.toIso(cell)}`)?.focus();
    });

    const getRovingPage = () =>
        getPages().find((page) => CalendarUtils.getIsSameCell(page.start, getRovingDay(), "month")) ?? getPages()[0];

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: getRovingDay(),
            precision: getPrecision(),
            cells: getIsMultiMonth() ? getRovingPage().cells : getCells(),
            shape: getShape(),
            direction: getDirection(),
            monthCount: getMonthCount(),
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    const getIsOwnDay = (page: CalendarPage, day: DateValue) =>
        !getIsMultiMonth() || CalendarUtils.getIsSameCell(page.start, day, "month");

    const renderDay = (getPage: Accessor<CalendarPage>, getDay: Accessor<DateValue>) => (
        <Show when={getIsOwnDay(getPage(), getDay())} fallback={<div role="gridcell" />}>
            <InteractionWrapper
                sizing={"fill"}
                isDisabled={() => getIsDayDisabled(getDay())}
                isFocusableWhenDisabled={() => !(access(props.isDisabled) ?? false)}
                isTabbable={() => CalendarUtils.getIsSameCell(getDay(), getRovingDay(), getPrecision())}
                extraFlags={(): CalendarRenderProps =>
                    CalendarUtils.computeCellFlags(getDay(), {
                        precision: getPrecision(),
                        month: getPage().start,
                        roving: getRovingDay(),
                        today: getToday(),
                        isSelected: props.computeIsSelected(getDay()),
                        range: getPaintedRange(),
                    })
                }
                renderControl={(setElementRef, getRenderProps) => (
                    <CalendarDay
                        ref={setElementRef}
                        id={() => `${gridId}-day-${DateValueUtils.toIso(getDay())}`}
                        flags={getRenderProps}
                        ariaLabel={() => getCellLabeler()(getDay())}
                        renderContent={(getDayFlags) => props.renderDay(getDay, getDayFlags)}
                        onSelect={() => pickDay(getDay())}
                    />
                )}
            />
        </Show>
    );

    const renderWeekNumber = (getRow: Accessor<DateValue[]>) => {
        const getWeekNumber = () =>
            DateValueUtils.getWeekNumber(getRow()[0], getWeekStartsOn(), getMinDaysInFirstWeek());

        return (
            <div
                class={styles.calendarWeekNumber}
                role="rowheader"
                aria-label={CalendarUtils.formatWeekLabel(getWeekFieldName(), getWeekNumber())}
            >
                {props.renderWeekNumber?.(getWeekNumber())}
            </div>
        );
    };

    const renderRows = (getPage: Accessor<CalendarPage>) => (
        <>
            <Show when={getPrecision() === "day"}>
                <div class={styles.calendarRow} style={{ "grid-column": `span ${getColumnCount()}` }} role="row">
                    <Show when={getHasWeekNumbers()}>
                        <div class={styles.calendarWeekNumber} role="columnheader" aria-label={getWeekFieldName()} />
                    </Show>

                    <Index each={getWeekdayNames()}>
                        {(getName, index) => (
                            <div class={styles.calendarWeekday} role="columnheader" aria-label={getName()}>
                                {props.renderWeekday?.(getName(), index)}
                            </div>
                        )}
                    </Index>
                </div>
            </Show>

            <Index each={CalendarUtils.getRows(getPage().cells, getShape().colCount)}>
                {(getRow) => (
                    <div class={styles.calendarRow} style={{ "grid-column": `span ${getColumnCount()}` }} role="row">
                        <Show when={getHasWeekNumbers()}>{renderWeekNumber(getRow)}</Show>

                        <Index each={getRow()}>{(getDay) => renderDay(getPage, getDay)}</Index>
                    </div>
                )}
            </Index>
        </>
    );

    const getGridStyle = () => ({
        "grid-template-columns": getHasWeekNumbers()
            ? `auto repeat(${getShape().colCount}, 1fr)`
            : `repeat(${getShape().colCount}, 1fr)`,
        "gap": `${access(props.gap) ?? CALENDAR_DEFAULTS.gap}px`,
    });

    return (
        <Show
            when={getIsMultiMonth()}
            fallback={
                <div
                    ref={setRootRef}
                    id={gridId}
                    class={styles.calendarRoot}
                    style={getGridStyle()}
                    role="grid"
                    aria-label={access(props.ariaLabel)}
                    aria-disabled={access(props.isDisabled) || undefined}
                    onKeyDown={handleKeyDown}
                >
                    {renderRows(() => getPages()[0])}
                </div>
            }
        >
            <div
                ref={setRootRef}
                id={gridId}
                class={styles.calendarMonths}
                style={{ gap: `${access(props.monthGap) ?? CALENDAR_DEFAULTS.monthGap}px` }}
                role="group"
                aria-label={access(props.ariaLabel)}
                aria-disabled={access(props.isDisabled) || undefined}
                onKeyDown={handleKeyDown}
            >
                <Index each={getPages()}>
                    {(getPage, index) => (
                        <div class={styles.calendarMonth}>
                            {props.renderMonthHeader?.(() => getPage().start, index)}

                            <div
                                class={styles.calendarRoot}
                                style={getGridStyle()}
                                role="grid"
                                aria-label={computeMonthLabel(getPage())}
                            >
                                {renderRows(getPage)}
                            </div>
                        </div>
                    )}
                </Index>
            </div>
        </Show>
    );
};

export const Calendar = (props: CalendarProps) => {
    const valueSignal = accessSignal(() => props.value);

    const getPrecision = () => access(props.precision) ?? CALENDAR_DEFAULTS.precision;

    return (
        <CalendarComposite
            {...props}
            computeIsSelected={(day) => CalendarUtils.getIsSameCell(day, valueSignal[0](), getPrecision())}
            computeAnchorDay={() => valueSignal[0]()}
            onPick={(day) => valueSignal[1](() => day)}
        />
    );
};

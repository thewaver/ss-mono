import { Index, Show, createEffect, createMemo, createSignal, createUniqueId, onMount } from "solid-js";

import type { DateValue } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { LiveAnnouncerUtils } from "../../../Abstracts/LiveAnnouncer/LiveAnnouncer.utils";
import { NavigatorUtils } from "../../../Abstracts/Navigator/Navigator.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { access, accessSignal } from "../../../Utils/propUtils";
import { CALENDAR_DEFAULTS } from "./Calendar.const";
import type {
    CalendarCompositeProps,
    CalendarDayProps,
    CalendarPrecision,
    CalendarProps,
    CalendarRenderProps,
} from "./Calendar.types";
import { CalendarUtils } from "./Calendar.utils";

import * as styles from "./Calendar.css";

const PAGE_STEP = 1;
const LEAP_STEP = 1;

const CELL_LABEL_OPTIONS: Record<CalendarPrecision, Intl.DateTimeFormatOptions> = {
    day: { day: "numeric", month: "long", year: "numeric" },
    month: { month: "long", year: "numeric" },
    year: { year: "numeric" },
};
const PAGE_ANNOUNCE_OPTIONS: Record<CalendarPrecision, Intl.DateTimeFormatOptions> = {
    day: { month: "long", year: "numeric" },
    month: { year: "numeric" },
    year: { year: "numeric" },
};

const withEra = (options: Intl.DateTimeFormatOptions): Intl.DateTimeFormatOptions => ({ ...options, era: "short" });

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

export const CalendarComposite = (props: CalendarCompositeProps) => {
    onMount(() => LiveAnnouncerUtils.reserve("polite"));

    const monthSignal = accessSignal(() => props.monthSignal);

    const gridId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getHighlighted, setHighlighted] = createSignal<DateValue | undefined>();

    const getDirection = NavigatorUtils.createDirectionSignal(getRootRef);

    const getPrecision = createMemo(() => access(props.precision) ?? CALENDAR_DEFAULTS.precision);

    const getWeekStartsOn = createMemo(() => access(props.weekStartsOn) ?? CALENDAR_DEFAULTS.weekStartsOn);

    const getMonth = createMemo(() => monthSignal[0]());

    const getPageStart = createMemo(() => CalendarUtils.getPageStart(getMonth(), getPrecision()));

    const getToday = createMemo(() =>
        DateValueUtils.withCalendar(
            access(props.today) ?? DateValueUtils.fromDate(new Date()),
            DateValueUtils.getCalendarId(getMonth()),
        ),
    );

    const getCells = createMemo(() => CalendarUtils.getCells(getMonth(), getPrecision(), getWeekStartsOn()));

    const getShape = createMemo(() => CalendarUtils.getGridShape(getMonth(), getPrecision()));

    const getRows = createMemo(() => {
        const cells = getCells();
        const colCount = getShape().colCount;

        return Array.from({ length: Math.ceil(cells.length / colCount) }, (_, row) =>
            cells.slice(row * colCount, (row + 1) * colCount),
        );
    });

    const getCurrentEraId = createMemo(() => {
        const eras = DateValueUtils.getEras(getMonth(), access(props.locale));

        return eras[eras.length - 1].id;
    });

    const getFirstCell = createMemo(() => getCells()[0]);

    const getCellLabelFormatters = createMemo(() => {
        const first = getFirstCell();
        const options = CELL_LABEL_OPTIONS[getPrecision()];
        const locale = access(props.locale);

        return {
            currentEra: DateValueUtils.createFormatter(first, options, locale),
            pastEra: DateValueUtils.createFormatter(first, withEra(options), locale),
        };
    });

    const computeCellLabel = (cell: DateValue) =>
        getCellLabelFormatters()[cell.era === getCurrentEraId() ? "currentEra" : "pastEra"](cell);

    const computePageLabel = () => {
        const precision = getPrecision();
        const start = getPageStart();
        const locale = access(props.locale);
        const baseOptions = PAGE_ANNOUNCE_OPTIONS[precision];
        const options = start.era === getCurrentEraId() ? baseOptions : withEra(baseOptions);

        if (precision !== "year") return DateValueUtils.format(start, options, locale);

        const cells = getCells();

        return CalendarUtils.formatSpan(cells[0], cells[cells.length - 1], options, locale);
    };

    const getWeekdayNames = createMemo(() =>
        DateValueUtils.getWeekdayNames(
            getWeekStartsOn(),
            access(props.weekdayWidth) ?? CALENDAR_DEFAULTS.weekdayWidth,
            access(props.locale),
        ),
    );

    const computeCellIndex = (value: DateValue | undefined) => {
        const index = getCells().findIndex((cell) => CalendarUtils.getIsSameCell(cell, value, getPrecision()));

        return index < 0 ? undefined : index;
    };

    const getIsDayDisabled = (day: DateValue) =>
        (access(props.isDisabled) ?? false) ||
        !CalendarUtils.getIsCellInBounds(day, getPrecision(), access(props.minValue), access(props.maxValue)) ||
        (props.computeIsDayDisabled?.(day) ?? false);

    const getRovingDay = createMemo(() => {
        const highlighted = getHighlighted();

        if (highlighted && computeCellIndex(highlighted) !== undefined) return highlighted;

        const anchor = props.computeAnchorDay?.();

        if (anchor && computeCellIndex(anchor) !== undefined) return anchor;

        const today = getToday();

        if (computeCellIndex(today) !== undefined) return today;

        return getPageStart();
    });

    const clampToBounds = (day: DateValue) => DateValueUtils.clamp(day, access(props.minValue), access(props.maxValue));

    const moveTo = (day: DateValue) => {
        const clamped = clampToBounds(day);

        setHighlighted(() => clamped);

        if (!DateValueUtils.isSame(CalendarUtils.getPageStart(clamped, getPrecision()), getPageStart())) {
            monthSignal[1](() => DateValueUtils.getStartOfMonth(clamped));
        }
    };

    const pickDay = (day: DateValue) => {
        if (getIsDayDisabled(day)) return;

        const picked = clampToBounds(CalendarUtils.getCellStart(day, getPrecision()));

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
        const cell = getCells()[computeCellIndex(getRovingDay()) ?? -1];
        const root = getRootRef();

        if (!cell || !root?.contains(document.activeElement) || root === document.activeElement) return;

        document.getElementById(`${gridId}-day-${DateValueUtils.toIso(cell)}`)?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const roving = getRovingDay();
        const precision = getPrecision();

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            pickDay(roving);

            return;
        }

        if (e.key === "PageUp" || e.key === "PageDown") {
            const direction = e.key === "PageUp" ? -1 : 1;

            e.preventDefault();
            moveTo(
                e.shiftKey
                    ? CalendarUtils.stepLeap(roving, precision, direction * LEAP_STEP)
                    : CalendarUtils.stepPage(roving, precision, direction * PAGE_STEP),
            );

            return;
        }

        const index = computeCellIndex(roving);

        if (index === undefined) return;

        const shape = getShape();
        const from = { row: Math.floor(index / shape.colCount), col: index % shape.colCount };
        const next = NavigatorUtils.computeNextCell(e.key, from, shape, {
            direction: getDirection(),
            hasPageKeys: false,
        });

        if (!next) return;

        e.preventDefault();

        const flat = next.row * shape.colCount + next.col;
        const lastIndex = getCells().length - 1;

        moveTo(
            CalendarUtils.getCellAt(
                getFirstCell(),
                next.row === from.row ? Math.min(flat, lastIndex) : flat,
                precision,
            ),
        );
    };

    return (
        <div
            ref={setRootRef}
            id={gridId}
            class={styles.calendarRoot}
            style={{
                "grid-template-columns": `repeat(${getShape().colCount}, 1fr)`,
                "gap": `${access(props.gap) ?? CALENDAR_DEFAULTS.gap}px`,
            }}
            role="grid"
            aria-label={access(props.ariaLabel)}
            aria-disabled={access(props.isDisabled) || undefined}
            onKeyDown={handleKeyDown}
        >
            <Show when={getPrecision() === "day"}>
                <div class={styles.calendarRow} style={{ "grid-column": `span ${getShape().colCount}` }} role="row">
                    <Index each={getWeekdayNames()}>
                        {(getName, index) => (
                            <div class={styles.calendarWeekday} role="columnheader" aria-label={getName()}>
                                {props.renderWeekday?.(getName(), index)}
                            </div>
                        )}
                    </Index>
                </div>
            </Show>

            <Index each={getRows()}>
                {(getRow) => (
                    <div class={styles.calendarRow} style={{ "grid-column": `span ${getShape().colCount}` }} role="row">
                        <Index each={getRow()}>
                            {(getDay) => (
                                <InteractionWrapper
                                    sizing={"fill"}
                                    isDisabled={() => getIsDayDisabled(getDay())}
                                    isFocusableWhenDisabled={() => !(access(props.isDisabled) ?? false)}
                                    isTabbable={() =>
                                        CalendarUtils.getIsSameCell(getDay(), getRovingDay(), getPrecision())
                                    }
                                    extraFlags={(): CalendarRenderProps => ({
                                        day: getDay(),
                                        isSelected: props.computeIsSelected(getDay()),
                                        isToday: CalendarUtils.getIsSameCell(getDay(), getToday(), getPrecision()),
                                        isOutsideMonth: getPrecision() === "day" && getDay().month !== getMonth().month,
                                        isHighlighted: CalendarUtils.getIsSameCell(
                                            getDay(),
                                            getRovingDay(),
                                            getPrecision(),
                                        ),
                                        isInRange: DateValueUtils.getIsWithin(getDay(), getPaintedRange()),
                                        isRangeStart: DateValueUtils.isSame(getDay(), getPaintedRange()?.start),
                                        isRangeEnd: DateValueUtils.isSame(getDay(), getPaintedRange()?.end),
                                    })}
                                    renderControl={(setElementRef, getRenderProps) => (
                                        <CalendarDay
                                            ref={setElementRef}
                                            id={() => `${gridId}-day-${DateValueUtils.toIso(getDay())}`}
                                            flags={getRenderProps}
                                            ariaLabel={() => computeCellLabel(getDay())}
                                            renderContent={(getDayFlags) => props.renderDay(getDay, getDayFlags)}
                                            onSelect={() => pickDay(getDay())}
                                        />
                                    )}
                                />
                            )}
                        </Index>
                    </div>
                )}
            </Index>
        </div>
    );
};

export const Calendar = (props: CalendarProps) => {
    const valueSignal = accessSignal(() => props.valueSignal);

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

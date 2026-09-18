import type { JSX, Signal } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { DateValue, DateValueRange, DateValueWeekStart } from "../../../Abstracts/DateValue/DateValue.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type { CalendarDayRenderer, CalendarWeekdayRenderer } from "../Calendar/Calendar.types";
import type { DateInputProps } from "../DateInput/DateInput.types";

export type DateRangePickerProps = Omit<DateInputProps, "renderTrailing" | "valueSignal" | "ariaLabel"> &
    AccessorProps<{
        /** Where the calendar sits against the fields. */
        placement?: AnchorPlacement;
        /** How far the calendar is held clear of the fields. */
        offset?: Point2d;
        /** How long the calendar takes to fade in and out. */
        popupTransitionDurationMs?: number;
        /** Names the calendar for assistive technology. */
        calendarLabel?: string;
        /** Names the start field for assistive technology. */
        startLabel?: string;
        /** Names the end field for assistive technology. */
        endLabel?: string;
        locale?: string;
        /** Which day begins a week, which decides the order of the column headings. */
        weekStartsOn?: DateValueWeekStart;
        /** Whether one day can be picked, for rules a plain earliest and latest cannot express. */
        computeIsDayDisabled?: (day: DateValue) => boolean;
        /** The picked range. It is the only thing that picks one. */
        valueSignal: SignalSource<DateValueRange | undefined>;
        /** Whether the calendar is open. It is the only thing that opens or closes it. */
        visibilitySignal?: SignalSource<boolean>;
        /** Draws the control that opens the calendar. */
        renderTrigger: (getIsOpen: () => boolean, onToggle: () => void) => JSX.Element;
        /** Draws whatever sits between the two fields. */
        renderSeparator?: () => JSX.Element;
        /** Draws one day cell. */
        renderDay: CalendarDayRenderer;
        /** Draws one weekday heading. */
        renderWeekday?: CalendarWeekdayRenderer;
        /**
         * Draws the surface the calendar sits on. The calendar is handed in rather than built, so the consumer decides
         * what surrounds it.
         */
        renderPopup: (
            renderCalendar: () => JSX.Element,
            monthSignal: Signal<DateValue>,
            getVisibilityTarget: () => 0 | 1,
            getTransitionDurationMs: () => number,
        ) => JSX.Element;
    }>;

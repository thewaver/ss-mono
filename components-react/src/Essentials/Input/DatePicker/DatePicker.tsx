import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
    DATE_INPUT_DEFAULTS,
    DATE_PICKER_DEFAULTS,
    type DateValue,
    type DateValueCalendarId,
    DateValueUtils,
    type PopupTriggerFlags,
} from "@thewaver/ss-components";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { Calendar } from "../Calendar/Calendar";
import { DateInput } from "../DateInput/DateInput";
import type { DatePickerProps } from "./DatePicker.types";

const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
    DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

export const DatePicker = (props: DatePickerProps) => {
    const [value] = props.value;

    const popupId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const isFocusReturnedRef = useRef(false);
    const [root, setRoot] = useState<HTMLDivElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const calendar = props.calendar ?? DATE_INPUT_DEFAULTS.calendar;
    const calendarRef = useRef(calendar);

    const monthState = useState(() => toMonth(value ?? DateValueUtils.fromDate(new Date()), calendar));
    const [, setMonth] = monthState;

    const isLocked = (props.isDisabled ?? false) || (props.isReadOnly ?? false);

    const setRootRef = useCallback((element: HTMLDivElement | null) => {
        rootRef.current = element;
        setRoot(element ?? undefined);
    }, []);

    const dismiss = () => {
        if (!isOpen) return;

        isFocusReturnedRef.current = true;
        setIsOpen(false);
    };

    const open = () => {
        if (isLocked) return;

        setIsOpen(true);
    };

    useEffect(() => {
        if (isOpen && isLocked) setIsOpen(false);
    }, [isOpen, isLocked]);

    useLayoutEffect(() => {
        if (isOpen && value) setMonth(toMonth(value, calendar));
    }, [isOpen]);

    useLayoutEffect(() => {
        if (calendarRef.current === calendar) return;

        calendarRef.current = calendar;
        setMonth((month) => toMonth(month, calendar));
    }, [calendar]);

    useEffect(() => {
        if (isOpen || !isFocusReturnedRef.current) return;

        isFocusReturnedRef.current = false;
        rootRef.current?.querySelector("input")?.focus();
    }, [isOpen]);

    const renderCalendar = () => (
        <Calendar
            value={props.value}
            month={monthState}
            minValue={props.minValue}
            maxValue={props.maxValue}
            isDisabled={props.isDisabled}
            locale={props.locale}
            weekStartsOn={props.weekStartsOn}
            precision={props.precision}
            ariaLabel={props.calendarLabel}
            disabledDays={props.disabledDays}
            computeIsDayDisabled={props.computeIsDayDisabled}
            renderDay={props.renderDay}
            renderWeekday={props.renderWeekday}
        />
    );

    return (
        <div ref={setRootRef}>
            <DateInput
                {...props}
                renderTrailing={() => (
                    <InteractionWrapper<PopupTriggerFlags>
                        isDisabled={isLocked}
                        extraFlags={{ isOpen }}
                        renderControl={(setElementRef, flags) => (
                            <PopupTrigger
                                ref={setElementRef}
                                id={props.triggerId}
                                popupId={popupId}
                                isOpen={isOpen}
                                ariaLabel={props.triggerAriaLabel}
                                flags={flags}
                                renderContent={props.renderTrigger}
                                onToggle={() => (isOpen ? dismiss() : open())}
                            />
                        )}
                    />
                )}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": props.calendarLabel }}
                isOpen={isOpen}
                anchorRef={root}
                placement={props.placement ?? DATE_PICKER_DEFAULTS.placement[direction]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(visibilityTarget, transitionDurationMs) =>
                    props.renderPopup(renderCalendar, monthState, visibilityTarget, transitionDurationMs)
                }
            />
        </div>
    );
};

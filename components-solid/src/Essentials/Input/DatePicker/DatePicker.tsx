import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, on, untrack } from "solid-js";

import {
    DATE_INPUT_DEFAULTS,
    DATE_PICKER_DEFAULTS,
    type DateValue,
    type DateValueCalendarId,
    DateValueUtils,
    type PopupTriggerFlags,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { access } from "../../../Utils/propUtils";
import { Calendar } from "../Calendar/Calendar";
import { DateInput } from "../DateInput/DateInput";
import type { DatePickerProps } from "./DatePickerSolid.types";

const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
    DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

export const DatePicker = (props: DatePickerProps) => {
    const popupId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getCalendar = createMemo(() => access(props.calendar) ?? DATE_INPUT_DEFAULTS.calendar);

    const monthSignal: Signal<DateValue> = createSignal(
        toMonth(untrack(() => props.value[0]()) ?? DateValueUtils.fromDate(new Date()), untrack(getCalendar)),
    );

    const dismiss = () => {
        if (!getIsOpen()) return;

        setIsOpen(false);
        getRootRef()?.querySelector("input")?.focus();
    };

    const getIsLocked = createMemo(() => (access(props.isDisabled) ?? false) || (access(props.isReadOnly) ?? false));

    const open = () => {
        if (getIsLocked()) return;

        setIsOpen(true);
    };

    createEffect(() => {
        const isOpen = getIsOpen();
        const isLocked = getIsLocked();

        if (!isOpen || !isLocked) return;

        setIsOpen(false);
    });

    createEffect(() => {
        if (!getIsOpen()) return;

        const value = untrack(() => props.value[0]());

        if (value) monthSignal[1](() => toMonth(value, untrack(getCalendar)));
    });

    createEffect(on(getCalendar, (calendar) => monthSignal[1]((month) => toMonth(month, calendar)), { defer: true }));

    const renderCalendar = () => (
        <Calendar
            value={props.value}
            month={monthSignal}
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
                        isDisabled={getIsLocked}
                        extraFlags={() => ({ isOpen: getIsOpen() })}
                        renderControl={(setElementRef, getRenderProps) => (
                            <PopupTrigger
                                ref={setElementRef}
                                id={props.triggerId}
                                popupId={() => popupId}
                                isOpen={getIsOpen}
                                ariaLabel={props.triggerAriaLabel}
                                flags={getRenderProps}
                                renderContent={props.renderTrigger}
                                onToggle={() => (getIsOpen() ? dismiss() : open())}
                            />
                        )}
                    />
                )}
            />

            <Popover
                id={() => popupId}
                role={"dialog"}
                ariaAttributes={() => ({
                    "aria-label": access(props.calendarLabel),
                })}
                isOpen={getIsOpen}
                anchorRef={getRootRef}
                placement={() => access(props.placement) ?? DATE_PICKER_DEFAULTS.placement[getDirection()]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) =>
                    props.renderPopup(renderCalendar, monthSignal, getVisibilityTarget, getTransitionDurationMs)
                }
            />
        </div>
    );
};

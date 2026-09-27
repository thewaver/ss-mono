import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { DATE_PICKER_DEFAULTS, type DateValue, DateValueUtils, type PopupTriggerFlags } from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { Calendar } from "../Calendar/Calendar";
import { DateInput } from "../DateInput/DateInput";
import type { DatePickerProps } from "./DatePicker.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DatePicker = (props: DatePickerProps) => {
    const [value] = props.valueState;

    const popupId = useId();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const isFocusReturnedRef = useRef(false);
    const [root, setRoot] = useState<HTMLDivElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibilityState, false);
    const monthState = useState(() => toMonth(value ?? DateValueUtils.fromDate(new Date())));
    const [, setMonth] = monthState;

    const isDisabled = props.isDisabled ?? false;

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
        if (isDisabled) return;

        setIsOpen(true);
    };

    useEffect(() => {
        if (isOpen && isDisabled) setIsOpen(false);
    }, [isOpen, isDisabled]);

    useLayoutEffect(() => {
        if (isOpen && value) setMonth(toMonth(value));
    }, [isOpen]);

    useEffect(() => {
        if (isOpen || !isFocusReturnedRef.current) return;

        isFocusReturnedRef.current = false;
        rootRef.current?.querySelector("input")?.focus();
    }, [isOpen]);

    const renderCalendar = () => (
        <Calendar
            valueState={props.valueState}
            monthState={monthState}
            minValue={props.minValue}
            maxValue={props.maxValue}
            isDisabled={props.isDisabled}
            locale={props.locale}
            weekStartsOn={props.weekStartsOn}
            precision={props.precision}
            ariaLabel={props.calendarLabel}
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
                        isDisabled={isDisabled}
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
                placement={props.placement ?? DATE_PICKER_DEFAULTS.placement}
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

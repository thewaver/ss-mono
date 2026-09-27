import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
    DATE_RANGE_PICKER_DEFAULTS,
    DateRangePickerStyles,
    DateRangePickerUtils,
    type DateValue,
    type DateValueRange,
    DateValueUtils,
    type PopupTriggerFlags,
} from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { DateInput } from "../DateInput/DateInput";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps } from "./DateRangePicker.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DateRangePicker = (props: DateRangePickerProps) => {
    const [range] = props.valueState;

    const popupId = useId();
    const fallbackFieldId = useId();

    const endFieldId = `${props.id ?? fallbackFieldId}-end`;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const isFocusReturnedRef = useRef(false);
    const [root, setRoot] = useState<HTMLDivElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibilityState, false);
    const monthState = useState(() => toMonth(range?.start ?? DateValueUtils.fromDate(new Date())));
    const [, setMonth] = monthState;

    const { firstState: startState, secondState: endState } = SignalMirrorReactUtils.useSplit<
        DateValueRange,
        DateValue,
        DateValue
    >(props.valueState, DateRangePickerUtils.SPLIT_DEFS);

    const isDisabled = props.isDisabled ?? false;

    const setRootRef = useCallback((element: HTMLDivElement | null) => {
        rootRef.current = element;
        setRoot(element ?? undefined);
    }, []);

    const open = () => {
        if (isDisabled) return;

        setIsOpen(true);
    };

    const dismiss = () => {
        if (!isOpen) return;

        isFocusReturnedRef.current = true;
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && isDisabled) setIsOpen(false);
    }, [isOpen, isDisabled]);

    useLayoutEffect(() => {
        if (isOpen && range?.start) setMonth(toMonth(range.start));
    }, [isOpen]);

    useEffect(() => {
        if (isOpen || !isFocusReturnedRef.current) return;

        isFocusReturnedRef.current = false;
        rootRef.current?.querySelector<HTMLInputElement>(`#${CSS.escape(endFieldId)}`)?.focus();
    }, [isOpen]);

    const renderCalendar = () => (
        <RangeCalendar
            valueState={props.valueState}
            monthState={monthState}
            minValue={props.minValue}
            maxValue={props.maxValue}
            isDisabled={props.isDisabled}
            locale={props.locale}
            weekStartsOn={props.weekStartsOn}
            ariaLabel={props.calendarLabel}
            computeIsDayDisabled={props.computeIsDayDisabled}
            renderDay={props.renderDay}
            renderWeekday={props.renderWeekday}
        />
    );

    return (
        <div ref={setRootRef} className={DateRangePickerStyles.dateRangePickerRoot}>
            <DateInput
                {...props}
                valueState={startState}
                id={props.id && `${props.id}-start`}
                name={props.name && `${props.name}-start`}
                ariaLabel={props.startLabel}
            />

            {props.renderSeparator?.()}

            <DateInput
                {...props}
                valueState={endState}
                id={endFieldId}
                name={props.name && `${props.name}-end`}
                ariaLabel={props.endLabel}
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
                placement={props.placement ?? DATE_RANGE_PICKER_DEFAULTS.placement}
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

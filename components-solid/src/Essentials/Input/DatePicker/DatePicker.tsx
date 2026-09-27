import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import { DATE_PICKER_DEFAULTS, type DateValue, DateValueUtils, type PopupTriggerFlags } from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { access } from "../../../Utils/propUtils";
import { Calendar } from "../Calendar/Calendar";
import { DateInput } from "../DateInput/DateInput";
import type { DatePickerProps } from "./DatePickerSolid.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DatePicker = (props: DatePickerProps) => {
    const popupId = createUniqueId();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibilitySignal, false);

    const monthSignal: Signal<DateValue> = createSignal(
        toMonth(untrack(() => props.valueSignal[0]()) ?? DateValueUtils.fromDate(new Date())),
    );

    const dismiss = () => {
        if (!getIsOpen()) return;

        setIsOpen(false);
        getRootRef()?.querySelector("input")?.focus();
    };

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const open = () => {
        if (getIsDisabled()) return;

        setIsOpen(true);
    };

    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    createEffect(() => {
        if (!getIsOpen()) return;

        const value = untrack(() => props.valueSignal[0]());

        if (value) monthSignal[1](() => toMonth(value));
    });

    const renderCalendar = () => (
        <Calendar
            valueSignal={props.valueSignal}
            monthSignal={monthSignal}
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
                        isDisabled={getIsDisabled}
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
                placement={() => access(props.placement) ?? DATE_PICKER_DEFAULTS.placement}
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

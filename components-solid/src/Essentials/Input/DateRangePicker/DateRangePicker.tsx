import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import {
    DATE_RANGE_PICKER_DEFAULTS,
    DateRangePickerUtils,
    type DateValue,
    type DateValueRange,
    DateValueUtils,
    type PopupTriggerFlags,
    DateRangePickerStyles as styles,
} from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { access, accessSignal } from "../../../Utils/propUtils";
import { DateInput } from "../DateInput/DateInput";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps } from "./DateRangePickerSolid.types";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DateRangePicker = (props: DateRangePickerProps) => {
    const valueSignal = accessSignal(() => props.value);

    const popupId = createUniqueId();
    const fallbackFieldId = createUniqueId();

    const getEndFieldId = () => `${access(props.id) ?? fallbackFieldId}-end`;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const { first: startSignal, second: endSignal } = SignalMirrorSolidUtils.createSplit<
        DateValueRange,
        DateValue,
        DateValue
    >(valueSignal, DateRangePickerUtils.SPLIT_DEFS);

    const monthSignal: Signal<DateValue> = createSignal(
        toMonth(untrack(() => valueSignal[0]()?.start) ?? DateValueUtils.fromDate(new Date())),
    );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const open = () => {
        if (getIsDisabled()) return;

        setIsOpen(true);
    };

    createEffect(() => {
        if (!getIsOpen() || !getIsDisabled()) return;

        setIsOpen(false);
    });

    const dismiss = () => {
        if (!getIsOpen()) return;

        setIsOpen(false);
        getRootRef()
            ?.querySelector<HTMLInputElement>(`#${CSS.escape(getEndFieldId())}`)
            ?.focus();
    };

    createEffect(() => {
        if (!getIsOpen()) return;

        const start = untrack(() => valueSignal[0]()?.start);

        if (start) monthSignal[1](() => toMonth(start));
    });

    const renderCalendar = () => (
        <RangeCalendar
            value={valueSignal}
            month={monthSignal}
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
        <div ref={setRootRef} class={styles.dateRangePickerRoot}>
            <DateInput
                {...props}
                value={startSignal}
                id={access(props.id) && `${access(props.id)}-start`}
                name={access(props.name) && `${access(props.name)}-start`}
                ariaLabel={props.startLabel}
            />

            {props.renderSeparator?.()}

            <DateInput
                {...props}
                value={endSignal}
                id={getEndFieldId}
                name={access(props.name) && `${access(props.name)}-end`}
                ariaLabel={props.endLabel}
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
                placement={() => access(props.placement) ?? DATE_RANGE_PICKER_DEFAULTS.placement}
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

import type { Signal } from "solid-js";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import type { AnchorPlacement } from "../../../Abstracts/Anchor/Anchor.types";
import type { DateValue, DateValueRange } from "../../../Abstracts/DateValue/DateValue.types";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { SignalMirrorUtils } from "../../../Abstracts/SignalMirror/SignalMirror.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import type { PopupTriggerFlags } from "../../../Primitives/PopupTrigger/PopupTrigger.types";
import { access, accessSignal } from "../../../Utils/propUtils";
import { DateInput } from "../DateInput/DateInput";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps } from "./DateRangePicker.types";

import * as styles from "./DateRangePicker.css";

const DEFAULT_DATE_RANGE_PICKER_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
const DEFAULT_DATE_RANGE_PICKER_TRIGGER_LABEL = "Open the calendar";
const DEFAULT_DATE_RANGE_PICKER_CALENDAR_LABEL = "Choose a date range";
const DEFAULT_DATE_RANGE_PICKER_START_LABEL = "Start date";
const DEFAULT_DATE_RANGE_PICKER_END_LABEL = "End date";

const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

export const DateRangePicker = (props: DateRangePickerProps) => {
    const valueSignal = accessSignal(() => props.valueSignal);

    const popupId = createUniqueId();
    const fallbackFieldId = createUniqueId();

    const getEndFieldId = () => `${access(props.id) ?? fallbackFieldId}-end`;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorUtils.createOptional(() => props.visibilitySignal, false);

    const { firstSignal: startSignal, secondSignal: endSignal } = SignalMirrorUtils.createSplit<
        DateValueRange,
        DateValue,
        DateValue
    >(valueSignal, {
        compose: (start, end) => DateValueUtils.orderRange(start, end),
        decompose: (range) => [range.start, range.end],
        getIsSame: DateValueUtils.isSameRange,
    });

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
            valueSignal={valueSignal}
            monthSignal={monthSignal}
            min={props.minDate}
            max={props.maxDate}
            isDisabled={props.isDisabled}
            locale={props.locale}
            weekStartsOn={props.weekStartsOn}
            ariaLabel={() => access(props.calendarLabel) ?? DEFAULT_DATE_RANGE_PICKER_CALENDAR_LABEL}
            computeIsDayDisabled={props.computeIsDayDisabled}
            renderDay={props.renderDay}
            renderWeekday={props.renderWeekday}
        />
    );

    return (
        <div ref={setRootRef} class={styles.dateRangePickerRoot}>
            <DateInput
                {...props}
                valueSignal={startSignal}
                id={access(props.id) && `${access(props.id)}-start`}
                name={access(props.name) && `${access(props.name)}-start`}
                ariaLabel={() => access(props.startLabel) ?? DEFAULT_DATE_RANGE_PICKER_START_LABEL}
            />

            {props.renderSeparator?.()}

            <DateInput
                {...props}
                valueSignal={endSignal}
                id={getEndFieldId}
                name={access(props.name) && `${access(props.name)}-end`}
                ariaLabel={() => access(props.endLabel) ?? DEFAULT_DATE_RANGE_PICKER_END_LABEL}
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
                                ariaLabel={() =>
                                    access(props.triggerAriaLabel) ?? DEFAULT_DATE_RANGE_PICKER_TRIGGER_LABEL
                                }
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
                    "aria-label": access(props.calendarLabel) ?? DEFAULT_DATE_RANGE_PICKER_CALENDAR_LABEL,
                })}
                isOpen={getIsOpen}
                anchorRef={getRootRef}
                placement={() => access(props.placement) ?? DEFAULT_DATE_RANGE_PICKER_PLACEMENT}
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

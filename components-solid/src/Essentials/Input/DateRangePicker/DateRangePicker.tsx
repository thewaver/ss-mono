import type { Signal } from "solid-js";
import { Show, createEffect, createMemo, createSignal, createUniqueId, on, splitProps, untrack } from "solid-js";

import {
    DATE_INPUT_DEFAULTS,
    DATE_RANGE_PICKER_DEFAULTS,
    DateRangePickerUtils,
    type DateValue,
    type DateValueCalendarId,
    type DateValueRange,
    DateValueUtils,
    type InteractionFlags,
    InteractionTrackerUtils,
    type PopupTriggerFlags,
    type TextFieldFlags,
    TextFieldUtils,
    DateRangePickerStyles as styles,
} from "@thewaver/ss-components";

import { NavigatorSolidUtils } from "../../../Abstracts/Navigator/NavigatorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { access, accessSignal } from "../../../Utils/propUtils";
import { Tooltip } from "../../Overlays/Tooltip/Tooltip";
import { DateInput } from "../DateInput/DateInput";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps } from "./DateRangePickerSolid.types";

const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
    DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

export const DateRangePicker = (props: DateRangePickerProps) => {
    const [, fieldProps] = splitProps(props, ["tooltipDefs"]);

    const valueSignal = accessSignal(() => props.value);

    const popupId = createUniqueId();
    const fallbackFieldId = createUniqueId();

    const getEndFieldId = () => `${access(props.id) ?? fallbackFieldId}-end`;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);

    const getDirection = NavigatorSolidUtils.createDirectionSignal(getRootRef);

    const getCalendar = createMemo(() => access(props.calendar) ?? DATE_INPUT_DEFAULTS.calendar);

    const { first: startSignal, second: endSignal } = SignalMirrorSolidUtils.createSplit<
        DateValueRange,
        DateValue,
        DateValue
    >(valueSignal, DateRangePickerUtils.SPLIT_DEFS);

    const monthSignal: Signal<DateValue> = createSignal(
        toMonth(untrack(() => valueSignal[0]()?.start) ?? DateValueUtils.fromDate(new Date()), untrack(getCalendar)),
    );

    const getIsDisabled = createMemo(() => access(props.isDisabled) ?? false);

    const getIsLocked = createMemo(() => getIsDisabled() || (access(props.isReadOnly) ?? false));

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

        if (start) monthSignal[1](() => toMonth(start, untrack(getCalendar)));
    });

    createEffect(on(getCalendar, (calendar) => monthSignal[1]((month) => toMonth(month, calendar)), { defer: true }));

    const [getStartFlags, setStartFlags] = createSignal<() => InteractionFlags<TextFieldFlags>>();
    const [getEndFlags, setEndFlags] = createSignal<() => InteractionFlags<TextFieldFlags>>();

    const getPairFlags = () =>
        TextFieldUtils.mergeFlags(
            [getStartFlags(), getEndFlags()].flatMap((getFlags) => (getFlags ? [getFlags()] : [])),
        );

    const getTooltipDefs = createMemo(() => {
        const defs = access(props.tooltipDefs);
        const isReachable = InteractionTrackerUtils.computeIsReachable(
            getIsDisabled(),
            access(props.isReachableWhenDisabled) ?? false,
        );

        return defs && (!getIsDisabled() || isReachable) ? defs : undefined;
    });

    const getLastTooltipDefs = createMemo<ReturnType<typeof getTooltipDefs>>(
        (previous) => getTooltipDefs() ?? previous,
    );

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
            disabledDays={props.disabledDays}
            computeIsDayDisabled={props.computeIsDayDisabled}
            renderDay={props.renderDay}
            renderWeekday={props.renderWeekday}
        />
    );

    return (
        <div ref={setRootRef} class={styles.dateRangePickerRoot}>
            <DateInput
                {...fieldProps}
                value={startSignal}
                id={access(props.id) === undefined ? undefined : `${access(props.id)}-start`}
                name={access(props.name) === undefined ? undefined : `${access(props.name)}-start`}
                ariaLabel={props.startLabel}
                renderContent={(getFlags) => {
                    setStartFlags(() => getFlags);

                    return props.renderContent(getFlags);
                }}
            />

            {props.renderSeparator?.()}

            <DateInput
                {...fieldProps}
                value={endSignal}
                id={getEndFieldId}
                name={access(props.name) === undefined ? undefined : `${access(props.name)}-end`}
                ariaLabel={props.endLabel}
                renderContent={(getFlags) => {
                    setEndFlags(() => getFlags);

                    return props.renderContent(getFlags);
                }}
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
                placement={() => access(props.placement) ?? DATE_RANGE_PICKER_DEFAULTS.placement[getDirection()]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(getVisibilityTarget, getTransitionDurationMs) =>
                    props.renderPopup(renderCalendar, monthSignal, getVisibilityTarget, getTransitionDurationMs)
                }
            />

            <Show when={getLastTooltipDefs()}>
                {(getDefs) => (
                    <Tooltip
                        {...getDefs()}
                        isAnchorGroup={true}
                        anchorRef={() => (getTooltipDefs() ? getRootRef() : undefined)}
                        renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement, getArrowAim) =>
                            getDefs().renderContent(
                                getVisibilityTarget,
                                getTransitionDurationMs,
                                getPlacement,
                                getPairFlags,
                                getArrowAim,
                            )
                        }
                    />
                )}
            </Show>
        </div>
    );
};

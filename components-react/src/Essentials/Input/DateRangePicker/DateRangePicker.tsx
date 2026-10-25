import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import {
    DATE_INPUT_DEFAULTS,
    DATE_RANGE_PICKER_DEFAULTS,
    DateRangePickerStyles,
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
} from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { NavigatorReactUtils } from "../../../Abstracts/Navigator/NavigatorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { InteractionWrapper } from "../../../Primitives/InteractionWrapper/InteractionWrapper";
import { Popover } from "../../../Primitives/Popover/Popover";
import { PopupTrigger } from "../../../Primitives/PopupTrigger/PopupTrigger";
import { Tooltip } from "../../Overlays/Tooltip/Tooltip";
import type { TooltipProps } from "../../Overlays/Tooltip/Tooltip.types";
import { DateInput } from "../DateInput/DateInput";
import { RangeCalendar } from "../RangeCalendar/RangeCalendar";
import type { DateRangePickerProps } from "./DateRangePicker.types";

type FieldFlags = InteractionFlags<TextFieldFlags>;

const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
    DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

const keepFlags = (previous: FieldFlags | undefined, next: FieldFlags) =>
    previous && StoreUtils.getIsShallowEqual(previous, next) ? previous : next;

const FlagsReport = (props: { flags: FieldFlags; onChange: (flags: FieldFlags) => void }) => {
    const { flags, onChange } = props;

    useLayoutEffect(() => onChange(flags), [flags, onChange]);

    return null;
};

export const DateRangePicker = (props: DateRangePickerProps) => {
    const { tooltipDefs, ...fieldProps } = props;

    const [range] = props.value;

    const popupId = useId();
    const fallbackFieldId = useId();

    const endFieldId = `${props.id ?? fallbackFieldId}-end`;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const isFocusReturnedRef = useRef(false);
    const [root, setRoot] = useState<HTMLDivElement>();
    const [isOpen, setIsOpen] = SignalMirrorReactUtils.useOptionalState(props.visibility, false);

    const direction = NavigatorReactUtils.useDirection(rootRef);

    const calendar = props.calendar ?? DATE_INPUT_DEFAULTS.calendar;
    const calendarRef = useRef(calendar);

    const monthState = useState(() => toMonth(range?.start ?? DateValueUtils.fromDate(new Date()), calendar));
    const [, setMonth] = monthState;

    const { first: startState, second: endState } = SignalMirrorReactUtils.useSplit<
        DateValueRange,
        DateValue,
        DateValue
    >(props.value, DateRangePickerUtils.SPLIT_DEFS);

    const isDisabled = props.isDisabled ?? false;
    const isLocked = isDisabled || (props.isReadOnly ?? false);

    const [startFlags, setStartFlags] = useState<FieldFlags>();
    const [endFlags, setEndFlags] = useState<FieldFlags>();

    const reportStartFlags = useCallback(
        (flags: FieldFlags) => setStartFlags((previous) => keepFlags(previous, flags)),
        [],
    );
    const reportEndFlags = useCallback(
        (flags: FieldFlags) => setEndFlags((previous) => keepFlags(previous, flags)),
        [],
    );

    const pairFlags = TextFieldUtils.mergeFlags([startFlags, endFlags].flatMap((flags) => (flags ? [flags] : [])));

    const isReachable = InteractionTrackerUtils.computeIsReachable(isDisabled, props.isReachableWhenDisabled ?? false);
    const shownTooltipDefs = tooltipDefs && (!isDisabled || isReachable) ? tooltipDefs : undefined;

    const tooltipProps: Omit<TooltipProps, "anchorRef"> | undefined = shownTooltipDefs && {
        ...shownTooltipDefs,
        isAnchorGroup: true,
        renderContent: (visibilityTarget, transitionDurationMs, placement, arrowAim) =>
            shownTooltipDefs.renderContent(visibilityTarget, transitionDurationMs, placement, pairFlags, arrowAim),
    };

    const lastTooltipPropsRef = useRef(tooltipProps);

    if (tooltipProps) lastTooltipPropsRef.current = tooltipProps;

    const shownTooltipProps = tooltipProps ?? lastTooltipPropsRef.current;

    const setRootRef = useCallback((element: HTMLDivElement | null) => {
        rootRef.current = element;
        setRoot(element ?? undefined);
    }, []);

    const open = () => {
        if (isLocked) return;

        setIsOpen(true);
    };

    const dismiss = () => {
        if (!isOpen) return;

        isFocusReturnedRef.current = true;
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen && isLocked) setIsOpen(false);
    }, [isOpen, isLocked]);

    useLayoutEffect(() => {
        if (isOpen && range?.start) setMonth(toMonth(range.start, calendar));
    }, [isOpen]);

    useLayoutEffect(() => {
        if (calendarRef.current === calendar) return;

        calendarRef.current = calendar;
        setMonth((month) => toMonth(month, calendar));
    }, [calendar]);

    useEffect(() => {
        if (isOpen || !isFocusReturnedRef.current) return;

        isFocusReturnedRef.current = false;
        rootRef.current?.querySelector<HTMLInputElement>(`#${CSS.escape(endFieldId)}`)?.focus();
    }, [isOpen]);

    const renderCalendar = () => (
        <RangeCalendar
            value={props.value}
            month={monthState}
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
        <div ref={setRootRef} className={DateRangePickerStyles.dateRangePickerRoot}>
            <DateInput
                {...fieldProps}
                value={startState}
                id={props.id && `${props.id}-start`}
                name={props.name && `${props.name}-start`}
                ariaLabel={props.startLabel}
                renderContent={(flags) => (
                    <>
                        {props.renderContent(flags)}
                        <FlagsReport flags={flags} onChange={reportStartFlags} />
                    </>
                )}
            />

            {props.renderSeparator?.()}

            <DateInput
                {...fieldProps}
                value={endState}
                id={endFieldId}
                name={props.name && `${props.name}-end`}
                ariaLabel={props.endLabel}
                renderContent={(flags) => (
                    <>
                        {props.renderContent(flags)}
                        <FlagsReport flags={flags} onChange={reportEndFlags} />
                    </>
                )}
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
                placement={props.placement ?? DATE_RANGE_PICKER_DEFAULTS.placement[direction]}
                offset={props.offset}
                transitionDurationMs={props.popupTransitionDurationMs}
                hasAutoFocus={true}
                onDismiss={(reason) => (reason === "escape" ? dismiss() : setIsOpen(false))}
                renderContent={(visibilityTarget, transitionDurationMs) =>
                    props.renderPopup(renderCalendar, monthState, visibilityTarget, transitionDurationMs)
                }
            />

            {shownTooltipProps && <Tooltip {...shownTooltipProps} anchorRef={tooltipProps ? root : undefined} />}
        </div>
    );
};

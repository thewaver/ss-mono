import { useCallback, useLayoutEffect, useRef, useState } from "react";

import {
    DateTimePickerStyles,
    DateTimePickerUtils,
    type InteractionFlags,
    InteractionTrackerUtils,
    type TextFieldFlags,
    TextFieldUtils,
} from "@thewaver/ss-components";
import { StoreUtils } from "@thewaver/ss-utils";

import { DateTimeValueReactUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueReact.utils";
import { Tooltip } from "../../Overlays/Tooltip/Tooltip";
import type { TooltipProps } from "../../Overlays/Tooltip/Tooltip.types";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePicker.types";

type FieldFlags = InteractionFlags<TextFieldFlags>;

const keepFlags = (previous: FieldFlags | undefined, next: FieldFlags) =>
    previous && StoreUtils.getIsShallowEqual(previous, next) ? previous : next;

const FlagsReport = (props: { flags: FieldFlags; onChange: (flags: FieldFlags) => void }) => {
    const { flags, onChange } = props;

    useLayoutEffect(() => onChange(flags), [flags, onChange]);

    return null;
};

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { tooltipDefs, ...halfProps } = props;
    const { renderLeading: _renderLeading, triggerId: _triggerId, ...timeProps } = halfProps;

    const { date: dateState, time: timeState } = DateTimeValueReactUtils.useSplit(props.value);

    const { minValue, maxValue } = props;

    const [root, setRoot] = useState<HTMLDivElement>();

    const [dateFlags, setDateFlags] = useState<FieldFlags>();
    const [timeFlags, setTimeFlags] = useState<FieldFlags>();

    const reportDateFlags = useCallback(
        (flags: FieldFlags) => setDateFlags((previous) => keepFlags(previous, flags)),
        [],
    );
    const reportTimeFlags = useCallback(
        (flags: FieldFlags) => setTimeFlags((previous) => keepFlags(previous, flags)),
        [],
    );

    const pairFlags = TextFieldUtils.mergeFlags([dateFlags, timeFlags].flatMap((flags) => (flags ? [flags] : [])));

    const isDisabled = props.isDisabled ?? false;
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

    return (
        <div ref={(element) => setRoot(element ?? undefined)} className={DateTimePickerStyles.dateTimePickerRoot}>
            <DatePicker
                {...halfProps}
                value={dateState}
                id={props.id && `${props.id}-date`}
                name={props.name && `${props.name}-date`}
                visibility={props.dateVisibility}
                ariaLabel={props.dateLabel}
                minValue={minValue?.date}
                maxValue={maxValue?.date}
                renderContent={(flags) => (
                    <>
                        {props.renderContent(flags)}
                        <FlagsReport flags={flags} onChange={reportDateFlags} />
                    </>
                )}
            />

            {props.renderSeparator?.()}

            <TimePicker
                {...timeProps}
                value={timeState}
                id={props.id && `${props.id}-time`}
                name={props.name && `${props.name}-time`}
                visibility={props.timeVisibility}
                ariaLabel={props.timeLabel}
                minValue={minValue && DateTimePickerUtils.computeMinTime(dateState[0], minValue)}
                maxValue={maxValue && DateTimePickerUtils.computeMaxTime(dateState[0], maxValue)}
                triggerId={props.timeTriggerId}
                triggerAriaLabel={props.timeTriggerAriaLabel}
                renderContent={(flags) => (
                    <>
                        {props.renderContent(flags)}
                        <FlagsReport flags={flags} onChange={reportTimeFlags} />
                    </>
                )}
                renderTrailing={props.renderTimeTrailing}
                renderTrigger={props.renderTimeTrigger}
                renderPopup={props.renderTimePopup}
            />

            {shownTooltipProps && <Tooltip {...shownTooltipProps} anchorRef={tooltipProps ? root : undefined} />}
        </div>
    );
};

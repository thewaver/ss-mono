import { DateTimePickerStyles, DateTimePickerUtils } from "@thewaver/ss-components";

import { DateTimeValueReactUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueReact.utils";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePicker.types";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { date: dateState, time: timeState } = DateTimeValueReactUtils.useSplit(props.value);

    const { minValue, maxValue } = props;

    return (
        <div className={DateTimePickerStyles.dateTimePickerRoot}>
            <DatePicker
                {...props}
                value={dateState}
                id={props.id && `${props.id}-date`}
                name={props.name && `${props.name}-date`}
                visibility={props.dateVisibility}
                ariaLabel={props.dateLabel}
                minValue={minValue?.date}
                maxValue={maxValue?.date}
            />

            {props.renderSeparator?.()}

            <TimePicker
                {...props}
                value={timeState}
                id={props.id && `${props.id}-time`}
                name={props.name && `${props.name}-time`}
                visibility={props.timeVisibility}
                ariaLabel={props.timeLabel}
                minValue={minValue && DateTimePickerUtils.computeMinTime(dateState[0], minValue)}
                maxValue={maxValue && DateTimePickerUtils.computeMaxTime(dateState[0], maxValue)}
                renderLeading={undefined}
                triggerId={props.timeTriggerId}
                triggerAriaLabel={props.timeTriggerAriaLabel}
                renderTrailing={props.renderTimeTrailing}
                renderTrigger={props.renderTimeTrigger}
                renderPopup={props.renderTimePopup}
            />
        </div>
    );
};

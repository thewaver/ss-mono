import { DateTimePickerStyles, DateTimePickerUtils } from "@thewaver/ss-components";

import { DateTimeValueReactUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueReact.utils";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePicker.types";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { dateState, timeState } = DateTimeValueReactUtils.useSplit(props.valueState);

    const { minValue, maxValue } = props;

    return (
        <div className={DateTimePickerStyles.dateTimePickerRoot}>
            <DatePicker
                {...props}
                valueState={dateState}
                id={props.id && `${props.id}-date`}
                name={props.name && `${props.name}-date`}
                visibilityState={props.dateVisibilityState}
                ariaLabel={props.dateLabel}
                minValue={minValue?.date}
                maxValue={maxValue?.date}
            />

            {props.renderSeparator?.()}

            <TimePicker
                {...props}
                valueState={timeState}
                id={props.id && `${props.id}-time`}
                name={props.name && `${props.name}-time`}
                visibilityState={props.timeVisibilityState}
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

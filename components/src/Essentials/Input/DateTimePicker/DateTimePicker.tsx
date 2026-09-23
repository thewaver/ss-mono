import type { TimeValue } from "@thewaver/ss-utils";

import type { DateTimeValue } from "../../../Abstracts/DateTimeValue/DateTimeValue.types";
import { DateTimeValueUtils } from "../../../Abstracts/DateTimeValue/DateTimeValue.utils";
import { DateValueUtils } from "../../../Abstracts/DateValue/DateValue.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePicker.types";

import * as styles from "./DateTimePicker.css";

const FIRST_SECOND_OF_DAY: TimeValue = { hour: 0, minute: 0, second: 0 };
const LAST_SECOND_OF_DAY: TimeValue = { hour: 23, minute: 59, second: 59 };

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { dateSignal, timeSignal } = DateTimeValueUtils.createSplit(accessSignal(() => props.valueSignal));

    const computeTimeBound = (bound: DateTimeValue, dayEdge: TimeValue) => {
        const date = dateSignal[0]();

        return date && DateValueUtils.isSame(date, bound.date) ? bound.time : dayEdge;
    };

    return (
        <div class={styles.dateTimePickerRoot}>
            <DatePicker
                {...props}
                valueSignal={dateSignal}
                id={access(props.id) && `${access(props.id)}-date`}
                name={access(props.name) && `${access(props.name)}-date`}
                visibilitySignal={props.dateVisibilitySignal}
                ariaLabel={props.dateLabel}
                minValue={props.minValue === undefined ? undefined : () => access(props.minValue)!.date}
                maxValue={props.maxValue === undefined ? undefined : () => access(props.maxValue)!.date}
            />

            {props.renderSeparator?.()}

            <TimePicker
                {...props}
                valueSignal={timeSignal}
                id={access(props.id) && `${access(props.id)}-time`}
                name={access(props.name) && `${access(props.name)}-time`}
                visibilitySignal={props.timeVisibilitySignal}
                ariaLabel={props.timeLabel}
                minValue={
                    props.minValue === undefined
                        ? undefined
                        : () => computeTimeBound(access(props.minValue)!, FIRST_SECOND_OF_DAY)
                }
                maxValue={
                    props.maxValue === undefined
                        ? undefined
                        : () => computeTimeBound(access(props.maxValue)!, LAST_SECOND_OF_DAY)
                }
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

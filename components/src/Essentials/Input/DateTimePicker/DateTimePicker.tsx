import { DateTimeValueUtils } from "../../../Abstracts/DateTimeValue/DateTimeValue.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import { DATE_TIME_PICKER_DEFAULTS } from "./DateTimePicker.const";
import type { DateTimePickerProps } from "./DateTimePicker.types";

import * as styles from "./DateTimePicker.css";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { dateSignal, timeSignal } = DateTimeValueUtils.createSplit(accessSignal(() => props.valueSignal));

    return (
        <div class={styles.dateTimePickerRoot}>
            <DatePicker
                {...props}
                valueSignal={dateSignal}
                id={access(props.id) && `${access(props.id)}-date`}
                name={access(props.name) && `${access(props.name)}-date`}
                visibilitySignal={props.dateVisibilitySignal}
                ariaLabel={() => access(props.dateLabel) ?? DATE_TIME_PICKER_DEFAULTS.dateLabel}
            />

            {props.renderSeparator?.()}

            <TimePicker
                {...props}
                valueSignal={timeSignal}
                id={access(props.id) && `${access(props.id)}-time`}
                name={access(props.name) && `${access(props.name)}-time`}
                visibilitySignal={props.timeVisibilitySignal}
                ariaLabel={() => access(props.timeLabel) ?? DATE_TIME_PICKER_DEFAULTS.timeLabel}
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

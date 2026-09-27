import { DateTimePickerUtils, DateTimePickerStyles as styles } from "@thewaver/ss-components";

import { DateTimeValueSolidUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueSolid.utils";
import { access, accessSignal } from "../../../Utils/propUtils";
import { DatePicker } from "../DatePicker/DatePicker";
import { TimePicker } from "../TimePicker/TimePicker";
import type { DateTimePickerProps } from "./DateTimePickerSolid.types";

export const DateTimePicker = (props: DateTimePickerProps) => {
    const { dateSignal, timeSignal } = DateTimeValueSolidUtils.createSplit(accessSignal(() => props.valueSignal));

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
                        : () => DateTimePickerUtils.computeMinTime(dateSignal[0](), access(props.minValue)!)
                }
                maxValue={
                    props.maxValue === undefined
                        ? undefined
                        : () => DateTimePickerUtils.computeMaxTime(dateSignal[0](), access(props.maxValue)!)
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

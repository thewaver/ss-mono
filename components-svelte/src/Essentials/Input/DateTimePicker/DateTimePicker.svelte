<script lang="ts">
    import { DateTimePickerUtils, DateTimePickerStyles as styles } from "@thewaver/ss-components";

    import { DateTimeValueSvelteUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueSvelte.utils.svelte.js";
    import DatePicker from "../DatePicker/DatePicker.svelte";
    import TimePicker from "../TimePicker/TimePicker.svelte";
    import type { DateTimePickerProps } from "./DateTimePicker.types.js";

    let {
        value = $bindable(),
        dateVisibility = $bindable(false),
        timeVisibility = $bindable(false),
        ref = $bindable(),
        ...props
    }: DateTimePickerProps = $props();

    const { date, time } = DateTimeValueSvelteUtils.createSplit([
        () => value,
        (next) => {
            value = next;
        },
    ]);
</script>

<div class={styles.dateTimePickerRoot}>
    <DatePicker
        {...props}
        bind:value={date[0], date[1]}
        bind:visibility={dateVisibility}
        bind:ref
        id={props.id && `${props.id}-date`}
        name={props.name && `${props.name}-date`}
        ariaLabel={props.dateLabel}
        minValue={props.minValue?.date}
        maxValue={props.maxValue?.date}
    />

    {@render props.renderSeparator?.()}

    <TimePicker
        {...props}
        bind:value={time[0], time[1]}
        bind:visibility={timeVisibility}
        bind:ref
        id={props.id && `${props.id}-time`}
        name={props.name && `${props.name}-time`}
        ariaLabel={props.timeLabel}
        minValue={props.minValue && DateTimePickerUtils.computeMinTime(date[0](), props.minValue)}
        maxValue={props.maxValue && DateTimePickerUtils.computeMaxTime(date[0](), props.maxValue)}
        renderLeading={undefined}
        triggerId={props.timeTriggerId}
        triggerAriaLabel={props.timeTriggerAriaLabel}
        renderTrailing={props.renderTimeTrailing}
        renderTrigger={props.renderTimeTrigger}
        renderPopup={props.renderTimePopup}
    />
</div>

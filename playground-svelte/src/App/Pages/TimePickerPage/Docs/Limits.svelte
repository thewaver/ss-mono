<script lang="ts">
    import { TimePicker } from "@thewaver/ss-components-svelte";
    import {
        CLOCK_TRIGGER_LABEL,
        TIME_SEGMENT_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        BOOKING_STEPS,
        CLOSING_TIME,
        FIELD_WIDTH,
        LOCALE,
        OPENING_TIME,
    } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import { type TimeValue, TimeUtils } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.svelte";

    let value = $state.raw<TimeValue | undefined>({ hour: 10, minute: 15 });

    const valueText = $derived(value ? TimeUtils.toIso(value) : "nothing");
</script>

<TimePicker
    bind:value
    clockSteps={BOOKING_STEPS}
    minValue={OPENING_TIME}
    maxValue={CLOSING_TIME}
    ariaLabel={"Booking time"}
    clockLabel={"Choose a time"}
    segmentHints={TIME_SEGMENT_HINTS}
    locale={LOCALE}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    triggerId={"limitsTrigger"}
    triggerAriaLabel={CLOCK_TRIGGER_LABEL}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderTrigger(flags)}
        <PageTimePickerTrigger {flags} />
    {/snippet}

    {#snippet renderOption(_unused, renderProps)}
        <PageClockOption {renderProps} />
    {/snippet}

    {#snippet renderUnit(name)}
        <PageClockUnit>{name}</PageClockUnit>
    {/snippet}

    {#snippet renderColumn(renderOptions)}
        <PageClockColumn>{@render renderOptions()}</PageClockColumn>
    {/snippet}

    {#snippet renderPopup(renderClock)}
        <PageClockFrame>{@render renderClock()}</PageClockFrame>
    {/snippet}
</TimePicker>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>

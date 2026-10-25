<script lang="ts">
    import { Label, TimePicker } from "@thewaver/ss-components-svelte";
    import {
        CLOCK_TRIGGER_LABEL,
        TIME_SEGMENT_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import PageTimePickerTrigger from "../../../StyledComponents/TimePickerTrigger/TimePickerTrigger.svelte";

    const LABEL_GAP = 5;

    let value = $state.raw<TimeValue | undefined>();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Pickup time</PageLabelCaption>

    <TimePicker
        bind:value
        clockLabel={"Choose a time"}
        segmentHints={TIME_SEGMENT_HINTS}
        locale={LOCALE}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        triggerId={"labeledTrigger"}
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
</Label>

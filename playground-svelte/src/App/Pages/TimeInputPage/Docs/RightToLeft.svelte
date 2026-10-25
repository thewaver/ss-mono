<script lang="ts">
    import type { InteractionFlags, TextFieldFlags, TimeInputMeridiem } from "@thewaver/ss-components-svelte";
    import { TimeInput } from "@thewaver/ss-components-svelte";
    import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageMeridiemToggle from "../../../PageComponents/MeridiemToggle/MeridiemToggle.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    let value = $state.raw<TimeValue | undefined>({ hour: 14, minute: 30 });
</script>

<div dir={"rtl"}>
    <TimeInput
        bind:value
        isTwelveHour={true}
        ariaLabel={"Time in a right-to-left box"}
        segmentHints={TIME_SEGMENT_HINTS}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
        renderTrailing={meridiemToggle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}
    </TimeInput>
</div>

{#snippet meridiemToggle(flags: InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem)}
    <PageMeridiemToggle meridiem={meridiem.value} isDisabled={flags.isDisabled ?? false} onToggle={meridiem.toggle} />
{/snippet}

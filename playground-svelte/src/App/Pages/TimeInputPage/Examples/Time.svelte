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
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TimeExampleProps } from "../../DatePickerPage/DatePickerPage.types";

    type Props = TimeExampleProps & {
        ariaLabel: string;
        isTwelveHour?: boolean;
        hasSeconds?: boolean;
        minValue?: TimeValue;
        maxValue?: TimeValue;
    };

    let { value = $bindable(), ...props }: Props = $props();
</script>

<TimeInput
    bind:value
    isTwelveHour={props.isTwelveHour}
    hasSeconds={props.hasSeconds}
    minValue={props.minValue}
    maxValue={props.maxValue}
    ariaLabel={props.ariaLabel}
    segmentHints={TIME_SEGMENT_HINTS}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    renderTrailing={props.isTwelveHour ? meridiemToggle : undefined}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderPlaceholder(flags, hint)}
        <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
    {/snippet}
</TimeInput>

{#snippet meridiemToggle(flags: InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem)}
    <PageMeridiemToggle meridiem={meridiem.value} isDisabled={flags.isDisabled ?? false} onToggle={meridiem.toggle} />
{/snippet}

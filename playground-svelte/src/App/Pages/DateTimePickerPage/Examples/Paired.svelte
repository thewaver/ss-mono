<script lang="ts">
    import { DateInput, DateTimeValueSvelteUtils, TimeInput } from "@thewaver/ss-components-svelte";
    import {
        DATE_PART_HINTS,
        TIME_SEGMENT_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { DateTimeExampleProps } from "../DateTimePickerPage.types";

    type Props = DateTimeExampleProps;

    let { value = $bindable() }: Props = $props();

    const { date: dateState, time: timeState } = DateTimeValueSvelteUtils.createSplit([
        () => value,
        (next) => {
            value = next;
        },
    ]);
</script>

<div class={styles.dateTimeRow}>
    <DateInput
        bind:value={dateState[0], dateState[1]}
        ariaLabel={"Date"}
        partHints={DATE_PART_HINTS}
        locale={LOCALE}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}
    </DateInput>

    <TimeInput
        bind:value={timeState[0], timeState[1]}
        ariaLabel={"Time"}
        segmentHints={TIME_SEGMENT_HINTS}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}
    </TimeInput>
</div>

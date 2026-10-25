<script lang="ts">
    import type { DateTimeValue } from "@thewaver/ss-components-svelte";
    import {
        DateInput,
        DateTimeValueSvelteUtils,
        DateTimeValueUtils,
        DateValueUtils,
        TimeInput,
    } from "@thewaver/ss-components-svelte";
    import {
        DATE_PART_HINTS,
        TIME_SEGMENT_HINTS,
    } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        LOCALE,
        PAIR_FIELD_WIDTH,
        TODAY,
    } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import { NOON } from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/DateTimePickerPage/DateTimePickerPage.css";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import { TimeUtils } from "@thewaver/ss-utils";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";

    let value = $state.raw<DateTimeValue | undefined>(DateTimeValueUtils.of(TODAY, NOON));

    const { date: dateState, time: timeState } = DateTimeValueSvelteUtils.createSplit([
        () => value,
        (next) => {
            value = next;
        },
    ]);

    const valueText = $derived(
        value ? `${DateValueUtils.toIso(value.date)} at ${TimeUtils.toIso(value.time)}` : "nothing",
    );
</script>

<div class={styles.dateTimeRow}>
    <DateInput
        bind:value={dateState[0], dateState[1]}
        ariaLabel={"Date"}
        partHints={DATE_PART_HINTS}
        locale={LOCALE}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={PAIR_FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}
    </DateInput>

    <TimeInput
        bind:value={timeState[0], timeState[1]}
        ariaLabel={"Time"}
        segmentHints={TIME_SEGMENT_HINTS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={PAIR_FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}
    </TimeInput>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>

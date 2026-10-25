<script lang="ts">
    import { TimeInput } from "@thewaver/ss-components-svelte";
    import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import { TimeUtils } from "@thewaver/ss-utils";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TimeInputBasicDocsExampleProps } from "../TimeInputPageSvelte.types";

    type Props = TimeInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<TimeValue | undefined>();

    const valueText = $derived(value ? TimeUtils.toIso(value) : "nothing");
</script>

<TimeInput
    bind:value
    isReadOnly={props.isReadOnly}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    ariaLabel={"Start time"}
    segmentHints={TIME_SEGMENT_HINTS}
    padding={FIELD_PADDING}
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

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>

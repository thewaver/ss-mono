<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { DateInput, DateValueUtils } from "@thewaver/ss-components-svelte";
    import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { DateInputBasicDocsExampleProps } from "../DateInputPageSvelte.types";

    type Props = DateInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<DateValue | undefined>();

    const valueText = $derived(value ? DateValueUtils.toIso(value) : "nothing");
</script>

<DateInput
    name="date"
    bind:value
    isReadOnly={props.isReadOnly}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    ariaLabel={"Start date"}
    locale={LOCALE}
    partHints={DATE_PART_HINTS}
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
</DateInput>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${valueText}`}</div>

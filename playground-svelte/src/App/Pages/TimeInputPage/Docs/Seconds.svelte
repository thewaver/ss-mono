<script lang="ts">
    import { TimeInput } from "@thewaver/ss-components-svelte";
    import { TIME_SEGMENT_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TimeInputSecondsDocsExampleProps } from "../TimeInputPageSvelte.types";

    type Props = TimeInputSecondsDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw<TimeValue | undefined>({ hour: 9, minute: 30, second: 0 });
</script>

<TimeInput
    bind:value
    hasSeconds={props.hasSeconds}
    ariaLabel={"Exact time"}
    segmentHints={TIME_SEGMENT_HINTS}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}
</TimeInput>

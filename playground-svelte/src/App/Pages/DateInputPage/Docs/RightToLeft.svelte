<script lang="ts">
    import type { DateInputEra, DateValue, InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";
    import { DateInput } from "@thewaver/ss-components-svelte";
    import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE, TODAY } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.svelte";
    import PageTextFieldContent from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import { DATE_RIGHT_LEFT_BOX_LABEL } from "@thewaver/ss-playground/App/Pages/DateInputPage/DateInputPage.const";

    let value = $state.raw<DateValue | undefined>(TODAY);
</script>

<div dir={"rtl"}>
    <DateInput
        bind:value
        ariaLabel={DATE_RIGHT_LEFT_BOX_LABEL}
        locale={LOCALE}
        partHints={DATE_PART_HINTS}
        padding={FIELD_PADDING}
        gap={FIELD_GAP}
        renderLeading={eraCycle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}

        {#snippet renderPlaceholder(flags, hint)}
            <PageTextFieldPlaceholder {flags}>{hint}</PageTextFieldPlaceholder>
        {/snippet}
    </DateInput>
</div>

{#snippet eraCycle(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra)}
    <PageEraCycle era={era.value} options={era.options} isDisabled={flags.isDisabled ?? false} onChange={era.set} />
{/snippet}

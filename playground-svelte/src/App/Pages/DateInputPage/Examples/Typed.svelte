<script lang="ts">
    import type {
        DateInputEra,
        DateInputFormat,
        InteractionFlags,
        TextFieldFlags,
    } from "@thewaver/ss-components-svelte";
    import { DateInput } from "@thewaver/ss-components-svelte";
    import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageEraCycle from "../../../PageComponents/EraCycle/EraCycle.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { DateExampleProps } from "../../DatePickerPage/DatePickerPage.types";

    type Props = DateExampleProps & {
        ariaLabel: string;
        format?: DateInputFormat;
    };

    let { value = $bindable(), ...props }: Props = $props();
</script>

<DateInput
    bind:value
    calendar={props.calendar}
    locale={LOCALE}
    format={props.format}
    ariaLabel={props.ariaLabel}
    partHints={DATE_PART_HINTS}
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

    {#snippet renderLeading(flags: InteractionFlags<TextFieldFlags>, era: DateInputEra)}
        <PageEraCycle era={era.value} options={era.options} isDisabled={flags.isDisabled ?? false} onChange={era.set} />
    {/snippet}
</DateInput>

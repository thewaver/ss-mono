<script lang="ts">
    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { Button, DateInput, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-svelte";
    import { DATE_PART_HINTS } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { FIELD_WIDTH, LOCALE } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";

    const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
    const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

    const EMPTY_ENTRY = "(empty)";

    const describeEntries = (data: FormData) =>
        Array.from(new Set(data.keys()), (key) => `${key}: ${data.getAll(key).join(", ") || EMPTY_ENTRY}`).join("; ");

    let plan = $state<string | undefined>();
    let topics = $state.raw<string[]>([]);
    let start = $state.raw<DateValue | undefined>();
    let outcome = $state("Not sent yet.");
</script>

<Form
    ariaLabel={"Booking"}
    onSubmit={(data) => {
        outcome = `Sent: ${describeEntries(data)}.`;
    }}
    onReset={() => {
        plan = undefined;
        topics = [];
        start = undefined;
        outcome = "Not sent yet.";
    }}
>
    {#snippet renderContent()}
        <PageFormStack>
            <FormField>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Plan</PageFormFieldCaption>
                {/snippet}

                {#snippet renderControl()}
                    <Select
                        renderHighlightFloater={renderPageHighlightFloater}
                        name="plan"
                        bind:value={plan}
                        options={PLANS}
                        renderPopup={renderSelectPopup}
                    >
                        {#snippet renderContent(selectedOption, flags)}
                            <PageSelectContent {flags}>{selectedOption?.value ?? PLACEHOLDER}</PageSelectContent>
                        {/snippet}

                        {#snippet renderOption(option, flags)}
                            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
                        {/snippet}
                    </Select>
                {/snippet}
            </FormField>

            <FormField>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Topics</PageFormFieldCaption>
                {/snippet}

                {#snippet renderControl()}
                    <MultiSelect
                        renderHighlightFloater={renderPageHighlightFloater}
                        name="topics"
                        bind:values={topics}
                        options={TOPICS}
                        renderPopup={renderSelectPopup}
                    >
                        {#snippet renderContent(selectedOptions, flags)}
                            <PageSelectContent {flags}>
                                {selectedOptions.length
                                    ? selectedOptions.map((option) => option.value).join(", ")
                                    : PLACEHOLDER}
                            </PageSelectContent>
                        {/snippet}

                        {#snippet renderOption(option, flags)}
                            <PageSelectOptionContent isGliding {flags}>{option.value}</PageSelectOptionContent>
                        {/snippet}
                    </MultiSelect>
                {/snippet}
            </FormField>

            <FormField>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Start date</PageFormFieldCaption>
                {/snippet}

                {#snippet renderControl()}
                    <DateInput
                        name="start"
                        bind:value={start}
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
                {/snippet}
            </FormField>

            <PageFormButtons>
                <Button type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Book</PageButtonContent>
                    {/snippet}
                </Button>

                <Button type={"reset"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Reset</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>

            <div class={exampleStyles.exampleReadout} data-readout>{outcome}</div>
        </PageFormStack>
    {/snippet}
</Form>

<script lang="ts">
    import { Button, Form, FormField, MultiSelect, Select } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageFormButtons from "../../../StyledComponents/FormFieldContent/PageFormButtons.svelte";
    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageFormStack from "../../../StyledComponents/FormFieldContent/PageFormStack.svelte";
    import { renderPageHighlightFloater } from "../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageSelectContent from "../../../StyledComponents/SelectContent/SelectContent.svelte";
    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import { PLACEHOLDER, renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";
    import type { FormFocusExampleProps } from "../FormPage.types";

    const PLANS = [{ value: "Basic" }, { value: "Team" }, { value: "Enterprise" }];
    const TOPICS = [{ value: "Design" }, { value: "Engineering" }, { value: "Research" }, { value: "Sales" }];

    type Props = FormFocusExampleProps;

    let { plan = $bindable(), topics = $bindable(), ...props }: Props = $props();
</script>

<Form ariaLabel={"Newsletter"} onSubmit={props.onSubmit} onReset={props.onReset}>
    {#snippet renderContent(state)}
        {@const planMessage = state.hasSubmitted && plan === undefined ? "Pick a plan." : ""}
        {@const topicsMessage = state.hasSubmitted && topics.length < 1 ? "Pick at least one topic." : ""}

        <PageFormStack>
            <FormField hasError={planMessage.length > 0} message={planMessage}>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Plan</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>{planMessage}</PageFormFieldMessage>
                {/snippet}

                {#snippet renderControl(fieldState)}
                    <Select
                        renderHighlightFloater={renderPageHighlightFloater}
                        bind:value={plan}
                        options={PLANS}
                        ariaLabel={"Plan"}
                        isRequired={true}
                        hasError={fieldState.hasError}
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

            <FormField hasError={topicsMessage.length > 0} message={topicsMessage}>
                {#snippet renderCaption()}
                    <PageFormFieldCaption>Topics</PageFormFieldCaption>
                {/snippet}

                {#snippet renderMessage(fieldState)}
                    <PageFormFieldMessage state={fieldState}>{topicsMessage}</PageFormFieldMessage>
                {/snippet}

                {#snippet renderControl(fieldState)}
                    <MultiSelect
                        renderHighlightFloater={renderPageHighlightFloater}
                        bind:values={topics}
                        options={TOPICS}
                        ariaLabel={"Topics"}
                        isRequired={true}
                        hasError={fieldState.hasError}
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

            <PageFormButtons>
                <Button type={"submit"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Subscribe</PageButtonContent>
                    {/snippet}
                </Button>

                <Button type={"reset"}>
                    {#snippet renderContent(flags)}
                        <PageButtonContent {flags}>Reset</PageButtonContent>
                    {/snippet}
                </Button>
            </PageFormButtons>
        </PageFormStack>
    {/snippet}
</Form>

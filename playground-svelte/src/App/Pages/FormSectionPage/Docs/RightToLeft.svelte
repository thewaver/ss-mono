<script lang="ts">
    import { FormField, FormSection, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormSectionBody from "../../../StyledComponents/FormFieldContent/PageFormSectionBody.svelte";
    import PageFormSectionCaption from "../../../StyledComponents/FormFieldContent/PageFormSectionCaption.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    let street = $state("");
    let city = $state("");
</script>

<div dir={"rtl"}>
    <FormSection>
        {#snippet renderCaption()}
            <PageFormSectionCaption>Delivery</PageFormSectionCaption>
        {/snippet}

        {#snippet renderContent()}
            <PageFormSectionBody>
                <FormField>
                    {#snippet renderCaption()}
                        <PageFormFieldCaption>Street</PageFormFieldCaption>
                    {/snippet}

                    {#snippet renderControl()}
                        <TextInput
                            bind:value={street}
                            padding={FIELD_PADDING}
                            gap={FIELD_GAP}
                            computeTextStyle={computePageTextFieldTextStyle}
                        >
                            {#snippet renderContent(flags)}
                                <PageTextFieldContent {flags} />
                            {/snippet}
                        </TextInput>
                    {/snippet}
                </FormField>

                <FormField>
                    {#snippet renderCaption()}
                        <PageFormFieldCaption>City</PageFormFieldCaption>
                    {/snippet}

                    {#snippet renderControl()}
                        <TextInput
                            bind:value={city}
                            padding={FIELD_PADDING}
                            gap={FIELD_GAP}
                            computeTextStyle={computePageTextFieldTextStyle}
                        >
                            {#snippet renderContent(flags)}
                                <PageTextFieldContent {flags} />
                            {/snippet}
                        </TextInput>
                    {/snippet}
                </FormField>
            </PageFormSectionBody>
        {/snippet}
    </FormSection>
</div>

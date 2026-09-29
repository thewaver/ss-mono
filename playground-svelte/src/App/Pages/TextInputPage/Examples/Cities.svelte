<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageSelectOptionContent from "../../../StyledComponents/SelectOptionContent/SelectOptionContent.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import { renderSelectPopup } from "../../SelectPage/SelectPage.const.svelte";
    import type { TextInputCitiesExampleProps } from "../TextInputPage.types";

    type Props = TextInputCitiesExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"City"}
    suggestions={props.suggestions}
    suggestionsAriaLabel={"Cities"}
    computeCustomSuggestionText={(city) => city.name}
    computeTextStyle={computePageTextFieldTextStyle}
    renderSuggestionPopup={renderSelectPopup}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>Any city</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderSuggestion(city, flags)}
        <PageSelectOptionContent {flags} description={city.country}>{city.name}</PageSelectOptionContent>
    {/snippet}
</TextInput>

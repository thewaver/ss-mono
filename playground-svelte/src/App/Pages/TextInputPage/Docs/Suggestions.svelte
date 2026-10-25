<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import { CITIES } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
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

    let value = $state("");

    const suggestions = $derived.by(() => {
        const query = value.trim().toLocaleLowerCase();

        if (!query) return [];

        return CITIES.filter((city) => city.name.toLocaleLowerCase().startsWith(query));
    });
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"City"}
    {suggestions}
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

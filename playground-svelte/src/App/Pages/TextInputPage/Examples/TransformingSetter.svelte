<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TextInputExampleProps } from "../TextInputPage.types";

    type Props = TextInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Coupon code"}
    onInput={(next) => {
        value = next.toLocaleUpperCase();
    }}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>Coupon code (upper-cased)</PageTextFieldPlaceholder>
    {/snippet}
</TextInput>

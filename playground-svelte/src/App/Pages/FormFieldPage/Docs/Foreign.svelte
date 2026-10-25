<script lang="ts">
    import { FormField } from "@thewaver/ss-components-svelte";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import ForeignInput from "./ForeignInput.svelte";

    const MESSAGE = "Shown to everyone who can see your posts.";

    let value = $state("");
</script>

<FormField message={MESSAGE}>
    {#snippet renderCaption()}
        <PageFormFieldCaption>Display name</PageFormFieldCaption>
    {/snippet}

    {#snippet renderMessage(state)}
        <PageFormFieldMessage {state}>{MESSAGE}</PageFormFieldMessage>
    {/snippet}

    {#snippet renderControl()}
        <ForeignInput bind:value />
    {/snippet}
</FormField>

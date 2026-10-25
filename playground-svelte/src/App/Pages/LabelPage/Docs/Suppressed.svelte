<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";

    let checked = $state(false);
</script>

<Label>
    <Checkbox bind:checked ariaLabel={"Announced as something else"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
</Label>

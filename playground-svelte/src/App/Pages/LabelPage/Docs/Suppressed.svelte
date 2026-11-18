<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import { ANNOUNCED_SOMETHING_ELSE_LABEL } from "@thewaver/ss-playground/App/Pages/LabelPage/LabelPage.const";

    let checked = $state(false);
</script>

<Label>
    <Checkbox bind:checked ariaLabel={ANNOUNCED_SOMETHING_ELSE_LABEL}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
</Label>

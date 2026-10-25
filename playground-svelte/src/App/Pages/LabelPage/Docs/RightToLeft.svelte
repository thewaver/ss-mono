<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";

    let checked = $state(false);
</script>

<div dir={"rtl"}>
    <Label>
        <Checkbox bind:checked>
            {#snippet renderContent(flags)}
                <PageCheckboxContent {flags} />
            {/snippet}
        </Checkbox>

        <PageLabelCaption>Remember me</PageLabelCaption>
    </Label>
</div>

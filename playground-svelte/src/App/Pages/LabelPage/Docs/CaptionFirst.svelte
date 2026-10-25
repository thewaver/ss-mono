<script lang="ts">
    import { Label, Toggle } from "@thewaver/ss-components-svelte";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";

    let checked = $state(true);
</script>

<Label>
    <PageLabelCaption>Send notifications</PageLabelCaption>

    <Toggle bind:checked>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags} />
        {/snippet}
    </Toggle>
</Label>

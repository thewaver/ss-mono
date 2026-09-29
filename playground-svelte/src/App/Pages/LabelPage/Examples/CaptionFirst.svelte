<script lang="ts">
    import { Label, Toggle } from "@thewaver/ss-components-svelte";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import type { LabelExampleProps } from "../LabelPage.types";

    type Props = LabelExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Label>
    <PageLabelCaption>Send notifications</PageLabelCaption>

    <Toggle bind:checked>
        {#snippet renderContent(flags)}
            <PageToggleContent {flags} />
        {/snippet}
    </Toggle>
</Label>

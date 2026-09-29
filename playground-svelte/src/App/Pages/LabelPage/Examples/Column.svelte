<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { LabelExampleProps } from "../LabelPage.types";

    const GAP = 5;

    type Props = LabelExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={GAP}>
    <PageLabelCaption>Stacked</PageLabelCaption>

    <Checkbox bind:checked>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>
</Label>

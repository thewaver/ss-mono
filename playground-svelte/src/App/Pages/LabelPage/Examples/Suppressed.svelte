<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { LabelExampleProps } from "../LabelPage.types";

    type Props = LabelExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Label>
    <Checkbox bind:checked ariaLabel={"Announced as something else"}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageLabelCaption>Subscribe to the newsletter</PageLabelCaption>
</Label>

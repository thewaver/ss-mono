<script lang="ts">
    import { Checkbox, Label } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { LabelBasicDocsExampleProps } from "../LabelPageSvelte.types";

    type Props = LabelBasicDocsExampleProps;

    let props: Props = $props();

    let checked = $state(false);
</script>

<Label orientation={props.orientation}>
    <Checkbox bind:checked isDisabled={props.isDisabled}>
        {#snippet renderContent(flags)}
            <PageCheckboxContent {flags} />
        {/snippet}
    </Checkbox>

    <PageLabelCaption id={"rememberCaption"}>Remember me</PageLabelCaption>
</Label>

<script lang="ts">
    import { FileInput, Label } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import type { FileInputExampleProps } from "../FileInputPage.types";

    const LABEL_GAP = 5;

    type Props = FileInputExampleProps;

    let { files = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Contract</PageLabelCaption>

    <FileInput bind:files>
        {#snippet renderContent(renderProps)}
            <PageFileInputContent {renderProps} />
        {/snippet}
    </FileInput>
</Label>

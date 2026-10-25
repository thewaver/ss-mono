<script lang="ts">
    import { FileInput, Label } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";

    const LABEL_GAP = 5;

    let files = $state.raw<File[]>([]);
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Contract</PageLabelCaption>

    <FileInput bind:files>
        {#snippet renderContent(renderProps)}
            <PageFileInputContent {renderProps} />
        {/snippet}
    </FileInput>
</Label>

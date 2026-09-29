<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import type { FileInputExampleProps } from "../FileInputPage.types";

    type Props = FileInputExampleProps;

    let { files = $bindable() }: Props = $props();
</script>

<FileInput bind:files hasError={files.length < 1} ariaLabel={"Required attachment"}>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

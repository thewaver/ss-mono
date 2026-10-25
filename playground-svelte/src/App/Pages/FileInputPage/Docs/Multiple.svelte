<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";

    let files = $state.raw<File[]>([]);
</script>

<FileInput bind:files isMultiple={true} ariaLabel={"Attachments"}>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

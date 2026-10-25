<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import type { FileInputBasicDocsExampleProps } from "../FileInputPageSvelte.types";

    type Props = FileInputBasicDocsExampleProps;

    let props: Props = $props();

    let files = $state.raw<File[]>([]);
</script>

<FileInput bind:files hasError={props.hasError} isDisabled={props.isDisabled} ariaLabel={"Attachment"}>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";
    import {
        DROP_ZONE_ACCEPT,
        DROP_ZONE_MAX_FILES,
        DROP_ZONE_MAX_SIZE_BYTES,
    } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

    import PageFileDropZoneContent from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent.svelte";
    import type { FileInputDropZoneExampleProps } from "../FileInputPage.types";

    type Props = FileInputDropZoneExampleProps;

    let { files = $bindable(), ...props }: Props = $props();
</script>

<FileInput
    bind:files
    isMultiple={true}
    maxFiles={DROP_ZONE_MAX_FILES}
    maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
    accept={DROP_ZONE_ACCEPT}
    ariaLabel={"Gallery images"}
    onChange={() => props.onRejectionsChange([])}
    onReject={props.onRejectionsChange}
>
    {#snippet renderContent(renderProps)}
        <PageFileDropZoneContent
            {renderProps}
            prompt={renderProps.isDragOver ? "Let go to add them" : "Drop images here, or press to choose"}
        />
    {/snippet}
</FileInput>

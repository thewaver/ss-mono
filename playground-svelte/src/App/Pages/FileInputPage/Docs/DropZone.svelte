<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";
    import type { FileInputRejection } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import {
        DROP_ZONE_ACCEPT,
        DROP_ZONE_MAX_FILES,
        DROP_ZONE_MAX_SIZE_BYTES,
        DROP_ZONE_REASON_TEXT,
    } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

    import PageFileDropZoneContent from "../../../StyledComponents/FileDropZoneContent/FileDropZoneContent.svelte";

    let files = $state.raw<File[]>([]);
    let rejections = $state.raw<FileInputRejection[]>([]);
</script>

<FileInput
    bind:files
    isMultiple={true}
    maxFiles={DROP_ZONE_MAX_FILES}
    maxSizeBytes={DROP_ZONE_MAX_SIZE_BYTES}
    accept={DROP_ZONE_ACCEPT}
    ariaLabel={"Gallery images"}
    onChange={() => {
        rejections = [];
    }}
    onReject={(next) => {
        rejections = next;
    }}
>
    {#snippet renderContent(renderProps)}
        <PageFileDropZoneContent
            {renderProps}
            prompt={renderProps.isDragOver ? "Let go to add them" : "Drop images here, or press to choose"}
        />
    {/snippet}
</FileInput>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Refused: ${
        rejections
            .map((rejection) => `${rejection.file.name}, ${DROP_ZONE_REASON_TEXT[rejection.reason]}`)
            .join("; ") || "nothing"
    }`}
</div>

<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";

    let files = $state.raw<File[]>([]);
    let rejection = $state("");
</script>

<FileInput
    bind:files
    hasError={rejection !== ""}
    ariaLabel={"Attachment"}
    onChange={(picked) => {
        const spaced = picked.find((file) => file.name.includes(" "));

        rejection = spaced ? `"${spaced.name}" has a space in its name, rename it and pick again` : "";

        if (spaced) files = [];
    }}
>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

<div class={exampleStyles.exampleReadout} data-readout>
    {rejection || "A file whose name has a space in it is refused"}
</div>

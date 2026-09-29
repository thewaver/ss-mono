<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";

    import PageFileInputContent from "../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import type { PageFileFieldProps } from "./Field.types";

    let props: PageFileFieldProps = $props();

    let files = $state.raw<File[]>([]);
</script>

<FileInput
    bind:files
    accept={props.accept}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    onChange={(picked) => {
        if (!picked.length) return;

        props.onPick(picked[0]);
    }}
>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

<script lang="ts">
    import { FileInput } from "@thewaver/ss-components-svelte";
    import { MAX_ATTACHMENT_BYTES } from "@thewaver/ss-playground/App/Pages/FileInputPage/FileInputPage.const";

    import PageFileInputContent from "../../../StyledComponents/FileInputContent/FileInputContent.svelte";
    import type { FileInputRejectingExampleProps } from "../FileInputPage.types";

    type Props = FileInputRejectingExampleProps;

    let { files = $bindable(), ...props }: Props = $props();
</script>

<FileInput
    bind:files
    hasError={props.rejection !== ""}
    ariaLabel={"Small attachment"}
    onChange={(picked) => {
        const tooBig = picked.filter((file) => file.size > MAX_ATTACHMENT_BYTES);

        props.onRejectionChange(tooBig.length ? `${tooBig[0].name} is too big, pick again` : "");

        if (tooBig.length) files = [];
    }}
>
    {#snippet renderContent(renderProps)}
        <PageFileInputContent {renderProps} />
    {/snippet}
</FileInput>

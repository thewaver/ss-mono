<script lang="ts">
    import { untrack } from "svelte";

    import { FILE_INPUT_DEFAULTS, type FileInputRenderProps, FileInputUtils } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { FileInputProps } from "./FileInput.types.js";
    import FileInputElement from "./FileInputElement.svelte";

    let { files = $bindable(), ref = $bindable(), ...props }: FileInputProps = $props();

    const isDisabled = $derived(props.isDisabled ?? false);

    const receive = (arrived: File[]) => {
        const admission = FileInputUtils.admitFiles(arrived, {
            accept: props.accept,
            isMultiple: props.isMultiple ?? FILE_INPUT_DEFAULTS.isMultiple,
            maxFiles: props.maxFiles,
            maxSizeBytes: props.maxSizeBytes,
        });

        if (FileInputUtils.getIsValueWritten(admission)) {
            files = admission.accepted;

            props.onChange?.(admission.accepted);
        }

        if (admission.rejections.length) props.onReject?.(admission.rejections);
    };

    const tracker = FileInputUtils.createDropTracker({
        getIsDisabled: () => isDisabled,
        onDrop: (dropped) => receive(dropped),
    });

    const getIsDragOver = readStore(tracker);

    $effect(() => {
        const dropArea = ref?.parentElement;

        if (!dropArea) return;

        return untrack(() => tracker.observe(dropArea));
    });

    const extraFlags: FileInputRenderProps = $derived({ files, isDragOver: getIsDragOver() && !isDisabled });
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <FileInputElement
            {attachElement}
            id={props.id}
            name={props.name}
            ariaLabel={props.ariaLabel}
            accept={props.accept}
            isMultiple={props.isMultiple}
            {flags}
            {files}
            renderContent={props.renderContent}
            onChange={receive}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>

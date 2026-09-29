import type { FileInputRenderProps, InteractionFlags } from "@thewaver/ss-components-svelte";

export type FileDropZoneContentProps = {
    renderProps: InteractionFlags<FileInputRenderProps>;
    prompt: string;
};

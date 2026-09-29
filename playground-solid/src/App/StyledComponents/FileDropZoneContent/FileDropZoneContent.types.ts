import type { AccessorProps, FileInputRenderProps, InteractionFlags } from "@thewaver/ss-components-solid";

export type FileDropZoneContentProps = AccessorProps<{
    renderProps: InteractionFlags<FileInputRenderProps>;
    prompt: string;
}>;

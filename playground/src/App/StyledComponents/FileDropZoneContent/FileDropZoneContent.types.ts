import type { FileInputRenderProps, InteractionFlags } from "@thewaver/ss-components";

export type BaseFileDropZoneContentValues = {
    renderProps: InteractionFlags<FileInputRenderProps>;
    prompt: string;
};

export type BaseFileDropZoneContentProps = BaseFileDropZoneContentValues;

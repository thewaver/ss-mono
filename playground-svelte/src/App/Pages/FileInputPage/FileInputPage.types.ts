import type { FileInputRejection } from "@thewaver/ss-components-svelte";

export type FileInputExampleProps = {
    files: File[];
};

export type FileInputRejectingExampleProps = FileInputExampleProps & {
    rejection: string;
    onRejectionChange: (rejection: string) => void;
};

export type FileInputDropZoneExampleProps = FileInputExampleProps & {
    onRejectionsChange: (rejections: FileInputRejection[]) => void;
};

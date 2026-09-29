import type { FileInputRejection } from "@thewaver/ss-components-vue";

export type FileInputExampleProps = {
    "files": File[];
    "onUpdate:files"?: (files: File[]) => void;
};

export type FileInputRejectingExampleProps = FileInputExampleProps & {
    rejection: string;
    onRejectionChange: (rejection: string) => void;
};

export type FileInputDropZoneExampleProps = FileInputExampleProps & {
    onRejectionsChange: (rejections: FileInputRejection[]) => void;
};

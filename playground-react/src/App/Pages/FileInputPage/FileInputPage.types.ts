import type { FileInputRejection } from "@thewaver/ss-components-react";

export type FileInputExampleProps = {
    filesState: readonly [File[], (files: File[]) => void];
};

export type FileInputRejectingExampleProps = FileInputExampleProps & {
    rejection: string;
    onRejectionChange: (rejection: string) => void;
};

export type FileInputDropZoneExampleProps = FileInputExampleProps & {
    onRejectionsChange: (rejections: FileInputRejection[]) => void;
};

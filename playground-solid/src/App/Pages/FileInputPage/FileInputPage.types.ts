import type { Signal } from "solid-js";

import type { AccessorProps, FileInputRejection } from "@thewaver/ss-components-solid";

export type FileInputExampleProps = {
    files: Signal<File[]>;
};

export type FileInputRejectingExampleProps = FileInputExampleProps &
    AccessorProps<{
        rejection: string;
        onRejectionChange: (rejection: string) => void;
    }>;

export type FileInputDropZoneExampleProps = FileInputExampleProps &
    AccessorProps<{
        onRejectionsChange: (rejections: FileInputRejection[]) => void;
    }>;

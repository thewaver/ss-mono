import type { Signal } from "solid-js";

import type { AccessorProps } from "@thewaver/ss-components";

export type FileInputExampleProps = {
    filesSignal: Signal<File[]>;
};

export type FileInputRejectingExampleProps = FileInputExampleProps &
    AccessorProps<{
        rejection: string;
        onRejectionChange: (rejection: string) => void;
    }>;

import type { BaseFileInputValues, FileInputCbs, FileInputRenderProps } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type { FileInputCbs };

export type FileInputElementProps = Omit<FileInputCbs, "onReject"> &
    InteractionControlProps<FileInputRenderProps> &
    Omit<BaseFileInputValues, "maxFiles" | "maxSizeBytes"> &
    Pick<FileInputRenderProps, "files">;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    FileInputCbs &
    Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> &
    BaseFileInputValues & {
        /** The chosen files. Bind it with `bind:files`; it is the only thing that changes them. */
        files: File[];
    };

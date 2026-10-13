import type { BaseFileInputValues, FileInputCbs, FileInputRenderProps } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, AccessorValues, SignalSource } from "../../../Utils/typeUtils";

export type FileInputElementProps = AccessorValues<Omit<BaseFileInputValues, "maxFiles" | "maxSizeBytes">> &
    AccessorProps<
        Omit<FileInputCbs, "onReject"> &
            Omit<InteractionControlProps<FileInputRenderProps>, "ariaLabel"> &
            Pick<FileInputRenderProps, "files">
    >;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorValues<BaseFileInputValues> &
    FileInputCbs &
    AccessorProps<
        Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> & {
            /** The chosen files. It is the only thing that changes them. */
            files: SignalSource<File[]>;
        }
    >;

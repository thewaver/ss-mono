import type { FileInputCbs, FileInputRenderProps, FileInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapperSolid.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type FileInputElementProps = AccessorProps<
    Omit<FileInputCbs, "onReject"> &
        InteractionControlProps<FileInputRenderProps> &
        Omit<FileInputState, "maxFiles" | "maxSizeBytes"> &
        Pick<FileInputRenderProps, "files">
>;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        FileInputCbs &
            Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> &
            FileInputState & {
                /** The chosen files. It is the only thing that changes them. */
                filesSignal: SignalSource<File[]>;
            }
    >;

import type { FileInputCbs, FileInputRenderProps, FileInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionControlSlots,
    InteractionWrapperProps,
    InteractionWrapperSlots,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type { FileInputCbs };

export type FileInputElementProps = Omit<FileInputCbs, "onReject"> &
    InteractionControlProps<FileInputRenderProps> &
    Omit<FileInputState, "maxFiles" | "maxSizeBytes"> &
    Pick<FileInputRenderProps, "files">;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "extraFlags"> &
    FileInputCbs &
    Pick<InteractionControlProps<FileInputRenderProps>, "id"> &
    FileInputState & {
        /** The chosen files. It is the only thing that changes them. */
        "files": File[];
        /** Receives the chosen files whenever a pick or a drop changes them, which is what `v-model:files` binds. */
        "onUpdate:files"?: (files: File[]) => void;
    };

export type FileInputSlots = Pick<InteractionWrapperSlots<FileInputRenderProps>, "renderDecoration"> &
    InteractionControlSlots<FileInputRenderProps>;

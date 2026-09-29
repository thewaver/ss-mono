import type { FileInputRejection, FileInputRenderProps, FileInputState } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types.js";

export type FileInputCbs = {
    /** Runs when the chosen files change. */
    onChange?: (files: File[]) => void;
    /**
     * Runs when files arrive that the control will not hold, from the picker or from a drop, with every refused
     * file of that arrival in one call and in the order they arrived. The files that passed have already gone into
     * the value by then; when none passed, the value is left as it was. The reason is a value rather than a
     * sentence, so what a reader is told about it is the consumer's to write.
     */
    onReject?: (rejections: FileInputRejection[]) => void;
    /** Runs when the pointer arrives over the control. */
    onMouseEnter?: (e: MouseEvent) => void;
    /** Runs when the pointer leaves the control. */
    onMouseLeave?: (e: MouseEvent) => void;
};

export type FileInputElementProps = Omit<FileInputCbs, "onReject"> &
    InteractionControlProps<FileInputRenderProps> &
    Omit<FileInputState, "maxFiles" | "maxSizeBytes"> &
    Pick<FileInputRenderProps, "files">;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    FileInputCbs &
    Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> &
    FileInputState & {
        /** The chosen files. Bind it with `bind:files`; it is the only thing that changes them. */
        files: File[];
    };

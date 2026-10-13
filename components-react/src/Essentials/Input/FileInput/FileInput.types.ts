import type { MouseEvent } from "react";

import type { BaseFileInputCbs, BaseFileInputValues, FileInputRenderProps } from "@thewaver/ss-components";

import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";

export type FileInputCbs = BaseFileInputCbs & {
    /** Runs when the pointer arrives over the control. */
    onMouseEnter?: (e: MouseEvent<HTMLInputElement>) => void;
    /** Runs when the pointer leaves the control. */
    onMouseLeave?: (e: MouseEvent<HTMLInputElement>) => void;
};

export type FileInputElementProps = Omit<FileInputCbs, "onReject"> &
    InteractionControlProps<FileInputRenderProps> &
    Omit<BaseFileInputValues, "maxFiles" | "maxSizeBytes"> &
    Pick<FileInputRenderProps, "files">;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    FileInputCbs &
    Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> &
    BaseFileInputValues & {
        /** The chosen files, and how to change them. It is the only thing that changes them. */
        files: readonly [File[], (files: File[]) => void];
    };

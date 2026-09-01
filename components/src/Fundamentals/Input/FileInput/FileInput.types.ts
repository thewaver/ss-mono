import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";
import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../InteractionWrapper/InteractionWrapper.types";

export type FileInputRenderProps = {
    files: File[];
};

export type FileInputCbs = {
    onChange?: (files: File[]) => void | Promise<void>;
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type FileInputState = {
    name?: string;
    ariaLabel?: string;
    accept?: string;
    isMultiple?: boolean;
};

export type FileInputElementProps = AccessorProps<
    FileInputCbs & InteractionControlProps<FileInputRenderProps> & FileInputState & { files: File[] }
>;

export type FileInputProps = Omit<InteractionWrapperProps<FileInputRenderProps>, "renderControl" | "extraFlags"> &
    AccessorProps<
        FileInputCbs &
            Pick<InteractionControlProps<FileInputRenderProps>, "id" | "renderContent"> &
            FileInputState & {
                filesSignal: SignalSource<File[]>;
            }
    >;

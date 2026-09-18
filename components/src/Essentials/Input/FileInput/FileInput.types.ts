import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type FileInputRenderProps = {
    /** The files currently chosen. */
    files: File[];
};

export type FileInputCbs = {
    /** Runs when the chosen files change. */
    onChange?: (files: File[]) => void | Promise<void>;
    /** Runs when the pointer arrives over the control. */
    onMouseEnter?: (e: MouseEvent) => void | Promise<void>;
    /** Runs when the pointer leaves the control. */
    onMouseLeave?: (e: MouseEvent) => void | Promise<void>;
};

export type FileInputState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the control for assistive technology. */
    ariaLabel?: string;
    /** Which kinds of file the browser should offer, as a list of types or extensions. */
    accept?: string;
    /** Whether more than one file can be chosen at a time. */
    isMultiple?: boolean;
};

export type FileInputElementProps = AccessorProps<
    FileInputCbs & InteractionControlProps<FileInputRenderProps> & FileInputState & FileInputRenderProps
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

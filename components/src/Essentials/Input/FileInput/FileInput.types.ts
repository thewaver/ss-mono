import type {
    InteractionControlProps,
    InteractionWrapperProps,
} from "../../../Primitives/InteractionWrapper/InteractionWrapper.types";
import type { AccessorProps, SignalSource } from "../../../Utils/typeUtils";

export type FileInputRejectReason = "count" | "size" | "type";

export type FileInputRejection = {
    /** The file that was refused. It never reached the value. */
    file: File;
    /**
     * Which limit refused it: `type` when it does not match `accept`, `size` when it is larger than
     * `maxSizeBytes`, `count` when the files ahead of it already filled the control. A file is checked in that
     * order and reported against the first limit it fails.
     */
    reason: FileInputRejectReason;
};

export type FileInputAdmission = {
    accepted: File[];
    rejections: FileInputRejection[];
};

export type FileInputRenderProps = {
    /** The files currently chosen. */
    files: File[];
    /**
     * Whether a file is being dragged over the control right now, so the painter can show that a drop will land
     * here. Files dropped anywhere on the control arrive exactly as a pick from the dialog does, checked against
     * the same limits. It is never true while the control is disabled, since a disabled control refuses the drop.
     *
     * The drop is a second way in beside pressing the control to open the dialog, never a replacement for it: a
     * drag is not something every reader can make, and WCAG 2.5.7 requires a single press to reach the same
     * result. So a consumer may not hide the picker behind the drop area — covering the control, or painting it
     * as a place to drop with nothing saying it can also be pressed.
     */
    isDragOver: boolean;
};

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

export type FileInputState = {
    /** The field's name when it is submitted as part of a form. */
    name?: string;
    /** Names the control for assistive technology. */
    ariaLabel?: string;
    /**
     * Which kinds of file the control takes, as a comma-separated list of MIME types, which may end in `/*`, and
     * extensions with a leading dot. The browser uses it to narrow what its dialog offers, and the control checks
     * every file against it again as it arrives, since the dialog can be switched to show everything and a drop
     * is never filtered. A file whose type the browser does not know matches only by extension. Left out, every
     * type is taken.
     */
    accept?: string;
    /** Whether more than one file can be chosen at a time. Left out, the control holds one file. */
    isMultiple?: boolean;
    /**
     * The most files one pick or one drop may put into the control. Files past the limit are refused in the order
     * they arrived, so the first ones are kept. Only read while `isMultiple` is on: a control that is not multiple
     * holds one file whatever this says. Left out, there is no limit.
     */
    maxFiles?: number;
    /** The largest file the control takes, in bytes. A larger one is refused. Left out, there is no limit. */
    maxSizeBytes?: number;
};

export type FileInputLimits = Pick<FileInputState, "accept" | "isMultiple" | "maxFiles" | "maxSizeBytes">;

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

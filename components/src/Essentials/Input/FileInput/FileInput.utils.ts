import { StoreUtils } from "@thewaver/ss-utils";

import type {
    FileInputAdmission,
    FileInputDropTracker,
    FileInputLimits,
    FileInputRejectReason,
} from "./FileInput.types";

const ACCEPT_SEPARATOR = ",";
const EXTENSION_MARK = ".";
const MIME_SEPARATOR = "/";
const MIME_PARAMETER_SEPARATOR = ";";
const WILDCARD = "*";
const FILE_DRAG_TYPE = "Files";
const SINGLE_FILE_LIMIT = 1;
const EMPTY_FILE_INPUT_VALUE = "";

/** A MIME type lower-cased and without any parameters, so `Text/Plain; charset=utf-8` reads as `text/plain`. */
const normalizeMime = (mime: string) => mime.split(MIME_PARAMETER_SEPARATOR)[0].trim().toLowerCase();

/** Whether a token of `accept` names an extension, which is a dot followed by at least one character. */
const isExtensionToken = (token: string) => token.startsWith(EXTENSION_MARK) && token.length > EXTENSION_MARK.length;

/** Whether a token of `accept` names a MIME type, which is two non-empty halves either side of one slash. */
const isMimeToken = (token: string) => {
    const parts = token.split(MIME_SEPARATOR);

    return parts.length === 2 && parts.every((part) => part.length > 0);
};

/** The tokens of `accept` that the browser would honor, lower-cased; anything else in it is ignored. */
const readAcceptTokens = (accept: string) =>
    accept
        .split(ACCEPT_SEPARATOR)
        .map((token) => normalizeMime(token))
        .filter((token) => isExtensionToken(token) || isMimeToken(token));

/** Whether a file's MIME type fits a MIME token, where either half of the token may be `*`. */
const matchesMimeToken = (token: string, type: string) => {
    if (!type) return false;

    const [tokenMain, tokenSub] = token.split(MIME_SEPARATOR);
    const [typeMain, typeSub] = normalizeMime(type).split(MIME_SEPARATOR);

    return (tokenMain === WILDCARD || tokenMain === typeMain) && (tokenSub === WILDCARD || tokenSub === typeSub);
};

/** Whether a file input already holds exactly these files, in this order. */
const holdsFiles = (element: HTMLInputElement, files: File[]) => {
    const held = element.files ?? [];

    return held.length === files.length && files.every((file, index) => held[index] === file);
};

/** Whether a drag is carrying files, as opposed to text, a link or an element from the page. */
const isFileDrag = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes(FILE_DRAG_TYPE);

/**
 * The checks a file input makes on each file as it arrives, and the drop area that lets a file arrive by dragging.
 *
 * A file that fails a check never becomes part of the value; the caller is told which file and which limit, and
 * judging the files that were kept is still the caller's.
 */
export namespace FileInputUtils {
    /**
     * Whether a file fits an `accept` list, matched the way the browser's own file dialog matches it.
     *
     * The list is comma-separated. A token starting with a dot is an extension and matches the end of the file's
     * name; any other token is a MIME type, either half of which may be `*`, so `image/*` takes every image.
     * Matching ignores case and any parameters on a MIME type. A file whose type the browser does not know — an
     * empty `type` — matches only by extension. Tokens that are neither shape are ignored, as the browser ignores
     * them, and a list with nothing left in it takes every file.
     *
     * @param file The file to check. Only its name and type are read.
     * @param accept The list to check it against. Left out, every file fits.
     * @returns `true` when at least one token matches, or when there is nothing to match against.
     */
    export const matchesAccept = (file: Pick<File, "name" | "type">, accept: string | undefined) => {
        const tokens = accept === undefined ? [] : readAcceptTokens(accept);

        if (!tokens.length) return true;

        const name = file.name.toLowerCase();

        return tokens.some((token) =>
            isExtensionToken(token) ? name.endsWith(token) : matchesMimeToken(token, file.type),
        );
    };

    /**
     * Sorts one arrival of files into the ones the control will hold and the ones it refuses.
     *
     * Each file is checked in the order it arrived, first for its type against `accept` ({@link matchesAccept}),
     * then for its size against `maxSizeBytes`, then for room against the count limit, and is refused for the
     * first check it fails. The count limit is `maxFiles` on a multiple control and one otherwise, and only files
     * that passed the first two checks take up room — so the files refused for count are the ones that arrived
     * after the control was full, and the earliest are kept.
     *
     * @param files The files in the order they arrived.
     * @param limits What the control takes. Any limit left out does not apply.
     * @returns The accepted files in arrival order, and one rejection per refused file in arrival order. Every
     * file given appears in exactly one of the two.
     */
    export const admitFiles = (files: File[], limits: FileInputLimits): FileInputAdmission => {
        const countLimit = limits.isMultiple ? (limits.maxFiles ?? Number.POSITIVE_INFINITY) : SINGLE_FILE_LIMIT;

        const accepted: File[] = [];
        const rejections: FileInputAdmission["rejections"] = [];

        const computeReason = (file: File): FileInputRejectReason | undefined => {
            if (!matchesAccept(file, limits.accept)) return "type";
            if (limits.maxSizeBytes !== undefined && file.size > limits.maxSizeBytes) return "size";
            if (accepted.length >= countLimit) return "count";

            return undefined;
        };

        for (const file of files) {
            const reason = computeReason(file);

            if (reason === undefined) {
                accepted.push(file);
            } else {
                rejections.push({ file, reason });
            }
        }

        return { accepted, rejections };
    };

    /**
     * Whether an arrival of files changes the value at all.
     *
     * An arrival in which every file was refused leaves the value as it was, so a reader who drops one wrong file
     * onto a control already holding the right ones does not lose them. Any other arrival replaces the value with
     * the files that passed — including an empty arrival, which is how a pick is cleared.
     *
     * @param admission What {@link admitFiles} made of the arrival.
     * @returns `true` when the accepted files should become the value.
     */
    export const getIsValueWritten = (admission: FileInputAdmission) =>
        admission.accepted.length > 0 || admission.rejections.length === 0;

    /**
     * Makes a native file input hold exactly the given files.
     *
     * A file input's own list is changed by the browser on every pick, but the value the control reports is the
     * owner's, which may have refused or trimmed the pick. This writes the owner's files back so the element never
     * disagrees with it: an empty list clears the element, which is also what lets the same file be picked again
     * and still fire a change. An element already holding the very same files, in the same order, is left alone.
     *
     * @param element The file input.
     * @param files The files it should hold.
     */
    export const syncElement = (element: HTMLInputElement, files: File[]) => {
        if (holdsFiles(element, files)) return;

        if (!files.length) {
            element.value = EMPTY_FILE_INPUT_VALUE;
            return;
        }

        const transfer = new DataTransfer();

        for (const file of files) transfer.items.add(file);

        element.files = transfer.files;
    };

    /**
     * Makes elements places files can be dropped, and reports whether a file drag is over the one being observed.
     *
     * Only drags carrying files are taken; text, links and elements dragged from the page pass through
     * untouched. While one is over the element the browser shows a copy cursor, and dropping it hands the files
     * over instead of letting the browser open them. The drag is counted as it enters and leaves, so moving
     * across the element's children does not make the report flicker. A disabled element still stops the
     * browser opening the files and shows a cursor saying the drop is refused, and the drop is not handed over.
     *
     * The store says whether a file drag is over the element whatever `getIsDisabled` answers, since that is a
     * value the caller already follows; a control shows the drag only while it is not disabled.
     *
     * The drop is a second way in, never the only one: a drag is not something every reader can make, and
     * WCAG 2.5.7 requires a single press to reach the same result. Pair it with a control that can be pressed,
     * and do not hide that control behind the drop area.
     *
     * @param defs.getIsDisabled Whether to refuse drops, read as each drag event arrives.
     * @param defs.onDrop Called with the dropped files, in the order the browser lists them.
     * @returns A store of whether a file drag is over the element, and `observe(element)`, which starts listening
     * on the element and returns the function that stops it. Stopping forgets any drag in progress, and the
     * tracker can be observed again afterwards.
     */
    export const createDropTracker = (defs: {
        getIsDisabled: () => boolean;
        onDrop: (files: File[]) => void;
    }): FileInputDropTracker => {
        const store = StoreUtils.create(false);

        let depth = 0;

        const setDepth = (next: number) => {
            depth = next;
            store.set(depth > 0);
        };

        return {
            get: store.get,
            subscribe: store.subscribe,
            observe: (element) => {
                const claim = (e: DragEvent) => {
                    e.preventDefault();

                    if (e.dataTransfer) e.dataTransfer.dropEffect = defs.getIsDisabled() ? "none" : "copy";
                };

                const onDragEnter = (e: DragEvent) => {
                    if (!isFileDrag(e)) return;

                    claim(e);
                    setDepth(depth + 1);
                };

                const onDragOver = (e: DragEvent) => {
                    if (!isFileDrag(e)) return;

                    claim(e);
                };

                const onDragLeave = (e: DragEvent) => {
                    if (!isFileDrag(e)) return;

                    setDepth(Math.max(depth - 1, 0));
                };

                const onDropped = (e: DragEvent) => {
                    if (!isFileDrag(e)) return;

                    e.preventDefault();
                    setDepth(0);

                    if (defs.getIsDisabled()) return;

                    defs.onDrop(Array.from(e.dataTransfer?.files ?? []));
                };

                element.addEventListener("dragenter", onDragEnter);
                element.addEventListener("dragover", onDragOver);
                element.addEventListener("dragleave", onDragLeave);
                element.addEventListener("drop", onDropped);

                return () => {
                    element.removeEventListener("dragenter", onDragEnter);
                    element.removeEventListener("dragover", onDragOver);
                    element.removeEventListener("dragleave", onDragLeave);
                    element.removeEventListener("drop", onDropped);
                    setDepth(0);
                };
            },
        };
    };
}

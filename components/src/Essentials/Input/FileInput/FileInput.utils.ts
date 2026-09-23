import type { Accessor } from "solid-js";
import { createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import type { FileInputAdmission, FileInputLimits, FileInputRejectReason } from "./FileInput.types";

const ACCEPT_SEPARATOR = ",";
const EXTENSION_MARK = ".";
const MIME_SEPARATOR = "/";
const MIME_PARAMETER_SEPARATOR = ";";
const WILDCARD = "*";
const FILE_DRAG_TYPE = "Files";
const SINGLE_FILE_LIMIT = 1;

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
     * Makes an element a place files can be dropped, and reports whether a file drag is over it.
     *
     * Only drags carrying files are taken; text, links and elements dragged from the page pass through
     * untouched. While one is over the element the browser shows a copy cursor, and dropping it hands the files
     * over instead of letting the browser open them. The drag is counted as it enters and leaves, so moving
     * across the element's children does not make the report flicker. A disabled element still stops the
     * browser opening the files, shows a cursor saying the drop is refused, and reports nothing.
     *
     * The drop is a second way in, never the only one: a drag is not something every reader can make, and
     * WCAG 2.5.7 requires a single press to reach the same result. Pair it with a control that can be pressed,
     * and do not hide that control behind the drop area.
     *
     * @param getRef The element to take drops on.
     * @param getIsDisabled Whether to refuse drops.
     * @param onDrop Called with the dropped files, in the order the browser lists them.
     * @returns `getIsDragOver`, true while a file drag is over the element and it is not disabled.
     */
    export const trackDrop = (
        getRef: Accessor<HTMLElement | undefined>,
        getIsDisabled: Accessor<boolean>,
        onDrop: (files: File[]) => void,
    ) => {
        const [getDepth, setDepth] = createSignal(0);

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            const claim = (e: DragEvent) => {
                e.preventDefault();

                if (e.dataTransfer) e.dataTransfer.dropEffect = getIsDisabled() ? "none" : "copy";
            };

            const onDragEnter = (e: DragEvent) => {
                if (!isFileDrag(e)) return;

                claim(e);
                setDepth((depth) => depth + 1);
            };

            const onDragOver = (e: DragEvent) => {
                if (!isFileDrag(e)) return;

                claim(e);
            };

            const onDragLeave = (e: DragEvent) => {
                if (!isFileDrag(e)) return;

                setDepth((depth) => Math.max(depth - 1, 0));
            };

            const onDropped = (e: DragEvent) => {
                if (!isFileDrag(e)) return;

                e.preventDefault();
                setDepth(0);

                if (getIsDisabled()) return;

                onDrop(Array.from(e.dataTransfer?.files ?? []));
            };

            ref.addEventListener("dragenter", onDragEnter);
            ref.addEventListener("dragover", onDragOver);
            ref.addEventListener("dragleave", onDragLeave);
            ref.addEventListener("drop", onDropped);

            onCleanup(() => {
                ref.removeEventListener("dragenter", onDragEnter);
                ref.removeEventListener("dragover", onDragOver);
                ref.removeEventListener("dragleave", onDragLeave);
                ref.removeEventListener("drop", onDropped);
                setDepth(0);
            });
        });

        return { getIsDragOver: createMemo(() => getDepth() > 0 && !getIsDisabled()) };
    };
}

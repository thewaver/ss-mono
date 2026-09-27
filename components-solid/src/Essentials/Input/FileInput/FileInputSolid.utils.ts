import { type Accessor, createEffect, createMemo, onCleanup } from "solid-js";

import { FileInputUtils } from "@thewaver/ss-components";

import { accessStore } from "../../../Utils/storeUtils";

/** The Solid side of {@link FileInputUtils}: the drop area kept on whichever element the control currently has. */
export namespace FileInputSolidUtils {
    /**
     * Makes an element a place files can be dropped, and reports whether a file drag is over it.
     *
     * {@link FileInputUtils.createDropTracker} observing the element `getRef` gives, moved to a new element when it
     * changes and let go when the owner is disposed. The report is false while the element is disabled.
     *
     * Must run inside a component or another reactive owner.
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
        const tracker = FileInputUtils.createDropTracker({ getIsDisabled, onDrop });

        createEffect(() => {
            const ref = getRef();

            if (!ref) return;

            onCleanup(tracker.observe(ref));
        });

        const getIsDragging = accessStore(tracker);

        return { getIsDragOver: createMemo(() => getIsDragging() && !getIsDisabled()) };
    };
}

import { onCleanup } from "solid-js";

import { type TypeaheadDefs, type TypeaheadHandle, TypeaheadUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";

/** The Solid side of {@link TypeaheadUtils}: the typed query as a signal. The matching itself is framework-free. */
export namespace TypeaheadSolidUtils {
    /**
     * Accumulates typed characters into a query that expires.
     *
     * {@link TypeaheadUtils.createBuffer} with the query read as an accessor, cleared when the owner is disposed.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param defs What {@link TypeaheadUtils.createBuffer} takes.
     * @returns `getQuery` for what has been typed, `clear` to start over, and `push` to offer a keystroke. `push`
     * returns the new query when the keystroke was taken and nothing when it was not, so a caller can tell
     * whether to search or to let the key through.
     */
    export const createBuffer = (defs?: TypeaheadDefs): TypeaheadHandle => {
        const buffer = TypeaheadUtils.createBuffer(defs);

        onCleanup(buffer.clear);

        return { getQuery: accessStore(buffer), push: buffer.push, clear: buffer.clear };
    };
}

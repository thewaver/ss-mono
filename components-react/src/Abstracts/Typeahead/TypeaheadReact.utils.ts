import { useEffect, useState } from "react";

import { TypeaheadUtils } from "@thewaver/ss-components";

import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";

/** The React side of `TypeaheadUtils`: the typed query as state. The matching itself is framework-free. */
export namespace TypeaheadReactUtils {
    /**
     * Accumulates typed characters into a query that expires.
     *
     * `TypeaheadUtils.createBuffer` with the query read as state, cleared on unmount.
     *
     * @param defs.timeoutMs How long to wait after the last keystroke before starting over. A second by default,
     * which is what native controls use. Read at each keystroke.
     * @returns `query` for what has been typed, `clear` to start over, and `push` to offer a keystroke. `push`
     * returns the new query when the keystroke was taken and nothing when it was not, so a caller can tell whether
     * to search or to let the key through.
     */
    export const useBuffer = (defs?: { timeoutMs?: number }) => {
        const latest = useLatest(defs);

        const [buffer] = useState(() => TypeaheadUtils.createBuffer({ getTimeoutMs: () => latest.current?.timeoutMs }));

        useEffect(() => buffer.clear, [buffer]);

        return { query: useStore(buffer), push: buffer.push, clear: buffer.clear };
    };
}

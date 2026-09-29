import { type MaybeRefOrGetter, onScopeDispose, toValue } from "vue";

import { TypeaheadUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";

/** The Vue side of `TypeaheadUtils`: the typed query as a ref. The matching itself is framework-free. */
export namespace TypeaheadVueUtils {
    /**
     * Accumulates typed characters into a query that expires.
     *
     * `TypeaheadUtils.createBuffer` with the query read as a ref, cleared on unmount.
     *
     * Must run inside a component's `setup` or another effect scope.
     *
     * @param defs.timeoutMs How long to wait after the last keystroke before starting over. A second by default,
     * which is what native controls use. Read at each keystroke.
     * @returns `query`, a ref of what has been typed, `clear` to start over, and `push` to offer a keystroke. `push`
     * returns the new query when the keystroke was taken and nothing when it was not, so a caller can tell whether
     * to search or to let the key through.
     */
    export const useBuffer = (defs?: { timeoutMs?: MaybeRefOrGetter<number | undefined> }) => {
        const buffer = TypeaheadUtils.createBuffer({ getTimeoutMs: () => toValue(defs?.timeoutMs) });

        onScopeDispose(buffer.clear);

        return { query: useStore(buffer), push: buffer.push, clear: buffer.clear };
    };
}

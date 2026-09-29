import { TypeaheadUtils } from "@thewaver/ss-components";
import { readStore } from "../../Utils/storeUtils.js";
/** The Svelte side of {@link TypeaheadUtils}: the typed query as a getter. The matching itself is framework-free. */
export var TypeaheadSvelteUtils;
(function (TypeaheadSvelteUtils) {
    /**
     * Accumulates typed characters into a query that expires.
     *
     * {@link TypeaheadUtils.createBuffer} with the query read as a getter, cleared when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param defs What {@link TypeaheadUtils.createBuffer} takes.
     * @returns `getQuery` for what has been typed, `clear` to start over, and `push` to offer a keystroke. `push`
     * returns the new query when the keystroke was taken and nothing when it was not, so a caller can tell whether to
     * search or to let the key through.
     */
    TypeaheadSvelteUtils.createBuffer = (defs) => {
        const buffer = TypeaheadUtils.createBuffer(defs);
        $effect(() => buffer.clear);
        return { getQuery: readStore(buffer), push: buffer.push, clear: buffer.clear };
    };
})(TypeaheadSvelteUtils || (TypeaheadSvelteUtils = {}));

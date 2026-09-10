import { type Accessor, createEffect, onCleanup } from "solid-js";

import type { DismisserLayerDefs } from "./Dismisser.types";

/** Every open layer, oldest first, so the last entry is the topmost. */
const layers: DismisserLayerDefs[] = [];

/** Whether an event landed outside a layer and everything that layer owns. */
const getIsOutside = (layer: DismisserLayerDefs, target: Node | null) =>
    !DismisserUtils.getIsWithinOwnedLayer(target, layer.getRoots());

/** Dismisses every layer the event landed outside of, topmost first. */
const dismissOutside = (target: Node | null, reason: "press" | "focus") => {
    if (!target) return;

    for (const layer of [...layers].reverse()) {
        if (getIsOutside(layer, target)) layer.onDismiss(reason);
    }
};

/** A press anywhere in the document closes the layers it fell outside of. */
const handlePointerDown = (e: PointerEvent) => {
    dismissOutside(e.target as Node | null, "press");
};

/** Focus leaving for somewhere outside a layer closes it. The element receiving focus is what is tested, not the one losing it. */
const handleFocusOut = (e: FocusEvent) => {
    dismissOutside(e.relatedTarget as Node | null, "focus");
};

/** Escape closes only the topmost layer, so nested layers unwind one at a time. */
const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;

    const top = layers[layers.length - 1];

    if (!top) return;

    e.preventDefault();
    top.onDismiss("escape");
};

/** Starts listening. Called when the first layer opens. */
const attach = () => {
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("focusout", handleFocusOut);
    document.addEventListener("keydown", handleKeyDown);
};

/** Stops listening. Called when the last layer closes. */
const detach = () => {
    document.removeEventListener("pointerdown", handlePointerDown);
    document.removeEventListener("focusout", handleFocusOut);
    document.removeEventListener("keydown", handleKeyDown);
};

/**
 * Closes open layers — menus, popovers, dialogs — when the user presses or tabs away, or hits
 * Escape.
 *
 * All open layers share one set of document listeners, attached when the first opens and removed
 * when the last closes, so a page with nothing open pays nothing. Layers form a stack: a press
 * outside closes every layer it fell outside of, topmost first, which unwinds a submenu and its
 * parent together; Escape closes only the topmost, which unwinds them one step at a time.
 */
export namespace DismisserUtils {
    /**
     * Tests whether a node belongs to a layer, following ownership as well as nesting.
     *
     * Walking up the DOM is not enough on its own, because a submenu portalled to the end of the
     * document is not inside its parent menu. So the walk also steps sideways: an element whose id
     * something points at with `aria-controls` continues the walk from that controller, which is what
     * keeps a menu open while the user is in the popup it opened. A trigger button counts as inside
     * the layer it controls for the same reason — clicking it should toggle the layer, not have it
     * closed from underneath and reopened.
     *
     * @param target The node the event landed on.
     * @param roots The layer's own elements. Missing entries are ignored, so a caller may pass refs
     * that have not been attached yet.
     * @returns `true` when the node is inside one of those roots or inside something they own.
     */
    export const getIsWithinOwnedLayer = (target: Node | null, roots: (HTMLElement | null | undefined)[]) => {
        let node = target instanceof Element ? target : (target?.parentElement ?? null);

        while (node) {
            const current = node;

            if (roots.some((root) => root?.contains(current))) return true;

            const owner = current.id ? document.querySelector(`[aria-controls="${CSS.escape(current.id)}"]`) : null;

            node = owner ?? current.parentElement;
        }

        return false;
    };

    /**
     * Registers a layer to be dismissed for as long as it is open.
     *
     * @param getIsOpen Whether the layer is currently open. Registration follows it, so nothing is
     * listened for while the layer is closed.
     * @param defs The layer's own elements, and what to do when it is dismissed. The reason is passed
     * on, since a layer often wants to return focus to its trigger after Escape but not after a press
     * elsewhere.
     */
    export const createLayer = (getIsOpen: Accessor<boolean>, defs: DismisserLayerDefs) => {
        createEffect(() => {
            if (!getIsOpen()) return;

            layers.push(defs);

            if (layers.length === 1) attach();

            onCleanup(() => {
                const index = layers.indexOf(defs);

                if (index >= 0) layers.splice(index, 1);
                if (layers.length === 0) detach();
            });
        });
    };
}

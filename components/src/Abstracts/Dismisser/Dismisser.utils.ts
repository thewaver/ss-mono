import { type Store, StoreUtils } from "@thewaver/ss-utils";

import type { DismisserLayerDefs } from "./Dismisser.types";

/** Every open layer, oldest first, so the last entry is the topmost. Replaced rather than edited on each change. */
const layers = StoreUtils.create<readonly DismisserLayerDefs[]>([]);

/**
 * Tests whether a node belongs to a layer, following ownership as well as nesting.
 *
 * Walking up the DOM is not enough on its own, because a submenu portaled to the end of the
 * document is not inside its parent menu. So the walk also steps sideways: an element whose id
 * something points at with `aria-controls` continues the walk from that controller, which is what
 * keeps a menu open while the user is in the popup it opened. A trigger button counts as inside
 * the layer it controls for the same reason — clicking it should toggle the layer, not have it
 * closed from underneath and reopened. A controller that sits inside the element it controls — a
 * sidebar's own collapse button — would send the walk round in a circle, so a step to an element
 * already visited is skipped and the walk carries on up from where it was.
 *
 * Published as {@link DismisserUtils.getIsWithinOwnedLayer}; it lives here because the module's own
 * listeners need it before the namespace object exists.
 *
 * @param target The node the event landed on.
 * @param roots The layer's own elements. Missing entries are ignored, so a caller may pass refs
 * that have not been attached yet.
 * @returns `true` when the node is inside one of those roots or inside something they own.
 */
const computeIsWithinOwnedLayer = (target: Node | null, roots: (HTMLElement | null | undefined)[]) => {
    const visited = new Set<Element>();

    let node = target instanceof Element ? target : (target?.parentElement ?? null);

    while (node && !visited.has(node)) {
        const current = node;

        visited.add(current);

        if (roots.some((root) => root?.contains(current))) return true;

        const owner = current.id ? document.querySelector(`[aria-controls="${CSS.escape(current.id)}"]`) : null;

        node = owner && !visited.has(owner) ? owner : current.parentElement;
    }

    return false;
};

/** Whether an event landed outside a layer and everything that layer owns. */
const getIsOutside = (layer: DismisserLayerDefs, target: Node | null) =>
    !computeIsWithinOwnedLayer(target, layer.getRoots());

/** Dismisses every layer the event landed outside of, topmost first. */
const dismissOutside = (target: Node | null, reason: "press" | "focus") => {
    if (!target) return;

    for (const layer of [...layers.get()].reverse()) {
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

/** Whether a key press is an Escape nothing has answered yet. One whose default something already prevented was used for that thing's own purpose. */
const getIsUnansweredEscape = (e: Pick<KeyboardEvent, "key" | "defaultPrevented">) =>
    e.key === "Escape" && !e.defaultPrevented;

/** Escape closes only the topmost layer, so nested layers unwind one at a time. */
const handleKeyDown = (e: KeyboardEvent) => {
    if (!getIsUnansweredEscape(e)) return;

    const top = layers.get().at(-1);

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
 * parent together; Escape closes only the topmost, which unwinds them one step at a time. An Escape
 * something already answered — a drag it canceled, focus it handed back — calls `preventDefault`,
 * and the stack then leaves it alone.
 */
export namespace DismisserUtils {
    /**
     * Tests whether a node belongs to a layer, following ownership as well as nesting.
     *
     * Walking up the DOM is not enough on its own, because a submenu portaled to the end of the
     * document is not inside its parent menu. So the walk also steps sideways: an element whose id
     * something points at with `aria-controls` continues the walk from that controller, which is what
     * keeps a menu open while the user is in the popup it opened. A trigger button counts as inside
     * the layer it controls for the same reason — clicking it should toggle the layer, not have it
     * closed from underneath and reopened. A controller inside the element it controls is stepped
     * past rather than followed, so the walk always ends.
     *
     * @param target The node the event landed on.
     * @param roots The layer's own elements. Missing entries are ignored, so a caller may pass refs
     * that have not been attached yet.
     * @returns `true` when the node is inside one of those roots or inside something they own.
     */
    export const getIsWithinOwnedLayer = computeIsWithinOwnedLayer;

    /**
     * The topmost open layer that takes input of its own, or `undefined` while none is open.
     *
     * A layer registered as passive — one that only shows something, such as a tooltip — is skipped, so a page's
     * keyboard shortcuts keep working while it is on screen. It is still dismissed like any other layer, Escape
     * included.
     *
     * @returns The layer, as it was handed to {@link addLayer}.
     */
    export const getTopLayer = () => layers.get().findLast((layer) => !layer.isPassive);

    /**
     * Every open layer, oldest first, as a store.
     *
     * The list is replaced rather than edited on each change, so a reader following it hears about every layer
     * added or removed — which is how a layer learns that one opened above it, or that the one above it closed.
     * Read {@link getTopLayerInGroup} or {@link getIsTopForInput} for the questions most callers are asking.
     */
    export const openLayers: Store<readonly DismisserLayerDefs[]> = { get: layers.get, subscribe: layers.subscribe };

    /**
     * The topmost open layer of a group, or `undefined` while none of the group is open.
     *
     * Layers of one kind that must not act at the same time — two spotlights, each wanting the reader's whole
     * attention — share a `group`, and only the one this returns acts. Passive layers count, unlike in
     * {@link getTopLayer}, since the question is which of the group was opened last, not where input goes. A layer
     * of another group or of none, open above or below, makes no difference.
     *
     * @param group The name the layers were registered under.
     * @returns The layer, as it was handed to {@link addLayer}.
     */
    export const getTopLayerInGroup = (group: string) => layers.get().findLast((layer) => layer.group === group);

    /**
     * Whether a key pressed now is a layer's to answer: it is open, and nothing above it takes input of its own.
     *
     * For a layer that takes input this is the same as being {@link getTopLayer}. A passive layer has no such
     * answer, so for one this says whether it sits above every layer that does — a passive layer under a dialog
     * is not answering keys meant for the dialog.
     *
     * @param layer The layer, as it was handed to {@link addLayer}.
     * @returns `false` while the layer is not open.
     */
    export const getIsTopForInput = (layer: DismisserLayerDefs) => {
        const open = layers.get();
        const index = open.indexOf(layer);

        return index >= 0 && open.slice(index + 1).every((above) => above.isPassive);
    };

    /**
     * Registers an open layer, to be dismissed until the returned function is called.
     *
     * The layer goes on top of the stack. Document listeners are attached with the first layer and removed with
     * the last, so a page with nothing open listens for nothing. Removing the same layer twice is harmless.
     *
     * @param defs The layer's own elements, and what to do when it is dismissed. The reason is passed
     * on, since a layer often wants to return focus to its trigger after Escape but not after a press
     * elsewhere. `isPassive` marks a layer that takes no input of its own, which {@link getTopLayer} skips, and is
     * read whenever the stack is asked, so a getter may answer it. `group` names a set of layers of which only the
     * topmost should act, for {@link getTopLayerInGroup}.
     * @returns The function that takes the layer off the stack again, for when it closes.
     */
    export const addLayer = (defs: DismisserLayerDefs) => {
        layers.update((current) => [...current, defs]);

        if (layers.get().length === 1) attach();

        return () => {
            if (!layers.get().includes(defs)) return;

            layers.update((current) => current.filter((layer) => layer !== defs));

            if (layers.get().length === 0) detach();
        };
    };
}

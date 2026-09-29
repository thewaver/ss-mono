import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import type { SidebarPhase } from "./Sidebar.types";

/** A control inside the sidebar that says it has a popup open, and names it. */
const OPEN_CONTROLLER_SELECTOR = '[aria-expanded="true"][aria-controls]';

/** The part of a sidebar that is not about drawing it: its phase, and what holds a hover-expanded one open. */
export namespace SidebarUtils {
    /**
     * Which of its four phases the sidebar is in.
     *
     * @param isExpanded Whether it is expanded, or on its way there.
     * @param hasTransitionFinished Whether the growth or shrinking has run its course.
     * @returns `"expanding"` or `"collapsing"` while the transition runs, and `"expanded"` or `"collapsed"` once
     * it has finished.
     */
    export const computePhase = (isExpanded: boolean, hasTransitionFinished: boolean): SidebarPhase => {
        if (isExpanded) return hasTransitionFinished ? "expanded" : "expanding";

        return hasTransitionFinished ? "collapsed" : "collapsing";
    };

    /**
     * Whether something opened from inside the sidebar is still open somewhere outside it.
     *
     * A popup opened from the sidebar is portaled out of it, so reaching it takes the pointer out of the sidebar
     * too. Any control inside that reports itself expanded and names what it controls counts, as long as at least
     * one of the elements it names exists and sits outside the sidebar.
     *
     * @param root The sidebar's own element, or `undefined` before it exists.
     * @returns Whether such a popup is open.
     */
    export const getHasOpenPopupOutside = (root: HTMLElement | undefined) =>
        root !== undefined &&
        [...root.querySelectorAll(OPEN_CONTROLLER_SELECTOR)].some((controller) =>
            (controller.getAttribute("aria-controls") ?? "").split(/\s+/).some((id) => {
                const controlled = id ? document.getElementById(id) : null;

                return controlled !== null && !root.contains(controlled);
            }),
        );

    /**
     * Calls back on the first pointer move that has left the sidebar for good.
     *
     * A move over the sidebar, over a layer it owns, or anywhere while {@link getHasOpenPopupOutside} still holds it
     * does not count, so the pointer can travel out to a popup the sidebar opened and back.
     *
     * @param root The sidebar's own element.
     * @param onAway Called on each move that counts.
     * @returns The function that stops listening.
     */
    export const observePointerAway = (root: HTMLElement | undefined, onAway: () => void) => {
        const handlePointerMove = (e: PointerEvent) => {
            if (getHasOpenPopupOutside(root) || DismisserUtils.getIsWithinOwnedLayer(e.target as Node | null, [root])) {
                return;
            }

            onAway();
        };

        document.addEventListener("pointermove", handlePointerMove);

        return () => document.removeEventListener("pointermove", handlePointerMove);
    };
}

import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

type ElevationEntry = {
    element: HTMLElement;
    zIndex: number;
};

const NO_ELEVATION = 0;

const entries: ElevationEntry[] = [];

const [getRevision, setRevision] = createSignal(0);

const bumpRevision = () => {
    setRevision((previous) => previous + 1);
};

/**
 * Tracks the stacking contexts an element is nested inside, so a popup can be raised above them.
 *
 * A popup rendered into a portal loses whatever `z-index` its opener sat under, and a popup
 * rendered in place cannot escape an ancestor that has one. Both cases need the same answer: what
 * is the highest `z-index` already applied to something containing me. Registrations live in one
 * module-wide list, so any component can ask without knowing who else is on screen.
 */
export namespace ElevationUtils {
    /**
     * Registers an element as a stacking layer for as long as the owning component lives.
     *
     * Call this from a component that raises itself — a modal, a drawer, a popover — so that anything
     * opening inside it can find out how high it must go. The registration follows the accessors: it
     * is added when the layer becomes active, moved when its element or index changes, and removed on
     * cleanup.
     *
     * @param getElement The element whose subtree the layer covers. Nothing is registered until it
     * exists.
     * @param getIsActive Whether the layer currently applies; a closed popup should report `false`.
     * @param getZIndex The `z-index` actually being applied to that element.
     */
    export const createElevation = (
        getElement: Accessor<HTMLElement | undefined>,
        getIsActive: Accessor<boolean>,
        getZIndex: Accessor<number>,
    ) => {
        createEffect(() => {
            const element = getElement();
            const zIndex = getZIndex();

            if (!getIsActive() || !element) return;

            const entry: ElevationEntry = { element, zIndex };

            entries.push(entry);
            bumpRevision();

            onCleanup(() => {
                const index = entries.indexOf(entry);

                if (index >= 0) entries.splice(index, 1);

                bumpRevision();
            });
        });
    };

    /**
     * Reports the `z-index` an element has to clear to sit above everything containing it.
     *
     * Reading this inside a reactive context re-runs whenever a layer is added or removed, so a popup
     * that opens while a modal is already up gets the modal's index rather than a stale zero.
     *
     * @param element The element about to be raised.
     * @returns The highest registered index among the layers containing it, or `0` when it is inside
     * none of them. Add the caller's own step to it rather than using it directly.
     */
    export const getBase = (element: HTMLElement | undefined) => {
        getRevision();

        if (!element) return NO_ELEVATION;

        let base = NO_ELEVATION;

        for (const entry of entries) {
            if (entry.element.contains(element)) base = Math.max(base, entry.zIndex);
        }

        return base;
    };
}

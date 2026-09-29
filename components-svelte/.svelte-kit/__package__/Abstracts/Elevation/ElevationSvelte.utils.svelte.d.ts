/** The Svelte side of {@link ElevationUtils}: layers registered from getters, and a base that re-reads itself. */
export declare namespace ElevationSvelteUtils {
    /**
     * Registers an element as a stacking layer for as long as the calling component lives.
     *
     * {@link ElevationUtils.addElevation} following getters: the layer is added when it becomes active, moved when
     * its element or index changes, and removed when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param getElement The element whose subtree the layer covers. Nothing is registered until it exists.
     * @param getIsActive Whether the layer currently applies; a closed popup should report `false`.
     * @param getZIndex The `z-index` actually being applied to that element.
     */
    const createElevation: (getElement: () => HTMLElement | undefined, getIsActive: () => boolean, getZIndex: () => number) => void;
    /**
     * Reports the `z-index` an element has to clear to sit above everything containing it.
     *
     * {@link ElevationUtils.getBase}, read again whenever a layer is added or removed when it is read inside an
     * effect, a `$derived` or markup, so a popup that opens while a modal is already up gets the modal's index
     * rather than a stale zero.
     *
     * @param element The element about to be raised.
     * @returns The highest registered index among the layers containing it, or `0` when it is inside none of them.
     * Add the caller's own step to it rather than using it directly.
     */
    const getBase: (element: HTMLElement | undefined) => number;
}

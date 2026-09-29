/** The Svelte side of {@link SmootherUtils}: trailing values driven by getters, read as a getter. */
export declare namespace SmootherSvelteUtils {
    /**
     * Follows a list of numbers, easing towards each change on animation frames.
     *
     * {@link SmootherUtils.create} fed from two getters and read as one. The frame being waited for is called off
     * when the component is destroyed.
     *
     * Must run while a component is being set up.
     *
     * @param getTargets The values to follow, read reactively.
     * @param getSmoothingMs How slowly they are followed, as {@link SmootherUtils.getStep} takes it.
     * @returns The trailing values, one per target, in the same order.
     */
    const create: (getTargets: () => number[], getSmoothingMs: () => number) => (() => number[]);
}

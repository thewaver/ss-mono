/** The Svelte side of {@link MediaQueryMonitorUtils}: a media query as a getter. */
export declare namespace MediaQueryMonitorSvelteUtils {
    /**
     * Watches a media query.
     *
     * {@link MediaQueryMonitorUtils.create} as a getter, joining the shared count for as long as the component lives
     * and is not disabled.
     *
     * Must run while a component is being set up.
     *
     * @param query The query text, as it would be written in CSS. Read once.
     * @param getIsDisabled Pass `true` to not listen at all. For a component that only consults the query when a
     * prop it is optional on has been given — it still has to ask for the getter while setting up, and this is how
     * it asks without joining the count.
     * @returns Whether it currently matches. `false` until the query is first evaluated, which happens as soon as the
     * component has mounted, and `false` for as long as it is disabled.
     */
    const create: (query: string, getIsDisabled?: () => boolean) => () => boolean;
    /**
     * Whether the user has asked for reduced motion.
     *
     * Anything that animates should consult this and offer a still or much shorter alternative — motion can cause
     * real discomfort, and the request is explicit.
     *
     * @param getIsDisabled Pass `true` to not listen at all. See {@link create}.
     * @returns Whether motion should be reduced.
     */
    const createReducedMotion: (getIsDisabled?: () => boolean) => () => boolean;
}

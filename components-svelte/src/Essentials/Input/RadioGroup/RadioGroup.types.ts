import type { Snippet } from "svelte";

import type { BaseRadioGroupProps } from "@thewaver/ss-components";

export type RadioGroupProps<T> = BaseRadioGroupProps & {
    /**
     * Which option is picked. Bind it with `bind:value`; it is the only thing that picks one: each `Radio` inside is
     * checked when its `value` is this one, compared by identity.
     */
    value: T;
    /**
     * Draws the marker that slides to the picked option, behind it. The fade is handed in rather than applied: the
     * marker fades out when nothing is picked and in when something is.
     */
    renderSelectionFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /**
     * Draws the marker that slides to the option under the pointer, or the one holding focus, behind it. It fades
     * out when neither is on an option, and is drawn under the picked option's marker where both are given.
     */
    renderHighlightFloater?: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;
    /** The options, each a `Radio`. */
    children?: Snippet;
};

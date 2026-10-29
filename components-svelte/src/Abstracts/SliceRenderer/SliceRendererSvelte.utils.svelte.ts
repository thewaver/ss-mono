import { untrack } from "svelte";

import { type SliceRendererItem, type SliceRendererPicture, SliceRendererUtils } from "@thewaver/ss-components";

/** The Svelte side of {@link SliceRendererUtils}: whether the graphics card can draw, a picture's status and an item. */
export namespace SliceRendererSvelteUtils {
    /**
     * Whether the graphics card is available, kept current as the browser takes it away and gives it back.
     *
     * Must run while a component is being set up.
     *
     * @param getIsDisabled Pass `true` to not listen at all, for a component asked to draw with page elements.
     * @returns `false` for as long as it is disabled.
     */
    export const createIsAvailable = (getIsDisabled: () => boolean) => {
        let isAvailable = $state(false);

        $effect(() => {
            if (getIsDisabled()) return;

            untrack(() => {
                isAvailable = SliceRendererUtils.getIsAvailable();
            });

            return SliceRendererUtils.subscribe(() => {
                isAvailable = SliceRendererUtils.getIsAvailable();
            });
        });

        return () => !getIsDisabled() && isAvailable;
    };

    /**
     * A picture as the graphics card sees it, kept current as it loads.
     *
     * Must run while a component is being set up.
     *
     * @param getSrc The picture's address.
     * @param getIsDisabled Pass `true` to not load it at all, for a component that needs neither the graphics card
     * nor the picture's size.
     * @returns Its status and size, or `undefined` while disabled.
     */
    export const createPicture = (getSrc: () => string, getIsDisabled: () => boolean) => {
        let picture = $state.raw<SliceRendererPicture>();

        $effect(() => {
            const src = getSrc();
            const isDisabled = getIsDisabled();

            if (isDisabled) {
                picture = undefined;

                return;
            }

            let isCurrent = true;

            picture = untrack(() =>
                SliceRendererUtils.requestPicture(src, () => {
                    if (isCurrent) picture = SliceRendererUtils.requestPicture(src, () => undefined);
                }),
            );

            return () => {
                isCurrent = false;
            };
        });

        return () => picture;
    };

    /**
     * An item bound to a canvas, made again whenever the graphics card comes back after being taken away.
     *
     * Must run while a component is being set up.
     *
     * @param getRef The component's canvas, once it is on the page.
     * @param getIsAvailable From {@link createIsAvailable}.
     * @returns The item, or `undefined` while there is no canvas or no graphics card.
     */
    export const createItem = (getRef: () => HTMLCanvasElement | undefined, getIsAvailable: () => boolean) => {
        let item = $state.raw<SliceRendererItem>();

        $effect(() => {
            const ref = getRef();
            const isAvailable = getIsAvailable();

            if (!ref || !isAvailable) return;

            const next = untrack(() => SliceRendererUtils.createItem(ref));

            item = next;

            return () => {
                next?.dispose();
                item = undefined;
            };
        });

        return () => item;
    };
}

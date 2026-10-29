import { type Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import { type SliceRendererItem, type SliceRendererPicture, SliceRendererUtils } from "@thewaver/ss-components";

/** The Solid side of {@link SliceRendererUtils}: whether the graphics card can draw, a picture's status and an item. */
export namespace SliceRendererSolidUtils {
    /**
     * Whether the graphics card is available, kept current as the browser takes it away and gives it back.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsDisabled Pass `true` to not listen at all, for a component asked to draw with page elements.
     * @returns `false` for as long as it is disabled.
     */
    export const createIsAvailable = (getIsDisabled: Accessor<boolean>) => {
        const [getIsAvailable, setIsAvailable] = createSignal(false);

        createEffect(() => {
            if (getIsDisabled()) return;

            setIsAvailable(SliceRendererUtils.getIsAvailable());

            onCleanup(SliceRendererUtils.subscribe(() => setIsAvailable(SliceRendererUtils.getIsAvailable())));
        });

        return () => !getIsDisabled() && getIsAvailable();
    };

    /**
     * A picture as the graphics card sees it, kept current as it loads.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getSrc The picture's address.
     * @param getIsDisabled Pass `true` to not load it at all, for a component that needs neither the graphics card
     * nor the picture's size.
     * @returns Its status and size, or `undefined` while disabled.
     */
    export const createPicture = (getSrc: Accessor<string>, getIsDisabled: Accessor<boolean>) => {
        const [getPicture, setPicture] = createSignal<SliceRendererPicture>();

        createEffect(() => {
            const src = getSrc();

            if (getIsDisabled()) {
                setPicture(undefined);

                return;
            }

            let isCurrent = true;

            setPicture(
                SliceRendererUtils.requestPicture(src, () => {
                    if (isCurrent) setPicture(SliceRendererUtils.requestPicture(src, () => undefined));
                }),
            );

            onCleanup(() => {
                isCurrent = false;
            });
        });

        return getPicture;
    };

    /**
     * An item bound to a canvas, made again whenever the graphics card comes back after being taken away.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getRef The component's canvas, once it is on the page.
     * @param getIsAvailable From {@link createIsAvailable}.
     * @returns The item, or `undefined` while there is no canvas or no graphics card.
     */
    export const createItem = (getRef: Accessor<HTMLCanvasElement | undefined>, getIsAvailable: Accessor<boolean>) => {
        const [getItem, setItem] = createSignal<SliceRendererItem>();

        createEffect(() => {
            const ref = getRef();
            const isAvailable = getIsAvailable();

            if (!ref || !isAvailable) return;

            const item = SliceRendererUtils.createItem(ref);

            setItem(item);

            onCleanup(() => {
                item?.dispose();
                setItem(undefined);
            });
        });

        return getItem;
    };
}

import { type RefObject, useLayoutEffect, useState } from "react";

import { type SliceRendererItem, type SliceRendererPicture, SliceRendererUtils } from "@thewaver/ss-components";

import { useElement } from "../../Utils/refUtils";

/** The React side of `SliceRendererUtils`: whether the graphics card can draw, a picture's status and an item. */
export namespace SliceRendererReactUtils {
    /**
     * Whether the graphics card is available, kept current as the browser takes it away and gives it back.
     *
     * @param isDisabled Pass `true` to not listen at all, for a component asked to draw with page elements.
     * @returns `false` until it is first checked, and `false` for as long as it is disabled.
     */
    export const useIsAvailable = (isDisabled: boolean) => {
        const [isAvailable, setIsAvailable] = useState(false);

        useLayoutEffect(() => {
            if (isDisabled) return;

            const update = () => setIsAvailable(SliceRendererUtils.getIsAvailable());

            update();

            return SliceRendererUtils.subscribe(update);
        }, [isDisabled]);

        return !isDisabled && isAvailable;
    };

    /**
     * A picture as the graphics card sees it, kept current as it loads.
     *
     * @param src The picture's address.
     * @param isDisabled Pass `true` to not load it at all, for a component that needs neither the graphics card nor
     * the picture's size.
     * @returns Its status and size, or `undefined` before it is first requested and while disabled.
     */
    export const usePicture = (src: string, isDisabled: boolean) => {
        const [picture, setPicture] = useState<SliceRendererPicture>();

        useLayoutEffect(() => {
            if (isDisabled) {
                setPicture(undefined);

                return;
            }

            let isCurrent = true;

            setPicture(
                SliceRendererUtils.requestPicture(src, () => {
                    if (isCurrent) setPicture(SliceRendererUtils.requestPicture(src, () => undefined));
                }),
            );

            return () => {
                isCurrent = false;
            };
        }, [src, isDisabled]);

        return picture;
    };

    /**
     * An item bound to a canvas, made again whenever the graphics card comes back after being taken away.
     *
     * @param ref The component's canvas. Nothing is made until it exists.
     * @param isAvailable From {@link useIsAvailable}.
     * @returns The item, or `undefined` while there is no canvas or no graphics card.
     */
    export const useItem = (ref: RefObject<HTMLCanvasElement | null>, isAvailable: boolean) => {
        const element = useElement(ref);
        const [item, setItem] = useState<SliceRendererItem>();

        useLayoutEffect(() => {
            if (!element || !isAvailable) return;

            const next = SliceRendererUtils.createItem(element);

            setItem(next);

            return () => {
                next?.dispose();
                setItem(undefined);
            };
        }, [element, isAvailable]);

        return item;
    };
}

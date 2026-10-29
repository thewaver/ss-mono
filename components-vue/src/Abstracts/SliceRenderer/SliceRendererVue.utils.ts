import { type MaybeRefOrGetter, computed, shallowRef, toValue, watch } from "vue";

import { type SliceRendererItem, type SliceRendererPicture, SliceRendererUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `SliceRendererUtils`: whether the graphics card can draw, a picture's status and an item. */
export namespace SliceRendererVueUtils {
    /**
     * Whether the graphics card is available, kept current as the browser takes it away and gives it back.
     *
     * Must run inside a component's `setup`.
     *
     * @param isDisabled Pass `true` to not listen at all, for a component asked to draw with page elements.
     * @returns A computed ref, `false` for as long as it is disabled.
     */
    export const useIsAvailable = (isDisabled: MaybeRefOrGetter<boolean> = false) => {
        const isAvailable = shallowRef(false);

        watch(
            () => toValue(isDisabled),
            (isOff, _, onCleanup) => {
                if (isOff) return;

                isAvailable.value = SliceRendererUtils.getIsAvailable();

                onCleanup(
                    SliceRendererUtils.subscribe(() => {
                        isAvailable.value = SliceRendererUtils.getIsAvailable();
                    }),
                );
            },
            { immediate: true },
        );

        return computed(() => !toValue(isDisabled) && isAvailable.value);
    };

    /**
     * A picture as the graphics card sees it, kept current as it loads.
     *
     * Must run inside a component's `setup`.
     *
     * @param src The picture's address.
     * @param isDisabled Pass `true` to not load it at all, for a component that needs neither the graphics card nor
     * the picture's size.
     * @returns A ref of its status and size, or `undefined` while disabled.
     */
    export const usePicture = (src: MaybeRefOrGetter<string>, isDisabled: MaybeRefOrGetter<boolean> = false) => {
        const picture = shallowRef<SliceRendererPicture>();

        watch(
            [() => toValue(src), () => toValue(isDisabled)],
            ([currentSrc, isOff], _, onCleanup) => {
                if (isOff) {
                    picture.value = undefined;

                    return;
                }

                let isCurrent = true;

                picture.value = SliceRendererUtils.requestPicture(currentSrc, () => {
                    if (isCurrent) picture.value = SliceRendererUtils.requestPicture(currentSrc, () => undefined);
                });

                onCleanup(() => {
                    isCurrent = false;
                });
            },
            { immediate: true },
        );

        return picture;
    };

    /**
     * An item bound to a canvas, made again whenever the graphics card comes back after being taken away.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The component's canvas, once it is on the page.
     * @param isAvailable From {@link useIsAvailable}.
     * @returns A ref of the item, or `undefined` while there is no canvas or no graphics card.
     */
    export const useItem = (
        ref: MaybeRefOrGetter<HTMLCanvasElement | null | undefined>,
        isAvailable: MaybeRefOrGetter<boolean>,
    ) => {
        const item = shallowRef<SliceRendererItem>();

        watchAfterRender([() => toValue(ref), () => toValue(isAvailable)], ([canvas, isOn]) => {
            if (!canvas || !isOn) return;

            const created = SliceRendererUtils.createItem(canvas);

            item.value = created;

            return () => {
                created?.dispose();
                item.value = undefined;
            };
        });

        return item;
    };
}

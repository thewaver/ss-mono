import { type ComponentPublicInstance, type MaybeRefOrGetter, computed, shallowRef, toValue } from "vue";

import { type AnchorPlacement, AnchorUtils, ElevationUtils } from "@thewaver/ss-components";
import { type Point2d, type Rect, Size2d } from "@thewaver/ss-utils";

import { watchAfterRender } from "../../Utils/effectUtils";
import { toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import { ElementObserverVueUtils } from "../ElementObserver/ElementObserverVue.utils";
import { useViewportContext } from "../Viewport/Viewport.context";

/** The Vue side of `AnchorUtils`: the positioning cycle for portaled content, as refs. */
export namespace AnchorVueUtils {
    /**
     * Runs the whole positioning cycle for portaled content.
     *
     * It measures the anchor and the content, chooses a placement that fits, clamps the result into the free space,
     * and reports a `z-index` that clears both the document's own stacking and any registered layer. Everything is
     * worked out again as the anchor moves, the content resizes or the viewport changes, and measuring stops while
     * the content is hidden, so a closed popup costs nothing. The arithmetic is `AnchorUtils.computePortalPlacement`,
     * `AnchorUtils.computePortalPosition` and their neighbors.
     *
     * Must run inside a component's `setup`.
     *
     * @param anchorRef The element to position against.
     * @param isVisible Whether the content is currently shown.
     * @param opts.placement The placement to aim for.
     * @param opts.offset The gap to hold between anchor and content.
     * @param opts.reservedScreenSize A margin to keep clear at the screen edges.
     * @param opts.anchorRect Supplies the anchor rectangle directly, for content anchored to something that is not
     * an element. Given this, no element is observed.
     * @param opts.isPinned Keeps the placement asked for and skips clamping.
     * @returns Computed refs: `anchorRect` and `isAnchorOnScreen` for deciding whether to draw at all, `placement`
     * for styling that depends on which way the content opened, `position` for where to put it, and `zIndex`; and
     * `setContentRef`, a function ref for the content's own element, without which nothing has a size to work with.
     * `position` is `undefined` until both anchor and content have been measured.
     */
    export const usePortalPosition = (
        anchorRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
        isVisible: MaybeRefOrGetter<boolean>,
        opts: {
            placement: MaybeRefOrGetter<AnchorPlacement>;
            offset?: MaybeRefOrGetter<Point2d | undefined>;
            reservedScreenSize?: MaybeRefOrGetter<Size2d | undefined>;
            anchorRect?: MaybeRefOrGetter<Rect | undefined>;
            isPinned?: MaybeRefOrGetter<boolean | undefined>;
        },
    ) => {
        const viewportContext = useViewportContext();
        const layers = useStore(ElevationUtils.registeredLayers);
        const contentElement = shallowRef<HTMLElement>();
        const contentSize = shallowRef<Size2d>();

        const observedRect = ElementObserverVueUtils.useViewportRect(
            anchorRef,
            () => toValue(isVisible) && !toValue(opts.anchorRect),
        );

        const anchorRect = computed(() => toValue(opts.anchorRect) ?? observedRect.value);

        const getLayoutOpts = () => ({
            offset: toValue(opts.offset),
            reservedScreenSize: toValue(opts.reservedScreenSize),
            isPinned: toValue(opts.isPinned),
        });

        const placement = computed(() =>
            AnchorUtils.computePortalPlacement(
                toValue(opts.placement),
                anchorRect.value,
                contentSize.value,
                viewportContext.getSize(),
                getLayoutOpts(),
            ),
        );

        const position = computed(() =>
            AnchorUtils.computePortalPosition(
                placement.value,
                anchorRect.value,
                contentSize.value,
                viewportContext.getSize(),
                getLayoutOpts(),
            ),
        );

        const isAnchorOnScreen = computed(() =>
            AnchorUtils.getIsAnchorOnScreen(anchorRect.value, viewportContext.getSize()),
        );

        const zIndex = computed(() => {
            if (!toValue(isVisible)) return 1;

            void layers.value;

            const anchor = toValue(anchorRef) ?? undefined;

            return Math.max(AnchorUtils.getStackingBase(anchor), ElevationUtils.getBase(anchor)) + 1;
        });

        watchAfterRender([contentElement, () => toValue(isVisible)], ([content, isShown]) => {
            if (!content || !isShown) return;

            const stop = AnchorUtils.observeContentSize(content, (size) => {
                if (!contentSize.value || !Size2d.isSame(contentSize.value, size)) contentSize.value = size;
            });

            return () => {
                stop();
                contentSize.value = undefined;
            };
        });

        return {
            anchorRect,
            isAnchorOnScreen,
            placement,
            position,
            zIndex,
            setContentRef: (target: Element | ComponentPublicInstance | null) => {
                contentElement.value = toElement(target);
            },
        };
    };
}

import { type SlotsType, computed, defineComponent, shallowRef, watch } from "vue";

import {
    TREEMAP_DEFAULTS,
    TREEMAP_ZOOM_EASING,
    type TreemapNode,
    TreemapStyles,
    type TreemapTransition,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { TreemapProps, TreemapSlots } from "./Treemap.types";

const NOTHING = 0;
const HIDDEN = 0;
const SHOWN = 1;
const NEXT = 1;

type TreemapZoomState<T> = {
    branch: TreemapNode<T>;
    cameFrom: TreemapNode<T> | undefined;
    transition: TreemapTransition<T> | undefined;
    generation: number;
};

export const Treemap = defineComponent(
    <T,>(props: TreemapProps<T>, { slots }: SlotsContext<TreemapSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const layerRef = shallowRef<HTMLUListElement>();
        const leavingLayerRef = shallowRef<HTMLUListElement>();
        const itemRefs = new Map<TreemapNode<T>, HTMLElement>();
        const tileRefs = new Map<TreemapNode<T>, HTMLElement>();
        const leavingItemRefs: Array<HTMLElement | undefined> = [];

        let isFocusPending = false;

        const focusedNode = shallowRef<TreemapNode<T>>();

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const weights = computed(() => TreemapUtils.computeWeights(props.root));

        const heldBranch = useTwoWay(props, "branch", props.root);

        const branch = computed(() => TreemapUtils.resolveBranch(heldBranch.value, props.root, weights.value));

        const zoom = shallowRef<TreemapZoomState<T>>({
            branch: branch.value,
            cameFrom: undefined,
            transition: undefined,
            generation: NOTHING,
        });

        watch(branch, (next) => {
            const current = zoom.value;

            zoom.value = {
                branch: next,
                cameFrom: current.branch,
                transition: TreemapUtils.computeTransition(
                    next,
                    current.branch,
                    weights.value,
                    size.value,
                    props.zoomDurationMs ?? TREEMAP_DEFAULTS.zoomDurationMs,
                ),
                generation: current.generation + NEXT,
            };
        });

        const tiles = computed(() => TreemapUtils.computeTiles(branch.value, weights.value, size.value));

        const stops = computed(() =>
            tiles.value.map((tile) => tile.node).filter((node) => TreemapUtils.getIsBranch(node, weights.value)),
        );

        const rovingNode = computed(() => TreemapUtils.resolveStop(focusedNode.value, stops.value));

        const zoomTo = (node: TreemapNode<T>) => {
            if (node === branch.value) return;

            isFocusPending = rootRef.value?.contains(document.activeElement) ?? false;

            heldBranch.value = node;
        };

        const focusNode = (node: TreemapNode<T>) => {
            focusedNode.value = node;
            tileRefs.get(node)?.focus();
        };

        watchAfterRender([() => zoom.value.generation], () => {
            const transition = zoom.value.transition;
            const animations: Animation[] = [];

            if (transition) {
                const timing = { duration: transition.durationMs, easing: TREEMAP_ZOOM_EASING };

                tiles.value.forEach((tile) => {
                    const from = TreemapUtils.computeEnteringStart(tile.rect, size.value, transition);
                    const animation = itemRefs
                        .get(tile.node)
                        ?.animate([TreemapUtils.toBox(from), TreemapUtils.toBox(tile.rect)], timing);

                    if (animation) animations.push(animation);
                });

                if (transition.zoom === "in") {
                    const fade = layerRef.value?.animate([{ opacity: HIDDEN }, { opacity: SHOWN }], timing);

                    if (fade) animations.push(fade);
                }
            }

            if (isFocusPending) {
                isFocusPending = false;

                const target = TreemapUtils.resolveStop(zoom.value.cameFrom, stops.value);

                if (target !== undefined) focusNode(target);
                else layerRef.value?.focus();
            }

            return () => animations.forEach((animation) => animation.cancel());
        });

        watchAfterRender([() => zoom.value.transition], ([transition]) => {
            const layer = leavingLayerRef.value;

            if (!transition || !layer) return;

            const timing: KeyframeAnimationOptions = {
                duration: transition.durationMs,
                easing: TREEMAP_ZOOM_EASING,
                fill: "forwards",
            };

            const animations = transition.leavingTiles.map((tile, index) =>
                leavingItemRefs[index]?.animate(
                    [
                        TreemapUtils.toBox(tile.rect),
                        TreemapUtils.toBox(TreemapUtils.computeLeavingEnd(tile.rect, size.value, transition)),
                    ],
                    timing,
                ),
            );

            const fade = layer.animate(
                [{ opacity: SHOWN }, { opacity: transition.zoom === "in" ? SHOWN : HIDDEN }],
                timing,
            );

            fade.onfinish = () => {
                if (zoom.value.transition === transition) zoom.value = { ...zoom.value, transition: undefined };
            };

            return () => {
                fade.onfinish = null;
                fade.cancel();
                animations.forEach((animation) => animation?.cancel());
            };
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                const parent = TreemapUtils.findParent(props.root, branch.value);

                if (!parent) return;

                e.preventDefault();
                zoomTo(parent);

                return;
            }

            const roving = rovingNode.value;

            if (roving === undefined || e.target !== tileRefs.get(roving)) return;

            const action = TreemapUtils.computeKeyAction(e.key, roving, stops.value);

            if (!action) return;

            e.preventDefault();

            if (action.kind === "zoom") zoomTo(action.node);
            else focusNode(action.node);
        };

        return () => {
            const { transition: leaving, generation } = zoom.value;

            return (
                <div
                    ref={rootRef}
                    class={[TreemapStyles.treemapRoot, leaving && TreemapStyles.treemapZooming]}
                    onKeydown={handleKeyDown}
                >
                    {leaving && (
                        <ul
                            key={`leaving-${generation}`}
                            ref={leavingLayerRef}
                            class={[
                                TreemapStyles.treemapLayer,
                                TreemapStyles.treemapLeaving,
                                leaving.zoom === "out" && TreemapStyles.treemapOnTop,
                            ]}
                            aria-hidden="true"
                        >
                            {leaving.leavingTiles.map((tile, index) => (
                                <li
                                    key={index}
                                    ref={(target) => {
                                        leavingItemRefs[index] = toElement(target);
                                    }}
                                    class={TreemapStyles.treemapItem}
                                    style={TreemapUtils.toBox(tile.rect)}
                                >
                                    <div class={TreemapStyles.treemapTile}>
                                        {callSlot(slots.renderTile, {
                                            node: tile.node,
                                            state: {
                                                rect: tile.rect,
                                                weight: tile.weight,
                                                isBranch: TreemapUtils.getIsBranch(tile.node, weights.value),
                                                isLeaving: true,
                                            },
                                        })}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    <ul
                        key={`level-${generation}`}
                        ref={layerRef}
                        class={TreemapStyles.treemapLayer}
                        tabindex={-1}
                        aria-label={props.ariaLabel}
                    >
                        {tiles.value.map((tile, index) => {
                            const node = tile.node;
                            const isBranch = TreemapUtils.getIsBranch(node, weights.value);

                            return (
                                <li
                                    key={index}
                                    ref={(target) => {
                                        const element = toElement(target);

                                        if (element) itemRefs.set(node, element);
                                        else itemRefs.delete(node);
                                    }}
                                    class={TreemapStyles.treemapItem}
                                    style={TreemapUtils.toBox(tile.rect)}
                                >
                                    <div
                                        ref={(target) => {
                                            const element = toElement(target);

                                            if (element) tileRefs.set(node, element);
                                            else tileRefs.delete(node);
                                        }}
                                        class={TreemapStyles.treemapTile}
                                        role={isBranch ? "button" : undefined}
                                        tabindex={isBranch ? (node === rovingNode.value ? 0 : -1) : undefined}
                                        onClick={() => {
                                            if (!isBranch) return;

                                            focusedNode.value = node;
                                            zoomTo(node);
                                        }}
                                    >
                                        {callSlot(slots.renderTile, {
                                            node,
                                            state: { rect: tile.rect, weight: tile.weight, isBranch, isLeaving: false },
                                        })}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        };
    },
    {
        name: "Treemap",
        slots: Object as SlotsType<TreemapSlots<any>>,
        props: declareProps<TreemapProps<unknown>>({
            "ariaLabel": null,
            "zoomDurationMs": null,
            "root": null,
            "branch": null,
            "onUpdate:branch": null,
        }),
    },
);

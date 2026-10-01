import { Fragment, type SlotsType, computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

import {
    CIRCLE_PACKING_DEFAULTS,
    type CirclePackingCircle,
    type CirclePackingCircleState,
    type CirclePackingNode,
    CirclePackingStyles,
    CirclePackingUtils,
    type CirclePackingView,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { CirclePackingProps, CirclePackingSlots } from "./CirclePacking.types";

const NOTHING = 0;
const NEXT = 1;
const HALF = 0.5;
const EMPTY_CIRCLE: CirclePackingCircle = { x: 0, y: 0, radius: 0 };

type CirclePackingZoomState<T> = {
    branch: CirclePackingNode<T>;
    cameFrom: CirclePackingNode<T> | undefined;
    path: ((progress: number) => CirclePackingView) | undefined;
    generation: number;
};

export const CirclePacking = defineComponent(
    <T,>(props: CirclePackingProps<T>, { slots }: SlotsContext<CirclePackingSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const circleRefs = new Map<CirclePackingNode<T>, SVGGElement>();

        let isFocusPending = false;

        const zoomClock = TreemapUtils.createZoomClock();
        const focusedNode = shallowRef<CirclePackingNode<T>>();

        const progress = useStore(zoomClock);
        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);
        const side = computed(() => Math.min(size.value.width, size.value.height));

        const weights = computed(() => TreemapUtils.computeWeights(props.root));
        const layout = computed(() =>
            CirclePackingUtils.computeLayout(
                props.root,
                weights.value,
                side.value,
                props.padding ?? CIRCLE_PACKING_DEFAULTS.padding,
            ),
        );
        const nodes = computed(() => CirclePackingUtils.listNodes(props.root, layout.value));
        const depths = computed(() => CirclePackingUtils.computeDepths(props.root));
        const nodeKeys = computed(() => new Map(nodes.value.map((node, index) => [node, index])));

        const heldBranch = useTwoWay(props, "branch", props.root);

        const branch = computed(() => TreemapUtils.resolveBranch(heldBranch.value, props.root, weights.value));

        const zoom = shallowRef<CirclePackingZoomState<T>>({
            branch: branch.value,
            cameFrom: undefined,
            path: undefined,
            generation: NOTHING,
        });

        watch(branch, (next) => {
            const current = zoom.value;
            const from = CirclePackingUtils.computeShownView(
                current.path,
                CirclePackingUtils.toView(layout.value.get(current.branch) ?? EMPTY_CIRCLE),
                progress.value,
            );

            zoom.value = {
                branch: next,
                cameFrom: current.branch,
                path: CirclePackingUtils.interpolateZoom(
                    from,
                    CirclePackingUtils.toView(layout.value.get(next) ?? EMPTY_CIRCLE),
                ),
                generation: current.generation + NEXT,
            };
        });

        const getIsInView = (node: CirclePackingNode<T>) => branch.value.children?.includes(node) ?? false;

        const stops = computed(() =>
            nodes.value.filter((node) => getIsInView(node) && TreemapUtils.getIsBranch(node, weights.value)),
        );

        const rovingNode = computed(() => TreemapUtils.resolveStop(focusedNode.value, stops.value));

        const zoomTo = (node: CirclePackingNode<T>) => {
            if (node === branch.value) return;

            isFocusPending = rootRef.value?.contains(document.activeElement) ?? false;

            heldBranch.value = node;
        };

        const focusNode = (node: CirclePackingNode<T>) => {
            focusedNode.value = node;
            circleRefs.get(node)?.focus();
        };

        onScopeDispose(zoomClock.stop);

        watchAfterRender([() => zoom.value.generation], ([generation]) => {
            if (generation === NOTHING) return;

            zoomClock.start(props.zoomDurationMs ?? CIRCLE_PACKING_DEFAULTS.zoomDurationMs);
        });

        watchAfterRender([() => zoom.value.generation], () => {
            if (!isFocusPending) return;

            isFocusPending = false;

            const target = TreemapUtils.resolveStop(zoom.value.cameFrom, stops.value);

            if (target !== undefined) focusNode(target);
            else rootRef.value?.focus();
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

            if (roving === undefined || e.target !== circleRefs.get(roving)) return;

            const action = TreemapUtils.computeKeyAction(e.key, roving, stops.value);

            if (!action) return;

            e.preventDefault();

            if (action.kind === "zoom") zoomTo(action.node);
            else focusNode(action.node);
        };

        return () => {
            const view = CirclePackingUtils.computeShownView(
                zoom.value.path,
                CirclePackingUtils.toView(layout.value.get(branch.value) ?? EMPTY_CIRCLE),
                progress.value,
            );

            const computeState = (node: CirclePackingNode<T>): CirclePackingCircleState => ({
                ...CirclePackingUtils.project(layout.value.get(node) ?? EMPTY_CIRCLE, view, side.value),
                weight: weights.value.get(node) ?? NOTHING,
                isBranch: TreemapUtils.getIsBranch(node, weights.value),
                isInView: getIsInView(node),
                depth: depths.value.get(node) ?? NOTHING,
            });

            return (
                <div
                    ref={rootRef}
                    class={CirclePackingStyles.circlePackingRoot}
                    tabindex={-1}
                    onKeydown={handleKeyDown}
                    onClick={() => zoomTo(props.root)}
                >
                    <svg
                        class={CirclePackingStyles.circlePackingCanvas}
                        viewBox={`${-size.value.width * HALF} ${-size.value.height * HALF} ${size.value.width} ${size.value.height}`}
                        role="list"
                        aria-label={props.ariaLabel}
                    >
                        {nodes.value.map((node) => {
                            const isBranch = TreemapUtils.getIsBranch(node, weights.value);
                            const isInView = getIsInView(node);

                            return (
                                <g
                                    key={nodeKeys.value.get(node)}
                                    role="listitem"
                                    class={isBranch ? undefined : CirclePackingStyles.circlePackingLeaf}
                                    aria-hidden={isInView ? undefined : "true"}
                                >
                                    <g
                                        ref={(target) => {
                                            const element = toElement<SVGGElement>(target);

                                            if (element) circleRefs.set(node, element);
                                            else circleRefs.delete(node);
                                        }}
                                        class={CirclePackingStyles.circlePackingCircle}
                                        role={isBranch && isInView ? "button" : undefined}
                                        tabindex={
                                            isBranch && isInView ? (node === rovingNode.value ? 0 : -1) : undefined
                                        }
                                        onClick={(e) => {
                                            if (!isBranch || node === branch.value) return;

                                            e.stopPropagation();
                                            focusedNode.value = node;
                                            zoomTo(node);
                                        }}
                                    >
                                        {callSlot(slots.renderCircle, { node, state: computeState(node) })}
                                    </g>
                                </g>
                            );
                        })}

                        {slots.renderLabel && (
                            <g class={CirclePackingStyles.circlePackingLabels} aria-hidden="true">
                                {nodes.value.map((node) => (
                                    <Fragment key={nodeKeys.value.get(node)}>
                                        {callSlot(slots.renderLabel, { node, state: computeState(node) })}
                                    </Fragment>
                                ))}
                            </g>
                        )}
                    </svg>
                </div>
            );
        };
    },
    {
        name: "CirclePacking",
        slots: Object as SlotsType<CirclePackingSlots<any>>,
        props: declareProps<CirclePackingProps<unknown>>({
            "ariaLabel": null,
            "padding": null,
            "zoomDurationMs": null,
            "root": null,
            "branch": null,
            "onUpdate:branch": null,
        }),
    },
);

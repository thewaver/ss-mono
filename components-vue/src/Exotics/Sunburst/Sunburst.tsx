import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

import {
    SUNBURST_DEFAULTS,
    type SunburstNode,
    type SunburstSpan,
    SunburstStyles,
    SunburstUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { SunburstProps, SunburstSlots } from "./Sunburst.types";

const NOTHING = 0;
const SETTLED = 1;
const NEXT = 1;
const HALF = 0.5;
const CENTER_RINGS = 1;
const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };

type SunburstZoomState<T> = {
    branch: SunburstNode<T>;
    cameFrom: SunburstNode<T> | undefined;
    fromViews: Map<SunburstNode<T>, SunburstSpan>;
    generation: number;
};

export const Sunburst = defineComponent(
    <T,>(props: SunburstProps<T>, { slots }: SlotsContext<SunburstSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const arcRefs = new Map<SunburstNode<T>, SVGGElement>();

        let isFocusPending = false;

        const zoomClock = TreemapUtils.createZoomClock();
        const focusedNode = shallowRef<SunburstNode<T>>();

        const progress = useStore(zoomClock);
        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const getRingCount = () => Math.max(SETTLED, props.ringCount ?? SUNBURST_DEFAULTS.ringCount);

        const weights = computed(() => TreemapUtils.computeWeights(props.root));
        const spans = computed(() => SunburstUtils.computeSpans(props.root, weights.value));
        const allNodes = computed(() => SunburstUtils.listNodes(props.root, weights.value));
        const nodeKeys = computed(() => new Map(allNodes.value.map((node, index) => [node, index])));

        const heldBranch = useTwoWay(props, "branch", props.root);

        const branch = computed(() => TreemapUtils.resolveBranch(heldBranch.value, props.root, weights.value));

        const zoom = shallowRef<SunburstZoomState<T>>({
            branch: branch.value,
            cameFrom: undefined,
            fromViews: new Map(),
            generation: NOTHING,
        });

        const computeShownView = (node: SunburstNode<T>, center: SunburstNode<T>) =>
            SunburstUtils.computeShownSpan(
                spans.value.get(node) ?? EMPTY_SPAN,
                spans.value.get(center) ?? EMPTY_SPAN,
                zoom.value.fromViews.get(node),
                progress.value,
            );

        watch(branch, (next) => {
            const current = zoom.value;

            zoom.value = {
                branch: next,
                cameFrom: current.branch,
                fromViews: new Map(allNodes.value.map((node) => [node, computeShownView(node, current.branch)])),
                generation: current.generation + NEXT,
            };
        });

        const centerSpan = computed(() => spans.value.get(branch.value) ?? EMPTY_SPAN);

        const targetViews = computed(
            () =>
                new Map(
                    allNodes.value.map((node) => [
                        node,
                        SunburstUtils.computeView(spans.value.get(node) ?? EMPTY_SPAN, centerSpan.value),
                    ]),
                ),
        );

        const getIsVisibleAtTarget = (node: SunburstNode<T>) =>
            SunburstUtils.getIsVisible(targetViews.value.get(node) ?? EMPTY_SPAN, getRingCount());

        const getIsVisibleAtStart = (node: SunburstNode<T>) =>
            SunburstUtils.getIsVisible(zoom.value.fromViews.get(node) ?? EMPTY_SPAN, getRingCount());

        const stops = computed(() =>
            allNodes.value.filter(
                (node) => getIsVisibleAtTarget(node) && TreemapUtils.getIsBranch(node, weights.value),
            ),
        );

        const rovingNode = computed(() => TreemapUtils.resolveStop(focusedNode.value, stops.value));

        const zoomTo = (node: SunburstNode<T>) => {
            if (node === branch.value) return;

            isFocusPending = rootRef.value?.contains(document.activeElement) ?? false;

            heldBranch.value = node;
        };

        const focusNode = (node: SunburstNode<T>) => {
            focusedNode.value = node;
            arcRefs.get(node)?.focus();
        };

        onScopeDispose(zoomClock.stop);

        watchAfterRender([() => zoom.value.generation], ([generation]) => {
            if (generation === NOTHING) return;

            zoomClock.start(props.zoomDurationMs ?? SUNBURST_DEFAULTS.zoomDurationMs);
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

            if (roving === undefined || e.target !== arcRefs.get(roving)) return;

            const action = TreemapUtils.computeKeyAction(e.key, roving, stops.value);

            if (!action) return;

            e.preventDefault();

            if (action.kind === "zoom") zoomTo(action.node);
            else focusNode(action.node);
        };

        return () => {
            const side = Math.min(size.value.width, size.value.height);
            const ringCount = getRingCount();
            const ringWidth = (side * HALF) / (ringCount + CENTER_RINGS);
            const isZooming = progress.value < SETTLED;

            const renderedNodes = allNodes.value.filter(
                (node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node)),
            );

            return (
                <div ref={rootRef} class={SunburstStyles.sunburstRoot} tabindex={-1} onKeydown={handleKeyDown}>
                    <svg
                        class={SunburstStyles.sunburstCanvas}
                        viewBox={`${-side * HALF} ${-side * HALF} ${side} ${side}`}
                        role="list"
                        aria-label={props.ariaLabel}
                    >
                        {renderedNodes.map((node) => {
                            const isBranch = TreemapUtils.getIsBranch(node, weights.value);
                            const isLeaving = !getIsVisibleAtTarget(node);

                            return (
                                <g
                                    key={nodeKeys.value.get(node)}
                                    role="listitem"
                                    class={isLeaving ? SunburstStyles.sunburstLeaving : undefined}
                                    style={{
                                        opacity: SunburstUtils.computeOpacity(
                                            getIsVisibleAtStart(node),
                                            !isLeaving,
                                            progress.value,
                                        ),
                                    }}
                                    aria-hidden={isLeaving ? "true" : undefined}
                                >
                                    <g
                                        ref={(target) => {
                                            const element = toElement<SVGGElement>(target);

                                            if (element) arcRefs.set(node, element);
                                            else arcRefs.delete(node);
                                        }}
                                        class={SunburstStyles.sunburstArc}
                                        role={isBranch ? "button" : undefined}
                                        tabindex={
                                            isBranch && !isLeaving ? (node === rovingNode.value ? 0 : -1) : undefined
                                        }
                                        onClick={() => {
                                            if (!isBranch || isLeaving) return;

                                            focusedNode.value = node;
                                            zoomTo(node);
                                        }}
                                    >
                                        {callSlot(slots.renderArc, {
                                            node,
                                            state: {
                                                ...SunburstUtils.toArc(computeShownView(node, branch.value), ringWidth),
                                                weight: weights.value.get(node) ?? NOTHING,
                                                isBranch,
                                                ring: (targetViews.value.get(node) ?? EMPTY_SPAN).inner,
                                            },
                                        })}
                                    </g>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            );
        };
    },
    {
        name: "Sunburst",
        slots: Object as SlotsType<SunburstSlots<any>>,
        props: declareProps<SunburstProps<unknown>>({
            "ariaLabel": null,
            "ringCount": null,
            "zoomDurationMs": null,
            "root": null,
            "branch": null,
            "onUpdate:branch": null,
        }),
    },
);

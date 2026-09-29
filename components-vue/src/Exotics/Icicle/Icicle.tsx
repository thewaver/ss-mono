import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef, watch } from "vue";

import {
    ICICLE_DEFAULTS,
    type IcicleNode,
    type IcicleSpan,
    IcicleStyles,
    IcicleUtils,
    NavigatorUtils,
    TreemapUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { IcicleProps, IcicleSlots } from "./Icicle.types";

const NOTHING = 0;
const SETTLED = 1;
const NEXT = 1;
const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };

type IcicleZoomState<T> = {
    focus: IcicleNode<T>;
    cameFrom: IcicleNode<T> | undefined;
    fromViews: Map<IcicleNode<T>, IcicleSpan>;
    generation: number;
};

export const Icicle = defineComponent(
    <T,>(props: IcicleProps<T>, { slots }: SlotsContext<IcicleSlots<T>>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const cellRefs = new Map<IcicleNode<T>, HTMLElement>();

        let isFocusPending = false;

        const zoomClock = TreemapUtils.createZoomClock();
        const cursorNode = shallowRef<IcicleNode<T>>();

        const progress = useStore(zoomClock);
        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const getColumnCount = () => Math.max(SETTLED, props.columnCount ?? ICICLE_DEFAULTS.columnCount);

        const weights = computed(() => TreemapUtils.computeWeights(props.root));
        const spans = computed(() => IcicleUtils.computeSpans(props.root, weights.value));
        const parents = computed(() => IcicleUtils.computeParents(props.root));
        const allNodes = computed(() => IcicleUtils.listNodes(spans.value, weights.value));
        const nodeKeys = computed(() => new Map(allNodes.value.map((node, index) => [node, index])));

        const heldFocus = useTwoWay(props, "focus", props.root);

        const focus = computed(() => (allNodes.value.includes(heldFocus.value) ? heldFocus.value : props.root));

        const zoom = shallowRef<IcicleZoomState<T>>({
            focus: focus.value,
            cameFrom: undefined,
            fromViews: new Map(),
            generation: NOTHING,
        });

        const computeShownView = (node: IcicleNode<T>, center: IcicleNode<T>) =>
            IcicleUtils.computeShownSpan(
                spans.value.get(node) ?? EMPTY_SPAN,
                spans.value.get(center) ?? EMPTY_SPAN,
                zoom.value.fromViews.get(node),
                progress.value,
            );

        watch(focus, (next) => {
            const current = zoom.value;

            zoom.value = {
                focus: next,
                cameFrom: current.focus,
                fromViews: new Map(allNodes.value.map((node) => [node, computeShownView(node, current.focus)])),
                generation: current.generation + NEXT,
            };
        });

        const focusSpan = computed(() => spans.value.get(focus.value) ?? EMPTY_SPAN);

        const targetViews = computed(
            () =>
                new Map(
                    allNodes.value.map((node) => [
                        node,
                        IcicleUtils.computeView(spans.value.get(node) ?? EMPTY_SPAN, focusSpan.value),
                    ]),
                ),
        );

        const getIsVisibleAtTarget = (node: IcicleNode<T>) =>
            IcicleUtils.getIsVisible(targetViews.value.get(node) ?? EMPTY_SPAN, getColumnCount());

        const getIsVisibleAtStart = (node: IcicleNode<T>) =>
            IcicleUtils.getIsVisible(zoom.value.fromViews.get(node) ?? EMPTY_SPAN, getColumnCount());

        const stops = computed(() => allNodes.value.filter(getIsVisibleAtTarget));

        const rovingNode = computed(() =>
            cursorNode.value !== undefined && stops.value.includes(cursorNode.value) ? cursorNode.value : focus.value,
        );

        const zoomTo = (node: IcicleNode<T>) => {
            if (node === focus.value) return;

            isFocusPending = rootRef.value?.contains(document.activeElement) ?? false;

            heldFocus.value = node;
        };

        const activate = (node: IcicleNode<T>) => {
            const target = IcicleUtils.computeActivationTarget(node, focus.value, parents.value);

            if (target) zoomTo(target);
        };

        const moveCursor = (node: IcicleNode<T>) => {
            cursorNode.value = node;
            cellRefs.get(node)?.focus();
        };

        onScopeDispose(zoomClock.stop);

        watchAfterRender([() => zoom.value.generation], ([generation]) => {
            if (generation === NOTHING) return;

            zoomClock.start(props.zoomDurationMs ?? ICICLE_DEFAULTS.zoomDurationMs);
        });

        watchAfterRender([() => zoom.value.generation], () => {
            if (!isFocusPending) return;

            isFocusPending = false;

            const cameFrom = zoom.value.cameFrom;

            moveCursor(cameFrom !== undefined && stops.value.includes(cameFrom) ? cameFrom : focus.value);
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                const parent = parents.value.get(focus.value);

                if (!parent) return;

                e.preventDefault();
                zoomTo(parent);

                return;
            }

            const roving = rovingNode.value;

            if (e.target !== cellRefs.get(roving)) return;

            if (NavigatorUtils.getIsActivationKey(e.key)) {
                e.preventDefault();
                activate(roving);

                return;
            }

            const step = IcicleUtils.getKeyStep(e.key);

            if (step === undefined) return;

            const next = IcicleUtils.computeStep(
                step,
                roving,
                stops.value.map((node) => ({ node, span: targetViews.value.get(node) ?? EMPTY_SPAN })),
                (node) => parents.value.get(node),
            );

            if (next === undefined || next === roving) return;

            e.preventDefault();
            moveCursor(next);
        };

        return () => {
            const isZooming = progress.value < SETTLED;
            const columnCount = getColumnCount();

            const renderedNodes = allNodes.value.filter(
                (node) => getIsVisibleAtTarget(node) || (isZooming && getIsVisibleAtStart(node)),
            );

            return (
                <div ref={rootRef} class={IcicleStyles.icicleRoot} onKeydown={handleKeyDown}>
                    <ul class={IcicleStyles.icicleList} aria-label={props.ariaLabel}>
                        {renderedNodes.map((node) => {
                            const isInView = getIsVisibleAtTarget(node);
                            const rect = IcicleUtils.toRect(
                                computeShownView(node, focus.value),
                                size.value,
                                columnCount,
                            );

                            return (
                                <li
                                    key={nodeKeys.value.get(node)}
                                    class={[IcicleStyles.icicleItem, !isInView && IcicleStyles.icicleLeaving]}
                                    style={TreemapUtils.toBox(rect)}
                                    aria-hidden={isInView ? undefined : "true"}
                                >
                                    <div
                                        ref={(target) => {
                                            const element = toElement(target);

                                            if (element) cellRefs.set(node, element);
                                            else cellRefs.delete(node);
                                        }}
                                        class={IcicleStyles.icicleCell}
                                        role="button"
                                        tabindex={isInView ? (node === rovingNode.value ? 0 : -1) : undefined}
                                        onClick={() => {
                                            if (!isInView) return;

                                            cursorNode.value = node;
                                            activate(node);
                                        }}
                                    >
                                        {callSlot(slots.renderCell, {
                                            node,
                                            state: {
                                                rect,
                                                weight: weights.value.get(node) ?? NOTHING,
                                                isBranch: TreemapUtils.getIsBranch(node, weights.value),
                                                isFocus: node === focus.value,
                                                isInView,
                                            },
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
        name: "Icicle",
        slots: Object as SlotsType<IcicleSlots<any>>,
        props: declareProps<IcicleProps<unknown>>({
            "ariaLabel": null,
            "columnCount": null,
            "zoomDurationMs": null,
            "root": null,
            "focus": null,
            "onUpdate:focus": null,
        }),
    },
);

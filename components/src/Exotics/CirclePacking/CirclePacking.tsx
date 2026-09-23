import { For, Show, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { TreemapUtils } from "../Treemap/Treemap.utils";
import { CIRCLE_PACKING_DEFAULTS } from "./CirclePacking.const";
import type {
    CirclePackingCircle,
    CirclePackingCircleState,
    CirclePackingNode,
    CirclePackingProps,
    CirclePackingView,
} from "./CirclePacking.types";
import { CirclePackingUtils } from "./CirclePacking.utils";

import * as styles from "./CirclePacking.css";

const NOTHING = 0;
const SETTLED = 1;
const HALF = 0.5;
const DOUBLE = 2;
const PARENT_FROM_END = 2;
const EASE_TURN = 0.5;
const EASE_IN_SCALE = 4;
const EASE_OUT_SCALE = -2;
const EASE_OUT_OFFSET = 2;
const EASE_POWER = 3;
const FRAME_STARVATION_SLACK_MS = 100;
const EMPTY_CIRCLE: CirclePackingCircle = { x: 0, y: 0, radius: 0 };

const ease = (progress: number) =>
    progress < EASE_TURN
        ? EASE_IN_SCALE * progress ** EASE_POWER
        : SETTLED - (EASE_OUT_SCALE * progress + EASE_OUT_OFFSET) ** EASE_POWER * HALF;

const toView = (circle: CirclePackingCircle): CirclePackingView => ({
    x: circle.x,
    y: circle.y,
    diameter: circle.radius * DOUBLE,
});

export const CirclePacking = <T,>(props: CirclePackingProps<T>) => {
    const circleRefs = new Map<CirclePackingNode<T>, SVGGElement>();

    let cameFrom: CirclePackingNode<T> | undefined;
    let isFocusPending = false;
    let frameId: number | undefined;
    let starvationHandle: ReturnType<typeof setTimeout> | undefined;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<CirclePackingNode<T>>();
    const [getProgress, setProgress] = createSignal(SETTLED);
    const [getPath, setPath] = createSignal<(progress: number) => CirclePackingView>();

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getSide = createMemo(() => Math.min(getSize().width, getSize().height));

    const getPadding = createMemo(() => access(props.padding) ?? CIRCLE_PACKING_DEFAULTS.padding);

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? CIRCLE_PACKING_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getLayout = createMemo(() =>
        CirclePackingUtils.computeLayout(getRootNode(), getWeights(), getSide(), getPadding()),
    );

    const getNodes = createMemo(() => {
        const nodes: CirclePackingNode<T>[] = [];
        const queue = [getRootNode()];

        while (queue.length) {
            const node = queue.shift()!;

            if (node !== getRootNode()) nodes.push(node);

            queue.push(...(node.children ?? []).filter((child) => getLayout().has(child)));
        }

        return nodes;
    });

    const [getHeldBranch, setHeldBranch] = SignalMirrorUtils.createOptional(
        () => props.branchSignal,
        untrack(getRootNode),
    );

    const getBranch = createMemo(() => {
        const held = getHeldBranch();

        return TreemapUtils.getIsBranch(held, getWeights()) && TreemapUtils.findPath(getRootNode(), held)
            ? held
            : getRootNode();
    });

    const getDepths = createMemo(() => {
        const depths = new Map<CirclePackingNode<T>, number>();

        const walk = (node: CirclePackingNode<T>, depth: number) => {
            depths.set(node, depth);
            node.children?.forEach((child) => walk(child, depth + SETTLED));
        };

        walk(getRootNode(), NOTHING);

        return depths;
    });

    const getIsZooming = createMemo(() => getProgress() < SETTLED);

    const getTargetView = createMemo(() => toView(getLayout().get(getBranch()) ?? EMPTY_CIRCLE));

    const getView = createMemo(() => {
        const path = getPath();

        return getIsZooming() && path ? path(ease(getProgress())) : getTargetView();
    });

    const getIsInView = (node: CirclePackingNode<T>) => getBranch().children?.includes(node) ?? false;

    const getStops = createMemo(() =>
        getNodes().filter((node) => getIsInView(node) && TreemapUtils.getIsBranch(node, getWeights())),
    );

    const getRovingNode = createMemo(() => {
        const focused = getFocusedNode();
        const stops = getStops();

        return focused !== undefined && stops.includes(focused) ? focused : stops[NOTHING];
    });

    const computeState = (node: CirclePackingNode<T>): CirclePackingCircleState => ({
        ...CirclePackingUtils.project(getLayout().get(node) ?? EMPTY_CIRCLE, getView(), getSide()),
        weight: getWeights().get(node) ?? NOTHING,
        isBranch: TreemapUtils.getIsBranch(node, getWeights()),
        isInView: getIsInView(node),
        depth: getDepths().get(node) ?? NOTHING,
    });

    const stopZoom = () => {
        if (frameId !== undefined) cancelAnimationFrame(frameId);
        if (starvationHandle !== undefined) clearTimeout(starvationHandle);

        frameId = undefined;
        starvationHandle = undefined;
    };

    const startZoom = (durationMs: number) => {
        stopZoom();

        if (durationMs <= NOTHING) {
            setProgress(SETTLED);

            return;
        }

        const startedAt = performance.now();

        const advance = (now: number) => {
            const progress = Math.min(SETTLED, (now - startedAt) / durationMs);

            setProgress(progress);

            if (progress < SETTLED) frameId = requestAnimationFrame(advance);
            else stopZoom();
        };

        setProgress(NOTHING);
        starvationHandle = setTimeout(() => {
            stopZoom();
            setProgress(SETTLED);
        }, durationMs + FRAME_STARVATION_SLACK_MS);
        frameId = requestAnimationFrame(advance);
    };

    onCleanup(stopZoom);

    createComputed(
        on(getBranch, (next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            const from = untrack(() => {
                const path = getPath();

                return getIsZooming() && path
                    ? path(ease(getProgress()))
                    : toView(getLayout().get(previous) ?? EMPTY_CIRCLE);
            });

            setPath(() =>
                CirclePackingUtils.interpolateZoom(from, toView(untrack(getLayout).get(next) ?? EMPTY_CIRCLE)),
            );
            startZoom(untrack(getZoomDurationMs));
        }),
    );

    const zoomTo = (node: CirclePackingNode<T>) => {
        if (node === getBranch()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldBranch(() => node);
    };

    const focusNode = (node: CirclePackingNode<T>) => {
        setFocusedNode(() => node);
        circleRefs.get(node)?.focus();
    };

    createEffect(
        on(getBranch, () => {
            if (!isFocusPending) return;

            isFocusPending = false;

            const stops = getStops();
            const target = cameFrom !== undefined && stops.includes(cameFrom) ? cameFrom : stops[NOTHING];

            if (target !== undefined) focusNode(target);
            else getRootRef()?.focus();
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const path = TreemapUtils.findPath(getRootNode(), getBranch());
            const parent = path?.[path.length - PARENT_FROM_END];

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (from === undefined || e.target !== circleRefs.get(from)) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            zoomTo(from);

            return;
        }

        const stops = getStops();
        const next = NavigatorUtils.computeNextPosition(e.key, stops.indexOf(from), stops.length, {
            orientation: "both",
            isLooping: false,
        });

        if (next === undefined || stops[next] === from) return;

        e.preventDefault();
        focusNode(stops[next]);
    };

    return (
        <div
            ref={setRootRef}
            class={styles.circlePackingRoot}
            tabindex={-1}
            onKeyDown={handleKeyDown}
            onClick={() => zoomTo(getRootNode())}
        >
            <svg
                class={styles.circlePackingCanvas}
                viewBox={`${-getSize().width * HALF} ${-getSize().height * HALF} ${getSize().width} ${getSize().height}`}
                role="list"
                aria-label={access(props.ariaLabel)}
            >
                <For each={getNodes()}>
                    {(node) => {
                        const getIsBranch = createMemo(() => TreemapUtils.getIsBranch(node, getWeights()));
                        const getIsNodeInView = createMemo(() => getIsInView(node));
                        const getState = () => computeState(node);

                        onCleanup(() => circleRefs.delete(node));

                        return (
                            <g
                                role="listitem"
                                class={getIsBranch() ? undefined : styles.circlePackingLeaf}
                                aria-hidden={getIsNodeInView() ? undefined : "true"}
                            >
                                <g
                                    ref={(element) => circleRefs.set(node, element)}
                                    class={styles.circlePackingCircle}
                                    role={getIsBranch() && getIsNodeInView() ? "button" : undefined}
                                    tabindex={
                                        getIsBranch() && getIsNodeInView()
                                            ? node === getRovingNode()
                                                ? 0
                                                : -1
                                            : undefined
                                    }
                                    onClick={(e) => {
                                        if (!getIsBranch() || node === getBranch()) return;

                                        e.stopPropagation();
                                        setFocusedNode(() => node);
                                        zoomTo(node);
                                    }}
                                >
                                    {props.renderCircle(() => node, getState)}
                                </g>
                            </g>
                        );
                    }}
                </For>

                <Show when={props.renderLabel}>
                    {(getRenderLabel) => (
                        <g class={styles.circlePackingLabels} aria-hidden="true">
                            <For each={getNodes()}>
                                {(node) =>
                                    getRenderLabel()(
                                        () => node,
                                        () => computeState(node),
                                    )
                                }
                            </For>
                        </g>
                    )}
                </Show>
            </svg>
        </div>
    );
};

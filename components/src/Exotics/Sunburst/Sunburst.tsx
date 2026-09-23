import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { TreemapUtils } from "../Treemap/Treemap.utils";
import { SUNBURST_DEFAULTS } from "./Sunburst.const";
import type { SunburstArcState, SunburstNode, SunburstProps, SunburstSpan } from "./Sunburst.types";
import { SunburstUtils } from "./Sunburst.utils";

import * as styles from "./Sunburst.css";

const NOTHING = 0;
const SETTLED = 1;
const HIDDEN = 0;
const SHOWN = 1;
const HALF = 0.5;
const PARENT_FROM_END = 2;
const CENTER_RINGS = 1;
const EASE_TURN = 0.5;
const EASE_IN_SCALE = 4;
const EASE_OUT_SCALE = -2;
const EASE_OUT_OFFSET = 2;
const EASE_POWER = 3;
const FRAME_STARVATION_SLACK_MS = 100;
const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };

const ease = (progress: number) =>
    progress < EASE_TURN
        ? EASE_IN_SCALE * progress ** EASE_POWER
        : SETTLED - (EASE_OUT_SCALE * progress + EASE_OUT_OFFSET) ** EASE_POWER * HALF;

export const Sunburst = <T,>(props: SunburstProps<T>) => {
    const arcRefs = new Map<SunburstNode<T>, SVGGElement>();

    let cameFrom: SunburstNode<T> | undefined;
    let isFocusPending = false;
    let frameId: number | undefined;
    let starvationHandle: ReturnType<typeof setTimeout> | undefined;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<SunburstNode<T>>();
    const [getProgress, setProgress] = createSignal(SETTLED);
    const [getFromViews, setFromViews] = createSignal(new Map<SunburstNode<T>, SunburstSpan>());

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getSide = createMemo(() => Math.min(getSize().width, getSize().height));

    const getRingCount = createMemo(() => Math.max(SETTLED, access(props.ringCount) ?? SUNBURST_DEFAULTS.ringCount));

    const getRingWidth = createMemo(() => (getSide() * HALF) / (getRingCount() + CENTER_RINGS));

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? SUNBURST_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getSpans = createMemo(() => SunburstUtils.computeSpans(getRootNode(), getWeights()));

    const getAllNodes = createMemo(() => {
        const nodes: SunburstNode<T>[] = [];

        const walk = (node: SunburstNode<T>) =>
            [...(node.children ?? [])]
                .sort((first, second) => (getWeights().get(second) ?? NOTHING) - (getWeights().get(first) ?? NOTHING))
                .forEach((child) => {
                    nodes.push(child);
                    walk(child);
                });

        walk(getRootNode());

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

    const getTargetViews = createMemo(() => {
        const center = getSpans().get(getBranch()) ?? EMPTY_SPAN;

        return new Map(
            getAllNodes().map((node) => [node, SunburstUtils.computeView(getSpans().get(node) ?? EMPTY_SPAN, center)]),
        );
    });

    const getIsZooming = createMemo(() => getProgress() < SETTLED);

    const getIsVisibleAtTarget = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(getTargetViews().get(node) ?? EMPTY_SPAN, getRingCount());

    const getIsVisibleAtStart = (node: SunburstNode<T>) =>
        SunburstUtils.getIsVisible(getFromViews().get(node) ?? EMPTY_SPAN, getRingCount());

    const getRenderedNodes = createMemo(() =>
        getAllNodes().filter((node) => getIsVisibleAtTarget(node) || (getIsZooming() && getIsVisibleAtStart(node))),
    );

    const getStops = createMemo(() =>
        getAllNodes().filter((node) => getIsVisibleAtTarget(node) && TreemapUtils.getIsBranch(node, getWeights())),
    );

    const getRovingNode = createMemo(() => {
        const focused = getFocusedNode();
        const stops = getStops();

        return focused !== undefined && stops.includes(focused) ? focused : stops[NOTHING];
    });

    const getCurrentView = (node: SunburstNode<T>) => {
        const target = getTargetViews().get(node) ?? EMPTY_SPAN;

        if (!getIsZooming()) return target;

        return SunburstUtils.interpolateSpan(getFromViews().get(node) ?? target, target, ease(getProgress()));
    };

    const getOpacity = (node: SunburstNode<T>) => {
        const to = getIsVisibleAtTarget(node) ? SHOWN : HIDDEN;

        if (!getIsZooming()) return to;

        const from = getIsVisibleAtStart(node) ? SHOWN : HIDDEN;

        return from + (to - from) * ease(getProgress());
    };

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

    const computeShownView = (node: SunburstNode<T>, center: SunburstNode<T>) => {
        const resting = SunburstUtils.computeView(
            getSpans().get(node) ?? EMPTY_SPAN,
            getSpans().get(center) ?? EMPTY_SPAN,
        );

        if (!getIsZooming()) return resting;

        return SunburstUtils.interpolateSpan(getFromViews().get(node) ?? resting, resting, ease(getProgress()));
    };

    createComputed(
        on(getBranch, (_next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            setFromViews(untrack(() => new Map(getAllNodes().map((node) => [node, computeShownView(node, previous)]))));
            startZoom(untrack(getZoomDurationMs));
        }),
    );

    const zoomTo = (node: SunburstNode<T>) => {
        if (node === getBranch()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldBranch(() => node);
    };

    const focusNode = (node: SunburstNode<T>) => {
        setFocusedNode(() => node);
        arcRefs.get(node)?.focus();
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

        if (from === undefined || e.target !== arcRefs.get(from)) return;

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
        <div ref={setRootRef} class={styles.sunburstRoot} tabindex={-1} onKeyDown={handleKeyDown}>
            <svg
                class={styles.sunburstCanvas}
                viewBox={`${-getSide() * HALF} ${-getSide() * HALF} ${getSide()} ${getSide()}`}
                role="list"
                aria-label={access(props.ariaLabel)}
            >
                <For each={getRenderedNodes()}>
                    {(node) => {
                        const getIsBranch = createMemo(() => TreemapUtils.getIsBranch(node, getWeights()));
                        const getIsLeaving = createMemo(() => !getIsVisibleAtTarget(node));
                        const getState = (): SunburstArcState => {
                            const target = getTargetViews().get(node) ?? EMPTY_SPAN;

                            return {
                                ...SunburstUtils.toArc(getCurrentView(node), getRingWidth()),
                                weight: getWeights().get(node) ?? NOTHING,
                                isBranch: getIsBranch(),
                                ring: target.inner,
                            };
                        };

                        onCleanup(() => arcRefs.delete(node));

                        return (
                            <g
                                role="listitem"
                                classList={{ [styles.sunburstLeaving]: getIsLeaving() }}
                                style={{ opacity: getOpacity(node) }}
                                aria-hidden={getIsLeaving() ? "true" : undefined}
                            >
                                <g
                                    ref={(element) => arcRefs.set(node, element)}
                                    class={styles.sunburstArc}
                                    role={getIsBranch() ? "button" : undefined}
                                    tabindex={
                                        getIsBranch() && !getIsLeaving()
                                            ? node === getRovingNode()
                                                ? 0
                                                : -1
                                            : undefined
                                    }
                                    onClick={() => {
                                        if (!getIsBranch() || getIsLeaving()) return;

                                        setFocusedNode(() => node);
                                        zoomTo(node);
                                    }}
                                >
                                    {props.renderArc(() => node, getState)}
                                </g>
                            </g>
                        );
                    }}
                </For>
            </svg>
        </div>
    );
};

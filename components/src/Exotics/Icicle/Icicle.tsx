import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import type { Rect } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { TreemapUtils } from "../Treemap/Treemap.utils";
import { ICICLE_DEFAULTS } from "./Icicle.const";
import type { IcicleCellState, IcicleNode, IcicleProps, IcicleSpan, IcicleStep } from "./Icicle.types";
import { IcicleUtils } from "./Icicle.utils";

import * as styles from "./Icicle.css";

const NOTHING = 0;
const SETTLED = 1;
const HALF = 0.5;
const EASE_TURN = 0.5;
const EASE_IN_SCALE = 4;
const EASE_OUT_SCALE = -2;
const EASE_OUT_OFFSET = 2;
const EASE_POWER = 3;
const FRAME_STARVATION_SLACK_MS = 100;
const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };

const STEP_KEYS: Record<string, IcicleStep> = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "toParent",
    ArrowRight: "toChildren",
    Home: "first",
    End: "last",
};

const ease = (progress: number) =>
    progress < EASE_TURN
        ? EASE_IN_SCALE * progress ** EASE_POWER
        : SETTLED - (EASE_OUT_SCALE * progress + EASE_OUT_OFFSET) ** EASE_POWER * HALF;

const toBox = (rect: Rect) => {
    const left = Math.round(rect.x);
    const top = Math.round(rect.y);

    return {
        left: `${left}px`,
        top: `${top}px`,
        width: `${Math.round(rect.x + rect.width) - left}px`,
        height: `${Math.round(rect.y + rect.height) - top}px`,
    };
};

export const Icicle = <T,>(props: IcicleProps<T>) => {
    const cellRefs = new Map<IcicleNode<T>, HTMLElement>();

    let cameFrom: IcicleNode<T> | undefined;
    let isFocusPending = false;
    let frameId: number | undefined;
    let starvationHandle: ReturnType<typeof setTimeout> | undefined;

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getCursorNode, setCursorNode] = createSignal<IcicleNode<T>>();
    const [getProgress, setProgress] = createSignal(SETTLED);
    const [getFromViews, setFromViews] = createSignal(new Map<IcicleNode<T>, IcicleSpan>());

    const getSize = ElementObserverUtils.createBorderBoxSizeObserver(getRootRef);

    const getColumnCount = createMemo(() =>
        Math.max(SETTLED, access(props.columnCount) ?? ICICLE_DEFAULTS.columnCount),
    );

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? ICICLE_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getSpans = createMemo(() => IcicleUtils.computeSpans(getRootNode(), getWeights()));

    const getParents = createMemo(() => {
        const parents = new Map<IcicleNode<T>, IcicleNode<T>>();

        const walk = (node: IcicleNode<T>) =>
            node.children?.forEach((child) => {
                parents.set(child, node);
                walk(child);
            });

        walk(getRootNode());

        return parents;
    });

    const getAllNodes = createMemo(() =>
        [...getSpans().keys()].filter((node) => (getWeights().get(node) ?? NOTHING) > NOTHING),
    );

    const [getHeldFocus, setHeldFocus] = SignalMirrorUtils.createOptional(
        () => props.focusSignal,
        untrack(getRootNode),
    );

    const getFocus = createMemo(() => {
        const held = getHeldFocus();

        return getAllNodes().includes(held) ? held : getRootNode();
    });

    const getTargetViews = createMemo(() => {
        const focus = getSpans().get(getFocus()) ?? EMPTY_SPAN;

        return new Map(
            getAllNodes().map((node) => [node, IcicleUtils.computeView(getSpans().get(node) ?? EMPTY_SPAN, focus)]),
        );
    });

    const getIsZooming = createMemo(() => getProgress() < SETTLED);

    const getIsVisibleAtTarget = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(getTargetViews().get(node) ?? EMPTY_SPAN, getColumnCount());

    const getIsVisibleAtStart = (node: IcicleNode<T>) =>
        IcicleUtils.getIsVisible(getFromViews().get(node) ?? EMPTY_SPAN, getColumnCount());

    const getRenderedNodes = createMemo(() =>
        getAllNodes().filter((node) => getIsVisibleAtTarget(node) || (getIsZooming() && getIsVisibleAtStart(node))),
    );

    const getStops = createMemo(() => getAllNodes().filter(getIsVisibleAtTarget));

    const getRovingNode = createMemo(() => {
        const cursor = getCursorNode();

        return cursor !== undefined && getStops().includes(cursor) ? cursor : getFocus();
    });

    const getCurrentView = (node: IcicleNode<T>) => {
        const target = getTargetViews().get(node) ?? EMPTY_SPAN;

        if (!getIsZooming()) return target;

        return IcicleUtils.interpolateSpan(getFromViews().get(node) ?? target, target, ease(getProgress()));
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

    const computeShownView = (node: IcicleNode<T>, focus: IcicleNode<T>) => {
        const resting = IcicleUtils.computeView(
            getSpans().get(node) ?? EMPTY_SPAN,
            getSpans().get(focus) ?? EMPTY_SPAN,
        );

        if (!getIsZooming()) return resting;

        return IcicleUtils.interpolateSpan(getFromViews().get(node) ?? resting, resting, ease(getProgress()));
    };

    createComputed(
        on(getFocus, (_next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            setFromViews(untrack(() => new Map(getAllNodes().map((node) => [node, computeShownView(node, previous)]))));
            startZoom(untrack(getZoomDurationMs));
        }),
    );

    const zoomTo = (node: IcicleNode<T>) => {
        if (node === getFocus()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldFocus(() => node);
    };

    const activate = (node: IcicleNode<T>) => {
        const parent = getParents().get(node);

        if (node !== getFocus()) zoomTo(node);
        else if (parent) zoomTo(parent);
    };

    const moveCursor = (node: IcicleNode<T>) => {
        setCursorNode(() => node);
        cellRefs.get(node)?.focus();
    };

    createEffect(
        on(getFocus, () => {
            if (!isFocusPending) return;

            isFocusPending = false;

            moveCursor(cameFrom !== undefined && getStops().includes(cameFrom) ? cameFrom : getFocus());
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = getParents().get(getFocus());

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (e.target !== cellRefs.get(from)) return;

        if (NavigatorUtils.getIsActivationKey(e.key)) {
            e.preventDefault();
            activate(from);

            return;
        }

        const step = STEP_KEYS[e.key];

        if (step === undefined) return;

        const next = IcicleUtils.computeStep(
            step,
            from,
            getStops().map((node) => ({ node, span: getTargetViews().get(node) ?? EMPTY_SPAN })),
            (node) => getParents().get(node),
        );

        if (next === undefined || next === from) return;

        e.preventDefault();
        moveCursor(next);
    };

    return (
        <div ref={setRootRef} class={styles.icicleRoot} onKeyDown={handleKeyDown}>
            <ul class={styles.icicleList} aria-label={access(props.ariaLabel)}>
                <For each={getRenderedNodes()}>
                    {(node) => {
                        const getIsInView = createMemo(() => getIsVisibleAtTarget(node));
                        const getState = (): IcicleCellState => ({
                            rect: IcicleUtils.toRect(getCurrentView(node), getSize(), getColumnCount()),
                            weight: getWeights().get(node) ?? NOTHING,
                            isBranch: TreemapUtils.getIsBranch(node, getWeights()),
                            isFocus: node === getFocus(),
                            isInView: getIsInView(),
                        });

                        onCleanup(() => cellRefs.delete(node));

                        return (
                            <li
                                class={styles.icicleItem}
                                classList={{ [styles.icicleLeaving]: !getIsInView() }}
                                style={toBox(getState().rect)}
                                aria-hidden={getIsInView() ? undefined : "true"}
                            >
                                <div
                                    ref={(element) => cellRefs.set(node, element)}
                                    class={styles.icicleCell}
                                    role="button"
                                    tabindex={getIsInView() ? (node === getRovingNode() ? 0 : -1) : undefined}
                                    onClick={() => {
                                        if (!getIsInView()) return;

                                        setCursorNode(() => node);
                                        activate(node);
                                    }}
                                >
                                    {props.renderCell(() => node, getState)}
                                </div>
                            </li>
                        );
                    }}
                </For>
            </ul>
        </div>
    );
};

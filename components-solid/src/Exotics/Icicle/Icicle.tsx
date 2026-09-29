import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    ICICLE_DEFAULTS,
    type IcicleCellState,
    type IcicleNode,
    type IcicleSpan,
    IcicleUtils,
    NavigatorUtils,
    TreemapUtils,
    IcicleStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { IcicleProps } from "./IcicleSolid.types";

const NOTHING = 0;
const SETTLED = 1;
const EMPTY_SPAN: IcicleSpan = { start: 0, end: 0, column: 0 };

export const Icicle = <T,>(props: IcicleProps<T>) => {
    const cellRefs = new Map<IcicleNode<T>, HTMLElement>();

    let cameFrom: IcicleNode<T> | undefined;
    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    onCleanup(zoomClock.stop);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getCursorNode, setCursorNode] = createSignal<IcicleNode<T>>();
    const getProgress = accessStore(zoomClock);
    const [getFromViews, setFromViews] = createSignal(new Map<IcicleNode<T>, IcicleSpan>());

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getColumnCount = createMemo(() =>
        Math.max(SETTLED, access(props.columnCount) ?? ICICLE_DEFAULTS.columnCount),
    );

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? ICICLE_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getSpans = createMemo(() => IcicleUtils.computeSpans(getRootNode(), getWeights()));

    const getParents = createMemo(() => IcicleUtils.computeParents(getRootNode()));

    const getAllNodes = createMemo(() => IcicleUtils.listNodes(getSpans(), getWeights()));

    const [getHeldFocus, setHeldFocus] = SignalMirrorSolidUtils.createOptional(() => props.focus, untrack(getRootNode));

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

    const computeShownView = (node: IcicleNode<T>, focus: IcicleNode<T>) =>
        IcicleUtils.computeShownSpan(
            getSpans().get(node) ?? EMPTY_SPAN,
            getSpans().get(focus) ?? EMPTY_SPAN,
            getFromViews().get(node),
            getProgress(),
        );

    const getCurrentView = (node: IcicleNode<T>) => computeShownView(node, getFocus());

    createComputed(
        on(getFocus, (_next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            setFromViews(untrack(() => new Map(getAllNodes().map((node) => [node, computeShownView(node, previous)]))));
            zoomClock.start(untrack(getZoomDurationMs));
        }),
    );

    const zoomTo = (node: IcicleNode<T>) => {
        if (node === getFocus()) return;

        isFocusPending = getRootRef()?.contains(document.activeElement) ?? false;

        setHeldFocus(() => node);
    };

    const activate = (node: IcicleNode<T>) => {
        const target = IcicleUtils.computeActivationTarget(node, getFocus(), getParents());

        if (target) zoomTo(target);
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

        const step = IcicleUtils.getKeyStep(e.key);

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
                                style={TreemapUtils.toBox(getState().rect)}
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

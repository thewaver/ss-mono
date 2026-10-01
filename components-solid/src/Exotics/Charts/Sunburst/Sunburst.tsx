import { For, createComputed, createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    SUNBURST_DEFAULTS,
    type SunburstArcState,
    type SunburstNode,
    type SunburstSpan,
    SunburstUtils,
    TreemapUtils,
    SunburstStyles as styles,
} from "@thewaver/ss-components";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { SunburstProps } from "./SunburstSolid.types";

const NOTHING = 0;
const SETTLED = 1;
const HALF = 0.5;
const CENTER_RINGS = 1;
const EMPTY_SPAN: SunburstSpan = { start: 0, end: 0, inner: 0, outer: 0 };

export const Sunburst = <T,>(props: SunburstProps<T>) => {
    const arcRefs = new Map<SunburstNode<T>, SVGGElement>();

    let cameFrom: SunburstNode<T> | undefined;
    let isFocusPending = false;

    const zoomClock = TreemapUtils.createZoomClock();

    onCleanup(zoomClock.stop);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getFocusedNode, setFocusedNode] = createSignal<SunburstNode<T>>();
    const getProgress = accessStore(zoomClock);
    const [getFromViews, setFromViews] = createSignal(new Map<SunburstNode<T>, SunburstSpan>());

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getSide = createMemo(() => Math.min(getSize().width, getSize().height));

    const getRingCount = createMemo(() => Math.max(SETTLED, access(props.ringCount) ?? SUNBURST_DEFAULTS.ringCount));

    const getRingWidth = createMemo(() => (getSide() * HALF) / (getRingCount() + CENTER_RINGS));

    const getZoomDurationMs = createMemo(() => access(props.zoomDurationMs) ?? SUNBURST_DEFAULTS.zoomDurationMs);

    const getRootNode = createMemo(() => access(props.root));

    const getWeights = createMemo(() => TreemapUtils.computeWeights(getRootNode()));

    const getSpans = createMemo(() => SunburstUtils.computeSpans(getRootNode(), getWeights()));

    const getAllNodes = createMemo(() => SunburstUtils.listNodes(getRootNode(), getWeights()));

    const [getHeldBranch, setHeldBranch] = SignalMirrorSolidUtils.createOptional(
        () => props.branch,
        untrack(getRootNode),
    );

    const getBranch = createMemo(() => TreemapUtils.resolveBranch(getHeldBranch(), getRootNode(), getWeights()));

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

    const getRovingNode = createMemo(() => TreemapUtils.resolveStop(getFocusedNode(), getStops()));

    const computeShownView = (node: SunburstNode<T>, center: SunburstNode<T>) =>
        SunburstUtils.computeShownSpan(
            getSpans().get(node) ?? EMPTY_SPAN,
            getSpans().get(center) ?? EMPTY_SPAN,
            getFromViews().get(node),
            getProgress(),
        );

    const getCurrentView = (node: SunburstNode<T>) => computeShownView(node, getBranch());

    const getOpacity = (node: SunburstNode<T>) =>
        SunburstUtils.computeOpacity(getIsVisibleAtStart(node), getIsVisibleAtTarget(node), getProgress());

    createComputed(
        on(getBranch, (_next, previous) => {
            cameFrom = previous;

            if (previous === undefined) return;

            setFromViews(untrack(() => new Map(getAllNodes().map((node) => [node, computeShownView(node, previous)]))));
            zoomClock.start(untrack(getZoomDurationMs));
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

            const target = TreemapUtils.resolveStop(cameFrom, getStops());

            if (target !== undefined) focusNode(target);
            else getRootRef()?.focus();
        }),
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            const parent = TreemapUtils.findParent(getRootNode(), getBranch());

            if (!parent) return;

            e.preventDefault();
            zoomTo(parent);

            return;
        }

        const from = getRovingNode();

        if (from === undefined || e.target !== arcRefs.get(from)) return;

        const action = TreemapUtils.computeKeyAction(e.key, from, getStops());

        if (!action) return;

        e.preventDefault();

        if (action.kind === "zoom") zoomTo(action.node);
        else focusNode(action.node);
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
